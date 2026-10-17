import Member from '../models/Member.js';
import Membership from '../models/Membership.js';
import Trainer from '../models/Trainer.js';
import WorkoutPlan from '../models/WorkoutPlan.js';
import Attendance from '../models/Attendance.js';
import Progress from '../models/Progress.js';
import { getNextSequence } from '../models/Counter.js';
import { buildIdQuery } from '../utils/idHelper.js';
import { sendSuccess, sendError } from '../utils/response.js';

export async function getMemberDashboard(req, res) {
  try {
    const member = await Member.findOne({
      $or: [{ user_id: req.user.id }, { user: req.user._id }],
    })
      .populate('user')
      .populate('membership')
      .populate({
        path: 'trainer',
        populate: { path: 'user', select: 'full_name email' },
      })
      .lean();

    if (!member) {
      return sendError(res, 'Member profile not found', 'NOT_FOUND', 404);
    }

    const memberIdNum = member.id;

    // Membership details
    let membership = member.membership || null;
    if (!membership && member.membership_id) {
      membership = await Membership.findOne(buildIdQuery(member.membership_id)).lean();
    }
    if (membership) {
      membership = { ...membership, id: membership.id || membership._id };
    }

    // Trainer details
    let trainer = null;
    if (member.trainer) {
      trainer = {
        id: member.trainer.id || member.trainer._id,
        specialization: member.trainer.specialization,
        experience_years: member.trainer.experience_years,
        full_name: member.trainer.user?.full_name || 'Coach',
        email: member.trainer.user?.email || null,
      };
    } else if (member.trainer_id) {
      const tDoc = await Trainer.findOne(buildIdQuery(member.trainer_id)).populate('user').lean();
      if (tDoc) {
        trainer = {
          id: tDoc.id || tDoc._id,
          specialization: tDoc.specialization,
          experience_years: tDoc.experience_years,
          full_name: tDoc.user?.full_name || 'Coach',
          email: tDoc.user?.email || null,
        };
      }
    }

    // Workout plan (Plan 1 or first available)
    const planDoc = await WorkoutPlan.findOne().sort({ id: 1 }).lean();
    const workoutPlan = planDoc ? { ...planDoc, id: planDoc.id || planDoc._id } : null;

    // Recent attendance
    const attDocs = await Attendance.find({
      $or: [{ member_id: memberIdNum }, { member: member._id }],
    })
      .sort({ date: -1 })
      .limit(5)
      .lean();

    const recentAttendance = attDocs.map((a) => ({
      ...a,
      id: a.id || a._id,
    }));

    // Latest progress
    const latestProgDoc = await Progress.findOne({
      $or: [{ member_id: memberIdNum }, { member: member._id }],
    })
      .sort({ measured_on: -1 })
      .lean();

    const latestProgress = latestProgDoc ? { ...latestProgDoc, id: latestProgDoc.id || latestProgDoc._id } : null;

    return sendSuccess(res, {
      member: { ...member, id: member.id || member._id },
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
    const member = await Member.findOne({
      $or: [{ user_id: req.user.id }, { user: req.user._id }],
    })
      .populate('membership')
      .lean();

    if (!member) {
      return sendError(res, 'Member profile not found', 'NOT_FOUND', 404);
    }

    let membership = member.membership || null;
    if (!membership && member.membership_id) {
      membership = await Membership.findOne(buildIdQuery(member.membership_id)).lean();
    }
    if (membership) {
      membership = { ...membership, id: membership.id || membership._id };
    }

    return sendSuccess(res, {
      member: { ...member, id: member.id || member._id },
      membership,
    });
  } catch (error) {
    console.error('getMemberMembership error:', error);
    return sendError(res, 'Failed to fetch membership details', 'INTERNAL_ERROR', 500);
  }
}

export async function getMemberWorkoutPlan(req, res) {
  try {
    const doc = await WorkoutPlan.findOne()
      .populate({
        path: 'trainer',
        populate: { path: 'user', select: 'full_name' },
      })
      .populate('exercises.exercise')
      .sort({ id: 1 })
      .lean();

    if (!doc) {
      return sendSuccess(res, { plan: null, exercises: [] });
    }

    const plan = {
      ...doc,
      id: doc.id || doc._id,
      trainer_name: doc.trainer?.user?.full_name || doc.trainer_name || 'Coach Vikram Malhotra',
    };

    const exercises = (doc.exercises || []).map((e, index) => {
      const exDoc = e.exercise || {};
      return {
        id: e.id || index + 1,
        _id: e._id,
        plan_id: plan.id,
        exercise_id: e.exercise_id || exDoc.id || exDoc._id,
        day_or_order: e.day_or_order,
        sets: e.sets,
        reps: e.reps,
        rest_seconds: e.rest_seconds,
        notes: e.notes,
        exercise_name: e.exercise_name || exDoc.name || 'Exercise',
        body_part: e.body_part || exDoc.body_part || 'Full Body',
      };
    });

    return sendSuccess(res, { plan, exercises });
  } catch (error) {
    console.error('getMemberWorkoutPlan error:', error);
    return sendError(res, 'Failed to fetch workout plan', 'INTERNAL_ERROR', 500);
  }
}

export async function getMemberAttendance(req, res) {
  try {
    const member = await Member.findOne({
      $or: [{ user_id: req.user.id }, { user: req.user._id }],
    });

    if (!member) {
      return sendError(res, 'Member not found', 'NOT_FOUND', 404);
    }

    const docs = await Attendance.find({
      $or: [{ member_id: member.id }, { member: member._id }],
    })
      .sort({ date: -1 })
      .lean();

    const attendance = docs.map((a) => ({
      ...a,
      id: a.id || a._id,
    }));

    return sendSuccess(res, { attendance });
  } catch (error) {
    console.error('getMemberAttendance error:', error);
    return sendError(res, 'Failed to load attendance logs', 'INTERNAL_ERROR', 500);
  }
}

export async function getMemberProgress(req, res) {
  try {
    const member = await Member.findOne({
      $or: [{ user_id: req.user.id }, { user: req.user._id }],
    });

    if (!member) {
      return sendError(res, 'Member not found', 'NOT_FOUND', 404);
    }

    const docs = await Progress.find({
      $or: [{ member_id: member.id }, { member: member._id }],
    })
      .sort({ measured_on: -1 })
      .lean();

    const progress = docs.map((p) => ({
      ...p,
      id: p.id || p._id,
    }));

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

    const member = await Member.findOne({
      $or: [{ user_id: req.user.id }, { user: req.user._id }],
    });

    if (!member) {
      return sendError(res, 'Member not found', 'NOT_FOUND', 404);
    }

    const w = parseFloat(weight_kg);
    const h = height_cm ? parseFloat(height_cm) : null;
    let computedBmi = bmi ? parseFloat(bmi) : null;

    if (!computedBmi && w > 0 && h > 0) {
      computedBmi = parseFloat((w / ((h / 100) * (h / 100))).toFixed(1));
    }

    const nextId = await getNextSequence('progress');

    await Progress.create({
      id: nextId,
      member_id: member.id,
      member: member._id,
      measured_on,
      weight_kg: w,
      height_cm: h,
      bmi: computedBmi,
      notes: notes?.trim() || null,
    });

    return sendSuccess(res, null, 'Progress logged successfully', 201);
  } catch (error) {
    console.error('addMemberProgress error:', error);
    return sendError(res, 'Failed to log biometric measurement', 'INTERNAL_ERROR', 500);
  }
}
