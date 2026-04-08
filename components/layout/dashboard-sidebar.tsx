"use client";

import * as React from "react";
import { Building2, FolderKanban, LayoutDashboard, Settings, Users } from "lucide-react";

import { cn } from "@/lib/utils";
import { DashboardNav, type DashboardNavItem } from "@/components/layout/dashboard-nav";
import { useI18n } from "@/i18n/provider";
import { useSettingsStore } from "@/store/settings-store";

const itemDefs = [
  { titleKey: "dashboard", href: "/dashboard", icon: LayoutDashboard },
  { titleKey: "employees", href: "/dashboard/employees", icon: Users },
  { titleKey: "departments", href: "/dashboard/departments", icon: Building2 },
  { titleKey: "projects", href: "/dashboard/projects", icon: FolderKanban },
  { titleKey: "settings", href: "/dashboard/settings", icon: Settings },
] as const;

export function DashboardSidebar({
  className,
  onNavigate,
}: {
  className?: string;
  onNavigate?: () => void;
}) {
  const { t } = useI18n();
  const collapsed = useSettingsStore((s) => s.sidebarCollapsed);
  const items = React.useMemo<DashboardNavItem[]>(
    () => itemDefs.map((d) => ({ title: t(d.titleKey), href: d.href, icon: d.icon })),
    [t],
  );

  return (
    <aside
      className={cn(
        "flex h-full shrink-0 flex-col border-r border-[var(--border)] bg-gradient-to-b from-[var(--sidebar-start)] to-[var(--sidebar-end)] text-white",
        collapsed ? "w-[72px]" : "w-64",
        className,
      )}
    >
      <div className="flex h-14 items-center gap-2 border-b border-white/15 px-4">
        <div className="grid h-8 w-8 place-items-center rounded-md bg-white/15 text-sm font-semibold text-white">
          EM
        </div>
        <div className={cn("leading-tight", collapsed && "hidden")}>
          <div className="text-sm font-semibold text-white">
            {t("brandTitle")}
          </div>
          <div className="text-xs text-slate-200/80">
            {t("brandSubtitle")}
          </div>
        </div>
      </div>

      <div className="px-3 py-4">
        <DashboardNav
          items={items}
          onNavigate={onNavigate}
          className={collapsed ? "[&_span]:hidden" : undefined}
        />
      </div>
    </aside>
  );
}

