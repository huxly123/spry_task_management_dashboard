"use client";

import { TaskProvider } from "@/context/TaskContext";
import type { ReactNode } from "react";

export function AppProviders({ children }: { children: ReactNode }) {
  return <TaskProvider>{children}</TaskProvider>;
}
