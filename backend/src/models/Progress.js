import mongoose from 'mongoose';

const progressSchema = new mongoose.Schema(
  {
    id: { type: Number, unique: true, sparse: true, index: true },
    member_id: { type: Number, required: true, index: true },
    member: { type: mongoose.Schema.Types.ObjectId, ref: 'Member' },
    measured_on: { type: String, required: true, index: true },
    weight_kg: { type: Number, required: true },
    height_cm: { type: Number, default: null },
    bmi: { type: Number, default: null },
    notes: { type: String, default: null },
  },
  {
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

const Progress = mongoose.model('Progress', progressSchema);
export default Progress;
