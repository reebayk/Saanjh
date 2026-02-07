import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import authRoutes from './routes/auth.routes';
import taskRoutes from './routes/task.routes';
import { authMiddleware } from './middleware/auth';

const app = express();

// Middleware
app.use(helmet()); // Security headers
app.use(cors()); // Allow frontend to connect
app.use(express.json()); // Parse JSON bodies

// Routes
app.use('/api/auth', authRoutes); // Auth endpoints
app.use('/api/tasks', taskRoutes); // Task endpoints (protected by authMiddleware)

//test protected route
app.get('/api/test-auth', authMiddleware, (req, res) => {
  res.json({
    success: true,
    message: 'You are authenticated!',
    user: req.user,
  });
});
// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    message: 'Saanjh API is running!',
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: 'Route not found',
    },
  });
});

export default app;