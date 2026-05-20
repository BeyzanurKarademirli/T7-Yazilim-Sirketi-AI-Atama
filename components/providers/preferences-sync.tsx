"use client";

import * as React from "react";

import { useSettingsStore } from "@/store/settings-store";

function getSystemPrefersDark() {
  return typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function applyTheme(theme: "system" | "light" | "dark") {
  const root = document.documentElement;
  const shouldDark = theme === "dark" || (theme === "system" && getSystemPrefersDark());
  root.classList.toggle("dark", shouldDark);
  root.style.colorScheme = shouldDark ? "dark" : "light";
}

function applyFontSize(size: "sm" | "md" | "lg") {
  const root = document.documentElement;
  const px = size === "sm" ? 14 : size === "lg" ? 18 : 16;
  root.style.fontSize = `${px}px`;
}

export function PreferencesSync() {
  const theme = useSettingsStore((s) => s.theme);
  const fontSize = useSettingsStore((s) => s.fontSize);

  React.useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  React.useEffect(() => {
    applyFontSize(fontSize);
  }, [fontSize]);

  // React to system theme changes when in "system"
  React.useEffect(() => {
    if (theme !== "system") return;
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => applyTheme("system");
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, [theme]);

  return null;
}

