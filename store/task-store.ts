import { create } from "zustand";
import { persist } from "zustand/middleware";

import { fetchMockTasks } from "@/lib/mock-task-api";
import type { Task, TaskPriority, TaskStatus } from "@/types/task";

type NewTaskInput = Omit<Task, "id" | "assigneeName">;

type TaskStore = {
  tasks: Task[];
  loadedFromApi: boolean;
  loadTasks: () => Promise<void>;
  addTask: (task: NewTaskInput & { assigneeName: string }) => void;
  updateTaskStatus: (taskId: string, status: TaskStatus) => void;
  removeTask: (taskId: string) => void;
  taskCountByStatus: (status: TaskStatus) => number;
  taskCountByPriority: (priority: TaskPriority) => number;
};

export const useTaskStore = create<TaskStore>()(
  persist(
    (set, get) => ({
      tasks: [],
      loadedFromApi: false,

      loadTasks: async () => {
        if (get().loadedFromApi || get().tasks.length > 0) return;
        const tasks = await fetchMockTasks();
        set({ tasks, loadedFromApi: true });
      },

      addTask: (task) =>
        set((state) => ({
          tasks: [{ id: crypto.randomUUID(), ...task }, ...state.tasks],
        })),

      updateTaskStatus: (taskId, status) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === taskId ? { ...task, status } : task,
          ),
        })),

      removeTask: (taskId) =>
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== taskId),
        })),

      taskCountByStatus: (status) =>
        get().tasks.filter((task) => task.status === status).length,

      taskCountByPriority: (priority) =>
        get().tasks.filter((task) => task.priority === priority).length,
    }),
    {
      name: "task-dashboard-store",
      version: 1,
      partialize: (state) => ({
        tasks: state.tasks,
        loadedFromApi: state.loadedFromApi,
      }),
    },
  ),
);
