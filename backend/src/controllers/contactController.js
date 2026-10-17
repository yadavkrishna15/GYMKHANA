import ContactMessage from '../models/ContactMessage.js';
import { getNextSequence } from '../models/Counter.js';
import { buildIdQuery } from '../utils/idHelper.js';
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

    const nextId = await getNextSequence('contact_messages');

    const created = await ContactMessage.create({
      id: nextId,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone?.trim() || null,
      subject: subject.trim(),
      message: message.trim(),
      is_read: 0,
    });

    return sendSuccess(res, { id: created.id || created._id }, 'Message submitted successfully', 201);
  } catch (error) {
    console.error('submitContactMessage error:', error);
    return sendError(res, 'Failed to submit contact message', 'INTERNAL_ERROR', 500);
  }
}

export async function getContactMessages(req, res) {
  try {
    const docs = await ContactMessage.find().sort({ id: -1, created_at: -1 }).lean();
    const messages = docs.map((m) => ({
      ...m,
      id: m.id || m._id,
    }));
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

    await ContactMessage.findOneAndUpdate(
      buildIdQuery(id),
      { is_read: is_read ? 1 : 0 },
      { returnDocument: 'after' }
    );

    return sendSuccess(res, null, 'Message status updated');
  } catch (error) {
    console.error('updateContactMessage error:', error);
    return sendError(res, 'Failed to update message status', 'INTERNAL_ERROR', 500);
  }
}

export async function deleteContactMessage(req, res) {
  try {
    const { id } = req.params;
    await ContactMessage.findOneAndDelete(buildIdQuery(id));
    return sendSuccess(res, null, 'Message deleted successfully');
  } catch (error) {
    console.error('deleteContactMessage error:', error);
    return sendError(res, 'Failed to delete message', 'INTERNAL_ERROR', 500);
  }
}
