"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useI18n } from "@/i18n/provider";
import { useAssignmentStore } from "@/store/assignment-store";

export function AssignmentLogScreen() {
  const { t } = useI18n();
  const logs = useAssignmentStore((s) => s.logs);

  return (
    <Card className="rounded-[var(--border-radius-lg)] border-[1.5px] border-[var(--border)] shadow-none">
      <CardContent className="p-[18px]">
        <p className="mb-3 text-[11px] font-medium uppercase tracking-wide text-[#5a6a85]">
          {t("logImmutable")}
        </p>
        {logs.length === 0 ? (
          <p className="py-6 text-center text-sm text-[#5a6a85]">{t("logEmpty")}</p>
        ) : (
          <ul className="divide-y divide-[var(--border)]">
            {logs.map((log) => (
              <li key={log.id} className="flex flex-wrap items-center gap-2.5 py-2.5">
                <Badge
                  className={
                    log.decision === "accepted"
                      ? "border-0 bg-[rgba(0,201,167,0.12)] text-[#007a67]"
                      : "border-0 bg-[rgba(255,78,78,0.12)] text-[#cc0000]"
                  }
                >
                  {log.decision === "accepted" ? t("accept") : t("reject")}
                </Badge>
                <span className="flex-1 text-sm text-[var(--foreground)]">
                  {log.taskTitle} → <strong>{log.employeeName}</strong>
                </span>
                <span className="text-xs text-[#5a6a85]">
                  {t("scoreLabel")}: {log.score} · #{log.rank} · {log.time}
                </span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
