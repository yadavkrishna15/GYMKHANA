import { query } from '../config/db.js';
import { sendSuccess, sendError } from '../utils/response.js';

export async function getMemberships(req, res) {
  try {
    const memberships = await query('SELECT * FROM memberships ORDER BY price ASC');
    return sendSuccess(res, { memberships });
  } catch (error) {
    console.error('getMemberships error:', error);
    return sendError(res, 'Failed to fetch membership tiers', 'INTERNAL_ERROR', 500);
  }
}

export async function requestMembership(req, res) {
  try {
    const { membership_id } = req.body;
    if (!membership_id) {
      return sendError(res, 'Membership ID is required', 'VALIDATION_ERROR', 400);
    }

    const memRows = await query('SELECT * FROM memberships WHERE id = ? LIMIT 1', [membership_id]);
    if (!memRows || memRows.length === 0) {
      return sendError(res, 'Membership tier not found', 'NOT_FOUND', 404);
    }

    // Update user's member row
    await query(
      'UPDATE members SET membership_id = ?, status = ? WHERE user_id = ?',
      [membership_id, 'ACTIVE', req.user.id]
    );

    return sendSuccess(res, null, `Membership request for ${memRows[0].name} registered successfully`);
  } catch (error) {
    console.error('requestMembership error:', error);
    return sendError(res, 'Failed to request membership', 'INTERNAL_ERROR', 500);
  }
}

export async function createMembership(req, res) {
  try {
    const { name, duration_months, price, features, access_details } = req.body;

    if (!name || !price) {
      return sendError(res, 'Name and price are required', 'VALIDATION_ERROR', 400);
    }

    const now = new Date();
    const result = await query(
      `INSERT INTO memberships (name, duration_months, price, features, access_details, created_at)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        name.trim(),
        parseInt(duration_months, 10) || 1,
        parseFloat(price),
        features?.trim() || null,
        access_details?.trim() || null,
        now,
      ]
    );

    return sendSuccess(res, { id: result.insertId }, 'Membership tier created successfully', 201);
  } catch (error) {
    console.error('createMembership error:', error);
    return sendError(res, 'Failed to create membership tier', 'INTERNAL_ERROR', 500);
  }
}

export async function updateMembership(req, res) {
  try {
    const { id } = req.params;
    const { name, duration_months, price, features, access_details } = req.body;

    await query(
      `UPDATE memberships SET
        name = ?,
        duration_months = ?,
        price = ?,
        features = ?,
        access_details = ?
       WHERE id = ?`,
      [
        name?.trim() || '',
        parseInt(duration_months, 10) || 1,
        parseFloat(price) || 0,
        features?.trim() || null,
        access_details?.trim() || null,
        id,
      ]
    );

    return sendSuccess(res, null, 'Membership tier updated successfully');
  } catch (error) {
    console.error('updateMembership error:', error);
    return sendError(res, 'Failed to update membership tier', 'INTERNAL_ERROR', 500);
  }
}

export async function deleteMembership(req, res) {
  try {
    const { id } = req.params;
    await query('DELETE FROM memberships WHERE id = ?', [id]);
    return sendSuccess(res, null, 'Membership tier deleted successfully');
  } catch (error) {
    console.error('deleteMembership error:', error);
    return sendError(res, 'Failed to delete membership tier', 'INTERNAL_ERROR', 500);
  }
}
