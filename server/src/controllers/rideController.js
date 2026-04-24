import sql from '../config/db.js';
import { sendReceiptEmail } from '../utils/mailer.js';
import { isPeakHour, getSurgeMultiplier, calculateFare } from '../utils/fareCalculator.js';


// @route   POST /api/rides
export const requestRide = async (req, res) => {
  const {
    pickup_address, destination_address,
    pickup_lat, pickup_lng, destination_lat, destination_lng,
    fare,            // client-estimated fare (used as fallback)
    distance, duration,
    hasAirportFee, hasTolls,
  } = req.body;
  const rider_id = req.user.id;
  const io = req.app.get('io');

  try {
    // ── Server-side fare calculation ────────────────────────
    // Parse distance/duration numbers from the request
    const distanceKm = parseFloat(distance) || 0;
    const durationMin = parseFloat(duration) || 0;

    let fareBreakdown = null;
    let computedFare = parseFloat(fare) || 0;

    // Only recalculate if we have valid distance/duration
    if (distanceKm > 0 && durationMin > 0) {
      // Fetch supply/demand for surge
      const [demandResult] = await sql`
        SELECT COUNT(*)::int AS count FROM rides WHERE status = 'pending'
      `;
      const [supplyResult] = await sql`
        SELECT COUNT(*)::int AS count FROM users WHERE role = 'driver' AND is_online = true
      `;
      const activeRequests = demandResult?.count || 0;
      const availableDrivers = supplyResult?.count || 0;

      const surgeMultiplier = getSurgeMultiplier(activeRequests, availableDrivers);
      const isPeak = isPeakHour(new Date());

      fareBreakdown = calculateFare({
        distanceKm,
        durationMin,
        surgeMultiplier,
        isPeak,
        hasTolls: !!hasTolls,
        hasAirportFee: !!hasAirportFee,
      });

      computedFare = fareBreakdown.total;
    }

    // Check rider's wallet balance against the computed fare
    const [riderWallet] = await sql`SELECT wallet_balance FROM users WHERE id = ${rider_id}`;
    if (!riderWallet || parseFloat(riderWallet.wallet_balance) < computedFare) {
      return res.status(400).json({ message: 'Insufficient wallet balance for this ride.' });
    }

    const [ride] = await sql`
      INSERT INTO rides (
        rider_id, pickup_address, destination_address, 
        pickup_lat, pickup_lng, destination_lat, destination_lng, 
        fare, distance, duration
      ) VALUES (
        ${rider_id}, ${pickup_address}, ${destination_address}, 
        ${pickup_lat}, ${pickup_lng}, ${destination_lat}, ${destination_lng}, 
        ${computedFare}, ${distance}, ${duration}
      ) RETURNING *
    `;

    // Fetch full rider details for the broadcast
    const [rider] = await sql`SELECT name, avatar_url FROM users WHERE id = ${req.user.id}`;

    // --- Broadcast to Drivers Pool ---
    io.to('drivers').emit('new_ride', {
      ...ride,
      rider_name: rider?.name || "New Rider",
      rider_avatar: rider?.avatar_url,
      rider_rating: "4.9" // Mock rating for now
    });

    // Return ride + fare breakdown so the frontend can display the full receipt
    res.status(201).json({
      ...ride,
      fareBreakdown,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateRideStatus = async (req, res) => {
  const { id } = req.params;
  const { status, driver_id } = req.body;
  const io = req.app.get('io');

  try {
    let updatedRide;
    if (driver_id) {
      // Ensure the ride is either not yet accepted or already belongs to this driver
      [updatedRide] = await sql`
        UPDATE rides 
        SET status = ${status}, driver_id = ${driver_id} 
        WHERE id = ${id} AND (driver_id IS NULL OR driver_id = ${driver_id}) 
        RETURNING *
      `;

      if (!updatedRide) {
        // Determine whether the ride doesn't exist or is already taken
        const [existingRide] = await sql`SELECT * FROM rides WHERE id = ${id}`;
        if (!existingRide) {
          return res.status(404).json({ message: 'Ride not found' });
        } else {
          return res.status(400).json({ message: 'Ride already accepted by another driver' });
        }
      }
    } else {
      [updatedRide] = await sql`
        UPDATE rides SET status = ${status} WHERE id = ${id} RETURNING *
      `;
      if (!updatedRide) {
        return res.status(404).json({ message: 'Ride not found' });
      }
    }

    // Process payment if ride is completed
    if (updatedRide && updatedRide.status === 'completed' && updatedRide.driver_id) {
        // Atomic transaction for payment processing
        await sql.begin(async (tx) => {
            const fareAmt = parseFloat(updatedRide.fare);
            const driverCut = fareAmt * 0.90; // 10% commission

            // Deduct from Rider
            await tx`UPDATE users SET wallet_balance = wallet_balance - ${fareAmt} WHERE id = ${updatedRide.rider_id}`;
            // Add to Driver
            await tx`UPDATE users SET wallet_balance = wallet_balance + ${driverCut} WHERE id = ${updatedRide.driver_id}`;

            // Create Transaction Logs
            await tx`
              INSERT INTO transactions (user_id, ride_id, amount, type, status) 
              VALUES (${updatedRide.rider_id}, ${updatedRide.id}, ${-fareAmt}, 'payment', 'completed')
            `;
            await tx`
              INSERT INTO transactions (user_id, ride_id, amount, type, status) 
              VALUES (${updatedRide.driver_id}, ${updatedRide.id}, ${driverCut}, 'earning', 'completed')
            `;
        });
    }

    // Fetch driver details if ride is accepted
    let driverInfo = {};
    if (updatedRide.status === 'accepted' && updatedRide.driver_id) {
      const [driver] = await sql`SELECT name, avatar_url FROM users WHERE id = ${updatedRide.driver_id}`;
      if (driver) {
        driverInfo = {
          driver_name: driver.name,
          driver_avatar: driver.avatar_url
        };
      }
    }

    io.to(`ride_${id}`).emit('status_update', { 
      status: updatedRide.status, 
      driver_id: updatedRide.driver_id,
      ...driverInfo
    });

    res.json(updatedRide);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get ride history for a user
// @route   GET /api/rides/history
export const getRideHistory = async (req, res) => {
  const userId = req.user.id;

  try {
    const rides = await sql`
      SELECT r.*, u.name as driver_name 
      FROM rides r 
      LEFT JOIN users u ON r.driver_id = u.id 
      WHERE r.rider_id = ${userId} OR r.driver_id = ${userId} 
      ORDER BY r.created_at DESC
    `;

    res.json(rides);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get current active ride
// @route   GET /api/rides/active
export const getActiveRide = async (req, res) => {
  const userId = req.user.id;

  try {
    const [ride] = await sql`
      SELECT r.*, u.name as driver_name, u.avatar_url as driver_avatar 
      FROM rides r 
      LEFT JOIN users u ON r.driver_id = u.id 
      WHERE (r.rider_id = ${userId} OR r.driver_id = ${userId}) 
      AND r.status IN ('pending', 'accepted', 'in_progress') 
      ORDER BY r.created_at DESC 
      LIMIT 1
    `;

    res.json(ride || null);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Send ride receipt to user email
// @route   POST /api/rides/:id/receipt
export const sendReceipt = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    // Fetch the ride
    const [ride] = await sql`
      SELECT * FROM rides 
      WHERE id = ${id} AND (rider_id = ${userId} OR driver_id = ${userId})
    `;

    if (!ride) {
      return res.status(404).json({ message: 'Ride not found' });
    }

    // Fetch the user's email and name
    const [user] = await sql`
      SELECT name, email FROM users WHERE id = ${userId}
    `;

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await sendReceiptEmail({ to: user.email, name: user.name, ride });

    res.json({ message: `Receipt sent to ${user.email}` });
  } catch (error) {
    console.error('Receipt send error:', error);
    res.status(500).json({ message: 'Failed to send receipt' });
  }
};
