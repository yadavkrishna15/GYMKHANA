import { Router } from 'express';
import {
  getWorkoutPlans,
  getWorkoutPlanById,
  createWorkoutPlan,
  updateWorkoutPlan,
  deleteWorkoutPlan,
} from '../controllers/workoutController.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = Router();

router.get('/', getWorkoutPlans);
router.get('/:id', getWorkoutPlanById);

router.post('/', authenticateToken, requireRole('ADMIN', 'TRAINER'), createWorkoutPlan);
router.put('/:id', authenticateToken, requireRole('ADMIN', 'TRAINER'), updateWorkoutPlan);
router.delete('/:id', authenticateToken, requireRole('ADMIN', 'TRAINER'), deleteWorkoutPlan);

export default router;
