import * as React from "react";

import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";
import { DashboardTopNav } from "@/components/layout/dashboard-topnav";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-dvh overflow-hidden bg-[var(--background)] text-[var(--foreground)]">
      <div className="flex h-full min-w-0">
        <DashboardSidebar className="hidden md:flex" />

        <div className="flex min-w-0 flex-1 flex-col">
          <DashboardTopNav />

          <main className="min-h-0 flex-1 overflow-y-auto p-4 md:p-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}

