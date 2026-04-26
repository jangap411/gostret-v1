import sql from '../config/db.js';

// Middleware to restrict access to admin-role users only
export const adminProtect = async (req, res, next) => {
  try {
    const [user] = await sql`SELECT id, role FROM users WHERE id = ${req.user.id}`;
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied: Admins only' });
    }
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
