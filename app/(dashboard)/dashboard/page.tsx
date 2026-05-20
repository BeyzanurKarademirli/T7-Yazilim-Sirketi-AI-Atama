"use client";

import { DashboardOverviewCards } from "@/components/dashboard/dashboard-overview-cards";
<<<<<<< HEAD
import { DashboardAnalytics } from "@/components/dashboard/dashboard-analytics";
export default function DashboardPage() {
  return (
    <div className="space-y-3.5">
      <DashboardOverviewCards />
      <DashboardAnalytics />
=======
import { useI18n } from "@/i18n/provider";

export default function DashboardPage() {
  const { t } = useI18n();
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight">
          {t("dashboard")}
        </h2>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          {t("overview")}
        </p>
      </div>

      <DashboardOverviewCards />
>>>>>>> a2ebc7a252b7ad714759a736da8116988d61fab8
    </div>
  );
}

