"use client";

import * as React from "react";
import { Menu, Search } from "lucide-react";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";
import { useI18n } from "@/i18n/provider";
import type { TranslationKey } from "@/i18n/translations";

function getPageTitle(pathname: string): TranslationKey {
  if (pathname.startsWith("/dashboard/employees")) return "employees";
  if (pathname.startsWith("/dashboard/departments")) return "departments";
  if (pathname.startsWith("/dashboard/settings")) return "settings";
  return "dashboard";
}

export function DashboardTopNav() {
  const { locale, setLocale, t } = useI18n();
  const pathname = usePathname();
  const title = t(getPageTitle(pathname));
  const [open, setOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:border-gray-700 dark:bg-gray-800/80 dark:text-white dark:supports-[backdrop-filter]:bg-gray-800/80">
      <div className="flex h-14 min-w-0 items-center gap-2 px-4 lg:px-6">
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
          <SheetContent side="left" className="p-0">
            <DashboardSidebar onNavigate={() => setOpen(false)} className="w-full border-r-0" />
          </SheetContent>
        </Sheet>

        <div className="min-w-0 flex-1">
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

