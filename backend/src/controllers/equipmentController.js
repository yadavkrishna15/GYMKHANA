import Equipment from '../models/Equipment.js';
import { getNextSequence } from '../models/Counter.js';
import { buildIdQuery } from '../utils/idHelper.js';
import { sendSuccess, sendError } from '../utils/response.js';

export async function getEquipment(req, res) {
  try {
    const { category, target_body_part, search } = req.query;
    const filter = {};

    if (category) {
      filter.category = category;
    }
    if (target_body_part) {
      filter.target_body_part = target_body_part;
    }
    if (search) {
      const searchRegex = new RegExp(search.trim(), 'i');
      filter.$or = [
        { name: searchRegex },
        { description: searchRegex },
        { primary_purpose: searchRegex },
      ];
    }

    const docs = await Equipment.find(filter).sort({ name: 1 }).lean();
    const equipment = docs.map((d) => ({
      ...d,
      id: d.id || d._id,
    }));

    return sendSuccess(res, { equipment });
  } catch (error) {
    console.error('getEquipment error:', error);
    return sendError(res, 'Failed to fetch equipment catalog', 'INTERNAL_ERROR', 500);
  }
}

export async function getEquipmentById(req, res) {
  try {
    const { id } = req.params;
    const doc = await Equipment.findOne(buildIdQuery(id)).lean();

    if (!doc) {
      return sendError(res, 'Equipment item not found', 'NOT_FOUND', 404);
    }

    const equipment = {
      ...doc,
      id: doc.id || doc._id,
    };

    const relatedDocs = await Equipment.find({
      $or: [{ category: equipment.category }, { target_body_part: equipment.target_body_part }],
      _id: { $ne: doc._id },
    })
      .limit(4)
      .lean();

    const related = relatedDocs.map((r) => ({
      ...r,
      id: r.id || r._id,
    }));

    return sendSuccess(res, { equipment, related });
  } catch (error) {
    console.error('getEquipmentById error:', error);
    return sendError(res, 'Failed to fetch equipment profile', 'INTERNAL_ERROR', 500);
  }
}

export async function createEquipment(req, res) {
  try {
    const {
      name,
      category,
      target_body_part,
      description,
      primary_purpose,
      benefits,
      how_to_use,
      safety_instructions,
      image_url,
    } = req.body;

    if (!name || !category || !target_body_part || !description || !how_to_use) {
      return sendError(res, 'Name, category, target area, description, and usage steps are required', 'VALIDATION_ERROR', 400);
    }

    const nextId = await getNextSequence('equipment');

    const created = await Equipment.create({
      id: nextId,
      name: name.trim(),
      category: category.trim(),
      target_body_part: target_body_part.trim(),
      description: description.trim(),
      primary_purpose: primary_purpose?.trim() || 'Strength & Conditioning',
      benefits: benefits?.trim() || null,
      how_to_use: how_to_use.trim(),
      safety_instructions: safety_instructions?.trim() || 'Check pin security before movement.',
      image_url: image_url?.trim() || null,
    });

    return sendSuccess(res, { id: created.id || created._id }, 'Equipment registered successfully', 201);
  } catch (error) {
    console.error('createEquipment error:', error);
    return sendError(res, 'Failed to register equipment', 'INTERNAL_ERROR', 500);
  }
}

export async function updateEquipment(req, res) {
  try {
    const { id } = req.params;
    const {
      name,
      category,
      target_body_part,
      description,
      primary_purpose,
      benefits,
      how_to_use,
      safety_instructions,
      image_url,
    } = req.body;

    const updated = await Equipment.findOneAndUpdate(
      buildIdQuery(id),
      {
        name: name?.trim() || '',
        category: category?.trim() || '',
        target_body_part: target_body_part?.trim() || '',
        description: description?.trim() || '',
        primary_purpose: primary_purpose?.trim() || '',
        benefits: benefits?.trim() || null,
        how_to_use: how_to_use?.trim() || '',
        safety_instructions: safety_instructions?.trim() || '',
        image_url: image_url?.trim() || null,
      },
      { returnDocument: 'after' }
    );

    if (!updated) {
      return sendError(res, 'Equipment item not found', 'NOT_FOUND', 404);
    }

    return sendSuccess(res, null, 'Equipment record updated successfully');
  } catch (error) {
    console.error('updateEquipment error:', error);
    return sendError(res, 'Failed to update equipment record', 'INTERNAL_ERROR', 500);
  }
}

export async function deleteEquipment(req, res) {
  try {
    const { id } = req.params;
    await Equipment.findOneAndDelete(buildIdQuery(id));
    return sendSuccess(res, null, 'Equipment deleted successfully');
  } catch (error) {
    console.error('deleteEquipment error:', error);
    return sendError(res, 'Failed to delete equipment record', 'INTERNAL_ERROR', 500);
  }
}
