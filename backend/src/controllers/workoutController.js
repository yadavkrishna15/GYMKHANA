import { query } from '../config/db.js';
import { sendSuccess, sendError } from '../utils/response.js';

export async function getWorkoutPlans(req, res) {
  try {
    const { goal, difficulty, search } = req.query;
    let sql = `
      SELECT wp.*,
             u.full_name AS trainer_name,
             COUNT(wpe.id) AS exercise_count
      FROM workout_plans wp
      LEFT JOIN trainers t ON wp.created_by = t.id
      LEFT JOIN users u ON t.user_id = u.id
      LEFT JOIN workout_plan_exercises wpe ON wp.id = wpe.plan_id
      WHERE 1=1
    `;
    const params = [];

    if (goal) {
      sql += ' AND wp.goal = ?';
      params.push(goal);
    }
    if (difficulty) {
      sql += ' AND wp.difficulty = ?';
      params.push(difficulty);
    }
    if (search) {
      sql += ' AND (wp.name LIKE ? OR wp.description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    sql += ' GROUP BY wp.id ORDER BY wp.id ASC';

    const plans = await query(sql, params);
    return sendSuccess(res, { plans });
  } catch (error) {
    console.error('getWorkoutPlans error:', error);
    return sendError(res, 'Failed to fetch workout plans', 'INTERNAL_ERROR', 500);
  }
}

export async function getWorkoutPlanById(req, res) {
  try {
    const { id } = req.params;
    const planRows = await query(
      `SELECT wp.*, u.full_name AS trainer_name
       FROM workout_plans wp
       LEFT JOIN trainers t ON wp.created_by = t.id
       LEFT JOIN users u ON t.user_id = u.id
       WHERE wp.id = ? LIMIT 1`,
      [id]
    );

    if (!planRows || planRows.length === 0) {
      return sendError(res, 'Workout plan not found', 'NOT_FOUND', 404);
    }

    const plan = planRows[0];

    const exercises = await query(
      `SELECT wpe.*, e.name AS exercise_name, e.body_part, e.image_url, e.difficulty AS exercise_difficulty
       FROM workout_plan_exercises wpe
       JOIN exercises e ON wpe.exercise_id = e.id
       WHERE wpe.plan_id = ?
       ORDER BY wpe.id ASC`,
      [id]
    );

    return sendSuccess(res, { plan, exercises });
  } catch (error) {
    console.error('getWorkoutPlanById error:', error);
    return sendError(res, 'Failed to fetch workout plan details', 'INTERNAL_ERROR', 500);
  }
}

export async function createWorkoutPlan(req, res) {
  try {
    const { name, goal, difficulty, duration_weeks, description, trainer_id } = req.body;

    if (!name || !goal || !description) {
      return sendError(res, 'Plan name, goal, and description are required', 'VALIDATION_ERROR', 400);
    }

    let createdBy = null;
    if (req.user.role === 'TRAINER') {
      const t = await query('SELECT id FROM trainers WHERE user_id = ? LIMIT 1', [req.user.id]);
      if (t && t.length > 0) createdBy = t[0].id;
    } else if (trainer_id) {
      createdBy = parseInt(trainer_id, 10);
    }

    const now = new Date();
    const result = await query(
      `INSERT INTO workout_plans (name, goal, difficulty, duration_weeks, description, created_by, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        name.trim(),
        goal.trim(),
        difficulty || 'Intermediate',
        parseInt(duration_weeks, 10) || 4,
        description.trim(),
        createdBy,
        now,
      ]
    );

    return sendSuccess(res, { id: result.insertId }, 'Workout plan created successfully', 201);
  } catch (error) {
    console.error('createWorkoutPlan error:', error);
    return sendError(res, 'Failed to create workout plan', 'INTERNAL_ERROR', 500);
  }
}

export async function updateWorkoutPlan(req, res) {
  try {
    const { id } = req.params;
    const { name, goal, difficulty, duration_weeks, description, trainer_id } = req.body;

    await query(
      `UPDATE workout_plans SET
        name = ?,
        goal = ?,
        difficulty = ?,
        duration_weeks = ?,
        description = ?,
        created_by = ?
       WHERE id = ?`,
      [
        name?.trim() || '',
        goal?.trim() || 'General Fitness',
        difficulty || 'Intermediate',
        parseInt(duration_weeks, 10) || 4,
        description?.trim() || '',
        trainer_id ? parseInt(trainer_id, 10) : null,
        id,
      ]
    );

    return sendSuccess(res, null, 'Workout plan updated successfully');
  } catch (error) {
    console.error('updateWorkoutPlan error:', error);
    return sendError(res, 'Failed to update workout plan', 'INTERNAL_ERROR', 500);
  }
}

export async function deleteWorkoutPlan(req, res) {
  try {
    const { id } = req.params;
    await query('DELETE FROM workout_plans WHERE id = ?', [id]);
    return sendSuccess(res, null, 'Workout plan deleted successfully');
  } catch (error) {
    console.error('deleteWorkoutPlan error:', error);
    return sendError(res, 'Failed to delete workout plan', 'INTERNAL_ERROR', 500);
  }
}
