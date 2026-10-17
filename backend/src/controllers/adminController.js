import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Member from '../models/Member.js';
import Trainer from '../models/Trainer.js';
import Exercise from '../models/Exercise.js';
import Equipment from '../models/Equipment.js';
import WorkoutPlan from '../models/WorkoutPlan.js';
import ContactMessage from '../models/ContactMessage.js';
import Membership from '../models/Membership.js';
import { getNextSequence } from '../models/Counter.js';
import { buildIdQuery } from '../utils/idHelper.js';
import { sendSuccess, sendError } from '../utils/response.js';

export async function getAdminStats(req, res) {
  try {
    const [
      membersCount,
      trainersCount,
      exercisesCount,
      equipmentCount,
      plansCount,
      unreadMessagesCount,
    ] = await Promise.all([
      Member.countDocuments(),
      Trainer.countDocuments(),
      Exercise.countDocuments(),
      Equipment.countDocuments(),
      WorkoutPlan.countDocuments(),
      ContactMessage.countDocuments({ is_read: 0 }),
    ]);

    // Recent members
    const recentMemberDocs = await Member.find()
      .populate('user')
      .sort({ id: -1 })
      .limit(5)
      .lean();

    const recentMembers = recentMemberDocs.map((m) => ({
      id: m.id || m._id,
      _id: m._id,
      join_date: m.join_date,
      status: m.status,
      full_name: m.user?.full_name || 'Member',
      email: m.user?.email || null,
    }));

    // Recent messages
    const recentMessageDocs = await ContactMessage.find()
      .sort({ id: -1, created_at: -1 })
      .limit(5)
      .lean();

    const recentMessages = recentMessageDocs.map((m) => ({
      id: m.id || m._id,
      _id: m._id,
      name: m.name,
      email: m.email,
      subject: m.subject,
      message: m.message,
      is_read: m.is_read,
      created_at: m.created_at,
    }));

    return sendSuccess(res, {
      counts: {
        members: membersCount,
        trainers: trainersCount,
        exercises: exercisesCount,
        equipment: equipmentCount,
        workoutPlans: plansCount,
        unreadMessages: unreadMessagesCount,
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
    const docs = await Member.find()
      .populate('user')
      .populate('membership')
      .populate({
        path: 'trainer',
        populate: { path: 'user', select: 'full_name' },
      })
      .sort({ id: -1 })
      .lean();

    const members = docs.map((m) => ({
      id: m.id || m._id,
      _id: m._id,
      user_id: m.user_id || m.user?.id,
      membership_id: m.membership_id || m.membership?.id,
      trainer_id: m.trainer_id || m.trainer?.id,
      join_date: m.join_date,
      status: m.status,
      full_name: m.user?.full_name || 'Member',
      email: m.user?.email || null,
      phone: m.user?.phone || null,
      membership_name: m.membership?.name || null,
      trainer_name: m.trainer?.user?.full_name || null,
    }));

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

    const updateData = {
      status: status || 'ACTIVE',
    };

    if (membership_id) {
      const mem = await Membership.findOne(buildIdQuery(membership_id));
      if (mem) {
        updateData.membership_id = mem.id || parseInt(membership_id, 10);
        updateData.membership = mem._id;
      }
    } else if (membership_id === null || membership_id === '') {
      updateData.membership_id = null;
      updateData.membership = null;
    }

    if (trainer_id) {
      const tr = await Trainer.findOne(buildIdQuery(trainer_id));
      if (tr) {
        updateData.trainer_id = tr.id || parseInt(trainer_id, 10);
        updateData.trainer = tr._id;
      }
    } else if (trainer_id === null || trainer_id === '') {
      updateData.trainer_id = null;
      updateData.trainer = null;
    }

    const updated = await Member.findOneAndUpdate(buildIdQuery(id), updateData, { returnDocument: 'after' });
    if (!updated) {
      return sendError(res, 'Member record not found', 'NOT_FOUND', 404);
    }

    return sendSuccess(res, null, 'Member record updated successfully');
  } catch (error) {
    console.error('updateMember error:', error);
    return sendError(res, 'Failed to update member record', 'INTERNAL_ERROR', 500);
  }
}

export async function getTrainersList(req, res) {
  try {
    const docs = await Trainer.find().populate('user').sort({ id: 1 }).lean();

    // Compute assigned_count for each trainer
    const trainers = await Promise.all(
      docs.map(async (t) => {
        const assigned_count = await Member.countDocuments({
          $or: [{ trainer_id: t.id }, { trainer: t._id }],
        });

        return {
          id: t.id || t._id,
          _id: t._id,
          user_id: t.user_id || t.user?.id,
          specialization: t.specialization,
          experience_years: t.experience_years,
          bio: t.bio,
          certifications: t.certifications,
          availability_status: t.availability_status,
          full_name: t.user?.full_name || 'Coach',
          email: t.user?.email || null,
          phone: t.user?.phone || null,
          assigned_count,
        };
      })
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

    const updated = await Trainer.findOneAndUpdate(
      buildIdQuery(id),
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
      return sendError(res, 'Trainer record not found', 'NOT_FOUND', 404);
    }

    return sendSuccess(res, null, 'Trainer record updated successfully');
  } catch (error) {
    console.error('updateTrainer error:', error);
    return sendError(res, 'Failed to update trainer record', 'INTERNAL_ERROR', 500);
  }
}

export async function createTrainer(req, res) {
  try {
    const { full_name, email, phone, password, specialization, experience_years, bio, certifications } = req.body;

    if (!full_name?.trim() || !email?.trim() || !password) {
      return sendError(res, 'Name, email, and initial password are required', 'VALIDATION_ERROR', 400);
    }

    if (password.length < 6) {
      return sendError(res, 'Password must be at least 6 characters long', 'VALIDATION_ERROR', 400);
    }

    const existing = await User.findOne({ email: email.trim().toLowerCase() });
    if (existing) {
      return sendError(res, 'An account with this email address already exists', 'DUPLICATE_EMAIL', 409);
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const nextUserId = await getNextSequence('users');
    const newUser = await User.create({
      id: nextUserId,
      full_name: full_name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone?.trim() || null,
      password_hash,
      role: 'TRAINER',
    });

    const nextTrainerId = await getNextSequence('trainers');
    const newTrainer = await Trainer.create({
      id: nextTrainerId,
      user_id: newUser.id,
      user: newUser._id,
      specialization: specialization?.trim() || 'General Fitness',
      experience_years: parseInt(experience_years, 10) || 1,
      bio: bio?.trim() || `Certified ${specialization || 'Fitness'} Coach at GYMKHANA.`,
      certifications: certifications?.trim() || null,
      availability_status: 'Available',
    });

    return sendSuccess(
      res,
      {
        trainer: {
          id: newTrainer.id,
          _id: newTrainer._id,
          full_name: newUser.full_name,
          email: newUser.email,
          phone: newUser.phone,
          specialization: newTrainer.specialization,
          experience_years: newTrainer.experience_years,
          bio: newTrainer.bio,
          certifications: newTrainer.certifications,
          availability_status: newTrainer.availability_status,
          assigned_count: 0,
        },
      },
      'Coach created successfully',
      201
    );
  } catch (error) {
    console.error('createTrainer error:', error);
    return sendError(res, 'Failed to create trainer record', 'INTERNAL_ERROR', 500);
  }
}

