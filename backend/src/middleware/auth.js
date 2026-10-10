import jwt from 'jsonwebtoken';
import { query } from '../config/db.js';
import { sendError } from '../utils/response.js';

export async function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    return sendError(res, 'Authentication token required', 'UNAUTHORIZED', 401);
  }

  try {
    const secret = process.env.JWT_SECRET || 'gymkhana_default_dev_secret_key';
    const decoded = jwt.verify(token, secret);

    const rows = await query('SELECT id, full_name, email, phone, role FROM users WHERE id = ? LIMIT 1', [decoded.id]);
    if (!rows || rows.length === 0) {
      return sendError(res, 'Invalid user session or user deleted', 'UNAUTHORIZED', 401);
    }

    req.user = rows[0];
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return sendError(res, 'Session token has expired. Please log in again.', 'TOKEN_EXPIRED', 401);
    }
    return sendError(res, 'Invalid authentication token', 'UNAUTHORIZED', 401);
  }
}

export function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return sendError(res, 'Authentication required', 'UNAUTHORIZED', 401);
    }

    if (!allowedRoles.includes(req.user.role)) {
      return sendError(
        res,
        `Access denied. Role "${req.user.role}" does not have authorization for this action.`,
        'FORBIDDEN',
        403
      );
    }

    next();
  };
}
