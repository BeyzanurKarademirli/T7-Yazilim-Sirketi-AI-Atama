"use client";

import * as React from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useI18n } from "@/i18n/provider";
import { notifyError, notifySuccess } from "@/lib/notify";
import { useSettingsStore } from "@/store/settings-store";

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return (parts[0]?.[0] ?? "A") + (parts[1]?.[0] ?? "");
}

export function UserSettingsTab() {
  const { t } = useI18n();
  const profileName = useSettingsStore((s) => s.profileName);
  const profileEmail = useSettingsStore((s) => s.profileEmail);
  const profileImageDataUrl = useSettingsStore((s) => s.profileImageDataUrl);
  const notifyEmail = useSettingsStore((s) => s.notifyEmail);
  const notifyToast = useSettingsStore((s) => s.notifyToast);
  const setProfile = useSettingsStore((s) => s.setProfile);
  const setNotify = useSettingsStore((s) => s.setNotify);

  const [currentPassword, setCurrentPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");

  async function onPickImage(file: File | null) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      notifyError(t("errorUnknown"));
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setProfile({ profileImageDataUrl: String(reader.result) });
    reader.readAsDataURL(file);
  }

  function onSaveProfile() {
    if (!profileName.trim() || !profileEmail.trim()) {
      notifyError(t("errorUnknown"));
      return;
    }
    notifySuccess(t("toastSaved"));
  }

  function onUpdatePassword() {
    if (!currentPassword || !newPassword) {
      notifyError(t("errorUnknown"));
      return;
    }
    if (newPassword !== confirmPassword) {
      notifyError(t("errorUnknown"));
      return;
    }
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    notifySuccess(t("toastPasswordUpdated"));
  }

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>{t("editProfile")}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6 sm:grid-cols-[auto_1fr] sm:items-start">
          <div className="flex items-center gap-4">
            <Avatar className="h-14 w-14">
              {profileImageDataUrl ? (
                <AvatarImage src={profileImageDataUrl} alt={profileName} />
              ) : null}
              <AvatarFallback>{initials(profileName)}</AvatarFallback>
            </Avatar>
          </div>

          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="profileName">{t("name")}</Label>
              <Input
                id="profileName"
                value={profileName}
                onChange={(e) => setProfile({ profileName: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="profileEmail">{t("email")}</Label>
              <Input
                id="profileEmail"
                type="email"
                value={profileEmail}
                onChange={(e) => setProfile({ profileEmail: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="profilePic">{t("profilePicture")}</Label>
              <Input
                id="profilePic"
                type="file"
                accept="image/*"
                onChange={(e) => void onPickImage(e.target.files?.[0] ?? null)}
              />
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
              <Button type="button" onClick={onSaveProfile}>
                {t("saveProfile")}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("changePassword")}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-2 sm:col-span-2">
            <Label htmlFor="currentPassword">{t("currentPassword")}</Label>
            <Input
              id="currentPassword"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="newPassword">{t("newPassword")}</Label>
            <Input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="confirmPassword">{t("confirmPassword")}</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <div className="flex sm:col-span-2 sm:justify-end">
            <Button type="button" onClick={onUpdatePassword}>
              {t("updatePassword")}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("notificationsPrefs")}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="flex items-center justify-between gap-4 rounded-md border border-zinc-200 p-4 dark:border-zinc-800">
            <div className="min-w-0">
              <div className="text-sm font-medium">{t("notifyByEmail")}</div>
            </div>
            <Switch
              checked={notifyEmail}
              onCheckedChange={(v) => setNotify({ notifyEmail: v })}
            />
          </div>
          <div className="flex items-center justify-between gap-4 rounded-md border border-zinc-200 p-4 dark:border-zinc-800">
            <div className="min-w-0">
              <div className="text-sm font-medium">{t("notifyByToast")}</div>
            </div>
            <Switch
              checked={notifyToast}
              onCheckedChange={(v) => setNotify({ notifyToast: v })}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

