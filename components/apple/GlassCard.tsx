"use client";

import * as React from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface GlassCardProps extends Omit<HTMLMotionProps<"div">, "children"> {
  children: React.ReactNode;
  hover?: boolean;
}

const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ children, className, hover = true, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={
          hover
            ? {
                y: -4,
                scale: 1.01,
              }
            : undefined
        }
        transition={{
          type: "spring",
          stiffness: 280,
          damping: 24,
        }}
        className={cn(
          "relative isolate overflow-hidden rounded-[28px]",
          // Light mode
          "border border-black/[0.06] bg-white/70 shadow-[0_8px_30px_rgba(0,0,0,0.06)]",
          // Dark mode
          "dark:border-white/10 dark:bg-white/[0.06] dark:shadow-[0_20px_60px_rgba(0,0,0,0.45)]",
          "backdrop-blur-2xl",
          className
        )}
        {...props}
      >
        {/* Soft top highlight — subtle in both modes */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-black/5 to-transparent dark:via-white/20" />

        {/* Very soft inner gradient */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-transparent dark:from-white/[0.07]" />

        <div className="relative z-10">{children}</div>
      </motion.div>
    );
  }
);

GlassCard.displayName = "GlassCard";
export default GlassCard;
