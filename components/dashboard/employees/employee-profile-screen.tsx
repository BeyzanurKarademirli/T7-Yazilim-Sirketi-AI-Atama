"use client";

import Link from "next/link";
import * as React from "react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useI18n } from "@/i18n/provider";
import type { TranslationKey } from "@/i18n/translations";
import { formatCurrency } from "@/lib/format";
import type { RoleId } from "@/lib/seed";
import { useEmployeeStore } from "@/store/employee-store";

const departmentKeyById: Partial<Record<string, TranslationKey>> = {
  eng: "departmentEng",
  hr: "departmentHr",
  fin: "departmentFin",
  ops: "departmentOps",
};

const roleKeyById: Record<RoleId, TranslationKey> = {
  frontendEngineer: "roleFrontendEngineer",
  backendEngineer: "roleBackendEngineer",
  fullstackEngineer: "roleFullstackEngineer",
  hrSpecialist: "roleHrSpecialist",
  accountant: "roleAccountant",
  manager: "roleManager",
};

export function EmployeeProfileScreen({ employeeId }: { employeeId: string }) {
  const { t } = useI18n();
  const employee = useEmployeeStore((s) => s.employees.find((item) => item.id === employeeId));
  const departments = useEmployeeStore((s) => s.departments);
  const projects = useEmployeeStore((s) => s.projects);

  const departmentNameById = React.useMemo(() => {
    return new Map(
      departments.map((department) => {
        const key = departmentKeyById[department.id];
        return [department.id, key ? t(key) : department.name] as const;
      }),
    );
  }, [departments, t]);

  const employeeProjects = React.useMemo(() => {
    if (!employee) return [];
    return projects
      .filter((project) =>
        project.groups.some((group) =>
          group.employees.some((projectEmployee) => projectEmployee.id === employee.id),
        ),
      )
      .map((project) => project.name);
  }, [employee, projects]);

  if (!employee) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">{t("employeeProfile")}</h2>
        <p className="text-sm text-[var(--muted-foreground)]">{t("errorEmployeeNotFound")}</p>
        <Link href="/dashboard/employees" className="text-sm font-medium text-[var(--focus)] hover:underline">
          {t("backToEmployees")}
        </Link>
      </div>
    );
  }

  const initials = employee.name
    .split(" ")
    .map((part) => part[0]?.toUpperCase())
    .join("")
    .slice(0, 2);

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-semibold tracking-tight">{t("employeeProfile")}</h2>
        <p className="text-sm text-[var(--muted-foreground)]">{t("employeeProfileDescription")}</p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center gap-4">
          <Avatar className="h-14 w-14">
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <CardTitle>{employee.name}</CardTitle>
            <p className="text-sm text-[var(--muted-foreground)]">{employee.email}</p>
          </div>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-xs uppercase tracking-wide text-[var(--muted-foreground)]">{t("department")}</p>
            <p className="text-sm font-medium">{departmentNameById.get(employee.department) ?? "-"}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-[var(--muted-foreground)]">{t("role")}</p>
            <p className="text-sm font-medium">{t(roleKeyById[employee.role])}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-[var(--muted-foreground)]">{t("salary")}</p>
            <p className="text-sm font-medium tabular-nums">{formatCurrency(employee.salary)}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-[var(--muted-foreground)]">{t("activeTasks")}</p>
            <p className="text-sm font-medium">{t("seeTaskBoardHint")}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t("projects")}</CardTitle>
        </CardHeader>
        <CardContent>
          {employeeProjects.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {employeeProjects.map((projectName) => (
                <Badge key={projectName} variant="secondary">
                  {projectName}
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-sm text-[var(--muted-foreground)]">{t("noProjectsForEmployee")}</p>
          )}
        </CardContent>
      </Card>

      <Link href="/dashboard/employees" className="inline-block text-sm font-medium text-[var(--focus)] hover:underline">
        {t("backToEmployees")}
      </Link>
    </div>
  );
}
