"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { loadTasks, saveTasks } from "@/lib/storage";
import type { Task, TaskInput } from "@/types/task";

interface TaskContextValue {
  tasks: Task[];
  isHydrated: boolean;
  addTask: (input: TaskInput) => void;
  updateTask: (id: string, input: TaskInput) => void;
  deleteTask: (id: string) => void;
}

const TaskContext = createContext<TaskContextValue | null>(null);

export function TaskProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setTasks(loadTasks());
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    saveTasks(tasks);
  }, [tasks, isHydrated]);

  const addTask = useCallback((input: TaskInput) => {
    const task: Task = {
      ...input,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    setTasks((prev) => [task, ...prev]);
  }, []);

  const updateTask = useCallback((id: string, input: TaskInput) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, ...input } : task)),
    );
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  }, []);

  const value = useMemo(
    () => ({ tasks, isHydrated, addTask, updateTask, deleteTask }),
    [tasks, isHydrated, addTask, updateTask, deleteTask],
  );

  return (
    <TaskContext.Provider value={value}>{children}</TaskContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error("useTasks must be used within a TaskProvider");
  }
  return context;
}
