"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

const badgeVariants = {
  default:
    "inline-flex items-center rounded-full border border-transparent bg-zinc-900 px-2.5 py-0.5 text-xs font-semibold text-zinc-50 transition-colors hover:bg-zinc-900/90 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-50/90",
  secondary:
    "inline-flex items-center rounded-full border border-transparent bg-zinc-100 px-2.5 py-0.5 text-xs font-semibold text-zinc-900 hover:bg-zinc-100/80 dark:bg-zinc-800 dark:text-zinc-50 dark:hover:bg-zinc-800/80",
};

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement> {
  variant?: keyof typeof badgeVariants;
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div
      className={cn(badgeVariants[variant], className)}
      {...props}
    />
  );
}

