import { Router } from 'express';
import {
  getExercises,
  getExerciseById,
  createExercise,
  updateExercise,
  deleteExercise,
} from '../controllers/exerciseController.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = Router();

// Public routes
router.get('/', getExercises);
router.get('/:id', getExerciseById);

// Admin-only CRUD
router.post('/', authenticateToken, requireRole('ADMIN'), createExercise);
router.put('/:id', authenticateToken, requireRole('ADMIN'), updateExercise);
router.delete('/:id', authenticateToken, requireRole('ADMIN'), deleteExercise);

export default router;
