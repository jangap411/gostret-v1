import express from 'express';
import { requestRide, updateRideStatus, getRideHistory, getActiveRide, sendReceipt } from '../controllers/rideController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.post('/', requestRide);
router.get('/history', getRideHistory);
router.get('/active', getActiveRide);
router.put('/:id/status', updateRideStatus);
router.post('/:id/receipt', sendReceipt);

export default router;

