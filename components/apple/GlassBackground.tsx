"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import AnimatedGradient from "./AnimatedGradient";
import { cn } from "@/lib/utils";

interface GlassBackgroundProps {
  children: ReactNode;
  className?: string;
}

export default function GlassBackground({
  children,
  className,
}: GlassBackgroundProps) {
  return (
    <main
      className={cn(
        "relative min-h-screen overflow-hidden bg-[#030712]",
        className
      )}
    >
      <AnimatedGradient />

      <motion.div
        animate={{
          opacity: [0.25, 0.45, 0.25],
          scale: [1, 1.08, 1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute left-1/2 top-[-300px] h-[700px] w-[700px] -translate-x-1/2 rounded-full bg-sky-500/20 blur-[180px]"
      />

      <motion.div
        animate={{
          y: [0, -25, 0],
          opacity: [0.18, 0.32, 0.18],
        }}
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute bottom-[-250px] left-1/2 h-[650px] w-[650px] -translate-x-1/2 rounded-full bg-cyan-400/20 blur-[170px]"
      />

      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,.15) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,.15) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="absolute inset-0 backdrop-blur-[110px]" />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_35%,rgba(0,0,0,.65)_100%)]" />

      <section className="relative z-10 flex min-h-screen items-center justify-center px-6">
        {children}
      </section>
    </main>
  );
}
