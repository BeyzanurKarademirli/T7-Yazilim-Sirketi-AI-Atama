"use client";

import { Plus, X } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useI18n } from "@/i18n/provider";
import { SKILL_CATEGORIES } from "@/lib/employee-utils";
import type { EmployeeSkill } from "@/types/employee";

export type SkillRow = { id: string; cat: EmployeeSkill["cat"]; lv: number };

function newRow(cat: EmployeeSkill["cat"] = "frontend", lv = 5): SkillRow {
  return { id: `sk-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, cat, lv };
}

export function skillsToRows(skills: EmployeeSkill[]): SkillRow[] {
  if (!skills.length) return [newRow()];
  return skills.map((s) => newRow(s.cat, s.lv));
}

export function rowsToSkills(rows: SkillRow[]): EmployeeSkill[] {
  return rows.map((r) => ({ cat: r.cat, lv: r.lv }));
}

export function SkillInputRows({
  rows,
  onChange,
}: {
  rows: SkillRow[];
  onChange: (rows: SkillRow[]) => void;
}) {
  const { t } = useI18n();

  return (
    <div>
      {rows.map((row) => (
        <div key={row.id} className="mb-2 flex items-center gap-2">
          <Select
            value={row.cat}
            onValueChange={(cat) =>
              onChange(
                rows.map((r) =>
                  r.id === row.id ? { ...r, cat: cat as EmployeeSkill["cat"] } : r,
                ),
              )
            }
          >
            <SelectTrigger className="h-8 w-[110px] border-[1.5px] border-[var(--border)] text-xs shadow-none">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SKILL_CATEGORIES.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <input
            type="range"
            min={1}
            max={10}
            value={row.lv}
            className="h-1.5 flex-1 accent-[var(--teal)]"
            onChange={(e) =>
              onChange(
                rows.map((r) =>
                  r.id === row.id ? { ...r, lv: Number(e.target.value) } : r,
                ),
              )
            }
          />
          <span className="w-[22px] shrink-0 text-right text-[13px] font-medium text-[var(--teal)]">
            {row.lv}
          </span>
          <button
            type="button"
            className="shrink-0 border-0 bg-transparent p-0.5 text-[var(--danger)]"
            aria-label={t("deleteEmployee")}
            onClick={() => {
              const next = rows.filter((r) => r.id !== row.id);
              onChange(next.length ? next : [newRow()]);
            }}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
      <button
        type="button"
        className="mt-1 inline-flex h-[30px] items-center gap-1 rounded-[var(--border-radius-md)] border border-dashed border-[var(--muted-foreground)] bg-transparent px-2.5 text-xs text-[#5a6a85] hover:border-[var(--teal)] hover:text-[var(--teal)]"
        onClick={() => onChange([...rows, newRow()])}
      >
        <Plus className="h-3.5 w-3.5" />
        {t("addSkillRow")}
      </button>
    </div>
  );
}
