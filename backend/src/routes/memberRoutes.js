import { Router } from 'express';
import {
  getMemberDashboard,
  getMemberMembership,
  getMemberWorkoutPlan,
  getMemberAttendance,
  getMemberProgress,
  addMemberProgress,
} from '../controllers/memberController.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = Router();

router.use(authenticateToken, requireRole('MEMBER', 'ADMIN'));

router.get('/dashboard', getMemberDashboard);
router.get('/membership', getMemberMembership);
router.get('/workout-plan', getMemberWorkoutPlan);
router.get('/attendance', getMemberAttendance);
router.get('/progress', getMemberProgress);
router.post('/progress', addMemberProgress);

export default router;
