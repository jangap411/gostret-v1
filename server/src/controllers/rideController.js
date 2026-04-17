import sql from '../config/db.js';
import { sendReceiptEmail } from '../utils/mailer.js';


// @route   POST /api/rides
export const requestRide = async (req, res) => {
  const { pickup_address, destination_address, pickup_lat, pickup_lng, destination_lat, destination_lng, fare, distance, duration } = req.body;
  const rider_id = req.user.id;
  const io = req.app.get('io');

  try {
    const [ride] = await sql`
      INSERT INTO rides (
        rider_id, pickup_address, destination_address, 
        pickup_lat, pickup_lng, destination_lat, destination_lng, 
        fare, distance, duration
      ) VALUES (
        ${rider_id}, ${pickup_address}, ${destination_address}, 
        ${pickup_lat}, ${pickup_lng}, ${destination_lat}, ${destination_lng}, 
        ${fare}, ${distance}, ${duration}
      ) RETURNING *
    `;

    // --- Broadcast to Drivers Pool ---
    io.to('drivers').emit('new_ride', {
      ...ride,
      rider_name: req.user.name,
      rider_rating: "4.9" // Mock rating for now
    });

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
    let updatedRide;
    if (driver_id) {
      [updatedRide] = await sql`
        UPDATE rides SET status = ${status}, driver_id = ${driver_id} WHERE id = ${id} RETURNING *
      `;
    } else {
      [updatedRide] = await sql`
        UPDATE rides SET status = ${status} WHERE id = ${id} RETURNING *
      `;
    }

    if (!updatedRide) {
      return res.status(404).json({ message: 'Ride not found' });
    }

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
