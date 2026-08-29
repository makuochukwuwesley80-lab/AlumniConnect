"use client";

import { motion } from "framer-motion";

export default function LoadingOverlay() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/60 backdrop-blur-xl"
    >
      <div className="flex flex-col items-center gap-5">
        <div className="relative h-16 w-16">
          <div className="absolute inset-0 rounded-full border-4 border-white/10" />

          <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-sky-400 border-r-blue-500" />

          <div className="absolute inset-3 rounded-full bg-gradient-to-br from-sky-400 to-blue-600 shadow-[0_0_35px_rgba(14,165,233,.5)]" />
        </div>

        <p className="text-sm font-medium tracking-wide text-white/80">
          Loading AlumniConnect...
        </p>
      </div>
    </motion.div>
  );
}
