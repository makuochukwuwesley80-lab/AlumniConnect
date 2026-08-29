"use client";

import { motion } from "framer-motion";

export default function AnimatedGradient() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <motion.div
        animate={{
          x: [0, 120, -80, 0],
          y: [0, -80, 60, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -top-40 -left-32 h-[600px] w-[600px] rounded-full bg-sky-500/30 blur-[150px]"
      />

      <motion.div
        animate={{
          x: [0, -100, 120, 0],
          y: [0, 100, -60, 0],
        }}
        transition={{
          duration: 24,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute right-[-180px] top-[10%] h-[650px] w-[650px] rounded-full bg-cyan-400/25 blur-[170px]"
      />

      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.25, 0.45, 0.25],
        }}
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute bottom-[-220px] left-1/2 h-[700px] w-[700px] -translate-x-1/2 rounded-full bg-blue-600/20 blur-[200px]"
      />
    </div>
  );
}
