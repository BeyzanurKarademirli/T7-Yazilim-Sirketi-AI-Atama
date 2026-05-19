"use client";

import * as React from "react";
import { ClipboardList, Cpu, LayoutDashboard, Settings, UserCheck, Users } from "lucide-react";

import { cn } from "@/lib/utils";
import { DashboardNav, type DashboardNavItem } from "@/components/layout/dashboard-nav";
import { useI18n } from "@/i18n/provider";
import { useSettingsStore } from "@/store/settings-store";

const itemDefs = [
  { titleKey: "navAssignTask", href: "/dashboard/tasks", icon: UserCheck },
  { titleKey: "dashboard", href: "/dashboard", icon: LayoutDashboard },
  { titleKey: "employees", href: "/dashboard/employees", icon: Users },
  { titleKey: "navAssignmentLog", href: "/dashboard/assignment-log", icon: ClipboardList },
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
  const mainItems = React.useMemo<DashboardNavItem[]>(
    () => itemDefs.map((d) => ({ title: t(d.titleKey), href: d.href, icon: d.icon })),
    [t],
  );
  const settingsItem = React.useMemo<DashboardNavItem>(
    () => ({ title: t("settings"), href: "/dashboard/settings", icon: Settings }),
    [t],
  );

  return (
    <aside
      className={cn(
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
        />
      </div>
    </aside>
  );
}

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
