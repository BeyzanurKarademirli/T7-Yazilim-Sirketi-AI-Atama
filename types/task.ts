export type TaskStatus = "todo" | "inProgress" | "done";

export type TaskPriority = "low" | "medium" | "high";

export type Task = {
  id: string;
  title: string;
  assigneeId: string;
  assigneeName: string;
  dueDate: string;
  status: TaskStatus;
  priority: TaskPriority;
};
