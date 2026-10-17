import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    id: { type: Number, unique: true, sparse: true, index: true },
    full_name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, default: null },
    password_hash: { type: String, required: true },
    role: { type: String, enum: ['MEMBER', 'TRAINER', 'ADMIN'], default: 'MEMBER' },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
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

const User = mongoose.model('User', userSchema);
export default User;
