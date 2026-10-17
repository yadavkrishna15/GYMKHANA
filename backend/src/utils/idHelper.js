import mongoose from 'mongoose';

/**
 * Builds a flexible query matching either a numeric `id` or MongoDB `_id`
 */
export function buildIdQuery(val, fieldName = 'id') {
  if (val === undefined || val === null) return { _id: null };
  const str = String(val).trim();
  const queries = [];
  const num = Number(str);
  if (!isNaN(num) && num > 0) {
    queries.push({ [fieldName]: num });
  }
  if (mongoose.Types.ObjectId.isValid(str) && String(new mongoose.Types.ObjectId(str)) === str) {
    queries.push({ _id: new mongoose.Types.ObjectId(str) });
  }
  if (queries.length === 1) return queries[0];
  if (queries.length > 1) return { $or: queries };
  return { [fieldName]: -1 };
}
