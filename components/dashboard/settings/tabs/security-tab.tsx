"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useI18n } from "@/i18n/provider";
import { notifySuccess } from "@/lib/notify";
import { useSettingsStore } from "@/store/settings-store";

export function SecurityTab() {
  const { t } = useI18n();
  const twoFactorEnabled = useSettingsStore((s) => s.twoFactorEnabled);
  const lastLoginAt = useSettingsStore((s) => s.lastLoginAt);
  const setTwoFactorEnabled = useSettingsStore((s) => s.setTwoFactorEnabled);
  const logoutAllDevices = useSettingsStore((s) => s.logoutAllDevices);

  const lastLoginText = React.useMemo(() => {
    try {
      return new Intl.DateTimeFormat(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(new Date(lastLoginAt));
    } catch {
      return lastLoginAt;
    }
  }, [lastLoginAt]);

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>{t("security")}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="flex items-center justify-between gap-4 rounded-md border border-zinc-200 p-4 dark:border-zinc-800">
            <div className="min-w-0">
              <div className="text-sm font-medium">{t("enable2fa")}</div>
            </div>
            <Switch
              checked={twoFactorEnabled}
              onCheckedChange={(v) => {
                setTwoFactorEnabled(v);
                notifySuccess(t("toastSaved"));
              }}
            />
          </div>

          <div className="flex items-center justify-between gap-4 rounded-md border border-zinc-200 p-4 dark:border-zinc-800">
            <div className="min-w-0">
              <div className="text-sm font-medium">{t("lastLogin")}</div>
              <div className="text-xs text-zinc-500 dark:text-zinc-400">{lastLoginText}</div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              type="button"
              variant="destructive"
              onClick={() => {
                logoutAllDevices();
                notifySuccess(t("toastSaved"));
              }}
            >
              {t("logoutAll")}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

