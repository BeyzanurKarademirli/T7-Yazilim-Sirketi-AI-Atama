"use client";

import * as React from "react";
import { Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useI18n } from "@/i18n/provider";
import { createId } from "@/lib/id";
import { notifyError, notifySuccess } from "@/lib/notify";
import { useEmployeeStore } from "@/store/employee-store";
import type { Department } from "@/types/department";
import type { TranslationKey } from "@/i18n/translations";

const departmentKeyById: Partial<Record<string, TranslationKey>> = {
  eng: "departmentEng",
  hr: "departmentHr",
  fin: "departmentFin",
  ops: "departmentOps",
};

function slugifyId(input: string) {
  const base = input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  return base.length > 0 ? base.slice(0, 24) : "";
}

export function DepartmentsScreen() {
  const { t } = useI18n();
  const departments = useEmployeeStore((s) => s.departments);
  const employees = useEmployeeStore((s) => s.employees);
  const addDepartment = useEmployeeStore((s) => s.addDepartment);
  const removeDepartment = useEmployeeStore((s) => s.removeDepartment);

  const [name, setName] = React.useState("");

  const employeeCountByDepartment = React.useMemo(() => {
    const map = new Map<string, number>();
    for (const e of employees) {
      map.set(e.department, (map.get(e.department) ?? 0) + 1);
    }
    return map;
  }, [employees]);

  function onAdd() {
    const trimmed = name.trim();
    if (!trimmed) return;

    const candidateId = slugifyId(trimmed) || createId();
    const department: Department = { id: candidateId, name: trimmed };

    const result = addDepartment(department);
    if (!result.ok) {
      notifyError(t(result.error));
      return;
    }

    notifySuccess(t("toastDepartmentAdded"), trimmed);
    setName("");
  }

  function onDelete(department: Department) {
    const result = removeDepartment(department.id);
    if (!result.ok) {
      notifyError(t(result.error));
      return;
    }
    notifySuccess(t("toastDepartmentDeleted"), department.name);
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-semibold tracking-tight">{t("departments")}</h2>
        <p className="text-sm text-[var(--muted-foreground)]">
          {t("departmentsDescription")}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("addDepartment")}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
          <div className="grid gap-2">
            <Label htmlFor="departmentName">{t("departmentName")}</Label>
            <Input
              id="departmentName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("departmentNamePlaceholder")}
            />
          </div>

          <Button type="button" onClick={onAdd} className="w-full sm:w-auto">
            <Plus />
            {t("addDepartment")}
          </Button>
        </CardContent>
      </Card>

      <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("department")}</TableHead>
              <TableHead className="text-right">{t("totalEmployees")}</TableHead>
              <TableHead className="w-[120px] text-right">{t("actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {departments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="py-10 text-center text-[var(--muted-foreground)]">
                  {t("noDepartments")}
                </TableCell>
              </TableRow>
            ) : (
              departments.map((d) => (
                <TableRow key={d.id}>
                  <TableCell className="font-medium">
                    {departmentKeyById[d.id] ? t(departmentKeyById[d.id]!) : d.name}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {employeeCountByDepartment.get(d.id) ?? 0}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={t("deleteDepartment")}
                      onClick={() => onDelete(d)}
                    >
                      <Trash2 className="text-[var(--danger)]" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

