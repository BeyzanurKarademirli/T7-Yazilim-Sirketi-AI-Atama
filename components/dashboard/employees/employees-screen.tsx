"use client";

import * as React from "react";
import { Plus } from "lucide-react";
import { EmployeeDialog, type EmployeeUpsertValues } from "@/components/dashboard/employees/employee-dialog";
import { EmployeesTable } from "@/components/dashboard/employees/employees-table";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/i18n/provider";
import { createId } from "@/lib/id";
import { formatCurrency } from "@/lib/format";
import { notifyError, notifySuccess } from "@/lib/notify";
import { useEmployeeStore } from "@/store/employee-store";
import type { Employee } from "@/types/employee";

export function EmployeesScreen() {
  const { t } = useI18n();
  const employees = useEmployeeStore((s) => s.employees);
  const departments = useEmployeeStore((s) => s.departments);
  const totalSalary = useEmployeeStore((s) => s.totalSalary);
  const addEmployee = useEmployeeStore((s) => s.addEmployee);
  const editEmployee = useEmployeeStore((s) => s.editEmployee);
  const removeEmployee = useEmployeeStore((s) => s.removeEmployee);

  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Employee | null>(null);

  const onCreate = React.useCallback(
    (values: EmployeeUpsertValues) => {
      const result = addEmployee({
        id: createId(),
        ...values,
      });

      if (!result.ok) {
        notifyError(t(result.error));
        return;
      }

      notifySuccess(t("toastEmployeeCreated"), values.name);
    },
    [addEmployee, t],
  );

  const onUpdate = React.useCallback(
    (employeeId: string, values: EmployeeUpsertValues) => {
      const result = editEmployee(employeeId, values);
      if (!result.ok) {
        notifyError(t(result.error));
        return;
      }
      notifySuccess(t("toastEmployeeUpdated"), values.name);
    },
    [editEmployee, t],
  );

  const onDelete = React.useCallback(
    (employee: Employee) => {
      const result = removeEmployee(employee.id);
      if (!result.ok) {
        notifyError(t(result.error));
        return;
      }
      notifySuccess(t("toastEmployeeDeleted"), employee.name);
    },
    [removeEmployee, t],
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight">{t("employees")}</h2>
          <p className="text-sm text-[var(--muted-foreground)]">
            {t("employeesDescription")}
          </p>
        </div>
        <Button
          onClick={() => {
            setEditing(null);
            setDialogOpen(true);
          }}
        >
          <Plus />
          {t("addEmployee")}
        </Button>
      </div>

      <EmployeesTable
        employees={employees}
        departments={departments}
        onEdit={(e) => {
          setEditing(e);
          setDialogOpen(true);
        }}
        onDelete={onDelete}
      />

      <div className="flex items-center justify-between rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm">
        <div className="text-[var(--muted-foreground)]">
          {t("totalsEmployeesLabel")}:{" "}
          <span className="font-medium text-[var(--foreground)]">
            {employees.length}
          </span>
        </div>
        <div className="text-[var(--muted-foreground)]">
          {t("totalsSalaryLabel")}:{" "}
          <span className="font-medium text-[var(--foreground)]">
            {formatCurrency(totalSalary)}
          </span>
        </div>
      </div>

      <EmployeeDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        departments={departments}
        initialEmployee={editing}
        onCreate={onCreate}
        onUpdate={onUpdate}
      />
    </div>
  );
}

