import mongoose from 'mongoose';

const membershipSchema = new mongoose.Schema(
  {
    id: { type: Number, unique: true, sparse: true, index: true },
    name: { type: String, required: true, trim: true },
    duration_months: { type: Number, default: 1 },
    price: { type: Number, required: true },
    features: { type: String, default: null },
    access_details: { type: String, default: null },
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

const Membership = mongoose.model('Membership', membershipSchema);
export default Membership;
