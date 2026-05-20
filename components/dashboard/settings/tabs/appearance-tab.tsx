"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useI18n } from "@/i18n/provider";
import { notifySuccess } from "@/lib/notify";
import { useSettingsStore, type FontSize, type ThemeMode } from "@/store/settings-store";

export function AppearanceTab() {
  const { t } = useI18n();
  const theme = useSettingsStore((s) => s.theme);
  const fontSize = useSettingsStore((s) => s.fontSize);
  const sidebarCollapsed = useSettingsStore((s) => s.sidebarCollapsed);
  const setAppearance = useSettingsStore((s) => s.setAppearance);

  const fontLabel: Record<FontSize, string> = {
    sm: t("fontSizeSm"),
    md: t("fontSizeMd"),
    lg: t("fontSizeLg"),
  };

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>{t("appearance")}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label>{t("theme")}</Label>
            <div className="flex items-center justify-between gap-4 rounded-md border border-zinc-200 px-3 py-2 dark:border-gray-700">
              <span className="text-sm font-medium">{t("darkMode")}</span>
              <Switch
                checked={theme === "dark"}
                onCheckedChange={(v) =>
                  setAppearance({ theme: v ? ("dark" as ThemeMode) : ("light" as ThemeMode) })
                }
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label>{t("fontSize")}</Label>
            <Select
              value={fontSize}
              onValueChange={(v) => setAppearance({ fontSize: v as FontSize })}
            >
              <SelectTrigger>
                <SelectValue placeholder={t("fontSize")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sm">{fontLabel.sm}</SelectItem>
                <SelectItem value="md">{fontLabel.md}</SelectItem>
                <SelectItem value="lg">{fontLabel.lg}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between gap-4 rounded-md border border-zinc-200 p-4 dark:border-zinc-800 sm:col-span-2">
            <div className="min-w-0">
              <div className="text-sm font-medium">{t("collapseSidebar")}</div>
            </div>
            <Switch
              checked={sidebarCollapsed}
              onCheckedChange={(v) => setAppearance({ sidebarCollapsed: v })}
            />
          </div>

          <div className="sm:col-span-2 flex justify-end">
            <Button
              type="button"
              variant="secondary"
              onClick={() => notifySuccess(t("toastSaved"))}
            >
              {t("saveChanges")}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

