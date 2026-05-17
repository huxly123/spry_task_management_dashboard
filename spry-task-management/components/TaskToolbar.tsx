"use client";

import { STATUS_LABELS, TASK_STATUSES, type SortDirection, type TaskStatus } from "@/types/task";

interface TaskToolbarProps {
  statusFilter: TaskStatus | "all";
  sortDirection: SortDirection;
  onStatusFilterChange: (value: TaskStatus | "all") => void;
  onSortDirectionChange: (value: SortDirection) => void;
  onAddClick: () => void;
  showStatusFilter?: boolean;
}

export function TaskToolbar({
  statusFilter,
  sortDirection,
  onStatusFilterChange,
  onSortDirectionChange,
  onAddClick,
  showStatusFilter = true,
}: TaskToolbarProps) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
        {showStatusFilter && (
          <label className="flex min-w-[10rem] flex-col gap-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Filter by status
            </span>
            <select
              value={statusFilter}
              onChange={(e) =>
                onStatusFilterChange(e.target.value as TaskStatus | "all")
              }
              className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            >
              <option value="all">All statuses</option>
              {TASK_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {STATUS_LABELS[status]}
                </option>
              ))}
            </select>
          </label>
        )}

        <label className="flex min-w-[10rem] flex-col gap-1.5">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Sort by due date
          </span>
          <select
            value={sortDirection}
            onChange={(e) =>
              onSortDirectionChange(e.target.value as SortDirection)
            }
            className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
          >
            <option value="asc">Earliest first</option>
            <option value="desc">Latest first</option>
          </select>
        </label>
      </div>

      <button
        type="button"
        onClick={onAddClick}
        className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      >
        <PlusIcon />
        Add task
      </button>
    </div>
  );
}

function PlusIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}
