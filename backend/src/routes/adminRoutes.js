import { Router } from 'express';
import {
  getAdminStats,
  getMembersList,
  updateMember,
  getTrainersList,
  updateTrainer,
  createTrainer,
} from '../controllers/adminController.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = Router();

// Protect all admin endpoints
router.use(authenticateToken, requireRole('ADMIN'));

router.get('/stats', getAdminStats);
router.get('/members', getMembersList);
router.put('/members/:id', updateMember);
router.get('/trainers', getTrainersList);
router.post('/trainers', createTrainer);
router.put('/trainers/:id', updateTrainer);

export default router;
