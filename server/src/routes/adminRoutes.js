import express from 'express';
import {
  getStats,
  getAllRides,
  getAllUsers,
  getLiveRides,
  getAllTransactions,
  getAllReviews,
  getRideById,
  getUserById,
  cancelRide,
  getRidesTrend,
} from '../controllers/adminController.js';
import { protect } from '../middleware/authMiddleware.js';
import { adminProtect } from '../middleware/adminMiddleware.js';

const router = express.Router();

// All admin routes require JWT auth + admin role
router.use(protect);
router.use(adminProtect);

router.get('/stats', getStats);
router.get('/stats/trend', getRidesTrend);
router.get('/rides', getAllRides);
router.get('/rides/live', getLiveRides);
router.get('/rides/:id', getRideById);
router.put('/rides/:id/cancel', cancelRide);
router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.get('/transactions', getAllTransactions);
router.get('/reviews', getAllReviews);

export default router;
