"use client";

import * as React from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useI18n } from "@/i18n/provider";
import { UserSettingsTab } from "@/components/dashboard/settings/tabs/user-settings-tab";
import { AppearanceTab } from "@/components/dashboard/settings/tabs/appearance-tab";
import { LanguageTab } from "@/components/dashboard/settings/tabs/language-tab";
import { SystemSettingsTab } from "@/components/dashboard/settings/tabs/system-settings-tab";
import { SecurityTab } from "@/components/dashboard/settings/tabs/security-tab";
import { DataBackupTab } from "@/components/dashboard/settings/tabs/data-backup-tab";

export function SettingsScreen() {
  const { t } = useI18n();

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-semibold tracking-tight">{t("settings")}</h2>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          {t("settingsDescription")}
        </p>
      </div>

      <Tabs defaultValue="user" className="w-full">
        <TabsList className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="user">{t("userSettings")}</TabsTrigger>
          <TabsTrigger value="appearance">{t("appearance")}</TabsTrigger>
          <TabsTrigger value="language">{t("language")}</TabsTrigger>
          <TabsTrigger value="system">{t("systemSettings")}</TabsTrigger>
          <TabsTrigger value="security">{t("security")}</TabsTrigger>
          <TabsTrigger value="data">{t("dataBackup")}</TabsTrigger>
        </TabsList>

        <TabsContent value="user">
          <UserSettingsTab />
        </TabsContent>
        <TabsContent value="appearance">
          <AppearanceTab />
        </TabsContent>
        <TabsContent value="language">
          <LanguageTab />
        </TabsContent>
        <TabsContent value="system">
          <SystemSettingsTab />
        </TabsContent>
        <TabsContent value="security">
          <SecurityTab />
        </TabsContent>
        <TabsContent value="data">
          <DataBackupTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}

