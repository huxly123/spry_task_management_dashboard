export const TASK_STATUSES = [
  "pending",
  "in_progress",
  "completed",
] as const;

export type TaskStatus = (typeof TASK_STATUSES)[number];

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  dueDate: string;
  createdAt: string;
}

export type TaskInput = Omit<Task, "id" | "createdAt">;

export const STATUS_LABELS: Record<TaskStatus, string> = {
  pending: "Pending",
  in_progress: "In Progress",
  completed: "Completed",
};

export type SortDirection = "asc" | "desc";
