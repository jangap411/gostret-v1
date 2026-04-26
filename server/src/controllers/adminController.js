import sql from '../config/db.js';

// @desc    Get platform overview stats
// @route   GET /api/admin/stats
export const getStats = async (req, res) => {
  try {
    const [totalRides] = await sql`SELECT COUNT(*) as count FROM rides`;
    const [activeRides] = await sql`SELECT COUNT(*) as count FROM rides WHERE status IN ('pending','accepted','in_progress')`;
    const [completedRides] = await sql`SELECT COUNT(*) as count FROM rides WHERE status = 'completed'`;
    const [cancelledRides] = await sql`SELECT COUNT(*) as count FROM rides WHERE status = 'cancelled'`;
    const [totalRiders] = await sql`SELECT COUNT(*) as count FROM users WHERE role = 'rider'`;
    const [totalDrivers] = await sql`SELECT COUNT(*) as count FROM users WHERE role = 'driver'`;
    const [onlineDrivers] = await sql`SELECT COUNT(*) as count FROM users WHERE role = 'driver' AND is_online = true`;
    const [totalRevenue] = await sql`SELECT COALESCE(SUM(fare), 0) as total FROM rides WHERE status = 'completed'`;
    const [todayRides] = await sql`SELECT COUNT(*) as count FROM rides WHERE created_at::date = CURRENT_DATE`;
    const [todayRevenue] = await sql`SELECT COALESCE(SUM(fare), 0) as total FROM rides WHERE status = 'completed' AND created_at::date = CURRENT_DATE`;
    const [avgFare] = await sql`SELECT COALESCE(AVG(fare), 0) as avg FROM rides WHERE status = 'completed'`;

    res.json({
      totalRides: parseInt(totalRides.count),
      activeRides: parseInt(activeRides.count),
      completedRides: parseInt(completedRides.count),
      cancelledRides: parseInt(cancelledRides.count),
      totalRiders: parseInt(totalRiders.count),
      totalDrivers: parseInt(totalDrivers.count),
      onlineDrivers: parseInt(onlineDrivers.count),
      totalRevenue: parseFloat(totalRevenue.total),
      todayRides: parseInt(todayRides.count),
      todayRevenue: parseFloat(todayRevenue.total),
      avgFare: parseFloat(avgFare.avg),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all rides with user details (paginated)
// @route   GET /api/admin/rides
export const getAllRides = async (req, res) => {
  const { page = 1, limit = 20, status, search } = req.query;
  const offset = (page - 1) * limit;

  try {
    let rides;
    if (status && status !== 'all') {
      rides = await sql`
        SELECT r.*, 
               rider.name as rider_name, rider.email as rider_email, rider.avatar_url as rider_avatar,
               driver.name as driver_name, driver.email as driver_email, driver.avatar_url as driver_avatar,
               driver.car_model, driver.car_plate
        FROM rides r
        LEFT JOIN users rider ON r.rider_id = rider.id
        LEFT JOIN users driver ON r.driver_id = driver.id
        WHERE r.status = ${status}
        ORDER BY r.created_at DESC
        LIMIT ${parseInt(limit)} OFFSET ${parseInt(offset)}
      `;
    } else {
      rides = await sql`
        SELECT r.*, 
               rider.name as rider_name, rider.email as rider_email, rider.avatar_url as rider_avatar,
               driver.name as driver_name, driver.email as driver_email, driver.avatar_url as driver_avatar,
               driver.car_model, driver.car_plate
        FROM rides r
        LEFT JOIN users rider ON r.rider_id = rider.id
        LEFT JOIN users driver ON r.driver_id = driver.id
        ORDER BY r.created_at DESC
        LIMIT ${parseInt(limit)} OFFSET ${parseInt(offset)}
      `;
    }

    const [{ count }] = await sql`SELECT COUNT(*) as count FROM rides`;

    res.json({ rides, total: parseInt(count), page: parseInt(page), limit: parseInt(limit) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all users with details (paginated)
// @route   GET /api/admin/users
export const getAllUsers = async (req, res) => {
  const { page = 1, limit = 20, role } = req.query;
  const offset = (page - 1) * limit;

  try {
    let users;
    if (role && role !== 'all') {
      users = await sql`
        SELECT id, name, email, role, wallet_balance, avatar_url, car_model, car_plate, 
               is_online, average_rating, created_at
        FROM users 
        WHERE role = ${role}
        ORDER BY created_at DESC
        LIMIT ${parseInt(limit)} OFFSET ${parseInt(offset)}
      `;
    } else {
      users = await sql`
        SELECT id, name, email, role, wallet_balance, avatar_url, car_model, car_plate, 
               is_online, average_rating, created_at
        FROM users 
        ORDER BY created_at DESC
        LIMIT ${parseInt(limit)} OFFSET ${parseInt(offset)}
      `;
    }

    const [{ count }] = await sql`SELECT COUNT(*) as count FROM users`;
    res.json({ users, total: parseInt(count), page: parseInt(page), limit: parseInt(limit) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get active rides in real-time (for safety monitoring)
// @route   GET /api/admin/rides/live
export const getLiveRides = async (req, res) => {
  try {
    const rides = await sql`
      SELECT r.*, 
             rider.name as rider_name, rider.email as rider_email, rider.avatar_url as rider_avatar, rider.average_rating as rider_rating,
             driver.name as driver_name, driver.email as driver_email, driver.avatar_url as driver_avatar, driver.average_rating as driver_rating,
             driver.car_model, driver.car_plate
      FROM rides r
      LEFT JOIN users rider ON r.rider_id = rider.id
      LEFT JOIN users driver ON r.driver_id = driver.id
      WHERE r.status IN ('accepted', 'in_progress')
      ORDER BY r.updated_at DESC
    `;
    res.json(rides);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get recent transactions across platform
// @route   GET /api/admin/transactions
export const getAllTransactions = async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const offset = (page - 1) * limit;

  try {
    const transactions = await sql`
      SELECT t.*, u.name as user_name, u.email as user_email, u.role as user_role
      FROM transactions t
      LEFT JOIN users u ON t.user_id = u.id
      ORDER BY t.created_at DESC
      LIMIT ${parseInt(limit)} OFFSET ${parseInt(offset)}
    `;
    const [{ count }] = await sql`SELECT COUNT(*) as count FROM transactions`;
    res.json({ transactions, total: parseInt(count) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all reviews for safety monitoring
// @route   GET /api/admin/reviews
export const getAllReviews = async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const offset = (page - 1) * limit;

  try {
    const reviews = await sql`
      SELECT rv.*, 
             reviewer.name as reviewer_name, reviewer.avatar_url as reviewer_avatar,
             reviewee.name as reviewee_name, reviewee.role as reviewee_role
      FROM reviews rv
      LEFT JOIN users reviewer ON rv.reviewer_id = reviewer.id
      LEFT JOIN users reviewee ON rv.reviewee_id = reviewee.id
      ORDER BY rv.created_at DESC
      LIMIT ${parseInt(limit)} OFFSET ${parseInt(offset)}
    `;
    const [{ count }] = await sql`SELECT COUNT(*) as count FROM reviews`;
    res.json({ reviews, total: parseInt(count) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get a specific ride in full detail (for incident investigation)
// @route   GET /api/admin/rides/:id
export const getRideById = async (req, res) => {
  const { id } = req.params;
  try {
    const [ride] = await sql`
      SELECT r.*, 
             rider.name as rider_name, rider.email as rider_email, rider.avatar_url as rider_avatar, rider.average_rating as rider_rating, rider.wallet_balance as rider_wallet,
             driver.name as driver_name, driver.email as driver_email, driver.avatar_url as driver_avatar, driver.average_rating as driver_rating,
             driver.car_model, driver.car_plate
      FROM rides r
      LEFT JOIN users rider ON r.rider_id = rider.id
      LEFT JOIN users driver ON r.driver_id = driver.id
      WHERE r.id = ${id}
    `;
    if (!ride) return res.status(404).json({ message: 'Ride not found' });

    const reviews = await sql`SELECT * FROM reviews WHERE ride_id = ${id}`;

    res.json({ ...ride, reviews });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get a specific user's full details
// @route   GET /api/admin/users/:id
export const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const [user] = await sql`
      SELECT id, name, email, role, wallet_balance, avatar_url, car_model, car_plate, is_online, average_rating, created_at
      FROM users WHERE id = ${id}
    `;
    if (!user) return res.status(404).json({ message: 'User not found' });

    const rides = await sql`
      SELECT r.*, 
             rider.name as rider_name,
             driver.name as driver_name
      FROM rides r
      LEFT JOIN users rider ON r.rider_id = rider.id
      LEFT JOIN users driver ON r.driver_id = driver.id
      WHERE r.rider_id = ${id} OR r.driver_id = ${id}
      ORDER BY r.created_at DESC LIMIT 10
    `;

    const reviews = await sql`
      SELECT rv.*, reviewer.name as reviewer_name FROM reviews rv
      LEFT JOIN users reviewer ON rv.reviewer_id = reviewer.id
      WHERE rv.reviewee_id = ${id}
      ORDER BY rv.created_at DESC LIMIT 5
    `;

    res.json({ ...user, recentRides: rides, reviews });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Cancel a ride (admin override)
// @route   PUT /api/admin/rides/:id/cancel
export const cancelRide = async (req, res) => {
  const { id } = req.params;
  const io = req.app.get('io');
  try {
    const [ride] = await sql`
      UPDATE rides SET status = 'cancelled' WHERE id = ${id} AND status NOT IN ('completed','cancelled')
      RETURNING *
    `;
    if (!ride) return res.status(400).json({ message: 'Ride cannot be cancelled' });

    io.to(`ride_${id}`).emit('status_update', { status: 'cancelled' });
    res.json({ message: 'Ride cancelled by admin', ride });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get rides trend (last 7 days)
// @route   GET /api/admin/stats/trend
export const getRidesTrend = async (req, res) => {
  try {
    const trend = await sql`
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as total_rides,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed,
        COUNT(CASE WHEN status = 'cancelled' THEN 1 END) as cancelled,
        COALESCE(SUM(CASE WHEN status = 'completed' THEN fare ELSE 0 END), 0) as revenue
      FROM rides
      WHERE created_at >= NOW() - INTERVAL '7 days'
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `;
    res.json(trend);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
