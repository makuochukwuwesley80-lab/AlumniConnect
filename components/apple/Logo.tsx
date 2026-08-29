"use client";

import { motion } from "framer-motion";
import { GraduationCap } from "lucide-react";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  light?: boolean;
}

export default function Logo({
  size = "md",
  light = false,
}: LogoProps) {
  const sizes = {
    sm: {
      box: "h-10 w-10 rounded-[13px]",
      icon: 20,
      title: "text-lg",
    },
    md: {
      box: "h-14 w-14 rounded-[18px]",
      icon: 27,
      title: "text-2xl",
    },
    lg: {
      box: "h-20 w-20 rounded-[24px]",
      icon: 38,
      title: "text-4xl",
    },
  };

  const current = sizes[size];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="flex items-center gap-3"
    >
      <div
        className={`relative flex ${current.box} shrink-0 items-center justify-center overflow-hidden bg-gradient-to-br from-sky-400 via-blue-600 to-cyan-500 shadow-[0_12px_35px_rgba(14,165,233,.35)]`}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-transparent" />

        <GraduationCap
          size={current.icon}
          strokeWidth={2.2}
          className="relative z-10 text-white"
        />
      </div>

      <div className="flex flex-col">
        <span
          className={`font-bold tracking-tight ${current.title} ${
            light ? "text-white" : "text-slate-900"
          }`}
        >
          Alumni<span className="text-sky-500">Connect</span>
        </span>

        {size !== "sm" && (
          <span
            className={`text-xs font-medium tracking-[0.18em] uppercase ${
              light ? "text-white/55" : "text-slate-500"
            }`}
          >
            Connect. Grow. Belong.
          </span>
        )}
      </div>
    </motion.div>
  );
}
