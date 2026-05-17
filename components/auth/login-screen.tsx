"use client";

import * as React from "react";
import { Lock, LogIn, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useI18n } from "@/i18n/provider";
import { notifyError } from "@/lib/notify";
import { useAuthStore } from "@/store/auth-store";
export function LoginScreen() {
  const { t } = useI18n();
  const login = useAuthStore((s) => s.login);

  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    const ok = login(username.trim(), password);
    if (!ok) {
      notifyError(t("errorInvalidCredentials"));
    }

    setSubmitting(false);
  }

  return (
    <div className="grid min-h-dvh place-items-center bg-[var(--background)] px-4 py-10">
      <Card className="w-full max-w-md border-[var(--border)] shadow-lg">
        <CardHeader className="space-y-3 text-center">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-[var(--primary)] text-lg font-semibold text-white">
            EM
          </div>
          <div className="space-y-1">
            <CardTitle className="text-xl">{t("loginTitle")}</CardTitle>
            <p className="text-sm text-[var(--muted-foreground)]">{t("loginSubtitle")}</p>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="loginUsername">{t("username")}</Label>
              <div className="relative">
                <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted-foreground)]" />
                <Input
                  id="loginUsername"
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="loginPassword">{t("password")}</Label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted-foreground)]" />
                <Input
                  id="loginPassword"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            <p className="text-xs text-[var(--muted-foreground)]">{t("loginDefaultHint")}</p>

            <Button
              type="submit"
              className="w-full"
              disabled={submitting || !username.trim() || !password}
            >
              <LogIn className="h-4 w-4" />
              {t("signIn")}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
