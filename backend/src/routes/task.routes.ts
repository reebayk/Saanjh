import { Router } from 'express';
import {
  getTasks,
  getTask,
  createNewTask,
  updateExistingTask,
  deleteExistingTask,
  toggleComplete,
} from '../controllers/taskController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

/**
 * TASK ROUTES
 * 
 * All routes require authentication (authMiddleware)
 * Users can only access their own tasks
 */

// Apply auth middleware to all task routes
router.use(authMiddleware);

// GET /api/tasks - Get all tasks (with optional filters)
router.get('/', getTasks);

// GET /api/tasks/:id - Get single task
router.get('/:id', getTask);

// POST /api/tasks - Create new task
router.post('/', createNewTask);

// PUT /api/tasks/:id - Update task
router.put('/:id', updateExistingTask);

// DELETE /api/tasks/:id - Delete task
router.delete('/:id', deleteExistingTask);

// PATCH /api/tasks/:id/toggle - Toggle completion
router.patch('/:id/toggle', toggleComplete);

export default router;