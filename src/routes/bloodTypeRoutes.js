import { Router } from 'express';
import { getBloodTypes } from '../controllers/bloodTypeController.js';

const router = Router();

router.get('/', getBloodTypes);

export default router;
