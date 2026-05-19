"use client";

import * as React from "react";

import { LoginScreen } from "@/components/auth/login-screen";
import { useStoreHydration } from "@/lib/use-store-hydration";
import { useAuthStore } from "@/store/auth-store";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const hydrated = useStoreHydration(useAuthStore.persist);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  if (!hydrated) {
    return (
      <div className="grid min-h-dvh place-items-center bg-[var(--background)]">
        <div className="h-8 w-8 animate-pulse rounded-full bg-[var(--border)]" aria-hidden />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  return <>{children}</>;
}
