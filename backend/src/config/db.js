import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || process.env.DATABASE_URL || 'mongodb://localhost:27017/gymkhana_db';

let isConnected = false;

export async function connectDB() {
  if (isConnected) return mongoose.connection;

  try {
    const conn = await mongoose.connect(MONGODB_URI, {
      autoIndex: true,
    });
    isConnected = true;
    console.log(` MongoDB Connected Successfully: ${conn.connection.host}/${conn.connection.name}`);
    return conn.connection;
  } catch (error) {
    console.error(' MongoDB Connection Error:', error.message);
    // Don't crash immediately in dev to allow health check / startup troubleshooting
    return null;
  }
}

// Export mongoose instance and connection
export default mongoose;
