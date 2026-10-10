import { Router } from 'express';
import {
  getMemberships,
  requestMembership,
  createMembership,
  updateMembership,
  deleteMembership,
} from '../controllers/membershipController.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = Router();

// Public read
router.get('/', getMemberships);

// Member request
router.post('/request', authenticateToken, requestMembership);

// Admin CRUD
router.post('/', authenticateToken, requireRole('ADMIN'), createMembership);
router.put('/:id', authenticateToken, requireRole('ADMIN'), updateMembership);
router.delete('/:id', authenticateToken, requireRole('ADMIN'), deleteMembership);

export default router;
