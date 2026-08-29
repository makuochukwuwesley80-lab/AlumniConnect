"use client";

import { motion } from "framer-motion";

export default function StudentSkeleton() {
  return (
    <div className="relative w-full rounded-3xl overflow-hidden bg-white/10 dark:bg-white/5 backdrop-blur-3xl border border-white/20 dark:border-white/10 p-6">
      <div className="absolute left-8 right-8 -bottom-10 h-20 rounded-full bg-blue-500/25 blur-[60px]" />
      <div className="relative flex flex-col items-center gap-4 animate-pulse">
        <div className="w-24 h-24 rounded-full bg-white/20 dark:bg-white/10 ring-2 ring-white/10 ring-offset-4 ring-offset-transparent" />
        <div className="w-3/4 h-5 rounded-full bg-white/20 dark:bg-white/10" />
        <div className="w-1/2 h-4 rounded-full bg-white/10 dark:bg-white/5" />
        <div className="w-2/3 h-4 rounded-full bg-white/10 dark:bg-white/5" />
        <div className="mt-4 w-full h-10 rounded-xl bg-white/10 dark:bg-white/5" />
      </div>
    </div>
  );
}
