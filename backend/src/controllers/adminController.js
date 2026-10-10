import { query } from '../config/db.js';
import { sendSuccess, sendError } from '../utils/response.js';

export async function getAdminStats(req, res) {
  try {
    const [membersCount] = await query('SELECT COUNT(*) AS cnt FROM members');
    const [trainersCount] = await query('SELECT COUNT(*) AS cnt FROM trainers');
    const [exercisesCount] = await query('SELECT COUNT(*) AS cnt FROM exercises');
    const [equipmentCount] = await query('SELECT COUNT(*) AS cnt FROM equipment');
    const [plansCount] = await query('SELECT COUNT(*) AS cnt FROM workout_plans');
    const [unreadMessages] = await query('SELECT COUNT(*) AS cnt FROM contact_messages WHERE is_read = 0');

    // Recent members
    const recentMembers = await query(
      `SELECT m.id, m.join_date, m.status, u.full_name, u.email
       FROM members m
       JOIN users u ON m.user_id = u.id
       ORDER BY m.id DESC LIMIT 5`
    );

    // Recent contact messages
    const recentMessages = await query(
      'SELECT id, name, email, subject, message, is_read, created_at FROM contact_messages ORDER BY id DESC LIMIT 5'
    );

    return sendSuccess(res, {
      counts: {
        members: membersCount.cnt,
        trainers: trainersCount.cnt,
        exercises: exercisesCount.cnt,
        equipment: equipmentCount.cnt,
        workoutPlans: plansCount.cnt,
        unreadMessages: unreadMessages.cnt,
      },
      recentMembers,
      recentMessages,
    });
  } catch (error) {
    console.error('getAdminStats error:', error);
    return sendError(res, 'Failed to fetch admin overview', 'INTERNAL_ERROR', 500);
  }
}

export async function getMembersList(req, res) {
  try {
    const members = await query(
      `SELECT m.id, m.user_id, m.membership_id, m.trainer_id, m.join_date, m.status,
              u.full_name, u.email, u.phone,
              mem.name AS membership_name,
              tu.full_name AS trainer_name
       FROM members m
       JOIN users u ON m.user_id = u.id
       LEFT JOIN memberships mem ON m.membership_id = mem.id
       LEFT JOIN trainers t ON m.trainer_id = t.id
       LEFT JOIN users tu ON t.user_id = tu.id
       ORDER BY m.id DESC`
    );
    return sendSuccess(res, { members });
  } catch (error) {
    console.error('getMembersList error:', error);
    return sendError(res, 'Failed to fetch members list', 'INTERNAL_ERROR', 500);
  }
}

export async function updateMember(req, res) {
  try {
    const { id } = req.params;
    const { membership_id, trainer_id, status } = req.body;

    await query(
      `UPDATE members SET
        membership_id = ?,
        trainer_id = ?,
        status = ?
       WHERE id = ?`,
      [
        membership_id ? parseInt(membership_id, 10) : null,
        trainer_id ? parseInt(trainer_id, 10) : null,
        status || 'ACTIVE',
        id,
      ]
    );

    return sendSuccess(res, null, 'Member record updated successfully');
  } catch (error) {
    console.error('updateMember error:', error);
    return sendError(res, 'Failed to update member record', 'INTERNAL_ERROR', 500);
  }
}

export async function getTrainersList(req, res) {
  try {
    const trainers = await query(
      `SELECT t.id, t.user_id, t.specialization, t.experience_years, t.bio, t.certifications, t.availability_status,
              u.full_name, u.email, u.phone,
              COUNT(m.id) AS assigned_count
       FROM trainers t
       JOIN users u ON t.user_id = u.id
       LEFT JOIN members m ON t.id = m.trainer_id
       GROUP BY t.id
       ORDER BY t.id ASC`
    );
    return sendSuccess(res, { trainers });
  } catch (error) {
    console.error('getTrainersList error:', error);
    return sendError(res, 'Failed to fetch trainers list', 'INTERNAL_ERROR', 500);
  }
}

export async function updateTrainer(req, res) {
  try {
    const { id } = req.params;
    const { specialization, experience_years, bio, certifications, availability_status } = req.body;

    await query(
      `UPDATE trainers SET
        specialization = ?,
        experience_years = ?,
        bio = ?,
        certifications = ?,
        availability_status = ?
       WHERE id = ?`,
      [
        specialization?.trim() || '',
        parseInt(experience_years, 10) || 1,
        bio?.trim() || '',
        certifications?.trim() || '',
        availability_status || 'Available',
        id,
      ]
    );

    return sendSuccess(res, null, 'Trainer record updated successfully');
  } catch (error) {
    console.error('updateTrainer error:', error);
    return sendError(res, 'Failed to update trainer record', 'INTERNAL_ERROR', 500);
  }
}
