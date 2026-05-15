"use client";

import * as React from "react";
import { Plus, Trash2, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useI18n } from "@/i18n/provider";
import { notifyError, notifySuccess } from "@/lib/notify";
import { useEmployeeStore } from "@/store/employee-store";
import type { Project } from "@/types/project";

function slugifyId(input: string) {
  const base = input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  return base.length > 0 ? base.slice(0, 24) : "";
}

function CreateProjectDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { t } = useI18n();
  const createProject = useEmployeeStore((s) => s.createProject);
  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    const id = slugifyId(trimmed) || crypto.randomUUID();

    const result = createProject({ id, name: trimmed, description, groups: [] });
    if (!result.ok) {
      notifyError(t(result.error));
      return;
    }
    notifySuccess(t("toastProjectCreated"), trimmed);
    setName("");
    setDescription("");
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-[var(--foreground)]">
            {t("addProject")}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="grid gap-4">
          <div className="grid gap-2">
            <Label
              htmlFor="projectName"
              className="text-sm font-medium text-[var(--foreground)]"
            >
              {t("projectName")}
            </Label>
            <Input
              id="projectName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="text-sm text-[var(--foreground)]"
              placeholder={t("projectName")}
            />
          </div>
          <div className="grid gap-2">
            <Label
              htmlFor="projectDescription"
              className="text-sm font-medium text-[var(--foreground)]"
            >
              {t("projectDescription")}
            </Label>
            <Input
              id="projectDescription"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="text-sm text-[var(--foreground)]"
              placeholder={t("projectDescription")}
            />
          </div>
          <DialogFooter className="pt-2">
            <Button type="submit">{t("addProject")}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function ProjectsScreen() {
  const { t } = useI18n();
  const employees = useEmployeeStore((s) => s.employees);
  const projects = useEmployeeStore((s) => s.projects);
  const deleteProject = useEmployeeStore((s) => s.deleteProject);
  const createGroup = useEmployeeStore((s) => s.createGroup);
  const assignEmployeeToGroup = useEmployeeStore((s) => s.assignEmployeeToGroup);
  const removeEmployeeFromGroup = useEmployeeStore((s) => s.removeEmployeeFromGroup);

  const [selectedProjectId, setSelectedProjectId] = React.useState<string | null>(
    projects[0]?.id ?? null,
  );
  const [createDialogOpen, setCreateDialogOpen] = React.useState(false);
  const [newGroupName, setNewGroupName] = React.useState("");
  const [selectedGroupName, setSelectedGroupName] = React.useState<string | null>(null);
  const [selectedEmployeeId, setSelectedEmployeeId] = React.useState<string | null>(null);

  const selectedProject: Project | undefined = React.useMemo(
    () => projects.find((p) => p.id === selectedProjectId) ?? projects[0],
    [projects, selectedProjectId],
  );

  React.useEffect(() => {
    if (!selectedProject) {
      setSelectedGroupName(null);
      return;
    }
    if (!selectedGroupName || !selectedProject.groups.some((g) => g.groupName === selectedGroupName)) {
      setSelectedGroupName(selectedProject.groups[0]?.groupName ?? null);
    }
  }, [selectedProject, selectedGroupName]);

  function onCreateGroup() {
    if (!selectedProject) return;
    const trimmed = newGroupName.trim();
    if (!trimmed) return;
    const result = createGroup(selectedProject.id, trimmed);
    if (!result.ok) {
      notifyError(t(result.error));
      return;
    }
    notifySuccess(t("toastGroupCreated"), trimmed);
    setNewGroupName("");
  }

  function onAssignEmployee() {
    if (!selectedProject || !selectedGroupName || !selectedEmployeeId) return;
    const result = assignEmployeeToGroup(
      selectedProject.id,
      selectedGroupName,
      selectedEmployeeId,
    );
    if (!result.ok) {
      notifyError(t(result.error));
      return;
    }
    const emp = employees.find((e) => e.id === selectedEmployeeId);
    notifySuccess(t("toastEmployeeAssigned"), emp?.name);
    setSelectedEmployeeId(null);
  }

  function onRemoveFromGroup(groupName: string, employeeId: string) {
    if (!selectedProject) return;
    const result = removeEmployeeFromGroup(selectedProject.id, groupName, employeeId);
    if (!result.ok) {
      notifyError(t(result.error));
      return;
    }
    notifySuccess(t("toastEmployeeRemoved"));
  }

  const currentGroup = selectedProject?.groups.find(
    (g) => g.groupName === selectedGroupName,
  );

  const availableEmployees = React.useMemo(() => {
    if (!currentGroup) return employees;
    const inGroup = new Set(currentGroup.employees.map((e) => e.id));
    return employees.filter((e) => !inGroup.has(e.id));
  }, [employees, currentGroup]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight">{t("projects")}</h2>
          <p className="text-sm text-[var(--muted-foreground)]">
            {t("projectsDescription")}
          </p>
        </div>
        <Button type="button" onClick={() => setCreateDialogOpen(true)}>
          <Plus />
          {t("addProject")}
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {projects.map((project) => (
          <Card
            key={project.id}
            className={`cursor-pointer transition hover:border-[var(--focus)] ${
              selectedProject?.id === project.id
                ? "border-[var(--primary)]"
                : ""
            }`}
            onClick={() => setSelectedProjectId(project.id)}
          >
            <CardHeader className="flex flex-row items-start justify-between gap-2">
              <div className="space-y-1">
                <CardTitle className="truncate">{project.name}</CardTitle>
                <p className="line-clamp-2 text-xs text-[var(--muted-foreground)]">
                  {project.description}
                </p>
              </div>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                aria-label={t("deleteProject")}
                onClick={(e) => {
                  e.stopPropagation();
                  deleteProject(project.id);
                  notifySuccess(t("toastProjectDeleted"), project.name);
                }}
              >
                <Trash2 className="h-4 w-4 text-[var(--danger)]" />
              </Button>
            </CardHeader>
            <CardContent className="flex items-center justify-between text-xs text-[var(--muted-foreground)]">
              <span>
                {t("totalGroups")}: {project.groups.length}
              </span>
              <span className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                {project.groups.reduce((sum, g) => sum + g.employees.length, 0)}
              </span>
            </CardContent>
          </Card>
        ))}
      </div>

      <CreateProjectDialog open={createDialogOpen} onOpenChange={setCreateDialogOpen} />

      {selectedProject ? (
        <Card>
          <CardHeader>
            <CardTitle>{selectedProject.name}</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-[2fr,1fr]">
            <div className="space-y-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
                <div className="grid flex-1 gap-2">
                  <Label htmlFor="groupName">{t("groupName")}</Label>
                  <Input
                    id="groupName"
                    value={newGroupName}
                    onChange={(e) => setNewGroupName(e.target.value)}
                  />
                </div>
                <Button type="button" className="sm:w-auto" onClick={onCreateGroup}>
                  <Plus />
                  {t("addGroup")}
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                {selectedProject.groups.map((g) => (
                  <Button
                    key={g.groupName}
                    type="button"
                    variant={
                      selectedGroupName === g.groupName ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() => setSelectedGroupName(g.groupName)}
                  >
                    {g.groupName}
                  </Button>
                ))}
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-medium">{t("employees")}</h3>
                {currentGroup && currentGroup.employees.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {currentGroup.employees.map((emp) => (
                      <Badge
                        key={emp.id}
                        variant="secondary"
                        className="flex items-center gap-1"
                      >
                        {emp.name}
                        <button
                          type="button"
                          onClick={() => onRemoveFromGroup(currentGroup.groupName, emp.id)}
                          className="ml-1 text-xs text-[var(--danger)] hover:opacity-90"
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-[var(--muted-foreground)]">
                    {t("noEmployees")}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid gap-2">
                <Label>{t("assignEmployee")}</Label>
                <Select
                  value={selectedEmployeeId ?? ""}
                  onValueChange={(v) => setSelectedEmployeeId(v || null)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t("selectEmployee")} />
                  </SelectTrigger>
                  <SelectContent>
                    {availableEmployees.map((e) => (
                      <SelectItem key={e.id} value={e.id}>
                        {e.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button
                type="button"
                disabled={!selectedEmployeeId || !selectedGroupName}
                onClick={onAssignEmployee}
                className="w-full"
              >
                {t("assignEmployee")}
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}

