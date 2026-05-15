"use client";

import * as React from "react";
import { Plus, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useI18n } from "@/i18n/provider";
import { useEmployeeStore } from "@/store/employee-store";
import { useTaskStore } from "@/store/task-store";
import type { TaskPriority, TaskStatus } from "@/types/task";

const statusOrder: TaskStatus[] = ["todo", "inProgress", "done"];
const priorityOrder: TaskPriority[] = ["low", "medium", "high"];

function statusKey(status: TaskStatus) {
  if (status === "todo") return "statusTodo";
  if (status === "inProgress") return "statusInProgress";
  return "statusDone";
}

function priorityKey(priority: TaskPriority) {
  if (priority === "low") return "priorityLow";
  if (priority === "medium") return "priorityMedium";
  return "priorityHigh";
}

function priorityClass(priority: TaskPriority) {
  if (priority === "high") return "bg-rose-100 text-rose-700";
  if (priority === "medium") return "bg-amber-100 text-amber-700";
  return "bg-emerald-100 text-emerald-700";
}

export function TasksScreen() {
  const { t } = useI18n();
  const employees = useEmployeeStore((s) => s.employees);
  const tasks = useTaskStore((s) => s.tasks);
  const loadTasks = useTaskStore((s) => s.loadTasks);
  const addTask = useTaskStore((s) => s.addTask);
  const removeTask = useTaskStore((s) => s.removeTask);
  const updateTaskStatus = useTaskStore((s) => s.updateTaskStatus);
  const taskCountByStatus = useTaskStore((s) => s.taskCountByStatus);

  const [open, setOpen] = React.useState(false);
  const [title, setTitle] = React.useState("");
  const [assigneeId, setAssigneeId] = React.useState("");
  const [dueDate, setDueDate] = React.useState("");
  const [status, setStatus] = React.useState<TaskStatus>("todo");
  const [priority, setPriority] = React.useState<TaskPriority>("medium");

  React.useEffect(() => {
    void loadTasks();
  }, [loadTasks]);

  function resetForm() {
    setTitle("");
    setAssigneeId("");
    setDueDate("");
    setStatus("todo");
    setPriority("medium");
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !assigneeId || !dueDate) return;
    const assignee = employees.find((employee) => employee.id === assigneeId);
    if (!assignee) return;

    addTask({
      title: title.trim(),
      assigneeId,
      assigneeName: assignee.name,
      dueDate,
      status,
      priority,
    });
    resetForm();
    setOpen(false);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight">{t("taskAssignment")}</h2>
          <p className="text-sm text-[var(--muted-foreground)]">{t("tasksDescription")}</p>
        </div>
        <Button type="button" onClick={() => setOpen(true)}>
          <Plus />
          {t("addTask")}
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {statusOrder.map((item) => (
          <Card key={item}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">{t(statusKey(item))}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold tabular-nums">{taskCountByStatus(item)}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("tasks")}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table className="min-w-[760px]">
            <TableHeader>
              <TableRow>
                <TableHead>{t("taskTitle")}</TableHead>
                <TableHead>{t("assignee")}</TableHead>
                <TableHead>{t("dueDate")}</TableHead>
                <TableHead>{t("taskStatus")}</TableHead>
                <TableHead>{t("priority")}</TableHead>
                <TableHead className="text-right">{t("actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tasks.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-8 text-center text-[var(--muted-foreground)]">
                    {t("noTasks")}
                  </TableCell>
                </TableRow>
              ) : (
                tasks.map((task) => (
                  <TableRow key={task.id}>
                    <TableCell className="font-medium">{task.title}</TableCell>
                    <TableCell>{task.assigneeName}</TableCell>
                    <TableCell>{task.dueDate}</TableCell>
                    <TableCell>
                      <Select
                        value={task.status}
                        onValueChange={(value) => updateTaskStatus(task.id, value as TaskStatus)}
                      >
                        <SelectTrigger className="w-[150px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {statusOrder.map((statusItem) => (
                            <SelectItem key={statusItem} value={statusItem}>
                              {t(statusKey(statusItem))}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={priorityClass(task.priority)}>
                        {t(priorityKey(task.priority))}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeTask(task.id)}
                        aria-label={t("deleteTask")}
                      >
                        <Trash2 className="text-[var(--danger)]" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t("addTask")}</DialogTitle>
          </DialogHeader>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="taskTitle">{t("taskTitle")}</Label>
              <Input
                id="taskTitle"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={t("taskTitlePlaceholder")}
              />
            </div>

            <div className="grid gap-2">
              <Label>{t("assignee")}</Label>
              <Select value={assigneeId} onValueChange={setAssigneeId}>
                <SelectTrigger>
                  <SelectValue placeholder={t("selectEmployee")} />
                </SelectTrigger>
                <SelectContent>
                  {employees.map((employee) => (
                    <SelectItem key={employee.id} value={employee.id}>
                      {employee.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2 sm:grid-cols-3">
              <div className="grid gap-2 sm:col-span-1">
                <Label htmlFor="dueDate">{t("dueDate")}</Label>
                <Input id="dueDate" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
              </div>

              <div className="grid gap-2 sm:col-span-1">
                <Label>{t("taskStatus")}</Label>
                <Select value={status} onValueChange={(value) => setStatus(value as TaskStatus)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOrder.map((statusItem) => (
                      <SelectItem key={statusItem} value={statusItem}>
                        {t(statusKey(statusItem))}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2 sm:col-span-1">
                <Label>{t("priority")}</Label>
                <Select value={priority} onValueChange={(value) => setPriority(value as TaskPriority)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {priorityOrder.map((priorityItem) => (
                      <SelectItem key={priorityItem} value={priorityItem}>
                        {t(priorityKey(priorityItem))}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter>
              <Button type="submit">{t("addTask")}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
