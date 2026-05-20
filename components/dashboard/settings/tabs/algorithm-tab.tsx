"use client";

import * as React from "react";
import { Star } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useI18n } from "@/i18n/provider";
import { notifySuccess } from "@/lib/notify";
import { useAssignmentStore } from "@/store/assignment-store";

export function AlgorithmTab() {
  const { t } = useI18n();
  const skillWeight = useAssignmentStore((s) => s.skillWeight);
  const workWeight = useAssignmentStore((s) => s.workWeight);
  const setWeights = useAssignmentStore((s) => s.setWeights);

  const [skill, setSkill] = React.useState(skillWeight);

  React.useEffect(() => setSkill(skillWeight), [skillWeight]);

  function onSkillChange(value: number) {
    setSkill(value);
    setWeights(value, 100 - value);
  }

  return (
    <Card className="rounded-[var(--border-radius-lg)] border-[1.5px] border-[var(--border)] shadow-none">
      <CardContent className="space-y-4 p-[18px]">
        <p className="text-[11px] font-medium uppercase tracking-wide text-[#5a6a85]">
          {t("algorithmWeights")}
        </p>
        <WeightRow
          icon={<Star className="h-4 w-4 text-[var(--teal)]" />}
          label={t("skillWeightLabel")}
          value={skill}
          onChange={onSkillChange}
          display={`%${skill}`}
        />
        <WeightRow
          icon={<Star className="h-4 w-4 text-[var(--blue)]" />}
          label={t("workWeightLabel")}
          value={workWeight}
          onChange={(v) => onSkillChange(100 - v)}
          display={`%${workWeight}`}
        />
        <p className="rounded-md bg-[var(--surface-muted)] px-3.5 py-2.5 text-xs text-[#5a6a85]">
          {t("weightsMustSum")}
        </p>
        <Button
          type="button"
          className="border-[var(--primary)] bg-[var(--primary)] text-white"
          onClick={() => notifySuccess(t("toastSaved"))}
        >
          {t("saveChanges")}
        </Button>
      </CardContent>
    </Card>
  );
}

function WeightRow({
  icon,
  label,
  value,
  onChange,
  display,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  onChange: (v: number) => void;
  display: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex w-40 items-center gap-1.5 text-sm text-[var(--foreground)]">
        {icon}
        {label}
      </span>
      <input
        type="range"
        min={20}
        max={80}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="flex-1"
      />
      <span className="w-12 text-right text-sm font-medium text-[var(--teal)]">{display}</span>
    </div>
  );
}
