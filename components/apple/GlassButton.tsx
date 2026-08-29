"use client";

import * as React from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface GlassButtonProps
  extends Omit<HTMLMotionProps<"button">, "children"> {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "destructive";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  fullWidth?: boolean;
}

const GlassButton = React.forwardRef<HTMLButtonElement, GlassButtonProps>(
  (
    {
      children,
      className,
      variant = "primary",
      size = "md",
      loading = false,
      fullWidth = false,
      disabled,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    return (
      <motion.button
        ref={ref}
        whileHover={!isDisabled ? { scale: 1.02, y: -1 } : undefined}
        whileTap={!isDisabled ? { scale: 0.98 } : undefined}
        transition={{ type: "spring", stiffness: 400, damping: 22 }}
        disabled={isDisabled}
        className={cn(
          "relative isolate inline-flex items-center justify-center gap-2 overflow-hidden",
          "rounded-full font-semibold tracking-tight",
          "backdrop-blur-xl transition-colors duration-200",
          "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-400/30",
          "disabled:pointer-events-none disabled:opacity-50",
          fullWidth && "w-full",

          // Sizes
          size === "sm" && "h-9 px-4 text-sm",
          size === "md" && "h-11 px-5 text-[15px]",
          size === "lg" && "h-12 px-6 text-base",

          // Primary
          variant === "primary" &&
            "border border-sky-500/20 bg-sky-500 text-white shadow-[0_8px_24px_rgba(14,165,233,0.28)] hover:bg-sky-400",

          // Secondary — works well in both modes
          variant === "secondary" &&
            "border border-black/8 bg-white/80 text-slate-900 shadow-sm hover:bg-white dark:border-white/15 dark:bg-white/10 dark:text-white dark:hover:bg-white/15",

          // Ghost
          variant === "ghost" &&
            "border border-black/6 bg-black/[0.03] text-slate-800 hover:bg-black/[0.06] dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10",

          // Destructive
          variant === "destructive" &&
            "border border-red-500/20 bg-red-500 text-white shadow-[0_8px_24px_rgba(239,68,68,0.28)] hover:bg-red-400",

          className
        )}
        {...props}
      >
        <div className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-b from-white/25 to-transparent" />
        <span className="relative z-10 flex items-center gap-2">
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          {children}
        </span>
      </motion.button>
    );
  }
);

GlassButton.displayName = "GlassButton";
export default GlassButton;
