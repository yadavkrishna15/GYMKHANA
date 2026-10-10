import { query } from '../config/db.js';
import { sendSuccess, sendError } from '../utils/response.js';

export async function getMemberDashboard(req, res) {
  try {
    const memberRows = await query('SELECT * FROM members WHERE user_id = ? LIMIT 1', [req.user.id]);
    if (!memberRows || memberRows.length === 0) {
      return sendError(res, 'Member profile not found', 'NOT_FOUND', 404);
    }
    const member = memberRows[0];

    // Membership details
    let membership = null;
    if (member.membership_id) {
      const memRows = await query('SELECT * FROM memberships WHERE id = ? LIMIT 1', [member.membership_id]);
      if (memRows && memRows.length > 0) membership = memRows[0];
    }

    // Assigned trainer
    let trainer = null;
    if (member.trainer_id) {
      const tRows = await query(
        `SELECT t.id, t.specialization, t.experience_years, u.full_name, u.email
         FROM trainers t
         JOIN users u ON t.user_id = u.id
         WHERE t.id = ? LIMIT 1`,
        [member.trainer_id]
      );
      if (tRows && tRows.length > 0) trainer = tRows[0];
    }

    // Workout plan (plan 1 or first available)
    const planRows = await query('SELECT * FROM workout_plans ORDER BY id ASC LIMIT 1');
    const workoutPlan = planRows.length > 0 ? planRows[0] : null;

    // Recent attendance
    const recentAttendance = await query(
      'SELECT id, date, check_in_time, check_out_time, status FROM attendance WHERE member_id = ? ORDER BY date DESC LIMIT 5',
      [member.id]
    );

    // Latest progress
    const progressRows = await query(
      'SELECT id, measured_on, weight_kg, height_cm, bmi, notes FROM progress WHERE member_id = ? ORDER BY measured_on DESC LIMIT 1',
      [member.id]
    );
    const latestProgress = progressRows.length > 0 ? progressRows[0] : null;

    return sendSuccess(res, {
      member,
      membership,
      trainer,
      workoutPlan,
      recentAttendance,
      latestProgress,
    });
  } catch (error) {
    console.error('getMemberDashboard error:', error);
    return sendError(res, 'Failed to load athlete dashboard', 'INTERNAL_ERROR', 500);
  }
}

export async function getMemberMembership(req, res) {
  try {
    const memberRows = await query('SELECT * FROM members WHERE user_id = ? LIMIT 1', [req.user.id]);
    if (!memberRows || memberRows.length === 0) {
      return sendError(res, 'Member profile not found', 'NOT_FOUND', 404);
    }
    const member = memberRows[0];

    let membership = null;
    if (member.membership_id) {
      const memRows = await query('SELECT * FROM memberships WHERE id = ? LIMIT 1', [member.membership_id]);
      if (memRows && memRows.length > 0) membership = memRows[0];
    }

    return sendSuccess(res, { member, membership });
  } catch (error) {
    console.error('getMemberMembership error:', error);
    return sendError(res, 'Failed to fetch membership details', 'INTERNAL_ERROR', 500);
  }
}

export async function getMemberWorkoutPlan(req, res) {
  try {
    // Return Plan 1 with exercises
    const planRows = await query(
      `SELECT wp.*, u.full_name AS trainer_name
       FROM workout_plans wp
       LEFT JOIN trainers t ON wp.created_by = t.id
       LEFT JOIN users u ON t.user_id = u.id
       ORDER BY wp.id ASC LIMIT 1`
    );

    if (!planRows || planRows.length === 0) {
      return sendSuccess(res, { plan: null, exercises: [] });
    }

    const plan = planRows[0];
    const exercises = await query(
      `SELECT wpe.*, e.name AS exercise_name, e.body_part
       FROM workout_plan_exercises wpe
       JOIN exercises e ON wpe.exercise_id = e.id
       WHERE wpe.plan_id = ?
       ORDER BY wpe.id ASC`,
      [plan.id]
    );

    return sendSuccess(res, { plan, exercises });
  } catch (error) {
    console.error('getMemberWorkoutPlan error:', error);
    return sendError(res, 'Failed to fetch workout plan', 'INTERNAL_ERROR', 500);
  }
}

export async function getMemberAttendance(req, res) {
  try {
    const memberRows = await query('SELECT id FROM members WHERE user_id = ? LIMIT 1', [req.user.id]);
    if (!memberRows || memberRows.length === 0) {
      return sendError(res, 'Member not found', 'NOT_FOUND', 404);
    }
    const memberId = memberRows[0].id;

    const attendance = await query(
      'SELECT id, date, check_in_time, check_out_time, status FROM attendance WHERE member_id = ? ORDER BY date DESC',
      [memberId]
    );

    return sendSuccess(res, { attendance });
  } catch (error) {
    console.error('getMemberAttendance error:', error);
    return sendError(res, 'Failed to load attendance logs', 'INTERNAL_ERROR', 500);
  }
}

export async function getMemberProgress(req, res) {
  try {
    const memberRows = await query('SELECT id FROM members WHERE user_id = ? LIMIT 1', [req.user.id]);
    if (!memberRows || memberRows.length === 0) {
      return sendError(res, 'Member not found', 'NOT_FOUND', 404);
    }
    const memberId = memberRows[0].id;

    const progress = await query(
      'SELECT id, measured_on, weight_kg, height_cm, bmi, notes FROM progress WHERE member_id = ? ORDER BY measured_on DESC',
      [memberId]
    );

    return sendSuccess(res, { progress });
  } catch (error) {
    console.error('getMemberProgress error:', error);
    return sendError(res, 'Failed to load biometric progress', 'INTERNAL_ERROR', 500);
  }
}

export async function addMemberProgress(req, res) {
  try {
    const { measured_on, weight_kg, height_cm, bmi, notes } = req.body;

    if (!measured_on || !weight_kg) {
      return sendError(res, 'Measurement date and weight are required', 'VALIDATION_ERROR', 400);
    }

    const memberRows = await query('SELECT id FROM members WHERE user_id = ? LIMIT 1', [req.user.id]);
    if (!memberRows || memberRows.length === 0) {
      return sendError(res, 'Member not found', 'NOT_FOUND', 404);
    }
    const memberId = memberRows[0].id;

    const w = parseFloat(weight_kg);
    const h = height_cm ? parseFloat(height_cm) : null;
    let computedBmi = bmi ? parseFloat(bmi) : null;

    if (!computedBmi && w > 0 && h > 0) {
      computedBmi = parseFloat((w / ((h / 100) * (h / 100))).toFixed(1));
    }

    await query(
      `INSERT INTO progress (member_id, measured_on, weight_kg, height_cm, bmi, notes)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [memberId, measured_on, w, h, computedBmi, notes?.trim() || null]
    );

    return sendSuccess(res, null, 'Progress logged successfully', 201);
  } catch (error) {
    console.error('addMemberProgress error:', error);
    return sendError(res, 'Failed to log biometric measurement', 'INTERNAL_ERROR', 500);
  }
}
