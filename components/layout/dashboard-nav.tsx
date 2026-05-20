"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

export type DashboardNavItem = {
  title: string;
  href: string;
  icon: LucideIcon;
};

export function DashboardNav({
  items,
  onNavigate,
  className,
<<<<<<< HEAD
  variant = "default",
=======
>>>>>>> a2ebc7a252b7ad714759a736da8116988d61fab8
}: {
  items: DashboardNavItem[];
  onNavigate?: () => void;
  className?: string;
<<<<<<< HEAD
  variant?: "default" | "ai";
=======
>>>>>>> a2ebc7a252b7ad714759a736da8116988d61fab8
}) {
  const pathname = usePathname();

  return (
<<<<<<< HEAD
    <nav className={cn("flex flex-col", variant === "ai" ? "gap-0" : "gap-1", className)}>
=======
    <nav className={cn("flex flex-col gap-1", className)}>
>>>>>>> a2ebc7a252b7ad714759a736da8116988d61fab8
      {items.map((item) => {
        const isActive =
          item.href === "/dashboard"
            ? pathname === item.href
            : pathname === item.href || pathname.startsWith(`${item.href}/`);

<<<<<<< HEAD
        if (variant === "ai") {
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "relative flex items-center gap-2.5 px-[18px] py-2.5 text-[13px] text-white/50 transition-colors hover:bg-white/[0.06] hover:text-white",
                isActive && "bg-[rgba(0,201,167,0.15)] text-white",
              )}
            >
              {isActive ? (
                <span
                  className="absolute bottom-1 left-0 top-1 w-[3px] rounded-r bg-[var(--teal)]"
                  aria-hidden
                />
              ) : null}
              <item.icon className="h-[17px] w-[17px] shrink-0" />
              <span className="truncate">{item.title}</span>
            </Link>
          );
        }

=======
>>>>>>> a2ebc7a252b7ad714759a736da8116988d61fab8
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
<<<<<<< HEAD
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-slate-200 transition-colors hover:bg-white/10 hover:text-white",
              isActive && "bg-white text-[var(--primary)] shadow-sm",
=======
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-900 dark:hover:text-zinc-50",
              isActive &&
                "bg-zinc-100 text-zinc-900 dark:bg-zinc-900 dark:text-zinc-50",
>>>>>>> a2ebc7a252b7ad714759a736da8116988d61fab8
            )}
          >
            <item.icon className="h-4 w-4" />
            <span className="truncate">{item.title}</span>
          </Link>
        );
      })}
    </nav>
  );
}
<<<<<<< HEAD
=======

>>>>>>> a2ebc7a252b7ad714759a736da8116988d61fab8
