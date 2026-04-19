import sql from '../config/db.js';

// @desc    Get user profile
// @route   GET /api/user/profile
export const getProfile = async (req, res) => {
  try {
    const [user] = await sql`
      SELECT id, name, email, role, wallet_balance, avatar_url 
      FROM users WHERE id = ${req.user.id}
    `;

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
    const result = await sql.begin(async (sql) => {
      // Update balance
      const [updatedUser] = await sql`
        UPDATE users SET wallet_balance = wallet_balance + ${amount} 
        WHERE id = ${userId} 
        RETURNING wallet_balance
      `;

      // Record transaction
      await sql`
        INSERT INTO transactions (user_id, amount, type, status) 
        VALUES (${userId}, ${amount}, 'top-up', 'completed')
      `;

      return updatedUser;
    });

    res.json({
      message: 'Wallet topped up successfully',
      wallet_balance: result.wallet_balance,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get user transactions
// @route   GET /api/user/transactions
export const getTransactions = async (req, res) => {
  const userId = req.user.id;

  try {
    const transactions = await sql`
      SELECT * FROM transactions WHERE user_id = ${userId} ORDER BY created_at DESC
    `;

    res.json(transactions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update user profile
// @route   PUT /api/user/profile
export const updateProfile = async (req, res) => {
  const userId = req.user.id;
  const { name, email, avatar_url, car_model, car_plate, is_online } = req.body;

  try {
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (email !== undefined) updateData.email = email;
    if (avatar_url !== undefined) updateData.avatar_url = avatar_url;
    if (car_model !== undefined) updateData.car_model = car_model;
    if (car_plate !== undefined) updateData.car_plate = car_plate;
    if (is_online !== undefined) updateData.is_online = is_online;

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: 'No fields to update' });
    }

    const [updatedUser] = await sql`
      UPDATE users SET ${sql(updateData)} 
      WHERE id = ${userId} 
      RETURNING id, name, email, role, wallet_balance, avatar_url, car_model, car_plate, is_online, average_rating
    `;

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(updatedUser);
  } catch (error) {
    console.error(error);
    if (error.code === '23505') {
      return res.status(400).json({ message: 'Email is already in use' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};
