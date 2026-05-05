import type { Task } from "@/types/task";

const MOCK_TASKS: Task[] = [
  {
    id: "task-1",
    title: "Dashboard kartlarını güncelle",
    assigneeId: "ahmet",
    assigneeName: "Ahmet",
    dueDate: "2026-05-09",
    status: "inProgress",
    priority: "high",
  },
  {
    id: "task-2",
    title: "Çalışan filtreleme ekle",
    assigneeId: "ali",
    assigneeName: "Ali",
    dueDate: "2026-05-11",
    status: "todo",
    priority: "medium",
  },
  {
    id: "task-3",
    title: "Mobil görünüm testleri",
    assigneeId: "ayse",
    assigneeName: "Ayşe",
    dueDate: "2026-05-07",
    status: "done",
    priority: "low",
  },
];

function wait(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

export async function fetchMockTasks(): Promise<Task[]> {
  await wait(250);
  return MOCK_TASKS;
}
