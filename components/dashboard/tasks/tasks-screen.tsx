"use client";

import * as React from "react";
import { Bot, Check, Sparkles, X } from "lucide-react";

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
import { AI_RATIONALE, scoreEmployee } from "@/lib/assignment-score";
import { departmentDisplayName, employeeInitials, topSkillLevel } from "@/lib/employee-utils";
import { useI18n } from "@/i18n/provider";
import { useAssignmentStore } from "@/store/assignment-store";
import { useEmployeeStore } from "@/store/employee-store";
import { useTaskStore } from "@/store/task-store";
import type { AiCandidate, TaskCategory } from "@/types/assignment";
import type { TaskPriority } from "@/types/task";

const AVATAR_COLORS = [
  "bg-[rgba(0,201,167,0.15)] text-[#007a67]",
  "bg-[rgba(74,158,255,0.15)] text-[#1666cc]",
  "bg-[rgba(255,179,71,0.15)] text-[#a06200]",
  "bg-[rgba(147,112,219,0.15)] text-[#5b3fa8]",
  "bg-[rgba(255,78,78,0.12)] text-[#cc0000]",
];

const RANK_BORDER = ["border-l-[3px] border-l-[var(--teal)]", "border-l-[3px] border-l-[var(--blue)]", "border-l-[3px] border-l-[var(--amber)]"];

export function TasksScreen() {
  const { t } = useI18n();
  const employees = useEmployeeStore((s) => s.employees);
  const addTask = useTaskStore((s) => s.addTask);
  const skillWeight = useAssignmentStore((s) => s.skillWeight);
  const workWeight = useAssignmentStore((s) => s.workWeight);
  const addLog = useAssignmentStore((s) => s.addLog);

  const [taskTitle, setTaskTitle] = React.useState("React dashboard bileşeni");
  const [category, setCategory] = React.useState<TaskCategory>("frontend");
  const [priority, setPriority] = React.useState("high");
  const [description, setDescription] = React.useState("Dashboard için React bileşeni yazımı");
  const [candidates, setCandidates] = React.useState<AiCandidate[]>([]);
  const [unavailableNames, setUnavailableNames] = React.useState<string[]>([]);
  const [assignedIds, setAssignedIds] = React.useState<Set<string>>(new Set());
  const [rejectedIds, setRejectedIds] = React.useState<Set<string>>(new Set());
  const [flash, setFlash] = React.useState<string | null>(null);

  const sw = skillWeight / 100;
  const ww = workWeight / 100;

  const runAI = React.useCallback(() => {
    const unavailable = employees.filter((e) => e.available === false);
    setUnavailableNames(unavailable.map((e) => e.name));
    setAssignedIds(new Set());
    setRejectedIds(new Set());

    const scored = employees
      .filter((e) => e.available !== false && topSkillLevel(e) > 0)
      .map((e, idx) => {
        const s = scoreEmployee(e, sw, ww);
        return { employee: e, ...s, idx };
      })
      .filter((row) => row.total >= 0.3)
      .sort((a, b) => b.total - a.total || a.employee.name.localeCompare(b.employee.name, "tr"))
      .slice(0, 3);

    const next: AiCandidate[] = scored.map((row, i) => ({
      employeeId: row.employee.id,
      name: row.employee.name,
      init: row.employee.init ?? employeeInitials(row.employee.name),
      departmentLabel: departmentDisplayName(row.employee.department),
      active: row.employee.activeTaskCount ?? 0,
      max: row.employee.maxCapacity ?? 5,
      rank: i + 1,
      skillPct: Math.round(row.skillRatio * 100),
      workloadPct: Math.round(row.workloadRatio * 100),
      total: row.total,
      rationale: AI_RATIONALE[i] ?? AI_RATIONALE[2]!,
    }));
    setCandidates(next);
  }, [employees, sw, ww]);

  React.useEffect(() => {
    const id = window.setTimeout(() => runAI(), 200);
    return () => window.clearTimeout(id);
  }, [runAI]);

  function decide(candidate: AiCandidate, decision: "accepted" | "rejected") {
    addLog({
      taskTitle: taskTitle.trim() || t("taskTitle"),
      employeeName: candidate.name,
      employeeId: candidate.employeeId,
      rank: candidate.rank,
      score: Number(candidate.total.toFixed(2)),
      decision,
    });

    if (decision === "accepted") {
      setAssignedIds((prev) => new Set(prev).add(candidate.employeeId));
      const emp = employees.find((e) => e.id === candidate.employeeId);
      if (emp) {
        addTask({
          title: taskTitle.trim(),
          assigneeId: emp.id,
          assigneeName: emp.name,
          dueDate: new Date().toISOString().slice(0, 10),
          status: "todo",
          priority: priority === "critical" ? "high" : priority === "medium" ? "medium" : "high",
        });
      }
      setFlash(`${candidate.name} ${t("assignedFlash")}`);
    } else {
      setRejectedIds((prev) => new Set(prev).add(candidate.employeeId));
      setFlash(`${candidate.name} ${t("rejectedFlash")}`);
    }
    window.setTimeout(() => setFlash(null), 3000);
  }

  const visibleCandidates = candidates.filter((c) => !rejectedIds.has(c.employeeId));

  return (
    <div className="space-y-3.5">
      <Card className="rounded-[var(--border-radius-lg)] border-[1.5px] border-[var(--border)] shadow-none">
        <CardContent className="p-[18px]">
          <p className="mb-3 text-[11px] font-medium uppercase tracking-wide text-[#5a6a85]">
            {t("taskInfoSection")}
          </p>
          <div className="mb-2.5 grid gap-2.5 sm:grid-cols-2">
            <Field label={t("taskTitle")}>
              <Input value={taskTitle} onChange={(e) => setTaskTitle(e.target.value)} className="h-[34px]" />
            </Field>
            <Field label={t("taskCategory")}>
              <Select value={category} onValueChange={(v) => setCategory(v as TaskCategory)}>
                <SelectTrigger className="h-[34px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="frontend">Frontend</SelectItem>
                  <SelectItem value="backend">Backend</SelectItem>
                  <SelectItem value="devops">DevOps</SelectItem>
                  <SelectItem value="data">Data</SelectItem>
                </SelectContent>
              </Select>
            </Field>
          </div>
          <div className="mb-2.5 grid gap-2.5 sm:grid-cols-2">
            <Field label={t("priority")}>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger className="h-[34px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">{t("priorityHigh")}</SelectItem>
                  <SelectItem value="critical">{t("priorityCritical")}</SelectItem>
                  <SelectItem value="medium">{t("priorityMedium")}</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field label={t("taskDescription")}>
              <Input value={description} onChange={(e) => setDescription(e.target.value)} className="h-[34px]" />
            </Field>
          </div>
          <Button
            type="button"
            className="h-[34px] border-[var(--primary)] bg-[var(--primary)] text-white hover:bg-[var(--primary-soft)]"
            onClick={runAI}
          >
            <Sparkles className="h-4 w-4" />
            {t("getAiSuggestion")}
          </Button>
        </CardContent>
      </Card>

      {flash ? (
        <div className="mb-3 flex items-center gap-1.5 rounded-md border border-[rgba(0,201,167,0.3)] bg-[rgba(0,201,167,0.1)] px-3 py-2 text-xs text-[#007a67]">
          <Check className="h-3.5 w-3.5" />
          {flash}
        </div>
      ) : null}

      {unavailableNames.length > 0 ? (
        <div className="mb-3 flex items-center gap-1.5 rounded-md border border-[rgba(255,179,71,0.3)] bg-[rgba(255,179,71,0.1)] px-3 py-2 text-xs text-[#a06200]">
          {t("unavailableRemoved")}: {unavailableNames.join(", ")}
        </div>
      ) : null}

      {visibleCandidates.length > 0 ? (
        <p className="mb-2.5 text-[11px] font-medium uppercase tracking-wide text-[#5a6a85]">
          {t("aiSuggestions")} — {visibleCandidates.length} {t("candidateCount")}
        </p>
      ) : null}

      <div className="space-y-2.5">
        {visibleCandidates.map((c, i) => {
          const assigned = assignedIds.has(c.employeeId);
          return (
            <div
              key={c.employeeId}
              className={`flex items-center gap-3.5 rounded-[var(--border-radius-lg)] border-[1.5px] border-[var(--border)] bg-[var(--surface)] p-3.5 transition-colors hover:border-[var(--teal)] ${RANK_BORDER[i] ?? ""} ${assigned ? "border-[var(--teal)] bg-[rgba(0,201,167,0.05)]" : ""}`}
            >
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[13px] font-medium ${AVATAR_COLORS[i % 5]}`}
              >
                {c.init}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-1">
                  <span className="text-sm font-medium text-[var(--foreground)]">{c.name}</span>
                  <Badge variant="secondary" className={rankBadgeClass(i)}>
                    #{c.rank}
                  </Badge>
                  {assigned ? (
                    <Badge className="border-0 bg-[rgba(0,201,167,0.12)] text-[#007a67]">
                      <Check className="mr-0.5 h-3 w-3" />
                      {t("assignedBadge")}
                    </Badge>
                  ) : null}
                </div>
                <p className="mt-0.5 text-xs text-[#5a6a85]">
                  {c.departmentLabel} · {t("activeTasks")}: {c.active}/{c.max}
                </p>
                <p className="mt-1 text-[11px] italic text-[#5a6a85]">
                  <Bot className="mr-0.5 inline h-3 w-3" />
                  {c.rationale}
                </p>
              </div>
              <ScoreBars skillPct={c.skillPct} workloadPct={c.workloadPct} total={c.total} />
              {!assigned ? (
                <div className="flex shrink-0 flex-col gap-1.5">
                  <Button
                    type="button"
                    size="sm"
                    className="h-[30px] border-[var(--teal)] bg-[var(--teal)] text-xs text-white hover:bg-[var(--teal-soft)]"
                    onClick={() => decide(c, "accepted")}
                  >
                    <Check className="h-3.5 w-3.5" />
                    {t("accept")}
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="h-[30px] border-[rgba(255,78,78,0.25)] bg-[rgba(255,78,78,0.1)] text-xs text-[var(--danger)] hover:bg-[rgba(255,78,78,0.2)]"
                    onClick={() => decide(c, "rejected")}
                  >
                    <X className="h-3.5 w-3.5" />
                    {t("reject")}
                  </Button>
                </div>
              ) : null}
            </div>
          );
        })}
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

function ScoreBars({
  skillPct,
  workloadPct,
  total,
}: {
  skillPct: number;
  workloadPct: number;
  total: number;
}) {
  return (
    <div className="w-[130px] shrink-0">
      <div className="flex justify-between text-[11px] text-[#5a6a85]">
        <span>Yetkinlik</span>
        <span>{skillPct}%</span>
      </div>
      <div className="mb-1 h-[5px] overflow-hidden rounded-full bg-[var(--border)]">
        <div className="h-full rounded-full bg-[var(--teal)]" style={{ width: `${skillPct}%` }} />
      </div>
      <div className="mb-0.5 flex justify-between text-[11px] text-[#5a6a85]">
        <span>İş yükü</span>
        <span>{workloadPct}%</span>
      </div>
      <div className="mb-1 h-[5px] overflow-hidden rounded-full bg-[var(--border)]">
        <div className="h-full rounded-full bg-[var(--blue)]" style={{ width: `${workloadPct}%` }} />
      </div>
      <p className="text-right text-lg font-medium text-[var(--foreground)]">{total.toFixed(2)}</p>
    </div>
  );
}

function rankBadgeClass(i: number) {
  if (i === 0) return "border-0 bg-[rgba(0,201,167,0.12)] text-[#007a67]";
  if (i === 1) return "border-0 bg-[rgba(74,158,255,0.12)] text-[#1666cc]";
  return "border-0 bg-[rgba(255,179,71,0.15)] text-[#a06200]";
}