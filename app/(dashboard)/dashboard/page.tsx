"use client";

import { DashboardOverviewCards } from "@/components/dashboard/dashboard-overview-cards";
import { DashboardAnalytics } from "@/components/dashboard/dashboard-analytics";
export default function DashboardPage() {
  return (
    <div className="space-y-3.5">
      <DashboardOverviewCards />
      <DashboardAnalytics />
    </div>
  );
}

