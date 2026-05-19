"use client";

import * as React from "react";
import { AlertTriangle } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { useI18n } from "@/i18n/provider";
import { useAssignmentStore } from "@/store/assignment-store";
import { useEmployeeStore } from "@/store/employee-store";
import { useTaskStore } from "@/store/task-store";

export function DashboardOverviewCards() {
  const { t } = useI18n();
  const employees = useEmployeeStore((s) => s.employees);
  const tasks = useTaskStore((s) => s.tasks);
  const logs = useAssignmentStore((s) => s.logs);

  const activeTasks = React.useMemo(
    () => employees.reduce((sum, e) => sum + (e.activeTaskCount ?? 0), 0),
    [employees],
  );

  const acceptRate = React.useMemo(() => {
    if (logs.length === 0) return "—";
    const acc = logs.filter((l) => l.decision === "accepted").length;
    return `${Math.round((acc / logs.length) * 100)}%`;
  }, [logs]);

  const metrics = [
    { label: t("totalEmployees"), value: String(employees.length), color: "text-[var(--teal)]", sub: null },
    { label: t("activeTasksMetric"), value: String(activeTasks || tasks.length), color: "text-[var(--blue)]", sub: null },
    { label: t("acceptRate"), value: acceptRate, color: "text-[var(--teal)]", sub: t("acceptRateTarget") },
    { label: t("stdDeviation"), value: "2.4", color: "text-[var(--danger)]", sub: t("thresholdExceeded") },
  ];

  return (
    <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 xl:grid-cols-4">
      {metrics.map((m) => (
        <Card
          key={m.label}
          className="rounded-[var(--border-radius-lg)] border-[1.5px] border-[var(--border)] shadow-none"
        >
          <CardContent className="p-3.5">
            <p className="text-[11px] uppercase tracking-wide text-[#5a6a85]">{m.label}</p>
            <p className={`mt-1 text-2xl font-medium tabular-nums ${m.color}`}>{m.value}</p>
            {m.sub ? (
              <p className={`mt-1 flex items-center gap-1 text-[11px] ${m.color}`}>
                {m.label === t("stdDeviation") ? <AlertTriangle className="h-3 w-3" /> : null}
                {m.sub}
              </p>
            ) : null}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
