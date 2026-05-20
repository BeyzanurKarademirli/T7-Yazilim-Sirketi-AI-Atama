"use client";

import * as React from "react";
<<<<<<< HEAD
import {
  Bot,
  Building2,
  Cpu,
  FolderKanban,
  LayoutDashboard,
  Settings,
  UserCheck,
  Users,
} from "lucide-react";
=======
import { Building2, FolderKanban, LayoutDashboard, Settings, Users } from "lucide-react";
>>>>>>> a2ebc7a252b7ad714759a736da8116988d61fab8

import { cn } from "@/lib/utils";
import { DashboardNav, type DashboardNavItem } from "@/components/layout/dashboard-nav";
import { useI18n } from "@/i18n/provider";
import { useSettingsStore } from "@/store/settings-store";

const itemDefs = [
<<<<<<< HEAD
  { titleKey: "navAssignTask", href: "/dashboard/tasks", icon: UserCheck },
=======
>>>>>>> a2ebc7a252b7ad714759a736da8116988d61fab8
  { titleKey: "dashboard", href: "/dashboard", icon: LayoutDashboard },
  { titleKey: "employees", href: "/dashboard/employees", icon: Users },
  { titleKey: "departments", href: "/dashboard/departments", icon: Building2 },
  { titleKey: "projects", href: "/dashboard/projects", icon: FolderKanban },
<<<<<<< HEAD
  { titleKey: "askAi", href: "/dashboard/ask-ai", icon: Bot },
=======
  { titleKey: "settings", href: "/dashboard/settings", icon: Settings },
>>>>>>> a2ebc7a252b7ad714759a736da8116988d61fab8
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
<<<<<<< HEAD
  const mainItems = React.useMemo<DashboardNavItem[]>(
    () => itemDefs.map((d) => ({ title: t(d.titleKey), href: d.href, icon: d.icon })),
    [t],
  );
  const settingsItem = React.useMemo<DashboardNavItem>(
    () => ({ title: t("settings"), href: "/dashboard/settings", icon: Settings }),
    [t],
  );
=======
  const items = React.useMemo<DashboardNavItem[]>(
    () => itemDefs.map((d) => ({ title: t(d.titleKey), href: d.href, icon: d.icon })),
    [t],
  );
>>>>>>> a2ebc7a252b7ad714759a736da8116988d61fab8

  return (
    <aside
      className={cn(
<<<<<<< HEAD
        "flex h-full shrink-0 flex-col bg-[var(--sidebar-start)] text-white",
        collapsed ? "w-[72px]" : "w-[210px]",
        className,
      )}
    >
      <SidebarLogo collapsed={collapsed} title={t("brandTitleAi")} subtitle={t("brandSubtitleAi")} />

      <div className="flex-1 px-0 py-2.5">
        <DashboardNav
          items={mainItems}
          onNavigate={onNavigate}
          className={collapsed ? "[&_span]:hidden" : undefined}
          variant="ai"
        />
      </div>

      <div className="mt-auto border-t border-white/10 pt-2">
        <DashboardNav
          items={[settingsItem]}
          onNavigate={onNavigate}
          className={collapsed ? "[&_span]:hidden" : undefined}
          variant="ai"
=======
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
>>>>>>> a2ebc7a252b7ad714759a736da8116988d61fab8
        />
      </div>
    </aside>
  );
}

<<<<<<< HEAD
function SidebarLogo({
  collapsed,
  title,
  subtitle,
}: {
  collapsed: boolean;
  title: string;
  subtitle: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 border-b border-white/10 px-[18px] py-5",
        collapsed && "justify-center px-2",
      )}
    >
      <Cpu className="h-[17px] w-[17px] shrink-0 text-[var(--teal)]" aria-hidden />
      {!collapsed ? (
        <div className="min-w-0 leading-tight">
          <div className="text-sm font-medium text-white">{title}</div>
          <div className="mt-0.5 text-[11px] text-white/40">{subtitle}</div>
        </div>
      ) : null}
    </div>
  );
}
=======
>>>>>>> a2ebc7a252b7ad714759a736da8116988d61fab8
