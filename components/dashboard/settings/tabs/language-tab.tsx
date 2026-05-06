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
import { useI18n } from "@/i18n/provider";
import { notifySuccess } from "@/lib/notify";

export function LanguageTab() {
  const { locale, setLocale, t } = useI18n();
  const [value, setValue] = React.useState(locale);

  React.useEffect(() => setValue(locale), [locale]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("language")}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
        <div className="grid gap-2">
          <Label>{t("selectLanguage")}</Label>
          <Select value={value} onValueChange={(v) => setValue(v as typeof locale)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">{t("english")}</SelectItem>
              <SelectItem value="tr">{t("turkish")}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
          type="button"
          onClick={() => {
            setLocale(value);
            notifySuccess(t("toastLanguageUpdated"));
          }}
          className="w-full sm:w-auto"
        >
          {t("saveChanges")}
        </Button>
      </CardContent>
    </Card>
  );
}

