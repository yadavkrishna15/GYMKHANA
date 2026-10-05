import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from '../config/db.js';
import { sendSuccess, sendError } from '../utils/response.js';

const JWT_SECRET = process.env.JWT_SECRET || 'gymkhana_default_dev_secret_key';

function generateToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
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
    const existing = await query('SELECT id FROM users WHERE email = ? LIMIT 1', [email.trim().toLowerCase()]);
    if (existing && existing.length > 0) {
      return sendError(res, 'An account with this email address already exists', 'DUPLICATE_EMAIL', 409);
    }

    // 3. Hash password
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);
    const now = new Date();

    // 4. Insert into users
    const userResult = await query(
      'INSERT INTO users (full_name, email, phone, password_hash, role, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [full_name.trim(), email.trim().toLowerCase(), phone?.trim() || null, password_hash, 'MEMBER', now, now]
    );

    const userId = userResult.insertId;

    // 5. Initialize member record
    const today = now.toISOString().split('T')[0];
    await query(
      'INSERT INTO members (user_id, membership_id, trainer_id, join_date, status) VALUES (?, NULL, NULL, ?, ?)',
      [userId, today, 'ACTIVE']
    );

    const user = {
      id: userId,
      full_name: full_name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone?.trim() || null,
      role: 'MEMBER',
    };

    const token = generateToken(user);

    return sendSuccess(res, { user, token }, 'Registration successful! Welcome to GYMKHANA.', 201);
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

    const rows = await query('SELECT * FROM users WHERE email = ? LIMIT 1', [email.trim().toLowerCase()]);
    if (!rows || rows.length === 0) {
      return sendError(res, 'Invalid email or password credentials', 'INVALID_CREDENTIALS', 401);
    }

    const userRecord = rows[0];
    const isMatch = await bcrypt.compare(password, userRecord.password_hash);
    if (!isMatch) {
      return sendError(res, 'Invalid email or password credentials', 'INVALID_CREDENTIALS', 401);
    }

    const user = {
      id: userRecord.id,
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
      const memberRows = await query(
        `SELECT m.id AS member_id, m.membership_id, m.trainer_id, m.join_date, m.status,
                mem.name AS membership_name,
                u.full_name AS trainer_name
         FROM members m
         LEFT JOIN memberships mem ON m.membership_id = mem.id
         LEFT JOIN trainers t ON m.trainer_id = t.id
         LEFT JOIN users u ON t.user_id = u.id
         WHERE m.user_id = ? LIMIT 1`,
        [user.id]
      );
      if (memberRows && memberRows.length > 0) {
        user.memberDetails = memberRows[0];
      }
    } else if (user.role === 'TRAINER') {
      const trainerRows = await query(
        `SELECT id AS trainer_id, specialization, experience_years, bio, certifications, availability_status
         FROM trainers WHERE user_id = ? LIMIT 1`,
        [user.id]
      );
      if (trainerRows && trainerRows.length > 0) {
        user.trainerDetails = trainerRows[0];
      }
    }

    return sendSuccess(res, { user });
  } catch (error) {
    console.error('GetMe Error:', error);
    return sendError(res, 'Failed to fetch current user profile.', 'INTERNAL_ERROR', 500);
  }
}
