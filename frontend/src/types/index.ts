// User types
export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export interface AuthResponse {
  success: boolean;
  data: {
    user: User;
    token: string;
  };
  message: string;
}

// Task types
export type Day = 
  | 'MONDAY' 
  | 'TUESDAY' 
  | 'WEDNESDAY' 
  | 'THURSDAY' 
  | 'FRIDAY' 
  | 'SATURDAY' 
  | 'SUNDAY' 
  | 'SOMEDAY';

export type Status = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';

export type Priority = 'LOW' | 'MEDIUM' | 'HIGH';

export interface Task {
  id: string;
  userId: string;
  title: string;
  description?: string;
  day: Day;
  status: Status;
  priority: Priority;
  position: number;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskData {
  title: string;
  description?: string;
  day?: Day;
  status?: Status;
  priority?: Priority;
}

export interface UpdateTaskData {
  title?: string;
  description?: string;
  day?: Day;
  status?: Status;
  priority?: Priority;
  completed?: boolean;
}