import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Member from '../models/Member.js';
import Trainer from '../models/Trainer.js';
import Membership from '../models/Membership.js';
import { getNextSequence } from '../models/Counter.js';
import { buildIdQuery } from '../utils/idHelper.js';
import { sendSuccess, sendError } from '../utils/response.js';

function getJwtSecret() {
  return process.env.JWT_SECRET || 'gymkhana_default_dev_secret_key';
}

function generateToken(user) {
  return jwt.sign(
    { id: user.id || user._id, email: user.email, role: user.role },
    getJwtSecret(),
    { expiresIn: '7d' }
  );
}

export async function register(req, res) {
  try {
    const { full_name, email, phone, password } = req.body;

    // 1. Validation
    if (!full_name || !full_name.trim()) {
      return sendError(res, 'Full name is required', 'VALIDATION_ERROR', 400);
    }
    if (!email || !email.trim()) {
      return sendError(res, 'Email address is required', 'VALIDATION_ERROR', 400);
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return sendError(res, 'Please provide a valid email address', 'VALIDATION_ERROR', 400);
    }
    if (!password || password.length < 6) {
      return sendError(res, 'Password must be at least 6 characters long', 'VALIDATION_ERROR', 400);
    }

    // 2. Duplicate email check
    const existing = await User.findOne({ email: email.trim().toLowerCase() });
    if (existing) {
      return sendError(res, 'An account with this email address already exists', 'DUPLICATE_EMAIL', 409);
    }

    // 3. Hash password
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    // 4. Sequential ID for backwards compatibility
    const nextUserId = await getNextSequence('users');

    // 5. Create user
    const newUser = await User.create({
      id: nextUserId,
      full_name: full_name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone?.trim() || null,
      password_hash,
      role: 'MEMBER',
    });

    // 6. Initialize member record
    const nextMemberId = await getNextSequence('members');
    const today = new Date().toISOString().split('T')[0];
    await Member.create({
      id: nextMemberId,
      user_id: newUser.id,
      user: newUser._id,
      membership_id: null,
      trainer_id: null,
      join_date: today,
      status: 'ACTIVE',
    });

    const userObj = {
      id: newUser.id,
      _id: newUser._id,
      full_name: newUser.full_name,
      email: newUser.email,
      phone: newUser.phone,
      role: 'MEMBER',
    };

    const token = generateToken(userObj);

    return sendSuccess(res, { user: userObj, token }, 'Registration successful! Welcome to GYMKHANA.', 201);
  } catch (error) {
    console.error('Registration Error:', error);
    return sendError(res, 'Server error during registration. Please try again.', 'INTERNAL_ERROR', 500);
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return sendError(res, 'Email and password are required', 'VALIDATION_ERROR', 400);
    }

    const userRecord = await User.findOne({ email: email.trim().toLowerCase() });
    if (!userRecord) {
      return sendError(res, 'Invalid email or password credentials', 'INVALID_CREDENTIALS', 401);
    }

    const isMatch = await bcrypt.compare(password, userRecord.password_hash);
    if (!isMatch) {
      return sendError(res, 'Invalid email or password credentials', 'INVALID_CREDENTIALS', 401);
    }

    const user = {
      id: userRecord.id || userRecord._id,
      _id: userRecord._id,
      full_name: userRecord.full_name,
      email: userRecord.email,
      phone: userRecord.phone,
      role: userRecord.role,
    };

    const token = generateToken(user);

    return sendSuccess(res, { user, token }, 'Authentication successful.');
  } catch (error) {
    console.error('Login Error:', error);
    return sendError(res, 'Server error during authentication.', 'INTERNAL_ERROR', 500);
  }
}

export async function getMe(req, res) {
  try {
    const user = { ...req.user };

    if (user.role === 'MEMBER') {
      const member = await Member.findOne({
        $or: [{ user_id: user.id }, { user: user._id }],
      })
        .populate('membership')
        .populate({
          path: 'trainer',
          populate: { path: 'user', select: 'full_name email' },
        })
        .lean();

      if (member) {
        // Also check if membership or trainer was linked by numeric ID
        let membershipName = member.membership?.name;
        if (!membershipName && member.membership_id) {
          const m = await Membership.findOne(buildIdQuery(member.membership_id)).lean();
          if (m) membershipName = m.name;
        }

        let trainerName = member.trainer?.user?.full_name;
        if (!trainerName && member.trainer_id) {
          const t = await Trainer.findOne(buildIdQuery(member.trainer_id)).populate('user').lean();
          if (t && t.user) trainerName = t.user.full_name;
        }

        user.memberDetails = {
          member_id: member.id || member._id,
          id: member.id || member._id,
          membership_id: member.membership_id || member.membership?.id,
          trainer_id: member.trainer_id || member.trainer?.id,
          join_date: member.join_date,
          status: member.status,
          membership_name: membershipName || null,
          trainer_name: trainerName || null,
        };
      }
    } else if (user.role === 'TRAINER') {
      const trainer = await Trainer.findOne({
        $or: [{ user_id: user.id }, { user: user._id }],
      }).lean();

      if (trainer) {
        user.trainerDetails = {
          trainer_id: trainer.id || trainer._id,
          id: trainer.id || trainer._id,
          specialization: trainer.specialization,
          experience_years: trainer.experience_years,
          bio: trainer.bio,
          certifications: trainer.certifications,
          availability_status: trainer.availability_status,
        };
      }
    }

    return sendSuccess(res, { user });
  } catch (error) {
    console.error('GetMe Error:', error);
    return sendError(res, 'Failed to fetch current user profile.', 'INTERNAL_ERROR', 500);
  }
}
