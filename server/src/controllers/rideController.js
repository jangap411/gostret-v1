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

    // --- Driver Simulation for Demo ---
    setTimeout(async () => {
      try {
        await sql`
          UPDATE rides SET status = 'accepted' WHERE id = ${ride.id}
        `;
          
        io.to(`ride_${ride.id}`).emit('status_update', { status: 'accepted' });
        console.log(`Ride ${ride.id} accepted by simulated driver`);

        setTimeout(async () => {
          await sql`
            UPDATE rides SET status = 'in_progress' WHERE id = ${ride.id}
          `;
            
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
            await sql`
              UPDATE rides SET status = 'completed' WHERE id = ${ride.id}
            `;
              
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
