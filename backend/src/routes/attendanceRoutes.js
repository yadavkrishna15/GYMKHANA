import { Router } from 'express';
import { getAttendanceLogs, recordAttendance } from '../controllers/attendanceController.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = Router();

router.use(authenticateToken, requireRole('ADMIN', 'TRAINER'));

router.get('/', getAttendanceLogs);
router.post('/', recordAttendance);

export default router;
