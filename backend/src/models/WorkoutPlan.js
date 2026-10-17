import mongoose from 'mongoose';

const workoutPlanExerciseSchema = new mongoose.Schema({
  id: { type: Number, index: true },
  exercise_id: { type: Number, index: true },
  exercise: { type: mongoose.Schema.Types.ObjectId, ref: 'Exercise' },
  day_or_order: { type: String, default: 'Day 1' },
  sets: { type: Number, default: 3 },
  reps: { type: String, default: '10-12' },
  rest_seconds: { type: Number, default: 60 },
  notes: { type: String, default: null },
  // Denormalized fields for instant fast lookup matching SQL JOIN
  exercise_name: { type: String },
  body_part: { type: String },
  exercise_difficulty: { type: String },
  image_url: { type: String },
});

const workoutPlanSchema = new mongoose.Schema(
  {
    id: { type: Number, unique: true, sparse: true, index: true },
    name: { type: String, required: true, trim: true },
    goal: { type: String, required: true, trim: true },
    difficulty: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Beginner' },
    duration_weeks: { type: Number, default: 4 },
    description: { type: String, required: true },
    created_by: { type: Number, default: null, index: true },
    trainer: { type: mongoose.Schema.Types.ObjectId, ref: 'Trainer', default: null },
    trainer_name: { type: String, default: null },
    exercises: [workoutPlanExerciseSchema],
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: false },
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        if (!ret.id && ret._id) ret.id = ret._id.toString();
        ret.exercise_count = ret.exercises ? ret.exercises.length : 0;
        return ret;
      },
    },
    toObject: {
      virtuals: true,
      transform: (doc, ret) => {
        if (!ret.id && ret._id) ret.id = ret._id.toString();
        ret.exercise_count = ret.exercises ? ret.exercises.length : 0;
        return ret;
      },
    },
  }
);

const WorkoutPlan = mongoose.model('WorkoutPlan', workoutPlanSchema);
export default WorkoutPlan;
