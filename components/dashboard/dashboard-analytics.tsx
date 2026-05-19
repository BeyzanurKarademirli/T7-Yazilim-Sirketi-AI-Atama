"use client";

import * as React from "react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useI18n } from "@/i18n/provider";
import { useEmployeeStore } from "@/store/employee-store";

export function DashboardAnalytics() {
  const { t } = useI18n();
  const employees = useEmployeeStore((s) => s.employees);

  const rows = React.useMemo(() => {
    return employees.map((e) => {
      const max = e.maxCapacity ?? 5;
      const active = e.activeTaskCount ?? 0;
      const pct = max > 0 ? Math.round((active / max) * 100) : 0;
      const barColor = pct >= 80 ? "var(--danger)" : pct >= 60 ? "var(--amber)" : "var(--teal)";

      let status: React.ReactNode = null;
      if (e.available === false) {
        status = (
          <Badge className="shrink-0 border-0 bg-[rgba(255,78,78,0.12)] text-[#cc0000]">
            {t("onLeave")}
          </Badge>
        );
      } else if (pct >= 80) {
        status = (
          <Badge className="shrink-0 border-0 bg-[rgba(255,78,78,0.12)] text-[#cc0000]">
            {t("criticalLoad")}
          </Badge>
        );
      } else if (pct >= 60) {
        status = (
          <Badge className="shrink-0 border-0 bg-[rgba(255,179,71,0.15)] text-[#a06200]">
            {t("busyLoad")}
          </Badge>
        );
      }

      return {
        id: e.id,
        name: e.name.split(" ")[0] ?? e.name,
        active,
        max,
        pct,
        barColor,
        status,
      };
    });
  }, [employees, t]);

  return (
    <Card className="rounded-[var(--border-radius-lg)] border-[1.5px] border-[var(--border)] shadow-none">
      <CardContent className="p-[18px]">
        <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.05em] text-[#5a6a85]">
          {t("workloadDistribution")}
        </p>
        <div>
          {rows.map((row) => (
            <div key={row.id} className="mb-2.5 flex items-center gap-2.5 last:mb-0">
              <span className="w-[90px] shrink-0 text-xs font-medium text-[var(--foreground)]">
                {row.name}
              </span>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-[var(--border)]">
                <div
                  className="h-full rounded-full transition-[width] duration-700 ease-out"
                  style={{ width: `${row.pct}%`, background: row.barColor }}
                />
              </div>
              <span className="w-9 shrink-0 text-right text-xs text-[#5a6a85]">
                {row.active}/{row.max}
              </span>
              {row.status}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
