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
        "flex h-full shrink-0 flex-col border-r border-zinc-200 bg-white dark:border-gray-700 dark:bg-gray-800",
        collapsed ? "w-[72px]" : "w-64",
        className,
      )}
    >
      <div className="flex h-14 items-center gap-2 border-b border-zinc-200 px-4 dark:border-zinc-800">
        <div className="h-8 w-8 rounded-md bg-zinc-900 text-zinc-50 dark:bg-zinc-50 dark:text-zinc-900 grid place-items-center text-sm font-semibold">
          EM
        </div>
        <div className={cn("leading-tight", collapsed && "hidden")}>
          <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
            {t("brandTitle")}
          </div>
          <div className="text-xs text-zinc-500 dark:text-zinc-400">
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

