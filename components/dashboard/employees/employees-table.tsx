"use client";

import * as React from "react";
import Link from "next/link";
import { Eye, Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useI18n } from "@/i18n/provider";
import type { TranslationKey } from "@/i18n/translations";
import { formatCurrency } from "@/lib/format";
import type { RoleId } from "@/lib/seed";
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

export function EmployeesTable({
  employees,
  departments,
  onEdit,
  onDelete,
}: {
  employees: Employee[];
  departments: Department[];
  onEdit: (employee: Employee) => void;
  onDelete: (employee: Employee) => void;
}) {
  const { t } = useI18n();
  const departmentNameById = React.useMemo(() => {
    return new Map(
      departments.map((d) => {
        const key = departmentKeyById[d.id];
        return [d.id, key ? t(key) : d.name] as const;
      }),
    );
  }, [departments, t]);

  return (
    <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)]">
      <Table className="min-w-[760px]">
        <TableHeader>
          <TableRow>
            <TableHead>{t("name")}</TableHead>
            <TableHead>{t("email")}</TableHead>
            <TableHead>{t("department")}</TableHead>
            <TableHead className="text-right">{t("salary")}</TableHead>
            <TableHead>{t("role")}</TableHead>
            <TableHead className="w-[170px] text-right">{t("actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {employees.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={6}
                className="py-10 text-center text-[var(--muted-foreground)]"
              >
                {t("noEmployees")}
              </TableCell>
            </TableRow>
          ) : (
            employees.map((e) => (
              <TableRow key={e.id}>
                <TableCell className="font-medium">
                  {e.name}
                </TableCell>
                <TableCell className="text-[var(--muted-foreground)]">
                  {e.email}
                </TableCell>
                <TableCell>{departmentNameById.get(e.department) ?? "—"}</TableCell>
                <TableCell className="text-right tabular-nums">
                  {formatCurrency(e.salary)}
                </TableCell>
                <TableCell className="text-[var(--muted-foreground)]">
                  {t(roleKeyById[e.role])}
                </TableCell>
                <TableCell className="text-right">
                  <div className="inline-flex items-center gap-2">
                    <Button
                      asChild
                      variant="ghost"
                      size="icon"
                      aria-label={t("viewProfile")}
                    >
                      <Link href={`/dashboard/employees/${e.id}`}>
                        <Eye />
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={t("editEmployee")}
                      onClick={() => onEdit(e)}
                    >
                      <Pencil />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={t("deleteEmployee")}
                      onClick={() => onDelete(e)}
                    >
                      <Trash2 className="text-[var(--danger)]" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

