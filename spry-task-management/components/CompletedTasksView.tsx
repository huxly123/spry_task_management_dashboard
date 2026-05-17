"use client";

import { useMemo, useState } from "react";
import { DashboardShell } from "@/components/DashboardShell";
import { StatusSummary } from "@/components/StatusSummary";
import { TaskForm } from "@/components/TaskForm";
import { TaskList } from "@/components/TaskList";
import { TaskModal } from "@/components/TaskModal";
import { TaskToolbar } from "@/components/TaskToolbar";
import { useTasks } from "@/context/TaskContext";
import { countByStatus, sortByDueDate } from "@/lib/task-utils";
import type { SortDirection, Task } from "@/types/task";

type ModalState =
  | { mode: "closed" }
  | { mode: "create" }
  | { mode: "edit"; task: Task };

export function CompletedTasksView() {
  const { tasks, isHydrated, addTask, updateTask, deleteTask } = useTasks();
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [modal, setModal] = useState<ModalState>({ mode: "closed" });

  const counts = useMemo(() => countByStatus(tasks), [tasks]);

  const completedTasks = useMemo(() => {
    const completed = tasks.filter((task) => task.status === "completed");
    return sortByDueDate(completed, sortDirection);
  }, [tasks, sortDirection]);

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
        title="Completed Tasks"
        description="Review finished work and keep your archive tidy."
      >
        <div className="flex items-center justify-center py-24">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-200 border-t-indigo-600" />
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell
      title="Completed Tasks"
      description="Review finished work and keep your archive tidy."
    >
      <div className="space-y-8">
        <StatusSummary counts={counts} />

        <TaskToolbar
          statusFilter="completed"
          sortDirection={sortDirection}
          onStatusFilterChange={() => {}}
          onSortDirectionChange={setSortDirection}
          onAddClick={() => setModal({ mode: "create" })}
          showStatusFilter={false}
        />

        <TaskList
          tasks={completedTasks}
          emptyTitle="No completed tasks"
          emptyDescription="Tasks marked as completed will appear here."
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
            defaultStatus="completed"
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
