import type { TaskInput } from "@/types/task";

export type TaskFormErrors = Partial<Record<keyof TaskInput, string>>;

export function validateTaskInput(input: TaskInput): TaskFormErrors {
  const errors: TaskFormErrors = {};

  const title = input.title.trim();
  if (!title) {
    errors.title = "Title is required";
  } else if (title.length > 120) {
    errors.title = "Title must be 120 characters or less";
  }

  if (!input.dueDate) {
    errors.dueDate = "Due date is required";
  } else {
    const due = new Date(input.dueDate);
    if (Number.isNaN(due.getTime())) {
      errors.dueDate = "Enter a valid due date";
    }
  }

  if (input.description.length > 500) {
    errors.description = "Description must be 500 characters or less";
  }

  return errors;
}

export function hasErrors(errors: TaskFormErrors): boolean {
  return Object.keys(errors).length > 0;
}
