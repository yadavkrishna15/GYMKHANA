import mongoose from 'mongoose';

const exerciseSchema = new mongoose.Schema(
  {
    id: { type: Number, unique: true, sparse: true, index: true },
    name: { type: String, required: true, trim: true },
    body_part: { type: String, required: true, trim: true },
    category: { type: String, default: null },
    difficulty: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Beginner' },
    equipment_id: { type: Number, default: null, index: true },
    equipment: { type: mongoose.Schema.Types.ObjectId, ref: 'Equipment', default: null },
    description: { type: String, required: true },
    instructions: { type: String, required: true },
    benefits: { type: String, default: null },
    safety_tips: { type: String, default: null },
    common_mistakes: { type: String, default: null },
    image_url: { type: String, default: null },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: false },
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        if (!ret.id && ret._id) ret.id = ret._id.toString();
        return ret;
      },
    },
    toObject: {
      virtuals: true,
      transform: (doc, ret) => {
        if (!ret.id && ret._id) ret.id = ret._id.toString();
        return ret;
      },
    },
  }
);

const Exercise = mongoose.model('Exercise', exerciseSchema);
export default Exercise;
