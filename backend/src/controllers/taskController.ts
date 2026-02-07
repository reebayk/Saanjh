import { Request, Response } from 'express';
import {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  toggleTaskComplete,
} from '../services/taskService';
import { Day, Status, Priority } from '@prisma/client';

/**
 * GET ALL TASKS
 * 
 * GET /api/tasks
 * Query params: day, status, completed
 * 
 * Requires authentication (authMiddleware)
 */
export const getTasks = async (req: Request, res: Response) => {
  try {
    // Get userId from JWT (set by authMiddleware)
    const userId = req.user!.userId;

    // Get filters from query params
    const filters: any = {};

    if (req.query.day) {
      filters.day = req.query.day as Day;
    }

    if (req.query.status) {
      filters.status = req.query.status as Status;
    }

    if (req.query.completed !== undefined) {
      filters.completed = req.query.completed === 'true';
    }

    // Get tasks
    const tasks = await getAllTasks(userId, filters);

    return res.status(200).json({
      success: true,
      data: {
        tasks,
        total: tasks.length,
      },
    });
  } catch (error: any) {
    console.error('Get tasks error:', error);
    return res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Failed to get tasks',
      },
    });
  }
};

/**
 * GET SINGLE TASK
 * 
 * GET /api/tasks/:id
 */
export const getTask = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;
    const taskId = req.params.id as string;

    const task = await getTaskById(taskId, userId);

    return res.status(200).json({
      success: true,
      data: task,
    });
  } catch (error: any) {
    if (error.message === 'TASK_NOT_FOUND') {
      return res.status(404).json({
        success: false,
        error: {
          code: 'TASK_NOT_FOUND',
          message: 'Task not found',
        },
      });
    }

    console.error('Get task error:', error);
    return res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Failed to get task',
      },
    });
  }
};

/**
 * CREATE TASK
 * 
 * POST /api/tasks
 * Body: { title, description?, day?, status?, priority? }
 */
export const createNewTask = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;
    const { title, description, day, status, priority } = req.body;

    // Validate title
    if (!title) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Title is required',
        },
      });
    }

    // Create task
    const task = await createTask(userId, {
      title,
      description,
      day: day as Day,
      status: status as Status,
      priority: priority as Priority,
    });

    return res.status(201).json({
      success: true,
      data: task,
      message: 'Task created successfully',
    });
  } catch (error: any) {
    if (error.message === 'TITLE_REQUIRED' || error.message === 'TITLE_TOO_LONG') {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: error.message === 'TITLE_REQUIRED' 
            ? 'Title is required' 
            : 'Title must be 200 characters or less',
        },
      });
    }

    console.error('Create task error:', error);
    return res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Failed to create task',
      },
    });
  }
};

/**
 * UPDATE TASK
 * 
 * PUT /api/tasks/:id
 * Body: { title?, description?, day?, status?, priority?, completed? }
 */
export const updateExistingTask = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;
    const taskId = req.params.id as string;
    const updateData = req.body;

    const task = await updateTask(taskId, userId, updateData);

    return res.status(200).json({
      success: true,
      data: task,
      message: 'Task updated successfully',
    });
  } catch (error: any) {
    if (error.message === 'TASK_NOT_FOUND') {
      return res.status(404).json({
        success: false,
        error: {
          code: 'TASK_NOT_FOUND',
          message: 'Task not found',
        },
      });
    }

    if (error.message === 'TITLE_REQUIRED' || error.message === 'TITLE_TOO_LONG') {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: error.message === 'TITLE_REQUIRED' 
            ? 'Title is required' 
            : 'Title must be 200 characters or less',
        },
      });
    }

    console.error('Update task error:', error);
    return res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Failed to update task',
      },
    });
  }
};

/**
 * DELETE TASK
 * 
 * DELETE /api/tasks/:id
 */
export const deleteExistingTask = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;
    const taskId = req.params.id as string;

    await deleteTask(taskId, userId);

    return res.status(200).json({
      success: true,
      message: 'Task deleted successfully',
    });
  } catch (error: any) {
    if (error.message === 'TASK_NOT_FOUND') {
      return res.status(404).json({
        success: false,
        error: {
          code: 'TASK_NOT_FOUND',
          message: 'Task not found',
        },
      });
    }

    console.error('Delete task error:', error);
    return res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Failed to delete task',
      },
    });
  }
};

/**
 * TOGGLE TASK COMPLETION
 * 
 * PATCH /api/tasks/:id/toggle
 */
export const toggleComplete = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;
    const taskId = req.params.id as string;

    const task = await toggleTaskComplete(taskId, userId);

    return res.status(200).json({
      success: true,
      data: task,
      message: `Task marked as ${task.completed ? 'completed' : 'incomplete'}`,
    });
  } catch (error: any) {
    if (error.message === 'TASK_NOT_FOUND') {
      return res.status(404).json({
        success: false,
        error: {
          code: 'TASK_NOT_FOUND',
          message: 'Task not found',
        },
      });
    }

    console.error('Toggle task error:', error);
    return res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Failed to toggle task',
      },
    });
  }
};