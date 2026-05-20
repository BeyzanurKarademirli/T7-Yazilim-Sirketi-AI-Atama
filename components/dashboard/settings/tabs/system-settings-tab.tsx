"use client";

import * as React from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useI18n } from "@/i18n/provider";
import { useSettingsStore, type RoleName } from "@/store/settings-store";

const allRoles: RoleName[] = ["Admin", "Manager", "Employee"];

export function SystemSettingsTab() {
  const { t } = useI18n();
  const enabledRoles = useSettingsStore((s) => s.enabledRoles);
  const cardsVisibility = useSettingsStore((s) => s.cardsVisibility);
  const setEnabledRoles = useSettingsStore((s) => s.setEnabledRoles);
  const setCardVisibility = useSettingsStore((s) => s.setCardVisibility);

  function toggleRole(role: RoleName, enabled: boolean) {
    const next = enabled
      ? Array.from(new Set([...enabledRoles, role]))
      : enabledRoles.filter((r) => r !== role);
    setEnabledRoles(next);
  }

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>{t("manageRoles")}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3">
          {allRoles.map((role) => (
            <div
              key={role}
              className="flex items-center justify-between gap-4 rounded-md border border-zinc-200 p-4 dark:border-zinc-800"
            >
              <div className="text-sm font-medium">{role}</div>
              <Switch
                checked={enabledRoles.includes(role)}
                onCheckedChange={(v) => toggleRole(role, v)}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("cardsVisibility")}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3">
          <div className="flex items-center justify-between gap-4 rounded-md border border-zinc-200 p-4 dark:border-zinc-800">
            <div className="text-sm font-medium">{t("totalEmployees")}</div>
            <Switch
              checked={cardsVisibility.totalEmployees}
              onCheckedChange={(v) => setCardVisibility("totalEmployees", v)}
            />
          </div>
          <div className="flex items-center justify-between gap-4 rounded-md border border-zinc-200 p-4 dark:border-zinc-800">
            <div className="text-sm font-medium">{t("totalSalary")}</div>
            <Switch
              checked={cardsVisibility.totalSalary}
              onCheckedChange={(v) => setCardVisibility("totalSalary", v)}
            />
          </div>
          <div className="flex items-center justify-between gap-4 rounded-md border border-zinc-200 p-4 dark:border-zinc-800">
            <div className="text-sm font-medium">{t("departments")}</div>
            <Switch
              checked={cardsVisibility.departments}
              onCheckedChange={(v) => setCardVisibility("departments", v)}
            />
          </div>
          <div className="flex items-center justify-between gap-4 rounded-md border border-zinc-200 p-4 dark:border-zinc-800">
            <div className="text-sm font-medium">{t("averageSalary")}</div>
            <Switch
              checked={cardsVisibility.averageSalary}
              onCheckedChange={(v) => setCardVisibility("averageSalary", v)}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

