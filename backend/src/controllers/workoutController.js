import WorkoutPlan from '../models/WorkoutPlan.js';
import Trainer from '../models/Trainer.js';
import Exercise from '../models/Exercise.js';
import { getNextSequence } from '../models/Counter.js';
import { buildIdQuery } from '../utils/idHelper.js';
import { sendSuccess, sendError } from '../utils/response.js';

export async function getWorkoutPlans(req, res) {
  try {
    const { goal, difficulty, search } = req.query;
    const filter = {};

    if (goal) {
      filter.goal = goal;
    }
    if (difficulty) {
      filter.difficulty = difficulty;
    }
    if (search) {
      const searchRegex = new RegExp(search.trim(), 'i');
      filter.$or = [{ name: searchRegex }, { description: searchRegex }];
    }

    const docs = await WorkoutPlan.find(filter)
      .populate({
        path: 'trainer',
        populate: { path: 'user', select: 'full_name' },
      })
      .sort({ id: 1 })
      .lean();

    const plans = docs.map((p) => ({
      ...p,
      id: p.id || p._id,
      trainer_name: p.trainer?.user?.full_name || p.trainer_name || 'GYMKHANA Master Coach',
      exercise_count: p.exercises ? p.exercises.length : 0,
    }));

    return sendSuccess(res, { plans });
  } catch (error) {
    console.error('getWorkoutPlans error:', error);
    return sendError(res, 'Failed to fetch workout plans', 'INTERNAL_ERROR', 500);
  }
}

export async function getWorkoutPlanById(req, res) {
  try {
    const { id } = req.params;
    const doc = await WorkoutPlan.findOne(buildIdQuery(id))
      .populate({
        path: 'trainer',
        populate: { path: 'user', select: 'full_name' },
      })
      .populate('exercises.exercise')
      .lean();

    if (!doc) {
      return sendError(res, 'Workout plan not found', 'NOT_FOUND', 404);
    }

    const plan = {
      ...doc,
      id: doc.id || doc._id,
      trainer_name: doc.trainer?.user?.full_name || doc.trainer_name || 'GYMKHANA Master Coach',
      exercise_count: doc.exercises ? doc.exercises.length : 0,
    };

    // Build exercises list matching previous SQL shape
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
        image_url: e.image_url || exDoc.image_url || null,
        exercise_difficulty: e.exercise_difficulty || exDoc.difficulty || 'Beginner',
      };
    });

    return sendSuccess(res, { plan, exercises });
  } catch (error) {
    console.error('getWorkoutPlanById error:', error);
    return sendError(res, 'Failed to fetch workout plan details', 'INTERNAL_ERROR', 500);
  }
}

export async function createWorkoutPlan(req, res) {
  try {
    const { name, goal, difficulty, duration_weeks, description, trainer_id, exercises } = req.body;

    if (!name || !goal || !description) {
      return sendError(res, 'Plan name, goal, and description are required', 'VALIDATION_ERROR', 400);
    }

    let createdByNum = null;
    let trainerRef = null;
    let trainerName = null;

    if (req.user.role === 'TRAINER') {
      const t = await Trainer.findOne({
        $or: [{ user_id: req.user.id }, { user: req.user._id }],
      }).populate('user');
      if (t) {
        createdByNum = t.id;
        trainerRef = t._id;
        trainerName = t.user?.full_name;
      }
    } else if (trainer_id) {
      const t = await Trainer.findOne(buildIdQuery(trainer_id)).populate('user');
      if (t) {
        createdByNum = t.id || parseInt(trainer_id, 10);
        trainerRef = t._id;
        trainerName = t.user?.full_name;
      }
    }

    const nextId = await getNextSequence('workout_plans');

    // If exercises array is provided, resolve them
    const formattedExercises = [];
    if (Array.isArray(exercises)) {
      for (let i = 0; i < exercises.length; i++) {
        const item = exercises[i];
        let exDoc = null;
        if (item.exercise_id) {
          exDoc = await Exercise.findOne(buildIdQuery(item.exercise_id));
        }
        formattedExercises.push({
          id: i + 1,
          exercise_id: exDoc ? exDoc.id : item.exercise_id,
          exercise: exDoc ? exDoc._id : null,
          day_or_order: item.day_or_order || `Day ${i + 1}`,
          sets: item.sets || 3,
          reps: item.reps || '10-12',
          rest_seconds: item.rest_seconds || 60,
          notes: item.notes || null,
          exercise_name: exDoc ? exDoc.name : item.exercise_name,
          body_part: exDoc ? exDoc.body_part : item.body_part,
          exercise_difficulty: exDoc ? exDoc.difficulty : item.exercise_difficulty,
          image_url: exDoc ? exDoc.image_url : null,
        });
      }
    }

    const created = await WorkoutPlan.create({
      id: nextId,
      name: name.trim(),
      goal: goal.trim(),
      difficulty: difficulty || 'Intermediate',
      duration_weeks: parseInt(duration_weeks, 10) || 4,
      description: description.trim(),
      created_by: createdByNum,
      trainer: trainerRef,
      trainer_name: trainerName,
      exercises: formattedExercises,
    });

    return sendSuccess(res, { id: created.id || created._id }, 'Workout plan created successfully', 201);
  } catch (error) {
    console.error('createWorkoutPlan error:', error);
    return sendError(res, 'Failed to create workout plan', 'INTERNAL_ERROR', 500);
  }
}

export async function updateWorkoutPlan(req, res) {
  try {
    const { id } = req.params;
    const { name, goal, difficulty, duration_weeks, description, trainer_id, exercises } = req.body;

    const updateData = {
      name: name?.trim() || '',
      goal: goal?.trim() || 'General Fitness',
      difficulty: difficulty || 'Intermediate',
      duration_weeks: parseInt(duration_weeks, 10) || 4,
      description: description?.trim() || '',
    };

    if (trainer_id) {
      const t = await Trainer.findOne(buildIdQuery(trainer_id)).populate('user');
      if (t) {
        updateData.created_by = t.id || parseInt(trainer_id, 10);
        updateData.trainer = t._id;
        updateData.trainer_name = t.user?.full_name;
      }
    }

    if (Array.isArray(exercises)) {
      updateData.exercises = exercises;
    }

    const updated = await WorkoutPlan.findOneAndUpdate(buildIdQuery(id), updateData, { returnDocument: 'after' });
    if (!updated) {
      return sendError(res, 'Workout plan not found', 'NOT_FOUND', 404);
    }

    return sendSuccess(res, null, 'Workout plan updated successfully');
  } catch (error) {
    console.error('updateWorkoutPlan error:', error);
    return sendError(res, 'Failed to update workout plan', 'INTERNAL_ERROR', 500);
  }
}

export async function deleteWorkoutPlan(req, res) {
  try {
    const { id } = req.params;
    await WorkoutPlan.findOneAndDelete(buildIdQuery(id));
    return sendSuccess(res, null, 'Workout plan deleted successfully');
  } catch (error) {
    console.error('deleteWorkoutPlan error:', error);
    return sendError(res, 'Failed to delete workout plan', 'INTERNAL_ERROR', 500);
  }
}
