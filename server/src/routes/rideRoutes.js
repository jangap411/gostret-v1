import express from 'express';
import { requestRide, updateRideStatus, getRideHistory, getActiveRide, sendReceipt } from '../controllers/rideController.js';
import { estimateFare } from '../controllers/fareController.js';
import { protect } from '../middleware/authMiddleware.js';

import { validate } from '../middleware/validate.js';
import { requestRideSchema, updateRideStatusSchema } from '../validations/rideSchema.js';

const router = express.Router();

router.use(protect);

router.post('/estimate-fare', estimateFare);
router.post('/', validate(requestRideSchema), requestRide);
router.get('/history', getRideHistory);
router.get('/active', getActiveRide);
router.put('/:id/status', validate(updateRideStatusSchema), updateRideStatus);
router.post('/:id/receipt', sendReceipt);

export default router;

