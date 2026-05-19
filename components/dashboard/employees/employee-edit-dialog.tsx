"use client";

import * as React from "react";
import { CheckCircle2, Pencil } from "lucide-react";

import {
  SkillInputRows,
  rowsToSkills,
  skillsToRows,
  type SkillRow,
} from "@/components/dashboard/employees/skill-input-rows";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useI18n } from "@/i18n/provider";
import {
  V6_DEPARTMENTS,
  employeeInitials,
  normalizeSkills,
  roleIdFromSkills,
} from "@/lib/employee-utils";
import type { AssignmentRole, Employee } from "@/types/employee";

type EditForm = {
  name: string;
  email: string;
  department: string;
  assignmentRole: AssignmentRole;
  maxCapacity: string;
  skillRows: SkillRow[];
};

function employeeToForm(e: Employee): EditForm {
  return {
    name: e.name,
    email: e.email,
    department: e.department,
    assignmentRole: e.assignmentRole ?? "employee",
    maxCapacity: String(e.maxCapacity ?? 5),
    skillRows: skillsToRows(e.skills ?? []),
  };
}

export function EmployeeEditDialog({
  employee,
  open,
  onOpenChange,
  onSave,
}: {
  employee: Employee | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (employeeId: string, data: Omit<Employee, "id">) => void;
}) {
  const { t } = useI18n();
  const [form, setForm] = React.useState<EditForm | null>(null);
  const [saved, setSaved] = React.useState(false);

  React.useEffect(() => {
    if (employee && open) {
      setForm(employeeToForm(employee));
      setSaved(false);
    }
  }, [employee, open]);

  function submit() {
    if (!employee || !form) return;
    const name = form.name.trim();
    const email = form.email.trim();
    if (!name || !email) return;
    const skills = normalizeSkills(rowsToSkills(form.skillRows));
    if (!skills.length) return;

    onSave(employee.id, {
      name,
      email,
      department: form.department,
      salary: employee.salary ?? 0,
      role: roleIdFromSkills(skills),
      init: employeeInitials(name),
      maxCapacity: Number(form.maxCapacity) || 5,
      activeTaskCount: employee.activeTaskCount ?? 0,
      available: employee.available !== false,
      skills,
      assignmentRole: form.assignmentRole,
    });

    setSaved(true);
    window.setTimeout(() => {
      setSaved(false);
      onOpenChange(false);
    }, 1000);
  }

  if (!form) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[min(480px,90vh)] max-w-[460px] overflow-y-auto border-[1.5px] border-[var(--border)] p-[22px] shadow-none">
        <DialogHeader className="mb-4 flex flex-row items-center justify-between space-y-0">
          <DialogTitle className="flex items-center gap-1.5 text-[15px] font-medium text-[var(--foreground)]">
            <Pencil className="h-4 w-4 text-[var(--teal)]" />
            {t("editProfile")}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          <Field label={`${t("name")} *`}>
            <Input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="h-[34px] border-[1.5px] shadow-none"
            />
          </Field>
          <Field label={`${t("email")} *`}>
            <Input
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="h-[34px] border-[1.5px] shadow-none"
            />
          </Field>
        </div>

        <div className="mt-2.5 grid grid-cols-1 gap-2.5 sm:grid-cols-3">
          <Field label={t("department")}>
            <Select
              value={form.department}
              onValueChange={(department) => setForm({ ...form, department })}
            >
              <SelectTrigger className="h-[34px] border-[1.5px] shadow-none">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {V6_DEPARTMENTS.map((d) => (
                  <SelectItem key={d.id} value={d.id}>
                    {d.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label={t("role")}>
            <Select
              value={form.assignmentRole}
              onValueChange={(assignmentRole) =>
                setForm({ ...form, assignmentRole: assignmentRole as AssignmentRole })
              }
            >
              <SelectTrigger className="h-[34px] border-[1.5px] shadow-none">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="employee">{t("assignmentRoleEmployee")}</SelectItem>
                <SelectItem value="scrum_master">{t("assignmentRoleScrum")}</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field label={t("maxCapacity")}>
            <Select
              value={form.maxCapacity}
              onValueChange={(maxCapacity) => setForm({ ...form, maxCapacity })}
            >
              <SelectTrigger className="h-[34px] border-[1.5px] shadow-none">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {["3", "5", "7", "10"].map((v) => (
                  <SelectItem key={v} value={v}>
                    {v}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        </div>

        <div className="mb-3 mt-2">
          <p className="mb-2 text-xs text-[#5a6a85]">{t("skillsRequired").replace(" *", "")}</p>
          <SkillInputRows
            rows={form.skillRows}
            onChange={(skillRows) => setForm({ ...form, skillRows })}
          />
        </div>

        <div className="flex gap-2">
          <Button
            type="button"
            className="h-[34px] border-[var(--navy)] bg-[var(--navy)] text-white hover:opacity-90"
            onClick={submit}
          >
            {t("saveChanges")}
          </Button>
          <Button type="button" variant="outline" className="h-[34px]" onClick={() => onOpenChange(false)}>
            {t("cancel")}
          </Button>
        </div>

        {saved ? (
          <div className="mt-2.5 flex items-center gap-1.5 rounded-[var(--border-radius-md)] border border-[rgba(0,201,167,0.3)] bg-[rgba(0,201,167,0.1)] px-3 py-2 text-xs text-[#007a67]">
            <CheckCircle2 className="h-3.5 w-3.5" />
            {t("employeeProfileUpdatedOk")}
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <Label className="mb-1 block text-xs text-[#5a6a85]">{label}</Label>
      {children}
    </div>
  );
}
