<<<<<<< HEAD
"use client";

import * as React from "react";

import { AuthGuard } from "@/components/auth/auth-guard";
=======
import * as React from "react";

>>>>>>> a2ebc7a252b7ad714759a736da8116988d61fab8
import { DashboardShell } from "@/components/layout/dashboard-shell";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
<<<<<<< HEAD
  return (
    <AuthGuard>
      <DashboardShell>{children}</DashboardShell>
    </AuthGuard>
  );
}
=======
  return <DashboardShell>{children}</DashboardShell>;
}

>>>>>>> a2ebc7a252b7ad714759a736da8116988d61fab8
