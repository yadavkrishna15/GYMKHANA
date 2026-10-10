import { query } from '../config/db.js';
import { sendSuccess, sendError } from '../utils/response.js';

export async function getAttendanceLogs(req, res) {
  try {
    const { date, member_id } = req.query;
    let sql = `
      SELECT a.*, u.full_name AS member_name, u.email
      FROM attendance a
      JOIN members m ON a.member_id = m.id
      JOIN users u ON m.user_id = u.id
      WHERE 1=1
    `;
    const params = [];

    if (date) {
      sql += ' AND a.date = ?';
      params.push(date);
    }
    if (member_id) {
      sql += ' AND a.member_id = ?';
      params.push(member_id);
    }

    sql += ' ORDER BY a.date DESC, a.id DESC';

    const attendance = await query(sql, params);
    return sendSuccess(res, { attendance });
  } catch (error) {
    console.error('getAttendanceLogs error:', error);
    return sendError(res, 'Failed to fetch attendance logs', 'INTERNAL_ERROR', 500);
  }
}

export async function recordAttendance(req, res) {
  try {
    const { member_id, date, check_in_time, check_out_time, status } = req.body;

    if (!member_id || !date) {
      return sendError(res, 'Member selection and date are required', 'VALIDATION_ERROR', 400);
    }

    const result = await query(
      `INSERT INTO attendance (member_id, date, check_in_time, check_out_time, status)
       VALUES (?, ?, ?, ?, ?)`,
      [
        parseInt(member_id, 10),
        date,
        check_in_time?.trim() || '07:00 AM',
        check_out_time?.trim() || '08:30 AM',
        status || 'Present',
      ]
    );

    return sendSuccess(res, { id: result.insertId }, 'Attendance logged successfully', 201);
  } catch (error) {
    console.error('recordAttendance error:', error);
    return sendError(res, 'Failed to log attendance', 'INTERNAL_ERROR', 500);
  }
}
