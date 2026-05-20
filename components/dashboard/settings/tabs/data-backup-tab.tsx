"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useI18n } from "@/i18n/provider";
import { notifyError, notifySuccess } from "@/lib/notify";
import { useEmployeeStore } from "@/store/employee-store";
import type { Department } from "@/types/department";
import type { Employee } from "@/types/employee";

function download(filename: string, content: string, type = "application/json") {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function toCsv(rows: Array<Record<string, unknown>>) {
  const headers = Object.keys(rows[0] ?? {});
  const escape = (v: unknown) => {
    const s = String(v ?? "");
    if (/[\",\\n]/.test(s)) return `"${s.replace(/\"/g, '""')}"`;
    return s;
  };
  const lines = [
    headers.join(","),
    ...rows.map((r) => headers.map((h) => escape(r[h])).join(",")),
  ];
  return lines.join("\n");
}

export function DataBackupTab() {
  const { t } = useI18n();
  const employees = useEmployeeStore((s) => s.employees);
  const departments = useEmployeeStore((s) => s.departments);
  const replaceData = useEmployeeStore((s) => s.replaceData);
  const resetData = useEmployeeStore((s) => s.resetData);

  async function onImport(file: File | null) {
    if (!file) return;
    try {
      const text = await file.text();
      const parsed = JSON.parse(text) as { employees: unknown; departments: unknown };
      const result = replaceData({
        employees: Array.isArray(parsed.employees)
          ? (parsed.employees as Employee[])
          : [],
        departments: Array.isArray(parsed.departments)
          ? (parsed.departments as Department[])
          : [],
      });
      if (!result.ok) {
        notifyError(t(result.error));
        return;
      }
      notifySuccess(t("toastImported"));
    } catch {
      notifyError(t("errorUnknown"));
    }
  }

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>{t("dataBackup")}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="grid gap-3 sm:grid-cols-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                download(
                  "dashboard-data.json",
                  JSON.stringify({ employees, departments }, null, 2),
                );
                notifySuccess(t("toastExported"));
              }}
            >
              {t("exportJson")}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                download("employees.csv", toCsv(employees as Record<string, unknown>[]), "text/csv");
                notifySuccess(t("toastExported"));
              }}
            >
              {t("exportCsv")}
            </Button>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="importJson">{t("importJson")}</Label>
            <Input
              id="importJson"
              type="file"
              accept="application/json"
              onChange={(e) => void onImport(e.target.files?.[0] ?? null)}
            />
            <p className="text-xs text-zinc-500 dark:text-zinc-400">{t("importHint")}</p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="destructive"
              onClick={() => {
                resetData();
                notifySuccess(t("toastReset"));
              }}
            >
              {t("resetData")}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

