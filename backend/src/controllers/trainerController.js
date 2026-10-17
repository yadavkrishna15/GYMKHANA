import Trainer from '../models/Trainer.js';
import Member from '../models/Member.js';
import WorkoutPlan from '../models/WorkoutPlan.js';
import Attendance from '../models/Attendance.js';
import Progress from '../models/Progress.js';
import { getNextSequence } from '../models/Counter.js';
import { buildIdQuery } from '../utils/idHelper.js';
import { sendSuccess, sendError } from '../utils/response.js';

export async function getPublicTrainers(req, res) {
  try {
    const { specialization, search } = req.query;
    const filter = {};

    if (specialization) {
      filter.specialization = specialization;
    }

    let docs = await Trainer.find(filter).populate('user').sort({ experience_years: -1 }).lean();

    if (search) {
      const term = search.toLowerCase();
      docs = docs.filter(
        (t) =>
          t.user?.full_name?.toLowerCase().includes(term) ||
          t.specialization?.toLowerCase().includes(term) ||
          t.bio?.toLowerCase().includes(term)
      );
    }

    const trainers = docs.map((t) => ({
      id: t.id || t._id,
      _id: t._id,
      specialization: t.specialization,
      experience_years: t.experience_years,
      bio: t.bio,
      certifications: t.certifications,
      availability_status: t.availability_status,
      full_name: t.user?.full_name || 'Coach',
      email: t.user?.email || null,
    }));

    return sendSuccess(res, { trainers });
  } catch (error) {
    console.error('getPublicTrainers error:', error);
    return sendError(res, 'Failed to fetch trainers', 'INTERNAL_ERROR', 500);
  }
}

export async function getTrainerDashboard(req, res) {
  try {
    const trainer = await Trainer.findOne({
      $or: [{ user_id: req.user.id }, { user: req.user._id }],
    })
      .populate('user')
      .lean();

    if (!trainer) {
      return sendError(res, 'Trainer profile not found', 'NOT_FOUND', 404);
    }

    const trainerIdNum = trainer.id;
    const memberDocs = await Member.find({
      $or: [{ trainer_id: trainerIdNum }, { trainer: trainer._id }],
    })
      .populate('user')
      .populate('membership')
      .sort({ id: -1 })
      .lean();

    const planDocs = await WorkoutPlan.find({
      $or: [{ created_by: trainerIdNum }, { trainer: trainer._id }],
    })
      .sort({ id: -1 })
      .lean();

    const defaultPlanName = planDocs.length > 0 ? planDocs[0].name : 'Push-Pull-Legs (PPL) Split';

    const assignedMembers = memberDocs.map((m) => ({
      id: m.id || m._id,
      _id: m._id,
      user_id: m.user_id || m.user?.id,
      join_date: m.join_date,
      status: m.status,
      full_name: m.user?.full_name || 'Athlete',
      email: m.user?.email || null,
      phone: m.user?.phone || null,
      plan_name: defaultPlanName,
    }));

    const myPlans = planDocs.map((p) => ({
      id: p.id || p._id,
      _id: p._id,
      name: p.name,
      goal: p.goal,
      difficulty: p.difficulty,
      duration_weeks: p.duration_weeks,
      description: p.description,
    }));

    return sendSuccess(res, {
      trainer: {
        ...trainer,
        id: trainer.id || trainer._id,
      },
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
    const doc = await Trainer.findOne({
      $or: [{ user_id: req.user.id }, { user: req.user._id }],
    })
      .populate('user')
      .lean();

    if (!doc) {
      return sendError(res, 'Trainer profile not found', 'NOT_FOUND', 404);
    }

    const trainer = {
      ...doc,
      id: doc.id || doc._id,
    };

    return sendSuccess(res, { trainer });
  } catch (error) {
    console.error('getTrainerProfile error:', error);
    return sendError(res, 'Failed to load profile', 'INTERNAL_ERROR', 500);
  }
}

export async function updateTrainerProfile(req, res) {
  try {
    const { specialization, experience_years, bio, certifications, availability_status } = req.body;

    const updated = await Trainer.findOneAndUpdate(
      { $or: [{ user_id: req.user.id }, { user: req.user._id }] },
      {
        specialization: specialization?.trim() || '',
        experience_years: parseInt(experience_years, 10) || 1,
        bio: bio?.trim() || '',
        certifications: certifications?.trim() || '',
        availability_status: availability_status || 'Available',
      },
      { returnDocument: 'after' }
    );

    if (!updated) {
      return sendError(res, 'Trainer profile not found', 'NOT_FOUND', 404);
    }

    return sendSuccess(res, null, 'Trainer profile updated successfully');
  } catch (error) {
    console.error('updateTrainerProfile error:', error);
    return sendError(res, 'Failed to update profile', 'INTERNAL_ERROR', 500);
  }
}

export async function getAssignedMembers(req, res) {
  try {
    const trainer = await Trainer.findOne({
      $or: [{ user_id: req.user.id }, { user: req.user._id }],
    });

    if (!trainer) {
      return sendError(res, 'Trainer profile not found', 'NOT_FOUND', 404);
    }

    const docs = await Member.find({
      $or: [{ trainer_id: trainer.id }, { trainer: trainer._id }],
    })
      .populate('user')
      .populate('membership')
      .sort({ id: -1 })
      .lean();

    const members = docs.map((m) => ({
      id: m.id || m._id,
      _id: m._id,
      user_id: m.user_id || m.user?.id,
      join_date: m.join_date,
      status: m.status,
      full_name: m.user?.full_name || 'Member',
      email: m.user?.email || null,
      phone: m.user?.phone || null,
      membership_name: m.membership?.name || null,
    }));

    return sendSuccess(res, { members });
  } catch (error) {
    console.error('getAssignedMembers error:', error);
    return sendError(res, 'Failed to fetch assigned athletes', 'INTERNAL_ERROR', 500);
  }
}

export async function getMemberDetailsForTrainer(req, res) {
  try {
    const { id } = req.params;

    const mDoc = await Member.findOne(buildIdQuery(id))
      .populate('user')
      .populate('membership')
      .lean();

    if (!mDoc) {
      return sendError(res, 'Member record not located', 'NOT_FOUND', 404);
    }

    const member = {
      id: mDoc.id || mDoc._id,
      _id: mDoc._id,
      user_id: mDoc.user_id || mDoc.user?.id,
      join_date: mDoc.join_date,
      status: mDoc.status,
      membership_id: mDoc.membership_id || mDoc.membership?.id,
      full_name: mDoc.user?.full_name || 'Athlete',
      email: mDoc.user?.email || null,
      phone: mDoc.user?.phone || null,
      membership_name: mDoc.membership?.name || null,
    };

    const memberIdNum = member.id;

    // Attendance
    const attDocs = await Attendance.find({
      $or: [{ member_id: memberIdNum }, { member: mDoc._id }],
    })
      .sort({ date: -1 })
      .limit(10)
      .lean();

    const attendance = attDocs.map((a) => ({
      ...a,
      id: a.id || a._id,
    }));

    // Progress
    const progDocs = await Progress.find({
      $or: [{ member_id: memberIdNum }, { member: mDoc._id }],
    })
      .sort({ measured_on: -1 })
      .lean();

    const progress = progDocs.map((p) => ({
      ...p,
      id: p.id || p._id,
    }));

    // Workout plan (default to first available plan)
    const planDoc = await WorkoutPlan.findOne().sort({ id: 1 }).lean();
    const workoutPlan = planDoc ? { ...planDoc, id: planDoc.id || planDoc._id } : null;

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

    const member = await Member.findOne(buildIdQuery(id));
    if (!member) {
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

    const member = await Member.findOne(buildIdQuery(id));
    if (!member) {
      return sendError(res, 'Member not found', 'NOT_FOUND', 404);
    }

    const nextId = await getNextSequence('progress');
    const w = parseFloat(weight_kg);
    const h = height_cm ? parseFloat(height_cm) : null;
    let computedBmi = bmi ? parseFloat(bmi) : null;

    if (!computedBmi && w > 0 && h > 0) {
      computedBmi = parseFloat((w / ((h / 100) * (h / 100))).toFixed(1));
    }

    await Progress.create({
      id: nextId,
      member_id: member.id || parseInt(id, 10),
      member: member._id,
      measured_on,
      weight_kg: w,
      height_cm: h,
      bmi: computedBmi,
      notes: notes?.trim() || null,
    });

    return sendSuccess(res, null, 'Biometric progress recorded successfully', 201);
  } catch (error) {
    console.error('addMemberProgressByTrainer error:', error);
    return sendError(res, 'Failed to record athlete progress', 'INTERNAL_ERROR', 500);
  }
}

export async function getTrainerPlans(req, res) {
  try {
    const trainer = await Trainer.findOne({
      $or: [{ user_id: req.user.id }, { user: req.user._id }],
    });

    if (!trainer) {
      return sendError(res, 'Trainer profile not found', 'NOT_FOUND', 404);
    }

    const docs = await WorkoutPlan.find({
      $or: [{ created_by: trainer.id }, { trainer: trainer._id }],
    })
      .sort({ id: -1 })
      .lean();

    const plans = docs.map((p) => ({
      ...p,
      id: p.id || p._id,
      exercise_count: p.exercises ? p.exercises.length : 0,
    }));

    return sendSuccess(res, { plans });
  } catch (error) {
    console.error('getTrainerPlans error:', error);
    return sendError(res, 'Failed to fetch coach routines', 'INTERNAL_ERROR', 500);
  }
}
