import { query } from '../config/db.js';
import { sendSuccess, sendError } from '../utils/response.js';

export async function submitContactMessage(req, res) {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !name.trim()) {
      return sendError(res, 'Name is required', 'VALIDATION_ERROR', 400);
    }
    if (!email || !email.trim()) {
      return sendError(res, 'Email address is required', 'VALIDATION_ERROR', 400);
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return sendError(res, 'Please provide a valid email address', 'VALIDATION_ERROR', 400);
    }
    if (!subject || !subject.trim()) {
      return sendError(res, 'Subject is required', 'VALIDATION_ERROR', 400);
    }
    if (!message || message.trim().length < 10) {
      return sendError(res, 'Message must be at least 10 characters long', 'VALIDATION_ERROR', 400);
    }

    const now = new Date();
    const result = await query(
      `INSERT INTO contact_messages (name, email, phone, subject, message, is_read, created_at)
       VALUES (?, ?, ?, ?, ?, 0, ?)`,
      [
        name.trim(),
        email.trim().toLowerCase(),
        phone?.trim() || null,
        subject.trim(),
        message.trim(),
        now,
      ]
    );

    return sendSuccess(res, { id: result.insertId }, 'Message submitted successfully', 201);
  } catch (error) {
    console.error('submitContactMessage error:', error);
    return sendError(res, 'Failed to submit contact message', 'INTERNAL_ERROR', 500);
  }
}

export async function getContactMessages(req, res) {
  try {
    const messages = await query('SELECT * FROM contact_messages ORDER BY id DESC');
    return sendSuccess(res, { messages });
  } catch (error) {
    console.error('getContactMessages error:', error);
    return sendError(res, 'Failed to fetch messages', 'INTERNAL_ERROR', 500);
  }
}

export async function updateContactMessage(req, res) {
  try {
    const { id } = req.params;
    const { is_read } = req.body;

    await query('UPDATE contact_messages SET is_read = ? WHERE id = ?', [is_read ? 1 : 0, id]);
    return sendSuccess(res, null, 'Message status updated');
  } catch (error) {
    console.error('updateContactMessage error:', error);
    return sendError(res, 'Failed to update message status', 'INTERNAL_ERROR', 500);
  }
}

export async function deleteContactMessage(req, res) {
  try {
    const { id } = req.params;
    await query('DELETE FROM contact_messages WHERE id = ?', [id]);
    return sendSuccess(res, null, 'Message deleted successfully');
  } catch (error) {
    console.error('deleteContactMessage error:', error);
    return sendError(res, 'Failed to delete message', 'INTERNAL_ERROR', 500);
  }
}
