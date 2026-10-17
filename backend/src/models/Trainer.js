import mongoose from 'mongoose';

const trainerSchema = new mongoose.Schema(
  {
    id: { type: Number, unique: true, sparse: true, index: true },
    user_id: { type: Number, index: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    specialization: { type: String, required: true, trim: true },
    experience_years: { type: Number, default: 1 },
    bio: { type: String, required: true, trim: true },
    certifications: { type: String, default: null },
    availability_status: { type: String, default: 'Available' },
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

const Trainer = mongoose.model('Trainer', trainerSchema);
export default Trainer;
