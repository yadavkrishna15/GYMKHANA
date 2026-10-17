import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { buildIdQuery } from '../utils/idHelper.js';
import { sendSuccess, sendError } from '../utils/response.js';

export async function updateProfile(req, res) {
  try {
    const { full_name, phone, current_password, new_password } = req.body;

    if (!full_name || !full_name.trim()) {
      return sendError(res, 'Full name cannot be empty', 'VALIDATION_ERROR', 400);
    }

    const user = await User.findOne(buildIdQuery(req.user.id || req.user._id));
    if (!user) {
      return sendError(res, 'User record not found', 'NOT_FOUND', 404);
    }

    // Check if password change is requested
    if (new_password) {
      if (!current_password) {
        return sendError(res, 'Current password is required to set a new password', 'VALIDATION_ERROR', 400);
      }
      if (new_password.length < 6) {
        return sendError(res, 'New password must be at least 6 characters long', 'VALIDATION_ERROR', 400);
      }

      const isMatch = await bcrypt.compare(current_password, user.password_hash);
      if (!isMatch) {
        return sendError(res, 'Current password entered is incorrect', 'INVALID_CREDENTIALS', 400);
      }

      const salt = await bcrypt.genSalt(10);
      user.password_hash = await bcrypt.hash(new_password, salt);
    }

    user.full_name = full_name.trim();
    user.phone = phone?.trim() || null;
    user.updated_at = new Date();
    await user.save();

    return sendSuccess(res, null, 'Profile updated successfully');
  } catch (error) {
    console.error('updateProfile error:', error);
    return sendError(res, 'Failed to update user profile', 'INTERNAL_ERROR', 500);
  }
}
