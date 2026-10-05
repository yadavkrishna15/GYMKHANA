import { Router } from 'express';
import { updateProfile } from '../controllers/userController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

router.put('/profile', authenticateToken, updateProfile);

export default router;
