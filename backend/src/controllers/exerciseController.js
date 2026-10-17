import Exercise from '../models/Exercise.js';
import Equipment from '../models/Equipment.js';
import { getNextSequence } from '../models/Counter.js';
import { buildIdQuery } from '../utils/idHelper.js';
import { sendSuccess, sendError } from '../utils/response.js';

export async function getExercises(req, res) {
  try {
    const { body_part, difficulty, search } = req.query;
    const filter = {};

    if (body_part) {
      filter.body_part = body_part;
    }
    if (difficulty) {
      filter.difficulty = difficulty;
    }
    if (search) {
      const searchRegex = new RegExp(search.trim(), 'i');
      filter.$or = [{ name: searchRegex }, { description: searchRegex }];
    }

    const docs = await Exercise.find(filter).populate('equipment').sort({ name: 1 }).lean();

    // Map equipment name if needed
    const exercises = docs.map((e) => ({
      ...e,
      id: e.id || e._id,
      equipment_name: e.equipment?.name || null,
    }));

    return sendSuccess(res, { exercises });
  } catch (error) {
    console.error('getExercises error:', error);
    return sendError(res, 'Failed to fetch exercise directory', 'INTERNAL_ERROR', 500);
  }
}

export async function getExerciseById(req, res) {
  try {
    const { id } = req.params;
    const doc = await Exercise.findOne(buildIdQuery(id)).populate('equipment').lean();

    if (!doc) {
      return sendError(res, 'Exercise not found', 'NOT_FOUND', 404);
    }

    const exercise = {
      ...doc,
      id: doc.id || doc._id,
      equipment_name: doc.equipment?.name || null,
    };

    // Related exercises in the same body part
    const relatedDocs = await Exercise.find({
      body_part: exercise.body_part,
      _id: { $ne: doc._id },
    })
      .select('id name body_part difficulty description image_url')
      .limit(4)
      .lean();

    const related = relatedDocs.map((r) => ({
      ...r,
      id: r.id || r._id,
    }));

    return sendSuccess(res, { exercise, related });
  } catch (error) {
    console.error('getExerciseById error:', error);
    return sendError(res, 'Failed to fetch exercise details', 'INTERNAL_ERROR', 500);
  }
}

export async function createExercise(req, res) {
  try {
    const {
      name,
      body_part,
      category,
      difficulty,
      equipment_id,
      description,
      instructions,
      benefits,
      safety_tips,
      common_mistakes,
      image_url,
    } = req.body;

    if (!name || !body_part || !description || !instructions) {
      return sendError(res, 'Name, body part, description, and instructions are required', 'VALIDATION_ERROR', 400);
    }

    let equipmentObj = null;
    let eqIdNum = equipment_id ? parseInt(equipment_id, 10) : null;
    if (equipment_id) {
      equipmentObj = await Equipment.findOne(buildIdQuery(equipment_id));
      if (equipmentObj && !eqIdNum) eqIdNum = equipmentObj.id;
    }

    const nextId = await getNextSequence('exercises');

    const created = await Exercise.create({
      id: nextId,
      name: name.trim(),
      body_part,
      category: category?.trim() || null,
      difficulty: difficulty || 'Beginner',
      equipment_id: eqIdNum,
      equipment: equipmentObj ? equipmentObj._id : null,
      description: description.trim(),
      instructions: instructions.trim(),
      benefits: benefits?.trim() || null,
      safety_tips: safety_tips?.trim() || null,
      common_mistakes: common_mistakes?.trim() || null,
      image_url: image_url?.trim() || null,
    });

    return sendSuccess(res, { id: created.id || created._id }, 'Exercise created successfully', 201);
  } catch (error) {
    console.error('createExercise error:', error);
    return sendError(res, 'Failed to create exercise record', 'INTERNAL_ERROR', 500);
  }
}

export async function updateExercise(req, res) {
  try {
    const { id } = req.params;
    const {
      name,
      body_part,
      category,
      difficulty,
      equipment_id,
      description,
      instructions,
      benefits,
      safety_tips,
      common_mistakes,
      image_url,
    } = req.body;

    if (!name || !body_part) {
      return sendError(res, 'Name and body part are required', 'VALIDATION_ERROR', 400);
    }

    let eqRef = null;
    let eqIdNum = equipment_id ? parseInt(equipment_id, 10) : null;
    if (equipment_id) {
      const eq = await Equipment.findOne(buildIdQuery(equipment_id));
      if (eq) {
        eqRef = eq._id;
        eqIdNum = eq.id || eqIdNum;
      }
    }

    const updated = await Exercise.findOneAndUpdate(
      buildIdQuery(id),
      {
        name: name.trim(),
        body_part,
        category: category?.trim() || null,
        difficulty: difficulty || 'Beginner',
        equipment_id: eqIdNum,
        equipment: eqRef,
        description: description?.trim() || '',
        instructions: instructions?.trim() || '',
        benefits: benefits?.trim() || null,
        safety_tips: safety_tips?.trim() || null,
        common_mistakes: common_mistakes?.trim() || null,
        image_url: image_url?.trim() || null,
      },
      { returnDocument: 'after' }
    );

    if (!updated) {
      return sendError(res, 'Exercise not found', 'NOT_FOUND', 404);
    }

    return sendSuccess(res, null, 'Exercise updated successfully');
  } catch (error) {
    console.error('updateExercise error:', error);
    return sendError(res, 'Failed to update exercise record', 'INTERNAL_ERROR', 500);
  }
}

export async function deleteExercise(req, res) {
  try {
    const { id } = req.params;
    await Exercise.findOneAndDelete(buildIdQuery(id));
    return sendSuccess(res, null, 'Exercise deleted successfully');
  } catch (error) {
    console.error('deleteExercise error:', error);
    return sendError(res, 'Failed to delete exercise record', 'INTERNAL_ERROR', 500);
  }
}
