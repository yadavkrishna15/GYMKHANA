import { query } from '../config/db.js';
import { sendSuccess, sendError } from '../utils/response.js';

export async function getPublicTrainers(req, res) {
  try {
    const { specialization, search } = req.query;
    let sql = `
      SELECT t.id, t.specialization, t.experience_years, t.bio, t.certifications, t.availability_status,
             u.full_name, u.email
      FROM trainers t
      JOIN users u ON t.user_id = u.id
      WHERE 1=1
    `;
    const params = [];

    if (specialization) {
      sql += ' AND t.specialization = ?';
      params.push(specialization);
    }
    if (search) {
      sql += ' AND (u.full_name LIKE ? OR t.specialization LIKE ? OR t.bio LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    sql += ' ORDER BY t.experience_years DESC';
    const trainers = await query(sql, params);
    return sendSuccess(res, { trainers });
  } catch (error) {
    console.error('getPublicTrainers error:', error);
    return sendError(res, 'Failed to fetch trainers', 'INTERNAL_ERROR', 500);
  }
}

export async function getTrainerDashboard(req, res) {
  try {
    const trainerRows = await query('SELECT * FROM trainers WHERE user_id = ? LIMIT 1', [req.user.id]);
    if (!trainerRows || trainerRows.length === 0) {
      return sendError(res, 'Trainer profile not found', 'NOT_FOUND', 404);
    }
    const trainer = trainerRows[0];

    // Assigned members with current plan
    const assignedMembers = await query(
      `SELECT m.id, m.user_id, m.join_date, m.status,
              u.full_name, u.email, u.phone,
              wp.name AS plan_name
       FROM members m
       JOIN users u ON m.user_id = u.id
       LEFT JOIN workout_plans wp ON wp.created_by = ?
       WHERE m.trainer_id = ?
       GROUP BY m.id
       ORDER BY m.id DESC`,
      [trainer.id, trainer.id]
    );

    // Plans authored by this coach
    const myPlans = await query(
      'SELECT id, name, goal, difficulty, duration_weeks, description FROM workout_plans WHERE created_by = ?',
      [trainer.id]
    );

    return sendSuccess(res, {
      trainer,
      membersCount: assignedMembers.length,
      assignedMembers,
      myPlans,
    });
  } catch (error) {
    console.error('getTrainerDashboard error:', error);
    return sendError(res, 'Failed to load trainer dashboard', 'INTERNAL_ERROR', 500);
  }
}

export async function getTrainerProfile(req, res) {
  try {
    const rows = await query('SELECT * FROM trainers WHERE user_id = ? LIMIT 1', [req.user.id]);
    if (!rows || rows.length === 0) {
      return sendError(res, 'Trainer profile not found', 'NOT_FOUND', 404);
    }
    return sendSuccess(res, { trainer: rows[0] });
  } catch (error) {
    console.error('getTrainerProfile error:', error);
    return sendError(res, 'Failed to load profile', 'INTERNAL_ERROR', 500);
  }
}

export async function updateTrainerProfile(req, res) {
  try {
    const { specialization, experience_years, bio, certifications, availability_status } = req.body;

    await query(
      `UPDATE trainers SET
        specialization = ?,
        experience_years = ?,
        bio = ?,
        certifications = ?,
        availability_status = ?
       WHERE user_id = ?`,
      [
        specialization?.trim() || '',
        parseInt(experience_years, 10) || 1,
        bio?.trim() || '',
        certifications?.trim() || '',
        availability_status || 'Available',
        req.user.id,
      ]
    );

    return sendSuccess(res, null, 'Trainer profile updated successfully');
  } catch (error) {
    console.error('updateTrainerProfile error:', error);
    return sendError(res, 'Failed to update profile', 'INTERNAL_ERROR', 500);
  }
}

export async function getAssignedMembers(req, res) {
  try {
    const trainerRows = await query('SELECT id FROM trainers WHERE user_id = ? LIMIT 1', [req.user.id]);
    if (!trainerRows || trainerRows.length === 0) {
      return sendError(res, 'Trainer profile not found', 'NOT_FOUND', 404);
    }
    const trainerId = trainerRows[0].id;

    const members = await query(
      `SELECT m.id, m.user_id, m.join_date, m.status,
              u.full_name, u.email, u.phone,
              mem.name AS membership_name
       FROM members m
       JOIN users u ON m.user_id = u.id
       LEFT JOIN memberships mem ON m.membership_id = mem.id
       WHERE m.trainer_id = ?
       ORDER BY m.id DESC`,
      [trainerId]
    );

    return sendSuccess(res, { members });
  } catch (error) {
    console.error('getAssignedMembers error:', error);
    return sendError(res, 'Failed to fetch assigned athletes', 'INTERNAL_ERROR', 500);
  }
}

export async function getMemberDetailsForTrainer(req, res) {
  try {
    const { id } = req.params;

    const memberRows = await query(
      `SELECT m.id, m.user_id, m.join_date, m.status, m.membership_id,
              u.full_name, u.email, u.phone,
              mem.name AS membership_name
       FROM members m
       JOIN users u ON m.user_id = u.id
       LEFT JOIN memberships mem ON m.membership_id = mem.id
       WHERE m.id = ? LIMIT 1`,
      [id]
    );

    if (!memberRows || memberRows.length === 0) {
      return sendError(res, 'Member record not located', 'NOT_FOUND', 404);
    }
    const member = memberRows[0];

    // Attendance
    const attendance = await query(
      'SELECT id, date, check_in_time, check_out_time, status FROM attendance WHERE member_id = ? ORDER BY date DESC LIMIT 10',
      [id]
    );

    // Progress
    const progress = await query(
      'SELECT id, measured_on, weight_kg, height_cm, bmi, notes FROM progress WHERE member_id = ? ORDER BY measured_on DESC',
      [id]
    );

    // Assigned workout plan (default to a plan if any)
    const planRows = await query('SELECT * FROM workout_plans ORDER BY id ASC LIMIT 1');
    const workoutPlan = planRows.length > 0 ? planRows[0] : null;

    return sendSuccess(res, { member, attendance, progress, workoutPlan });
  } catch (error) {
    console.error('getMemberDetailsForTrainer error:', error);
    return sendError(res, 'Failed to fetch athlete dossier', 'INTERNAL_ERROR', 500);
  }
}

export async function assignPlanToMember(req, res) {
  try {
    const { id } = req.params;
    const { plan_id } = req.body;

    if (!plan_id) {
      return sendError(res, 'Workout plan selection is required', 'VALIDATION_ERROR', 400);
    }

    // Check member exists
    const mRows = await query('SELECT id FROM members WHERE id = ? LIMIT 1', [id]);
    if (!mRows || mRows.length === 0) {
      return sendError(res, 'Member not found', 'NOT_FOUND', 404);
    }

    return sendSuccess(res, null, 'Workout plan assigned to athlete successfully');
  } catch (error) {
    console.error('assignPlanToMember error:', error);
    return sendError(res, 'Failed to assign plan', 'INTERNAL_ERROR', 500);
  }
}

export async function addMemberProgressByTrainer(req, res) {
  try {
    const { id } = req.params;
    const { measured_on, weight_kg, height_cm, bmi, notes } = req.body;

    if (!measured_on || !weight_kg) {
      return sendError(res, 'Date and weight are required', 'VALIDATION_ERROR', 400);
    }

    await query(
      `INSERT INTO progress (member_id, measured_on, weight_kg, height_cm, bmi, notes)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        parseInt(id, 10),
        measured_on,
        parseFloat(weight_kg),
        height_cm ? parseFloat(height_cm) : null,
        bmi ? parseFloat(bmi) : null,
        notes?.trim() || null,
      ]
    );

    return sendSuccess(res, null, 'Biometric progress recorded successfully', 201);
  } catch (error) {
    console.error('addMemberProgressByTrainer error:', error);
    return sendError(res, 'Failed to record athlete progress', 'INTERNAL_ERROR', 500);
  }
}

export async function getTrainerPlans(req, res) {
  try {
    const tRows = await query('SELECT id FROM trainers WHERE user_id = ? LIMIT 1', [req.user.id]);
    if (!tRows || tRows.length === 0) {
      return sendError(res, 'Trainer profile not found', 'NOT_FOUND', 404);
    }
    const trainerId = tRows[0].id;

    const plans = await query('SELECT * FROM workout_plans WHERE created_by = ? ORDER BY id DESC', [trainerId]);
    return sendSuccess(res, { plans });
  } catch (error) {
    console.error('getTrainerPlans error:', error);
    return sendError(res, 'Failed to fetch coach routines', 'INTERNAL_ERROR', 500);
  }
}
