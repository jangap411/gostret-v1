import express from 'express';
import { getProfile, topUpWallet, getTransactions } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/profile', getProfile);
router.get('/transactions', getTransactions);
router.post('/wallet/top-up', topUpWallet);

export default router;
