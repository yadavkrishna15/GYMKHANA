import Attendance from '../models/Attendance.js';
import Member from '../models/Member.js';
import { getNextSequence } from '../models/Counter.js';
import { buildIdQuery } from '../utils/idHelper.js';
import { sendSuccess, sendError } from '../utils/response.js';

export async function getAttendanceLogs(req, res) {
  try {
    const { date, member_id } = req.query;
    const filter = {};

    if (date) {
      filter.date = date;
    }
    if (member_id) {
      const mNum = parseInt(member_id, 10);
      if (!isNaN(mNum)) {
        filter.$or = [{ member_id: mNum }, { member: member_id }];
      } else {
        filter.member = member_id;
      }
    }

    const docs = await Attendance.find(filter)
      .populate({
        path: 'member',
        populate: { path: 'user', select: 'full_name email' },
      })
      .sort({ date: -1, id: -1 })
      .lean();

    const attendance = docs.map((a) => ({
      ...a,
      id: a.id || a._id,
      member_name: a.member?.user?.full_name || 'Member',
      email: a.member?.user?.email || null,
    }));

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

    const member = await Member.findOne(buildIdQuery(member_id));
    if (!member) {
      return sendError(res, 'Member record not found', 'NOT_FOUND', 404);
    }

    const nextId = await getNextSequence('attendance');

    const created = await Attendance.create({
      id: nextId,
      member_id: member.id || parseInt(member_id, 10),
      member: member._id,
      date,
      check_in_time: check_in_time?.trim() || '07:00 AM',
      check_out_time: check_out_time?.trim() || '08:30 AM',
      status: status || 'Present',
    });

    return sendSuccess(res, { id: created.id || created._id }, 'Attendance logged successfully', 201);
  } catch (error) {
    console.error('recordAttendance error:', error);
    return sendError(res, 'Failed to log attendance', 'INTERNAL_ERROR', 500);
  }
}
