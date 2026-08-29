"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      position="top-center"
      expand={true}
      richColors
      closeButton
      duration={4000}
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:pointer-events-auto group-[.toaster]:flex group-[.toaster]:items-start group-[.toaster]:gap-3 group-[.toaster]:rounded-2xl group-[.toaster]:border group-[.toaster]:border-white/20 group-[.toaster]:bg-white/70 group-[.toaster]:px-4 group-[.toaster]:py-3.5 group-[.toaster]:shadow-[0_8px_32px_rgba(0,0,0,0.12)] group-[.toaster]:backdrop-blur-xl group-[.toaster]:backdrop-saturate-150 dark:group-[.toaster]:border-white/10 dark:group-[.toaster]:bg-zinc-900/70 dark:group-[.toaster]:shadow-[0_8px_32px_rgba(0,0,0,0.45)]",
          title:
            "group-[.toast]:text-[15px] group-[.toast]:font-semibold group-[.toast]:tracking-tight group-[.toast]:text-zinc-900 dark:group-[.toast]:text-zinc-50",
          description:
            "group-[.toast]:text-[13px] group-[.toast]:leading-relaxed group-[.toast]:text-zinc-600 dark:group-[.toast]:text-zinc-400",
          actionButton:
            "group-[.toast]:rounded-full group-[.toast]:bg-blue-500 group-[.toast]:px-3.5 group-[.toast]:py-1.5 group-[.toast]:text-[13px] group-[.toast]:font-medium group-[.toast]:text-white group-[.toast]:shadow-sm group-[.toast]:transition-colors group-[.toast]:hover:bg-blue-600 dark:group-[.toast]:bg-blue-500 dark:group-[.toast]:hover:bg-blue-400",
          cancelButton:
            "group-[.toast]:rounded-full group-[.toast]:bg-zinc-100 group-[.toast]:px-3.5 group-[.toast]:py-1.5 group-[.toast]:text-[13px] group-[.toast]:font-medium group-[.toast]:text-zinc-700 group-[.toast]:transition-colors group-[.toast]:hover:bg-zinc-200 dark:group-[.toast]:bg-zinc-800 dark:group-[.toast]:text-zinc-300 dark:group-[.toast]:hover:bg-zinc-700",
          closeButton:
            "group-[.toast]:rounded-full group-[.toast]:border group-[.toast]:border-zinc-200/80 group-[.toast]:bg-white/80 group-[.toast]:text-zinc-500 group-[.toast]:shadow-sm group-[.toast]:transition-colors group-[.toast]:hover:bg-zinc-100 group-[.toast]:hover:text-zinc-800 dark:group-[.toast]:border-zinc-700 dark:group-[.toast]:bg-zinc-900/80 dark:group-[.toast]:text-zinc-400 dark:group-[.toast]:hover:bg-zinc-800 dark:group-[.toast]:hover:text-zinc-200",
          success:
            "group-[.toaster]:border-emerald-500/20 group-[.toaster]:bg-emerald-50/80 dark:group-[.toaster]:border-emerald-500/20 dark:group-[.toaster]:bg-emerald-950/40",
          error:
            "group-[.toaster]:border-red-500/20 group-[.toaster]:bg-red-50/80 dark:group-[.toaster]:border-red-500/20 dark:group-[.toaster]:bg-red-950/40",
          warning:
            "group-[.toaster]:border-amber-500/20 group-[.toaster]:bg-amber-50/80 dark:group-[.toaster]:border-amber-500/20 dark:group-[.toaster]:bg-amber-950/40",
          info: "group-[.toaster]:border-blue-500/20 group-[.toaster]:bg-blue-50/80 dark:group-[.toaster]:border-blue-500/20 dark:group-[.toaster]:bg-blue-950/40",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
