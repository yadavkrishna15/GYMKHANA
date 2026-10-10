import { query } from '../config/db.js';
import { sendSuccess, sendError } from '../utils/response.js';

export async function getEquipment(req, res) {
  try {
    const { category, target_body_part, search } = req.query;
    let sql = 'SELECT * FROM equipment WHERE 1=1';
    const params = [];

    if (category) {
      sql += ' AND category = ?';
      params.push(category);
    }
    if (target_body_part) {
      sql += ' AND target_body_part = ?';
      params.push(target_body_part);
    }
    if (search) {
      sql += ' AND (name LIKE ? OR description LIKE ? OR primary_purpose LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    sql += ' ORDER BY name ASC';
    const equipment = await query(sql, params);
    return sendSuccess(res, { equipment });
  } catch (error) {
    console.error('getEquipment error:', error);
    return sendError(res, 'Failed to fetch equipment catalog', 'INTERNAL_ERROR', 500);
  }
}

export async function getEquipmentById(req, res) {
  try {
    const { id } = req.params;
    const rows = await query('SELECT * FROM equipment WHERE id = ? LIMIT 1', [id]);

    if (!rows || rows.length === 0) {
      return sendError(res, 'Equipment item not found', 'NOT_FOUND', 404);
    }

    const equipment = rows[0];

    const related = await query(
      'SELECT id, name, category, target_body_part, description FROM equipment WHERE (category = ? OR target_body_part = ?) AND id != ? LIMIT 4',
      [equipment.category, equipment.target_body_part, id]
    );

    return sendSuccess(res, { equipment, related });
  } catch (error) {
    console.error('getEquipmentById error:', error);
    return sendError(res, 'Failed to fetch equipment profile', 'INTERNAL_ERROR', 500);
  }
}

export async function createEquipment(req, res) {
  try {
    const {
      name,
      category,
      target_body_part,
      description,
      primary_purpose,
      benefits,
      how_to_use,
      safety_instructions,
      image_url,
    } = req.body;

    if (!name || !category || !target_body_part || !description || !how_to_use) {
      return sendError(res, 'Name, category, target area, description, and usage steps are required', 'VALIDATION_ERROR', 400);
    }

    const now = new Date();
    const result = await query(
      `INSERT INTO equipment
        (name, category, target_body_part, description, primary_purpose, benefits, how_to_use, safety_instructions, image_url, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name.trim(),
        category.trim(),
        target_body_part.trim(),
        description.trim(),
        primary_purpose?.trim() || 'Strength & Conditioning',
        benefits?.trim() || null,
        how_to_use.trim(),
        safety_instructions?.trim() || 'Check pin security before movement.',
        image_url?.trim() || null,
        now,
      ]
    );

    return sendSuccess(res, { id: result.insertId }, 'Equipment registered successfully', 201);
  } catch (error) {
    console.error('createEquipment error:', error);
    return sendError(res, 'Failed to register equipment', 'INTERNAL_ERROR', 500);
  }
}

export async function updateEquipment(req, res) {
  try {
    const { id } = req.params;
    const {
      name,
      category,
      target_body_part,
      description,
      primary_purpose,
      benefits,
      how_to_use,
      safety_instructions,
      image_url,
    } = req.body;

    await query(
      `UPDATE equipment SET
        name = ?,
        category = ?,
        target_body_part = ?,
        description = ?,
        primary_purpose = ?,
        benefits = ?,
        how_to_use = ?,
        safety_instructions = ?,
        image_url = ?
       WHERE id = ?`,
      [
        name?.trim() || '',
        category?.trim() || '',
        target_body_part?.trim() || '',
        description?.trim() || '',
        primary_purpose?.trim() || '',
        benefits?.trim() || null,
        how_to_use?.trim() || '',
        safety_instructions?.trim() || '',
        image_url?.trim() || null,
        id,
      ]
    );

    return sendSuccess(res, null, 'Equipment record updated successfully');
  } catch (error) {
    console.error('updateEquipment error:', error);
    return sendError(res, 'Failed to update equipment record', 'INTERNAL_ERROR', 500);
  }
}

export async function deleteEquipment(req, res) {
  try {
    const { id } = req.params;
    await query('DELETE FROM equipment WHERE id = ?', [id]);
    return sendSuccess(res, null, 'Equipment deleted successfully');
  } catch (error) {
    console.error('deleteEquipment error:', error);
    return sendError(res, 'Failed to delete equipment record', 'INTERNAL_ERROR', 500);
  }
}
