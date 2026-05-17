"use client";

import type { ReactNode } from "react";
import { formatDueDate, isOverdue } from "@/lib/task-utils";
import { STATUS_LABELS, type Task } from "@/types/task";

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

const statusStyles = {
  pending: "bg-amber-50 text-amber-800 ring-amber-200",
  in_progress: "bg-sky-50 text-sky-800 ring-sky-200",
  completed: "bg-emerald-50 text-emerald-800 ring-emerald-200",
} as const;

export function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  const overdue = isOverdue(task);

  return (
    <article className="group flex flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-indigo-200 hover:shadow-md">
      <div className="mb-3 flex items-start justify-between gap-3">
        <h3 className="text-base font-semibold leading-snug text-slate-900">
          {task.title}
        </h3>
        <span
          className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${statusStyles[task.status]}`}
        >
          {STATUS_LABELS[task.status]}
        </span>
      </div>

      {task.description ? (
        <p className="mb-4 line-clamp-3 flex-1 text-sm leading-relaxed text-slate-600">
          {task.description}
        </p>
      ) : (
        <p className="mb-4 flex-1 text-sm italic text-slate-400">
          No description
        </p>
      )}

      <div className="mt-auto flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
        <time
          dateTime={task.dueDate}
          className={`text-sm font-medium ${overdue ? "text-rose-600" : "text-slate-500"}`}
        >
          {overdue && (
            <span className="mr-1.5 inline-block rounded bg-rose-50 px-1.5 py-0.5 text-xs text-rose-700 ring-1 ring-rose-200">
              Overdue
            </span>
          )}
          Due {formatDueDate(task.dueDate)}
        </time>

        <div className="flex gap-1 opacity-100 transition sm:opacity-0 sm:group-hover:opacity-100 sm:focus-within:opacity-100">
          <IconButton label="Edit task" onClick={() => onEdit(task)}>
            <EditIcon />
          </IconButton>
          <IconButton
            label="Delete task"
            onClick={() => onDelete(task.id)}
            variant="danger"
          >
            <TrashIcon />
          </IconButton>
        </div>
      </div>
    </article>
  );
}

function IconButton({
  children,
  label,
  onClick,
  variant = "default",
}: {
  children: ReactNode;
  label: string;
  onClick: () => void;
  variant?: "default" | "danger";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`rounded-lg p-2 transition ${
        variant === "danger"
          ? "text-slate-400 hover:bg-rose-50 hover:text-rose-600"
          : "text-slate-400 hover:bg-indigo-50 hover:text-indigo-600"
      }`}
    >
      {children}
    </button>
  );
}

function EditIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M12 20h9M16.5 3.5a2.12 2.12 0 1 1 3 3L7 19l-4 1 1-4Z" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M3 6h18M8 6V4h8v2M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
    </svg>
  );
}
