import mongoose from 'mongoose';

const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 },
});

const Counter = mongoose.model('Counter', counterSchema);

export async function getNextSequence(name, initialValue = 0) {
  const counter = await Counter.findByIdAndUpdate(
    name,
    { $inc: { seq: 1 } },
    { returnDocument: 'after', upsert: true }
  );
  return counter.seq;
}

export async function setSequence(name, value) {
  await Counter.findByIdAndUpdate(
    name,
    { seq: value },
    { returnDocument: 'after', upsert: true }
  );
}

export default Counter;
