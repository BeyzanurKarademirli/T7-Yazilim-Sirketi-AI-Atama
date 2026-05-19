"use client";

import * as React from "react";
import { AlertCircle, CheckCircle2, Pencil, Trash2, UserPlus, X } from "lucide-react";

import { EmployeeEditDialog } from "@/components/dashboard/employees/employee-edit-dialog";
import {
  SkillInputRows,
  rowsToSkills,
  skillsToRows,
  type SkillRow,
} from "@/components/dashboard/employees/skill-input-rows";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import type { TranslationKey } from "@/i18n/translations";
import { createId } from "@/lib/id";
import {
  EMPLOYEE_AVATAR_CLASSES,
  V6_DEPARTMENTS,
  departmentDisplayName,
  employeeInitials,
  normalizeSkills,
  roleIdFromSkills,
} from "@/lib/employee-utils";
import { notifyError, notifySuccess } from "@/lib/notify";
import { useEmployeeStore } from "@/store/employee-store";
import type { AssignmentRole, Employee } from "@/types/employee";

function RoleBadge({ role, t }: { role?: AssignmentRole; t: (key: TranslationKey) => string }) {
  if (role === "scrum_master") {
    return (
      <Badge className="border-0 bg-[rgba(147,112,219,0.15)] text-[#5b3fa8]">
        {t("assignmentRoleScrum")}
      </Badge>
    );
  }
  return (
    <Badge className="border-0 bg-[rgba(74,158,255,0.12)] text-[#1666cc]">
      {t("assignmentRoleEmployee")}
    </Badge>
  );
}

export function EmployeesScreen() {
  const { t } = useI18n();
  const employees = useEmployeeStore((s) => s.employees);
  const addEmployee = useEmployeeStore((s) => s.addEmployee);
  const editEmployee = useEmployeeStore((s) => s.editEmployee);
  const removeEmployee = useEmployeeStore((s) => s.removeEmployee);
  const toggleEmployeeAvailability = useEmployeeStore((s) => s.toggleEmployeeAvailability);

  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [department, setDepartment] = React.useState("eng");
  const [assignmentRole, setAssignmentRole] = React.useState<AssignmentRole>("employee");
  const [maxCapacity, setMaxCapacity] = React.useState("5");
  const [skillRows, setSkillRows] = React.useState<SkillRow[]>(() => skillsToRows([]));
  const [formError, setFormError] = React.useState<string | null>(null);
  const [formOk, setFormOk] = React.useState(false);
  const [editing, setEditing] = React.useState<Employee | null>(null);
  const [editOpen, setEditOpen] = React.useState(false);

  function clearForm() {
    setName("");
    setEmail("");
    setDepartment("eng");
    setAssignmentRole("employee");
    setMaxCapacity("5");
    setSkillRows(skillsToRows([]));
    setFormError(null);
  }

  function showError(key: "errorNameRequired" | "errorEmailInvalid" | "errorSkillsRequired" | "errorDuplicateEmail") {
    setFormError(t(key));
    notifyError(t(key));
    window.setTimeout(() => setFormError(null), 3000);
  }

  function handleAdd() {
    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedName) {
      showError("errorNameRequired");
      return;
    }
    if (!trimmedEmail.includes("@")) {
      showError("errorEmailInvalid");
      return;
    }
    const skills = normalizeSkills(rowsToSkills(skillRows));
    if (!skills.length) {
      showError("errorSkillsRequired");
      return;
    }

    const result = addEmployee({
      id: createId(),
      name: trimmedName,
      email: trimmedEmail,
      department,
      salary: 0,
      role: roleIdFromSkills(skills),
      init: employeeInitials(trimmedName),
      maxCapacity: Number(maxCapacity) || 5,
      activeTaskCount: 0,
      available: true,
      skills,
      assignmentRole,
    });

    if (!result.ok) {
      if (result.error === "errorDuplicateEmail") showError("errorDuplicateEmail");
      return;
    }

    setFormOk(true);
    notifySuccess(t("toastEmployeeCreated"), trimmedName);
    window.setTimeout(() => setFormOk(false), 2500);
    clearForm();
  }

  function handleSaveEdit(employeeId: string, data: Omit<Employee, "id">) {
    const result = editEmployee(employeeId, data);
    if (!result.ok) {
      notifyError(t(result.error));
      return;
    }
    notifySuccess(t("toastEmployeeUpdated"), data.name);
  }

  function handleDelete(employee: Employee) {
    const result = removeEmployee(employee.id);
    if (!result.ok) {
      notifyError(t(result.error));
      return;
    }
    notifySuccess(t("toastEmployeeDeleted"), employee.name);
  }

  function handleToggleAvailability(employee: Employee) {
    const result = toggleEmployeeAvailability(employee.id);
    if (!result.ok) {
      notifyError(t(result.error));
      return;
    }
    const nowAvailable = employee.available === false;
    notifySuccess(
      nowAvailable ? t("toastEmployeeAvailable") : t("toastEmployeeOnLeave"),
      employee.name,
    );
  }

  return (
    <div className="space-y-3.5">
      <Card className="rounded-[var(--border-radius-lg)] border-[1.5px] border-[var(--border)] shadow-none">
        <CardContent className="p-[18px]">
          <p className="mb-3 text-[11px] font-medium uppercase tracking-wide text-[#5a6a85]">
            {t("newEmployeeSection")}
          </p>

          <div className="mb-2.5 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            <Field label={`${t("name")} *`}>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="örn. Ahmet Yıldız"
                className="h-[34px] border-[1.5px] shadow-none"
              />
            </Field>
            <Field label={`${t("email")} *`}>
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ahmet@sirket.com"
                className="h-[34px] border-[1.5px] shadow-none"
              />
            </Field>
          </div>

          <div className="mb-2.5 grid grid-cols-1 gap-2.5 sm:grid-cols-3">
            <Field label={t("department")}>
              <Select value={department} onValueChange={setDepartment}>
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
                value={assignmentRole}
                onValueChange={(v) => setAssignmentRole(v as AssignmentRole)}
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
              <Select value={maxCapacity} onValueChange={setMaxCapacity}>
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

          <div className="mb-2.5">
            <p className="mb-2 text-xs text-[#5a6a85]">{t("skillsRequired")}</p>
            <SkillInputRows rows={skillRows} onChange={setSkillRows} />
          </div>

          <div className="mt-1 flex flex-wrap gap-2">
            <Button
              type="button"
              className="h-[34px] border-[var(--teal)] bg-[var(--teal)] text-white hover:opacity-90"
              onClick={handleAdd}
            >
              <UserPlus className="h-4 w-4" />
              {t("addEmployeeBtn")}
            </Button>
            <Button type="button" variant="outline" className="h-[34px]" onClick={clearForm}>
              <X className="h-4 w-4" />
              {t("clearForm")}
            </Button>
          </div>

          {formError ? (
            <div className="mt-2 flex items-center gap-1.5 rounded-[var(--border-radius-md)] border border-[rgba(255,78,78,0.25)] bg-[rgba(255,78,78,0.08)] px-3 py-2 text-xs text-[var(--danger)]">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" />
              {formError}
            </div>
          ) : null}
          {formOk ? (
            <div className="mt-2 flex items-center gap-1.5 rounded-[var(--border-radius-md)] border border-[rgba(0,201,167,0.3)] bg-[rgba(0,201,167,0.1)] px-3 py-2 text-xs text-[#007a67]">
              <CheckCircle2 className="h-3.5 w-3.5" />
              {t("employeeAddedOk")}
            </div>
          ) : null}
        </CardContent>
      </Card>

      <Card className="rounded-[var(--border-radius-lg)] border-[1.5px] border-[var(--border)] shadow-none">
        <CardContent className="p-[18px]">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-[11px] font-medium uppercase tracking-wide text-[#5a6a85]">
              {t("currentEmployeesSection")}
            </p>
            <Badge className="border-0 bg-[rgba(74,158,255,0.12)] text-[#1666cc]">
              {employees.length} {t("employeesCount")}
            </Badge>
          </div>

          <div>
            {employees.map((e, i) => (
              <EmployeeRow
                key={e.id}
                employee={e}
                index={i}
                onToggle={() => handleToggleAvailability(e)}
                onEdit={() => {
                  setEditing(e);
                  setEditOpen(true);
                }}
                onDelete={() => handleDelete(e)}
                t={t}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      <EmployeeEditDialog
        employee={editing}
        open={editOpen}
        onOpenChange={setEditOpen}
        onSave={handleSaveEdit}
      />
    </div>
  );
}

function EmployeeRow({
  employee: e,
  index: i,
  onToggle,
  onEdit,
  onDelete,
  t,
}: {
  employee: Employee;
  index: number;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
  t: (key: TranslationKey) => string;
}) {
  const max = e.maxCapacity ?? 5;
  const active = e.activeTaskCount ?? 0;
  const pct = max > 0 ? Math.round((active / max) * 100) : 0;
  const available = e.available !== false;

  return (
    <div className="flex items-center gap-3 border-b border-[var(--border)] py-3 last:border-b-0">
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[13px] font-medium ${EMPLOYEE_AVATAR_CLASSES[i % 5]}`}
      >
        {e.init ?? employeeInitials(e.name)}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[13px] font-medium text-[var(--foreground)]">{e.name}</span>
          <RoleBadge role={e.assignmentRole} t={t} />
        </div>
        <p className="mt-0.5 text-xs text-[#5a6a85]">
          {departmentDisplayName(e.department)} · {e.email}
        </p>
        <div className="mt-1 flex flex-wrap gap-1">
          {(e.skills ?? []).map((s) => (
            <span
              key={`${s.cat}-${s.lv}`}
              className="rounded-full border border-[var(--border)] bg-[var(--muted)] px-1.5 py-0 text-[10px] text-[#5a6a85]"
            >
              {s.cat} {s.lv}/10
            </span>
          ))}
        </div>
      </div>
      <div className="mx-2.5 w-[72px] shrink-0">
        <p className="mb-0.5 text-[11px] text-[#5a6a85]">
          {active}/{max}
        </p>
        <div className="h-[5px] overflow-hidden rounded-full bg-[var(--border)]">
          <div className="h-full rounded-full bg-[var(--teal)]" style={{ width: `${pct}%` }} />
        </div>
        </div>
      <div className="flex shrink-0 flex-col items-end gap-1.5">
        <button type="button" onClick={onToggle}>
          <Badge
            className={
              available
                ? "cursor-pointer border-0 bg-[rgba(0,201,167,0.12)] text-[#007a67]"
                : "cursor-pointer border-0 bg-[rgba(255,78,78,0.12)] text-[#cc0000]"
            }
          >
            {available ? t("availableBadge") : t("onLeave")}
          </Badge>
        </button>
        <div className="flex gap-1">
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="h-7 border-[rgba(74,158,255,0.25)] bg-[rgba(74,158,255,0.1)] px-2.5 text-xs text-[#1666cc] hover:bg-[rgba(74,158,255,0.2)]"
            onClick={onEdit}
          >
            <Pencil className="h-3 w-3" />
            Düzenle
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="h-7 border-[rgba(255,78,78,0.25)] bg-[rgba(255,78,78,0.1)] px-2 text-[var(--danger)] hover:bg-[rgba(255,78,78,0.2)]"
            onClick={onDelete}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
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
