"use client";

import * as React from "react";
import { Bot, Menu } from "lucide-react";
import { usePathname } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";
import { useI18n } from "@/i18n/provider";
import type { TranslationKey } from "@/i18n/translations";

const pageMeta: Record<string, { title: TranslationKey; sub: TranslationKey }> = {
  "/dashboard/tasks": { title: "navAssignTask", sub: "pageSubAssign" },
  "/dashboard": { title: "dashboard", sub: "pageSubDashboard" },
  "/dashboard/employees": { title: "employees", sub: "pageSubEmployees" },
  "/dashboard/assignment-log": { title: "navAssignmentLog", sub: "pageSubLog" },
  "/dashboard/settings": { title: "settings", sub: "pageSubSettings" },
};

function getMeta(pathname: string) {
  if (pathname.startsWith("/dashboard/assignment-log")) return pageMeta["/dashboard/assignment-log"];
  if (pathname.startsWith("/dashboard/tasks")) return pageMeta["/dashboard/tasks"];
  if (pathname.startsWith("/dashboard/employees")) return pageMeta["/dashboard/employees"];
  if (pathname.startsWith("/dashboard/settings")) return pageMeta["/dashboard/settings"];
  return pageMeta["/dashboard"];
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

        <Badge className="hidden border-0 bg-[rgba(0,201,167,0.12)] text-[#007a67] hover:bg-[rgba(0,201,167,0.12)] sm:inline-flex">
          <Bot className="mr-1 h-3.5 w-3.5" />
          {t("groqApiActive")}
        </Badge>

        <LocaleSwitcher locale={locale} setLocale={setLocale} />
      </div>
    </header>
  );
}

function LocaleSwitcher({
  locale,
  setLocale,
}: {
  locale: string;
  setLocale: (l: "en" | "tr") => void;
}) {
  return (
    <div className="flex items-center gap-1 rounded-md border border-[var(--border)] bg-[var(--surface)] p-1">
      <Button
        type="button"
        variant={locale === "en" ? "secondary" : "ghost"}
        size="sm"
        className="h-7 px-2 text-xs"
        onClick={() => setLocale("en")}
      >
        EN
      </Button>
      <Button
        type="button"
        variant={locale === "tr" ? "secondary" : "ghost"}
        size="sm"
        className="h-7 px-2 text-xs"
        onClick={() => setLocale("tr")}
      >
        TR
      </Button>
    </div>
  );
}

