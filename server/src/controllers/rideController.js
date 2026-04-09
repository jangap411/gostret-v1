import { query } from '../config/db.js';

// @desc    Request a new ride
// @route   POST /api/rides
export const requestRide = async (req, res) => {
  const { pickup_address, destination_address, pickup_lat, pickup_lng, destination_lat, destination_lng, fare, distance, duration } = req.body;
  const rider_id = req.user.id;

  try {
    const result = await query(
      'INSERT INTO rides (rider_id, pickup_address, destination_address, pickup_lat, pickup_lng, destination_lat, destination_lng, fare, distance, duration) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *',
      [rider_id, pickup_address, destination_address, pickup_lat, pickup_lng, destination_lat, destination_lng, fare, distance, duration]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update ride status
// @route   PUT /api/rides/:id/status
export const updateRideStatus = async (req, res) => {
  const { id } = req.params;
  const { status, driver_id } = req.body;

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

    res.json(result.rows[0]);
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
