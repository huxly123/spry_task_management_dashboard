import type { StatusCounts } from "@/lib/task-utils";
import { STATUS_LABELS, type TaskStatus } from "@/types/task";

const summaryConfig: {
  status: TaskStatus;
  accent: string;
  dot: string;
}[] = [
  { status: "pending", accent: "border-amber-200 bg-amber-50/80", dot: "bg-amber-500" },
  {
    status: "in_progress",
    accent: "border-sky-200 bg-sky-50/80",
    dot: "bg-sky-500",
  },
  {
    status: "completed",
    accent: "border-emerald-200 bg-emerald-50/80",
    dot: "bg-emerald-500",
  },
];

interface StatusSummaryProps {
  counts: StatusCounts;
}

export function StatusSummary({ counts }: StatusSummaryProps) {
  const total = counts.pending + counts.in_progress + counts.completed;

  return (
    <section aria-label="Task summary by status">
      <div className="mb-3 flex items-baseline justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
          Overview
        </h2>
        <span className="text-sm text-slate-500">
          {total} task{total === 1 ? "" : "s"} total
        </span>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        {summaryConfig.map(({ status, accent, dot }) => (
          <div
            key={status}
            className={`rounded-xl border p-4 ${accent}`}
          >
            <div className="mb-2 flex items-center gap-2">
              <span className={`h-2 w-2 rounded-full ${dot}`} aria-hidden />
              <span className="text-sm font-medium text-slate-600">
                {STATUS_LABELS[status]}
              </span>
            </div>
            <p className="text-3xl font-bold tabular-nums text-slate-900">
              {counts[status]}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
