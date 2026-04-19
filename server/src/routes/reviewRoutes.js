import express from 'express';
import { addReview } from '../controllers/reviewController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.post('/', addReview);

export default router;
