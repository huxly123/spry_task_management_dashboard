"use client";

import { useMemo, useState } from "react";
import { DashboardShell } from "@/components/DashboardShell";
import { StatusSummary } from "@/components/StatusSummary";
import { TaskForm } from "@/components/TaskForm";
import { TaskList } from "@/components/TaskList";
import { TaskModal } from "@/components/TaskModal";
import { TaskToolbar } from "@/components/TaskToolbar";
import { useTasks } from "@/context/TaskContext";
import {
  countByStatus,
  filterByStatus,
  sortByDueDate,
} from "@/lib/task-utils";
import type { SortDirection, Task, TaskStatus } from "@/types/task";

type ModalState =
  | { mode: "closed" }
  | { mode: "create" }
  | { mode: "edit"; task: Task };

export function AllTasksView() {
  const { tasks, isHydrated, addTask, updateTask, deleteTask } = useTasks();
  const [statusFilter, setStatusFilter] = useState<TaskStatus | "all">("all");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [modal, setModal] = useState<ModalState>({ mode: "closed" });

  const counts = useMemo(() => countByStatus(tasks), [tasks]);

  const visibleTasks = useMemo(() => {
    const filtered = filterByStatus(tasks, statusFilter);
    return sortByDueDate(filtered, sortDirection);
  }, [tasks, statusFilter, sortDirection]);

  function handleDelete(id: string) {
    if (window.confirm("Delete this task? This cannot be undone.")) {
      deleteTask(id);
    }
  }

  function closeModal() {
    setModal({ mode: "closed" });
  }

  if (!isHydrated) {
    return (
      <DashboardShell
        title="All Tasks"
        description="View and manage every task in your workspace."
      >
        <LoadingState />
      </DashboardShell>
    );
  }

  return (
    <DashboardShell
      title="All Tasks"
      description="View and manage every task in your workspace."
    >
      <div className="space-y-8">
        <StatusSummary counts={counts} />

        <TaskToolbar
          statusFilter={statusFilter}
          sortDirection={sortDirection}
          onStatusFilterChange={setStatusFilter}
          onSortDirectionChange={setSortDirection}
          onAddClick={() => setModal({ mode: "create" })}
        />

        <TaskList
          tasks={visibleTasks}
          emptyTitle="No tasks yet"
          emptyDescription="Create your first task to get started, or adjust your filters."
          onEdit={(task) => setModal({ mode: "edit", task })}
          onDelete={handleDelete}
        />
      </div>

      <TaskModal
        title={modal.mode === "edit" ? "Edit task" : "Add new task"}
        isOpen={modal.mode !== "closed"}
        onClose={closeModal}
      >
        {modal.mode === "create" && (
          <TaskForm
            submitLabel="Create task"
            onCancel={closeModal}
            onSubmit={(input) => {
              addTask(input);
              closeModal();
            }}
          />
        )}
        {modal.mode === "edit" && (
          <TaskForm
            key={modal.task.id}
            initialValues={modal.task}
            submitLabel="Save changes"
            onCancel={closeModal}
            onSubmit={(input) => {
              updateTask(modal.task.id, input);
              closeModal();
            }}
          />
        )}
      </TaskModal>
    </DashboardShell>
  );
}

function LoadingState() {
  return (
    <div className="flex items-center justify-center py-24">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-200 border-t-indigo-600" />
    </div>
  );
}
