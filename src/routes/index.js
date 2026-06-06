import { Router } from 'express';
import { authenticate } from '../middleware/authMiddleware.js';
import authRoutes from './authRoutes.js';
import bloodTypeRoutes from './bloodTypeRoutes.js';
import donationRoutes from './donationRoutes.js';
import userRoutes from './userRoutes.js';

const router = Router();

router.use('/auth', authRoutes);

router.use(authenticate);
router.use('/blood-types', bloodTypeRoutes);
router.use('/donations', donationRoutes);
router.use('/users', userRoutes);

export default router;
