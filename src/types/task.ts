export type TaskStatus = 'completed' | 'pending';

export type StatusFilter = 'all' | TaskStatus;

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  createdAt: string;
}

export interface TaskFormValues {
  title: string;
  description: string;
}

export interface TaskFormErrors {
  title?: string;
  description?: string;
}
