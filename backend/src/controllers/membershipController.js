import Membership from '../models/Membership.js';
import Member from '../models/Member.js';
import { getNextSequence } from '../models/Counter.js';
import { buildIdQuery } from '../utils/idHelper.js';
import { sendSuccess, sendError } from '../utils/response.js';

export async function getMemberships(req, res) {
  try {
    const docs = await Membership.find().sort({ price: 1 }).lean();
    const memberships = docs.map((m) => ({
      ...m,
      id: m.id || m._id,
    }));
    return sendSuccess(res, { memberships });
  } catch (error) {
    console.error('getMemberships error:', error);
    return sendError(res, 'Failed to fetch membership tiers', 'INTERNAL_ERROR', 500);
  }
}

export async function requestMembership(req, res) {
  try {
    const { membership_id } = req.body;
    if (!membership_id) {
      return sendError(res, 'Membership ID is required', 'VALIDATION_ERROR', 400);
    }

    const memDoc = await Membership.findOne(buildIdQuery(membership_id));
    if (!memDoc) {
      return sendError(res, 'Membership tier not found', 'NOT_FOUND', 404);
    }

    await Member.findOneAndUpdate(
      { $or: [{ user_id: req.user.id }, { user: req.user._id }] },
      {
        membership_id: memDoc.id || parseInt(membership_id, 10),
        membership: memDoc._id,
        status: 'ACTIVE',
      }
    );

    return sendSuccess(res, null, `Membership request for ${memDoc.name} registered successfully`);
  } catch (error) {
    console.error('requestMembership error:', error);
    return sendError(res, 'Failed to request membership', 'INTERNAL_ERROR', 500);
  }
}

export async function createMembership(req, res) {
  try {
    const { name, duration_months, price, features, access_details } = req.body;

    if (!name || !price) {
      return sendError(res, 'Name and price are required', 'VALIDATION_ERROR', 400);
    }

    const nextId = await getNextSequence('memberships');

    const created = await Membership.create({
      id: nextId,
      name: name.trim(),
      duration_months: parseInt(duration_months, 10) || 1,
      price: parseFloat(price),
      features: features?.trim() || null,
      access_details: access_details?.trim() || null,
    });

    return sendSuccess(res, { id: created.id || created._id }, 'Membership tier created successfully', 201);
  } catch (error) {
    console.error('createMembership error:', error);
    return sendError(res, 'Failed to create membership tier', 'INTERNAL_ERROR', 500);
  }
}

export async function updateMembership(req, res) {
  try {
    const { id } = req.params;
    const { name, duration_months, price, features, access_details } = req.body;

    const updated = await Membership.findOneAndUpdate(
      buildIdQuery(id),
      {
        name: name?.trim() || '',
        duration_months: parseInt(duration_months, 10) || 1,
        price: parseFloat(price) || 0,
        features: features?.trim() || null,
        access_details: access_details?.trim() || null,
      },
      { returnDocument: 'after' }
    );

    if (!updated) {
      return sendError(res, 'Membership tier not found', 'NOT_FOUND', 404);
    }

    return sendSuccess(res, null, 'Membership tier updated successfully');
  } catch (error) {
    console.error('updateMembership error:', error);
    return sendError(res, 'Failed to update membership tier', 'INTERNAL_ERROR', 500);
  }
}

export async function deleteMembership(req, res) {
  try {
    const { id } = req.params;
    await Membership.findOneAndDelete(buildIdQuery(id));
    return sendSuccess(res, null, 'Membership tier deleted successfully');
  } catch (error) {
    console.error('deleteMembership error:', error);
    return sendError(res, 'Failed to delete membership tier', 'INTERNAL_ERROR', 500);
  }
}
