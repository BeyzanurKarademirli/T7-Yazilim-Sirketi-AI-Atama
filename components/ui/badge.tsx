"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

const badgeVariants = {
  default:
    "inline-flex items-center rounded-full border border-transparent bg-[var(--primary)] px-2.5 py-0.5 text-xs font-semibold text-white transition-colors hover:bg-[var(--primary-soft)]",
  secondary:
    "inline-flex items-center rounded-full border border-transparent bg-[var(--surface-muted)] px-2.5 py-0.5 text-xs font-semibold text-[var(--foreground)] hover:opacity-90",
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

