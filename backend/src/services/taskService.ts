import prisma from '../config/database';
import { Day, Status, Priority } from '@prisma/client';

/**
 * TASK SERVICE
 * 
 * Business logic for task operations
 * All functions require userId to ensure users only access their own tasks
 */

/**
 * GET ALL TASKS for a user
 * 
 * Optional filters:
 * - day: Filter by specific day
 * - status: Filter by status (pending, in_progress, completed)
 * - completed: Show only completed or incomplete tasks
 */
export const getAllTasks = async (
  userId: string,
  filters?: {
    day?: Day;
    status?: Status;
    completed?: boolean;
  }
) => {
  // Build filter object
  const where: any = { userId };

  if (filters?.day) {
    where.day = filters.day;
  }

  if (filters?.status) {
    where.status = filters.status;
  }

  if (filters?.completed !== undefined) {
    where.completed = filters.completed;
  }

  // Get tasks from database
  const tasks = await prisma.task.findMany({
    where,
    orderBy: [
      { position: 'asc' }, // Order by position first
      { createdAt: 'desc' }, // Then by creation date
    ],
  });

  return tasks;
};

/**
 * GET SINGLE TASK by ID
 * 
 * Security: Only returns task if it belongs to the user
 */
export const getTaskById = async (taskId: string, userId: string) => {
  const task = await prisma.task.findFirst({
    where: {
      id: taskId,
      userId, // Important: Ensures user owns this task
    },
  });

  if (!task) {
    throw new Error('TASK_NOT_FOUND');
  }

  return task;
};

/**
 * CREATE NEW TASK
 * 
 * Required: title, userId
 * Optional: description, day, status, priority
 */
export const createTask = async (
  userId: string,
  data: {
    title: string;
    description?: string;
    day?: Day;
    status?: Status;
    priority?: Priority;
  }
) => {
  // Validate title
  if (!data.title || data.title.trim().length === 0) {
    throw new Error('TITLE_REQUIRED');
  }

  if (data.title.length > 200) {
    throw new Error('TITLE_TOO_LONG');
  }

  // Create task
  const task = await prisma.task.create({
    data: {
      userId,
      title: data.title.trim(),
      description: data.description?.trim(),
      day: data.day || 'SOMEDAY', // Default to SOMEDAY if not specified
      status: data.status || 'PENDING', // Default to PENDING
      priority: data.priority || 'MEDIUM', // Default to MEDIUM
      position: 0, // Default position
    },
  });

  return task;
};

/**
 * UPDATE TASK
 * 
 * Can update any field
 * Security: Only updates if task belongs to user
 */
export const updateTask = async (
  taskId: string,
  userId: string,
  data: {
    title?: string;
    description?: string;
    day?: Day;
    status?: Status;
    priority?: Priority;
    position?: number;
    completed?: boolean;
  }
) => {
  // First, verify task belongs to user
  await getTaskById(taskId, userId);

  // Validate title if being updated
  if (data.title !== undefined) {
    if (data.title.trim().length === 0) {
      throw new Error('TITLE_REQUIRED');
    }
    if (data.title.length > 200) {
      throw new Error('TITLE_TOO_LONG');
    }
  }

  // Update task
  const task = await prisma.task.update({
    where: { id: taskId },
    data: {
      ...(data.title && { title: data.title.trim() }),
      ...(data.description !== undefined && { description: data.description?.trim() }),
      ...(data.day && { day: data.day }),
      ...(data.status && { status: data.status }),
      ...(data.priority && { priority: data.priority }),
      ...(data.position !== undefined && { position: data.position }),
      ...(data.completed !== undefined && { completed: data.completed }),
    },
  });

  return task;
};

/**
 * DELETE TASK
 * 
 * Security: Only deletes if task belongs to user
 */
export const deleteTask = async (taskId: string, userId: string) => {
  // Verify task belongs to user
  await getTaskById(taskId, userId);

  // Delete task
  await prisma.task.delete({
    where: { id: taskId },
  });

  return { message: 'Task deleted successfully' };
};

/**
 * TOGGLE TASK COMPLETION
 * 
 * Quick way to mark task as complete/incomplete
 */
export const toggleTaskComplete = async (taskId: string, userId: string) => {
  // Get current task
  const task = await getTaskById(taskId, userId);

  // Toggle completed status
  const updatedTask = await prisma.task.update({
    where: { id: taskId },
    data: {
      completed: !task.completed,
      status: !task.completed ? 'COMPLETED' : 'PENDING', // Update status too
    },
  });

  return updatedTask;
};