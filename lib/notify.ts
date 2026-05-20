"use client";

import { toast } from "sonner";

import { useSettingsStore } from "@/store/settings-store";

export function notifySuccess(message: string, description?: string) {
  if (!useSettingsStore.getState().notifyToast) return;
  toast.success(message, description ? { description } : undefined);
}

export function notifyError(message: string, description?: string) {
  if (!useSettingsStore.getState().notifyToast) return;
  toast.error(message, description ? { description } : undefined);
}

