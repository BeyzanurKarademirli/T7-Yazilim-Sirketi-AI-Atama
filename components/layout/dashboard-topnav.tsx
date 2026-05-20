"use client";

import * as React from "react";
import { Menu } from "lucide-react";
import { usePathname } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";
import { useI18n } from "@/i18n/provider";
import type { TranslationKey } from "@/i18n/translations";

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
}

export function DashboardTopNav() {
  const { locale, setLocale, t } = useI18n();
  const pathname = usePathname();
  const meta = getMeta(pathname);
  const [open, setOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-40 shrink-0 border-b-[1.5px] border-[var(--border)] bg-[var(--surface)]">
      <div className="flex h-[52px] min-w-0 items-center gap-3 px-5">
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
          <SheetContent side="left" className="w-[210px] p-0">
            <DashboardSidebar onNavigate={() => setOpen(false)} className="w-full border-r-0" />
          </SheetContent>
        </Sheet>

        <div className="min-w-0 flex-1">
          <h1 className="truncate text-[15px] font-medium text-[var(--foreground)]">
            {t(meta.title)}
          </h1>
          <p className="truncate text-xs text-[#5a6a85]">{t(meta.sub)}</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-1 rounded-md border border-[var(--border)] bg-[var(--surface)] p-1 sm:flex">
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
