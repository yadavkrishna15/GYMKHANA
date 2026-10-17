import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { buildIdQuery } from '../utils/idHelper.js';
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

    const user = await User.findOne(buildIdQuery(decoded.id)).lean();
    if (!user) {
      return sendError(res, 'Invalid user session or user deleted', 'UNAUTHORIZED', 401);
    }

    if (!user.id && user._id) user.id = user._id.toString();
    req.user = user;
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
