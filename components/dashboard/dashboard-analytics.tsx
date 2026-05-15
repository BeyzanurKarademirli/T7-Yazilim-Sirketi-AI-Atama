"use client";

import * as React from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useI18n } from "@/i18n/provider";
import { useEmployeeStore } from "@/store/employee-store";
import { useTaskStore } from "@/store/task-store";

export function DashboardAnalytics() {
  const { t } = useI18n();
  const departments = useEmployeeStore((s) => s.departments);
  const employees = useEmployeeStore((s) => s.employees);
  const tasks = useTaskStore((s) => s.tasks);
  const loadTasks = useTaskStore((s) => s.loadTasks);

  React.useEffect(() => {
    void loadTasks();
  }, [loadTasks]);

  const departmentStats = React.useMemo(() => {
    const total = Math.max(employees.length, 1);
    return departments.map((department) => {
      const count = employees.filter((employee) => employee.department === department.id).length;
      return {
        name: department.name,
        count,
        ratio: Math.round((count / total) * 100),
      };
    });
  }, [departments, employees]);

  const taskStatusStats = React.useMemo(() => {
    const total = Math.max(tasks.length, 1);
    const byStatus = {
      todo: tasks.filter((task) => task.status === "todo").length,
      inProgress: tasks.filter((task) => task.status === "inProgress").length,
      done: tasks.filter((task) => task.status === "done").length,
    };
    return [
      {
        label: t("statusTodo"),
        count: byStatus.todo,
        ratio: Math.round((byStatus.todo / total) * 100),
      },
      {
        label: t("statusInProgress"),
        count: byStatus.inProgress,
        ratio: Math.round((byStatus.inProgress / total) * 100),
      },
      {
        label: t("statusDone"),
        count: byStatus.done,
        ratio: Math.round((byStatus.done / total) * 100),
      },
    ];
  }, [tasks, t]);

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>{t("employeesByDepartment")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {departmentStats.map((item) => (
            <div key={item.name} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span>{item.name}</span>
                <span className="text-[var(--muted-foreground)]">{item.count}</span>
              </div>
              <div className="h-2 rounded-full bg-[var(--surface-muted)]">
                <div
                  className="h-full rounded-full bg-[var(--primary)] transition-all"
                  style={{ width: `${item.ratio}%` }}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("taskStatusDistribution")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {taskStatusStats.map((item) => (
            <div key={item.label} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span>{item.label}</span>
                <span className="text-[var(--muted-foreground)]">{item.count}</span>
              </div>
              <div className="h-2 rounded-full bg-[var(--surface-muted)]">
                <div
                  className="h-full rounded-full bg-[var(--focus)] transition-all"
                  style={{ width: `${item.ratio}%` }}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
