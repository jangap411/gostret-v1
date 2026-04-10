import { query } from '../config/db.js';

// @desc    Get user profile
// @route   GET /api/user/profile
export const getProfile = async (req, res) => {
  try {
    const result = await query('SELECT id, name, email, role, wallet_balance, avatar_url FROM users WHERE id = $1', [req.user.id]);
    const user = result.rows[0];

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update wallet balance
// @route   POST /api/user/wallet/top-up
export const topUpWallet = async (req, res) => {
  const { amount } = req.body;
  const userId = req.user.id;

  try {
    // Start transaction
    await query('BEGIN');

    // Update balance
    const updatedUser = await query(
      'UPDATE users SET wallet_balance = wallet_balance + $1 WHERE id = $2 RETURNING wallet_balance',
      [amount, userId]
    );

    // Record transaction
    await query(
      'INSERT INTO transactions (user_id, amount, type, status) VALUES ($1, $2, $3, $4)',
      [userId, amount, 'top-up', 'completed']
    );

    await query('COMMIT');

    res.json({
      message: 'Wallet topped up successfully',
      wallet_balance: updatedUser.rows[0].wallet_balance,
    });
  } catch (error) {
    await query('ROLLBACK');
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get user transactions
// @route   GET /api/user/transactions
export const getTransactions = async (req, res) => {
  const userId = req.user.id;

  try {
    const result = await query(
      'SELECT * FROM transactions WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update user profile
// @route   PUT /api/user/profile
export const updateProfile = async (req, res) => {
  const userId = req.user.id;
  const { name, email, avatar_url } = req.body;

  try {
    // Build dynamic SET clause for only provided fields
    const fields = [];
    const values = [];
    let paramIndex = 1;

    if (name !== undefined) {
      fields.push(`name = $${paramIndex++}`);
      values.push(name);
    }
    if (email !== undefined) {
      fields.push(`email = $${paramIndex++}`);
      values.push(email);
    }
    if (avatar_url !== undefined) {
      fields.push(`avatar_url = $${paramIndex++}`);
      values.push(avatar_url);
    }

    if (fields.length === 0) {
      return res.status(400).json({ message: 'No fields to update' });
    }

    values.push(userId);

    const result = await query(
      `UPDATE users SET ${fields.join(', ')} WHERE id = $${paramIndex} RETURNING id, name, email, role, wallet_balance, avatar_url`,
      values
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    if (error.code === '23505') {
      return res.status(400).json({ message: 'Email is already in use' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};
