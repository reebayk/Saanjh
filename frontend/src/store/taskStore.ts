import { create } from 'zustand';
import type { Task } from '../types';
import api from '../services/api';
import toast from 'react-hot-toast';

interface TaskState {
  tasks: Task[];
  loading: boolean;
  fetchTasks: () => Promise<void>;
  createTask: (data: any) => Promise<void>;
  updateTask: (id: string, data: any) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  toggleTask: (id: string) => Promise<void>;
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  loading: false,

  // Fetch all tasks
  fetchTasks: async () => {
    set({ loading: true });
    try {
      const response = await api.get('/tasks');
      set({ tasks: response.data.data.tasks, loading: false });
    } catch (error: any) {
      toast.error('Failed to fetch tasks');
      set({ loading: false });
    }
  },

  // Create task
  createTask: async (data) => {
    try {
      const response = await api.post('/tasks', data);
      set({ tasks: [...get().tasks, response.data.data] });
      toast.success('Task created!');
    } catch (error: any) {
      toast.error(error.response?.data?.error?.message || 'Failed to create task');
      throw error;
    }
  },

  // Update task
  updateTask: async (id, data) => {
    try {
      const response = await api.put(`/tasks/${id}`, data);
      set({
        tasks: get().tasks.map((task) =>
          task.id === id ? response.data.data : task
        ),
      });
      toast.success('Task updated!');
    } catch (error: any) {
      toast.error('Failed to update task');
      throw error;
    }
  },

  // Delete task
  deleteTask: async (id) => {
    try {
      await api.delete(`/tasks/${id}`);
      set({ tasks: get().tasks.filter((task) => task.id !== id) });
      toast.success('Task deleted!');
    } catch (error: any) {
      toast.error('Failed to delete task');
    }
  },

  // Toggle task completion
  toggleTask: async (id) => {
    try {
      const response = await api.patch(`/tasks/${id}/toggle`);
      set({
        tasks: get().tasks.map((task) =>
          task.id === id ? response.data.data : task
        ),
      });
    } catch (error: any) {
      toast.error('Failed to toggle task');
    }
  },
}));