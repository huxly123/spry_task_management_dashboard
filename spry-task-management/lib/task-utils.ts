import type { SortDirection, Task, TaskStatus } from "@/types/task";

export type StatusCounts = Record<TaskStatus, number>;

export function countByStatus(tasks: Task[]): StatusCounts {
  return tasks.reduce<StatusCounts>(
    (acc, task) => {
      acc[task.status] += 1;
      return acc;
    },
    { pending: 0, in_progress: 0, completed: 0 },
  );
}

export function filterByStatus(
  tasks: Task[],
  status: TaskStatus | "all",
): Task[] {
  if (status === "all") return tasks;
  return tasks.filter((task) => task.status === status);
}

export function sortByDueDate(
  tasks: Task[],
  direction: SortDirection,
): Task[] {
  return [...tasks].sort((a, b) => {
    const diff =
      new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    return direction === "asc" ? diff : -diff;
  });
}

export function formatDueDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function isOverdue(task: Task): boolean {
  if (task.status === "completed") return false;
  const due = new Date(task.dueDate);
  due.setHours(23, 59, 59, 999);
  return due.getTime() < Date.now();
}
