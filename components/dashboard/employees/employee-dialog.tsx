"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useI18n } from "@/i18n/provider";
import type { TranslationKey } from "@/i18n/translations";
import { DEFAULT_ROLES, type RoleId } from "@/lib/seed";
import type { Department } from "@/types/department";
import type { Employee } from "@/types/employee";

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

export type EmployeeUpsertValues = {
  name: string;
  email: string;
  department: string;
  salary: number;
  role: RoleId;
};

type EmployeeFormState = {
  name: string;
  email: string;
  department: string;
  salary: string;
  role: RoleId;
};

function employeeToForm(e: Employee): EmployeeFormState {
  return {
    name: e.name,
    email: e.email,
    department: e.department,
    salary: String(e.salary ?? 0),
    role: e.role,
  };
}

function emptyForm(departments: Department[]): EmployeeFormState {
  return {
    name: "",
    email: "",
    department: departments[0]?.id ?? "",
    salary: "",
    role: DEFAULT_ROLES[0] ?? "frontendEngineer",
  };
}

function toUpsertValues(form: EmployeeFormState): EmployeeUpsertValues {
  const salary = Number(form.salary);
  return {
    name: form.name.trim(),
    email: form.email.trim(),
    department: form.department,
    salary: Number.isFinite(salary) ? salary : 0,
    role: form.role,
  };
}

export function EmployeeDialog({
  open,
  onOpenChange,
  departments,
  initialEmployee,
  onCreate,
  onUpdate,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  departments: Department[];
  initialEmployee?: Employee | null;
  onCreate: (values: EmployeeUpsertValues) => void;
  onUpdate: (employeeId: string, values: EmployeeUpsertValues) => void;
}) {
  const { t } = useI18n();
  const [form, setForm] = React.useState<EmployeeFormState>(() =>
    emptyForm(departments),
  );

  React.useEffect(() => {
    if (!open) return;
    setForm(
      initialEmployee ? employeeToForm(initialEmployee) : emptyForm(departments),
    );
  }, [open, initialEmployee, departments]);

  const isEdit = Boolean(initialEmployee);

  const canSubmit =
    form.name.trim().length > 0 &&
    form.email.trim().length > 0 &&
    form.department.length > 0 &&
    Boolean(form.role);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? t("editEmployee") : t("addEmployee")}</DialogTitle>
          <DialogDescription>
            {isEdit ? t("editEmployeeDesc") : t("addEmployeeDesc")}
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            const values = toUpsertValues(form);
            if (isEdit && initialEmployee) onUpdate(initialEmployee.id, values);
            else onCreate(values);
            onOpenChange(false);
          }}
          className="grid gap-4"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2 sm:col-span-2">
              <Label htmlFor="name">{t("name")}</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(ev) => setForm((s) => ({ ...s, name: ev.target.value }))}
                autoComplete="name"
                placeholder={t("namePlaceholder")}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2 sm:col-span-2">
              <Label htmlFor="email">{t("email")}</Label>
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={(ev) => setForm((s) => ({ ...s, email: ev.target.value }))}
                autoComplete="email"
                placeholder={t("emailPlaceholder")}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="department">{t("department")}</Label>
              <select
                id="department"
                value={form.department}
                onChange={(ev) =>
                  setForm((s) => ({ ...s, department: ev.target.value }))
                }
                className="h-9 w-full rounded-md border border-zinc-200 bg-white px-3 text-sm shadow-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 dark:border-zinc-800 dark:bg-zinc-950 dark:focus-visible:ring-zinc-50 dark:focus-visible:ring-offset-zinc-950"
              >
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>
                    {departmentKeyById[d.id] ? t(departmentKeyById[d.id]!) : d.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="salary">{t("salary")}</Label>
              <Input
                id="salary"
                inputMode="numeric"
                value={form.salary}
                onChange={(ev) =>
                  setForm((s) => ({ ...s, salary: ev.target.value }))
                }
                placeholder={t("salaryPlaceholder")}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="role">{t("role")}</Label>
              <select
                id="role"
                value={form.role}
                onChange={(ev) =>
                  setForm((s) => ({ ...s, role: ev.target.value as RoleId }))
                }
                className="h-9 w-full rounded-md border border-zinc-200 bg-white px-3 text-sm shadow-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 dark:border-zinc-800 dark:bg-zinc-950 dark:focus-visible:ring-zinc-50 dark:focus-visible:ring-offset-zinc-950"
              >
                {DEFAULT_ROLES.map((r) => (
                  <option key={r} value={r}>
                    {t(roleKeyById[r])}
                  </option>
                ))}
              </select>
            </div>
            <div className="hidden sm:block" />
          </div>

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t("cancel")}
            </Button>
            <Button type="submit" disabled={!canSubmit}>
              {isEdit ? t("saveChanges") : t("addEmployee")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

