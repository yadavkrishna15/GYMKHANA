import { query } from '../config/db.js';
import { sendSuccess, sendError } from '../utils/response.js';

export async function getExercises(req, res) {
  try {
    const { body_part, difficulty, search } = req.query;
    let sql = `
      SELECT e.*, eq.name AS equipment_name
      FROM exercises e
      LEFT JOIN equipment eq ON e.equipment_id = eq.id
      WHERE 1=1
    `;
    const params = [];

    if (body_part) {
      sql += ' AND e.body_part = ?';
      params.push(body_part);
    }
    if (difficulty) {
      sql += ' AND e.difficulty = ?';
      params.push(difficulty);
    }
    if (search) {
      sql += ' AND (e.name LIKE ? OR e.description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    sql += ' ORDER BY e.name ASC';

    const exercises = await query(sql, params);
    return sendSuccess(res, { exercises });
  } catch (error) {
    console.error('getExercises error:', error);
    return sendError(res, 'Failed to fetch exercise directory', 'INTERNAL_ERROR', 500);
  }
}

export async function getExerciseById(req, res) {
  try {
    const { id } = req.params;
    const rows = await query(
      `SELECT e.*, eq.name AS equipment_name
       FROM exercises e
       LEFT JOIN equipment eq ON e.equipment_id = eq.id
       WHERE e.id = ? LIMIT 1`,
      [id]
    );

    if (!rows || rows.length === 0) {
      return sendError(res, 'Exercise not found', 'NOT_FOUND', 404);
    }

    const exercise = rows[0];

    // Fetch related exercises in the same body part
    const related = await query(
      `SELECT id, name, body_part, difficulty, description
       FROM exercises
       WHERE body_part = ? AND id != ?
       LIMIT 4`,
      [exercise.body_part, id]
    );

    return sendSuccess(res, { exercise, related });
  } catch (error) {
    console.error('getExerciseById error:', error);
    return sendError(res, 'Failed to fetch exercise details', 'INTERNAL_ERROR', 500);
  }
}

export async function createExercise(req, res) {
  try {
    const {
      name,
      body_part,
      category,
      difficulty,
      equipment_id,
      description,
      instructions,
      benefits,
      safety_tips,
      common_mistakes,
      image_url,
    } = req.body;

    if (!name || !body_part || !description || !instructions) {
      return sendError(res, 'Name, body part, description, and instructions are required', 'VALIDATION_ERROR', 400);
    }

    const now = new Date();
    const result = await query(
      `INSERT INTO exercises
        (name, body_part, category, difficulty, equipment_id, description, instructions, benefits, safety_tips, common_mistakes, image_url, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name.trim(),
        body_part,
        category?.trim() || null,
        difficulty || 'Beginner',
        equipment_id ? parseInt(equipment_id, 10) : null,
        description.trim(),
        instructions.trim(),
        benefits?.trim() || null,
        safety_tips?.trim() || null,
        common_mistakes?.trim() || null,
        image_url?.trim() || null,
        now,
      ]
    );

    return sendSuccess(res, { id: result.insertId }, 'Exercise created successfully', 201);
  } catch (error) {
    console.error('createExercise error:', error);
    return sendError(res, 'Failed to create exercise record', 'INTERNAL_ERROR', 500);
  }
}

export async function updateExercise(req, res) {
  try {
    const { id } = req.params;
    const {
      name,
      body_part,
      category,
      difficulty,
      equipment_id,
      description,
      instructions,
      benefits,
      safety_tips,
      common_mistakes,
      image_url,
    } = req.body;

    if (!name || !body_part) {
      return sendError(res, 'Name and body part are required', 'VALIDATION_ERROR', 400);
    }

    await query(
      `UPDATE exercises SET
        name = ?,
        body_part = ?,
        category = ?,
        difficulty = ?,
        equipment_id = ?,
        description = ?,
        instructions = ?,
        benefits = ?,
        safety_tips = ?,
        common_mistakes = ?,
        image_url = ?
       WHERE id = ?`,
      [
        name.trim(),
        body_part,
        category?.trim() || null,
        difficulty || 'Beginner',
        equipment_id ? parseInt(equipment_id, 10) : null,
        description?.trim() || '',
        instructions?.trim() || '',
        benefits?.trim() || null,
        safety_tips?.trim() || null,
        common_mistakes?.trim() || null,
        image_url?.trim() || null,
        id,
      ]
    );

    return sendSuccess(res, null, 'Exercise updated successfully');
  } catch (error) {
    console.error('updateExercise error:', error);
    return sendError(res, 'Failed to update exercise record', 'INTERNAL_ERROR', 500);
  }
}

export async function deleteExercise(req, res) {
  try {
    const { id } = req.params;
    await query('DELETE FROM exercises WHERE id = ?', [id]);
    return sendSuccess(res, null, 'Exercise deleted successfully');
  } catch (error) {
    console.error('deleteExercise error:', error);
    return sendError(res, 'Failed to delete exercise record', 'INTERNAL_ERROR', 500);
  }
}
