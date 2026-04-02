"use client";

import { Toaster as Sonner, type ToasterProps } from "sonner";

export function Toaster(props: ToasterProps) {
  return (
    <Sonner
      richColors
      closeButton
      position="top-right"
      toastOptions={{
        classNames: {
          toast:
            "border border-zinc-200 bg-white text-zinc-900 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50",
          description: "text-zinc-600 dark:text-zinc-400",
          actionButton:
            "bg-zinc-900 text-zinc-50 hover:bg-zinc-900/90 dark:bg-zinc-50 dark:text-zinc-900",
          cancelButton:
            "bg-zinc-100 text-zinc-900 hover:bg-zinc-100/80 dark:bg-zinc-900 dark:text-zinc-50",
        },
      }}
      {...props}
    />
  );
}

