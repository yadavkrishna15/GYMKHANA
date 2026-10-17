import mongoose from 'mongoose';

const memberSchema = new mongoose.Schema(
  {
    id: { type: Number, unique: true, sparse: true, index: true },
    user_id: { type: Number, index: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    membership_id: { type: Number, default: null, index: true },
    membership: { type: mongoose.Schema.Types.ObjectId, ref: 'Membership', default: null },
    trainer_id: { type: Number, default: null, index: true },
    trainer: { type: mongoose.Schema.Types.ObjectId, ref: 'Trainer', default: null },
    join_date: { type: String, required: true },
    status: { type: String, default: 'ACTIVE' },
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

const Member = mongoose.model('Member', memberSchema);
export default Member;
