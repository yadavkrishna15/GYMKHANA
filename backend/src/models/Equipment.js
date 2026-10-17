import mongoose from 'mongoose';

const equipmentSchema = new mongoose.Schema(
  {
    id: { type: Number, unique: true, sparse: true, index: true },
    name: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    target_body_part: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    primary_purpose: { type: String, default: 'Strength & Conditioning' },
    benefits: { type: String, default: null },
    how_to_use: { type: String, required: true },
    safety_instructions: { type: String, default: 'Check pin security before movement.' },
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

const Equipment = mongoose.model('Equipment', equipmentSchema);
export default Equipment;
