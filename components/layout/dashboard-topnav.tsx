"use client";

import * as React from "react";
<<<<<<< HEAD
import { Menu } from "lucide-react";
import { usePathname } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
=======
import { Menu, Search } from "lucide-react";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
>>>>>>> a2ebc7a252b7ad714759a736da8116988d61fab8
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";
import { useI18n } from "@/i18n/provider";
import type { TranslationKey } from "@/i18n/translations";

<<<<<<< HEAD
function getMeta(pathname: string): { title: TranslationKey; sub: TranslationKey } {
  if (pathname.startsWith("/dashboard/tasks")) {
    return { title: "navAssignTask", sub: "pageSubAssign" };
  }
  if (pathname.startsWith("/dashboard/assignment-log")) {
    return { title: "navAssignmentLog", sub: "pageSubLog" };
  }
  if (pathname.startsWith("/dashboard/employees")) {
    return { title: "employees", sub: "pageSubEmployees" };
  }
  if (pathname.startsWith("/dashboard/departments")) {
    return { title: "departments", sub: "pageSubDashboard" };
  }
  if (pathname.startsWith("/dashboard/projects")) {
    return { title: "projects", sub: "pageSubDashboard" };
  }
  if (pathname.startsWith("/dashboard/ask-ai")) {
    return { title: "askAi", sub: "askAiDescription" };
  }
  if (pathname.startsWith("/dashboard/settings")) {
    return { title: "settings", sub: "pageSubSettings" };
  }
  return { title: "dashboard", sub: "pageSubDashboard" };
=======
function getPageTitle(pathname: string): TranslationKey {
  if (pathname.startsWith("/dashboard/employees")) return "employees";
  if (pathname.startsWith("/dashboard/departments")) return "departments";
  if (pathname.startsWith("/dashboard/settings")) return "settings";
  return "dashboard";
>>>>>>> a2ebc7a252b7ad714759a736da8116988d61fab8
}

export function DashboardTopNav() {
  const { locale, setLocale, t } = useI18n();
  const pathname = usePathname();
<<<<<<< HEAD
  const meta = getMeta(pathname);
  const [open, setOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-40 shrink-0 border-b-[1.5px] border-[var(--border)] bg-[var(--surface)]">
      <div className="flex h-[52px] min-w-0 items-center gap-3 px-5">
=======
  const title = t(getPageTitle(pathname));
  const [open, setOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:border-gray-700 dark:bg-gray-800/80 dark:text-white dark:supports-[backdrop-filter]:bg-gray-800/80">
      <div className="flex h-14 min-w-0 items-center gap-2 px-4 lg:px-6">
>>>>>>> a2ebc7a252b7ad714759a736da8116988d61fab8
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              aria-label={t("openMenu")}
            >
              <Menu />
            </Button>
          </SheetTrigger>
<<<<<<< HEAD
          <SheetContent side="left" className="w-[210px] p-0">
=======
          <SheetContent side="left" className="p-0">
>>>>>>> a2ebc7a252b7ad714759a736da8116988d61fab8
            <DashboardSidebar onNavigate={() => setOpen(false)} className="w-full border-r-0" />
          </SheetContent>
        </Sheet>

        <div className="min-w-0 flex-1">
<<<<<<< HEAD
          <h1 className="truncate text-[15px] font-medium text-[var(--foreground)]">
            {t(meta.title)}
          </h1>
          <p className="truncate text-xs text-[#5a6a85]">{t(meta.sub)}</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-1 rounded-md border border-[var(--border)] bg-[var(--surface)] p-1 sm:flex">
=======
          <h1 className="truncate text-sm font-semibold text-zinc-900 dark:text-zinc-50">
            {title}
          </h1>
          <p className="hidden truncate text-xs text-zinc-500 dark:text-zinc-400 sm:block">
            {t("brandSubtitle")}
          </p>
        </div>

        <div className="hidden min-w-0 flex-1 items-center gap-2 rounded-md border border-zinc-200 bg-white px-2.5 dark:border-zinc-800 dark:bg-zinc-950 lg:flex lg:max-w-[520px]">
          <Search className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
          <Input
            placeholder={t("searchEmployees")}
            className="h-9 border-0 bg-transparent px-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-1 rounded-md border border-zinc-200 bg-white p-1 dark:border-zinc-800 dark:bg-zinc-950 sm:flex">
>>>>>>> a2ebc7a252b7ad714759a736da8116988d61fab8
            <Button
              type="button"
              variant={locale === "en" ? "secondary" : "ghost"}
              size="sm"
              className="h-8 px-2"
              onClick={() => setLocale("en")}
            >
              EN
            </Button>
            <Button
              type="button"
              variant={locale === "tr" ? "secondary" : "ghost"}
              size="sm"
              className="h-8 px-2"
              onClick={() => setLocale("tr")}
            >
              TR
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
<<<<<<< HEAD
=======

>>>>>>> a2ebc7a252b7ad714759a736da8116988d61fab8
