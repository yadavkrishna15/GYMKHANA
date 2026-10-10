import { Router } from 'express';
import {
  submitContactMessage,
  getContactMessages,
  updateContactMessage,
  deleteContactMessage,
} from '../controllers/contactController.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = Router();

// Public submission
router.post('/', submitContactMessage);

// Admin management
router.get('/', authenticateToken, requireRole('ADMIN'), getContactMessages);
router.put('/:id', authenticateToken, requireRole('ADMIN'), updateContactMessage);
router.delete('/:id', authenticateToken, requireRole('ADMIN'), deleteContactMessage);

export default router;
