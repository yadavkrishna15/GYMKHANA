import bcrypt from 'bcryptjs';
import { query } from '../config/db.js';
import { sendSuccess, sendError } from '../utils/response.js';

export async function updateProfile(req, res) {
  try {
    const { full_name, phone, current_password, new_password } = req.body;

    if (!full_name || !full_name.trim()) {
      return sendError(res, 'Full name cannot be empty', 'VALIDATION_ERROR', 400);
    }

    // Check if password change is requested
    if (new_password) {
      if (!current_password) {
        return sendError(res, 'Current password is required to set a new password', 'VALIDATION_ERROR', 400);
      }
      if (new_password.length < 6) {
        return sendError(res, 'New password must be at least 6 characters long', 'VALIDATION_ERROR', 400);
      }

      // Verify current password
      const userRows = await query('SELECT password_hash FROM users WHERE id = ? LIMIT 1', [req.user.id]);
      if (!userRows || userRows.length === 0) {
        return sendError(res, 'User record not found', 'NOT_FOUND', 404);
      }

      const isMatch = await bcrypt.compare(current_password, userRows[0].password_hash);
      if (!isMatch) {
        return sendError(res, 'Current password entered is incorrect', 'INVALID_CREDENTIALS', 400);
      }

      const salt = await bcrypt.genSalt(10);
      const newHash = await bcrypt.hash(new_password, salt);

      await query(
        'UPDATE users SET full_name = ?, phone = ?, password_hash = ?, updated_at = NOW() WHERE id = ?',
        [full_name.trim(), phone?.trim() || null, newHash, req.user.id]
      );
    } else {
      await query(
        'UPDATE users SET full_name = ?, phone = ?, updated_at = NOW() WHERE id = ?',
        [full_name.trim(), phone?.trim() || null, req.user.id]
      );
    }

    return sendSuccess(res, null, 'Profile updated successfully');
  } catch (error) {
    console.error('updateProfile error:', error);
    return sendError(res, 'Failed to update user profile', 'INTERNAL_ERROR', 500);
  }
}
