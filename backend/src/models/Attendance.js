import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema(
  {
    id: { type: Number, unique: true, sparse: true, index: true },
    member_id: { type: Number, required: true, index: true },
    member: { type: mongoose.Schema.Types.ObjectId, ref: 'Member' },
    date: { type: String, required: true, index: true },
    check_in_time: { type: String, required: true },
    check_out_time: { type: String, default: null },
    status: { type: String, default: 'Present' },
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

const Attendance = mongoose.model('Attendance', attendanceSchema);
export default Attendance;
