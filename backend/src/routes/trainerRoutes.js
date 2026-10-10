import { Router } from 'express';
import {
  getPublicTrainers,
  getTrainerDashboard,
  getTrainerProfile,
  updateTrainerProfile,
  getAssignedMembers,
  getMemberDetailsForTrainer,
  assignPlanToMember,
  addMemberProgressByTrainer,
  getTrainerPlans,
} from '../controllers/trainerController.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = Router();

// Public
router.get('/', getPublicTrainers);

// Trainer Protected
router.get('/dashboard', authenticateToken, requireRole('TRAINER', 'ADMIN'), getTrainerDashboard);
router.get('/profile', authenticateToken, requireRole('TRAINER', 'ADMIN'), getTrainerProfile);
router.put('/profile', authenticateToken, requireRole('TRAINER', 'ADMIN'), updateTrainerProfile);

router.get('/members', authenticateToken, requireRole('TRAINER', 'ADMIN'), getAssignedMembers);
router.get('/members/:id', authenticateToken, requireRole('TRAINER', 'ADMIN'), getMemberDetailsForTrainer);
router.post('/members/:id/assign-plan', authenticateToken, requireRole('TRAINER', 'ADMIN'), assignPlanToMember);
router.post('/members/:id/progress', authenticateToken, requireRole('TRAINER', 'ADMIN'), addMemberProgressByTrainer);

router.get('/plans', authenticateToken, requireRole('TRAINER', 'ADMIN'), getTrainerPlans);

export default router;
