import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import exerciseRoutes from './routes/exerciseRoutes.js';
import equipmentRoutes from './routes/equipmentRoutes.js';
import workoutRoutes from './routes/workoutRoutes.js';
import trainerRoutes from './routes/trainerRoutes.js';
import memberRoutes from './routes/memberRoutes.js';
import membershipRoutes from './routes/membershipRoutes.js';
import attendanceRoutes from './routes/attendanceRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

import { sendError } from './utils/response.js';

dotenv.config();

const app = express();

// CORS configuration (no wildcard in prod, driven by env)
const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim());

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, server-to-server)
      if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
        callback(null, true);
      } else {
        callback(new Error('Blocked by CORS security policy'));
      }
    },
    credentials: true,
  })
);

app.use(express.json());

// API Domain Routers
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/exercises', exerciseRoutes);
app.use('/api/equipment', equipmentRoutes);
app.use('/api/workouts', workoutRoutes);
app.use('/api/trainers', trainerRoutes);
app.use('/api/members', memberRoutes);
app.use('/api/memberships', membershipRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/admin', adminRoutes);

// Root index endpoint
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    message: 'GYMKHANA API Server is running',
    health: '/api/health'
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    system: 'GYMKHANA Smart Gym API',
    timestamp: new Date().toISOString(),
  });
});

// 404 handler for unmatched routes
app.use((req, res) => {
  sendError(res, `API route ${req.originalUrl} not found`, 'NOT_FOUND', 404);
});

// Centralized error handling middleware (Never leak stack traces)
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err.message);
  sendError(res, err.message || 'Internal server error occurred', 'INTERNAL_SERVER_ERROR', 500);
});

export default app;
