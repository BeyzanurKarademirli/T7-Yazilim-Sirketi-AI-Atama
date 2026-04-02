"use client";

import * as React from "react";
import { Building2, DollarSign, FolderKanban, Layers3, Users, Wallet } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useI18n } from "@/i18n/provider";
import { formatCurrency } from "@/lib/format";
import { useEmployeeStore } from "@/store/employee-store";
import { useSettingsStore } from "@/store/settings-store";

function StatCard({
  title,
  value,
  icon: Icon,
}: {
  title: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0">
        <CardTitle className="min-w-0 truncate">{title}</CardTitle>
        <Icon className="h-4 w-4 shrink-0 text-zinc-500 dark:text-zinc-400" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-semibold tabular-nums">{value}</div>
      </CardContent>
    </Card>
  );
}

export function DashboardOverviewCards() {
  const { t } = useI18n();
  const employees = useEmployeeStore((s) => s.employees);
  const departments = useEmployeeStore((s) => s.departments);
  const projects = useEmployeeStore((s) => s.projects);
  const totalSalary = useEmployeeStore((s) => s.totalSalary);
  const visible = useSettingsStore((s) => s.cardsVisibility);

  const averageSalary = React.useMemo(() => {
    if (employees.length === 0) return 0;
    return totalSalary / employees.length;
  }, [employees.length, totalSalary]);

  const employeesInProjects = React.useMemo(() => {
    const ids = new Set<string>();
    for (const p of projects) {
      for (const g of p.groups) {
        for (const e of g.employees) {
          ids.add(e.id);
        }
      }
    }
    return ids.size;
  }, [projects]);

  const totalGroups = React.useMemo(
    () => projects.reduce((sum, p) => sum + p.groups.length, 0),
    [projects],
  );

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      {visible.totalEmployees ? (
        <StatCard
          title={t("totalEmployees")}
          value={String(employees.length)}
          icon={Users}
        />
      ) : null}
      {visible.totalSalary ? (
        <StatCard
          title={t("totalSalary")}
          value={formatCurrency(totalSalary)}
          icon={DollarSign}
        />
      ) : null}
      {visible.departments ? (
        <StatCard
          title={t("departments")}
          value={String(departments.length)}
          icon={Building2}
        />
      ) : null}
      {visible.averageSalary ? (
        <StatCard
          title={t("averageSalary")}
          value={formatCurrency(averageSalary)}
          icon={Wallet}
        />
      ) : null}
      <StatCard
        title={t("projects")}
        value={String(projects.length)}
        icon={FolderKanban}
      />
      <StatCard
        title={t("employeesInProjects")}
        value={String(employeesInProjects)}
        icon={Users}
      />
      <StatCard
        title={t("totalGroups")}
        value={String(totalGroups)}
        icon={Layers3}
      />
    </div>
  );
}

