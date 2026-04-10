import { query } from '../config/db.js';
import { sendReceiptEmail } from '../utils/mailer.js';


// @route   POST /api/rides
export const requestRide = async (req, res) => {
  const { pickup_address, destination_address, pickup_lat, pickup_lng, destination_lat, destination_lng, fare, distance, duration } = req.body;
  const rider_id = req.user.id;
  const io = req.app.get('io');

  try {
    const result = await query(
      'INSERT INTO rides (rider_id, pickup_address, destination_address, pickup_lat, pickup_lng, destination_lat, destination_lng, fare, distance, duration) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *',
      [rider_id, pickup_address, destination_address, pickup_lat, pickup_lng, destination_lat, destination_lng, fare, distance, duration]
    );

    const ride = result.rows[0];

    // --- Driver Simulation for Demo ---
    setTimeout(async () => {
      try {
        await query('UPDATE rides SET status = $1 WHERE id = $2', ['accepted', ride.id]);
        io.to(`ride_${ride.id}`).emit('status_update', { status: 'accepted' });
        console.log(`Ride ${ride.id} accepted by simulated driver`);

        setTimeout(async () => {
          await query('UPDATE rides SET status = $1 WHERE id = $2', ['in_progress', ride.id]);
          io.to(`ride_${ride.id}`).emit('status_update', { status: 'in_progress' });
          console.log(`Ride ${ride.id} in progress`);

          // Simulate location updates during ride
          let progress = 0;
          const locationInterval = setInterval(() => {
            progress += 0.1;
            if (progress >= 1) {
               clearInterval(locationInterval);
               return;
            }
            // Simple interpolation for demo
            const lat = pickup_lat + (destination_lat - pickup_lat) * progress;
            const lng = pickup_lng + (destination_lng - pickup_lng) * progress;
            io.to(`ride_${ride.id}`).emit('location_update', { lat, lng });
          }, 3000);

          setTimeout(async () => {
            await query('UPDATE rides SET status = $1 WHERE id = $2', ['completed', ride.id]);
            io.to(`ride_${ride.id}`).emit('status_update', { status: 'completed' });
            console.log(`Ride ${ride.id} completed`);
          }, 20000);
        }, 10000);
      } catch (err) {
        console.error('Simulation error:', err);
      }
    }, 5000);

    res.status(201).json(ride);
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
    let result;
    if (driver_id) {
      result = await query(
        'UPDATE rides SET status = $1, driver_id = $2 WHERE id = $3 RETURNING *',
        [status, driver_id, id]
      );
    } else {
      result = await query(
        'UPDATE rides SET status = $1 WHERE id = $2 RETURNING *',
        [status, id]
      );
    }

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Ride not found' });
    }

    const updatedRide = result.rows[0];
    io.to(`ride_${id}`).emit('status_update', { status: updatedRide.status });

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
    const result = await query(
      'SELECT r.*, u.name as driver_name FROM rides r LEFT JOIN users u ON r.driver_id = u.id WHERE r.rider_id = $1 OR r.driver_id = $1 ORDER BY r.created_at DESC',
      [userId]
    );

    res.json(result.rows);
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
    const result = await query(
      "SELECT r.*, u.name as driver_name, u.avatar_url as driver_avatar FROM rides r LEFT JOIN users u ON r.driver_id = u.id WHERE (r.rider_id = $1 OR r.driver_id = $1) AND r.status IN ('pending', 'accepted', 'in_progress') ORDER BY r.created_at DESC LIMIT 1",
      [userId]
    );

    res.json(result.rows[0] || null);
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
    const rideResult = await query(
      'SELECT * FROM rides WHERE id = $1 AND (rider_id = $2 OR driver_id = $2)',
      [id, userId]
    );

    if (rideResult.rows.length === 0) {
      return res.status(404).json({ message: 'Ride not found' });
    }

    const ride = rideResult.rows[0];

    // Fetch the user's email and name
    const userResult = await query(
      'SELECT name, email FROM users WHERE id = $1',
      [userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { name, email } = userResult.rows[0];

    await sendReceiptEmail({ to: email, name, ride });

    res.json({ message: `Receipt sent to ${email}` });
  } catch (error) {
    console.error('Receipt send error:', error);
    res.status(500).json({ message: 'Failed to send receipt' });
  }
};
