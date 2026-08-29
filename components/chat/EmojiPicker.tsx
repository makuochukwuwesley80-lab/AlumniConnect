"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";

const CATEGORIES: { id: string; label: string; emojis: string[] }[] = [
  {
    id: "smileys",
    label: "Smileys",
    emojis: [
      "\u{1F600}", "\u{1F603}", "\u{1F604}", "\u{1F601}", "\u{1F606}",
      "\u{1F605}", "\u{1F602}", "\u{1F923}", "\u{1F60A}", "\u{1F607}",
      "\u{1F642}", "\u{1F609}", "\u{1F60D}", "\u{1F618}", "\u{1F617}",
      "\u{1F60B}", "\u{1F61B}", "\u{1F92A}", "\u{1F914}", "\u{1F910}",
      "\u{1F610}", "\u{1F611}", "\u{1F636}", "\u{1F60F}", "\u{1F612}",
      "\u{1F644}", "\u{1F62A}", "\u{1F634}", "\u{1F613}", "\u{1F625}",
      "\u{1F62D}", "\u{1F631}", "\u{1F621}", "\u{1F97A}", "\u{1F929}",
      "\u{1F973}", "\u{1F60E}", "\u{1F913}", "\u{1F615}", "\u{1F634}",
    ],
  },
  {
    id: "gestures",
    label: "Gestures",
    emojis: [
      "\u{1F44D}", "\u{1F44E}", "\u{1F44C}", "\u{270C}", "\u{1F91E}",
      "\u{1F918}", "\u{1F44F}", "\u{1F64C}", "\u{1F450}", "\u{1F91D}",
      "\u{1F64F}", "\u{270A}", "\u{1F44A}", "\u{1F91B}", "\u{1F91C}",
      "\u{1F4AA}", "\u{1F44B}", "\u{1F596}", "\u{1F595}", "\u{1F919}",
    ],
  },
  {
    id: "hearts",
    label: "Hearts",
    emojis: [
      "\u{2764}", "\u{1F9E1}", "\u{1F49B}", "\u{1F49A}", "\u{1F499}",
      "\u{1F49C}", "\u{1F5A4}", "\u{1F90D}", "\u{1F90E}", "\u{1F494}",
      "\u{1F495}", "\u{1F496}", "\u{1F497}", "\u{1F498}", "\u{1F49D}",
      "\u{2728}", "\u{1F31F}", "\u{1F4AB}", "\u{1F525}", "\u{1F4A5}",
    ],
  },
  {
    id: "campus",
    label: "Campus",
    emojis: [
      "\u{1F393}", "\u{1F4DA}", "\u{1F4D6}", "\u{270F}", "\u{1F4DD}",
      "\u{1F4BC}", "\u{1F5A5}", "\u{1F4BB}", "\u{1F4F1}", "\u{1F4E7}",
      "\u{1F4C5}", "\u{1F4CC}", "\u{1F4CA}", "\u{1F3C6}", "\u{1F947}",
      "\u{1F389}", "\u{1F38A}", "\u{1F3AF}", "\u{1F4A1}", "\u{1F680}",
    ],
  },
];

interface EmojiPickerProps {
  open: boolean;
  onClose: () => void;
  onSelect: (emoji: string) => void;
}

export function EmojiPicker({ open, onClose, onSelect }: EmojiPickerProps) {
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const [active, setActive] = React.useState(CATEGORIES[0].id);

  React.useEffect(() => {
    if (!open) return;

    function onPointerDown(event: MouseEvent | TouchEvent) {
      const node = containerRef.current;
      if (!node) return;
      if (!node.contains(event.target as Node)) onClose();
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.stopPropagation();
        onClose();
      }
    }

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("touchstart", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("touchstart", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  const current =
    CATEGORIES.find((category) => category.id === active) ?? CATEGORIES[0];

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          ref={containerRef}
          initial={{ opacity: 0, y: 8, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.97 }}
          transition={{ type: "spring", stiffness: 380, damping: 30 }}
          className="absolute bottom-full left-0 z-50 mb-3 w-[min(20rem,calc(100vw-2.5rem))] overflow-hidden rounded-2xl border border-slate-200/70 bg-white/95 shadow-[0_18px_44px_rgba(15,23,42,0.14)] backdrop-blur-2xl dark:border-white/10 dark:bg-[#12141a]/95 dark:shadow-[0_28px_70px_rgba(0,0,0,0.6)]"
        >
          <div className="flex gap-1 border-b border-slate-200/70 p-2 dark:border-white/10">
            {CATEGORIES.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => setActive(category.id)}
                className={
                  "flex-1 rounded-lg px-2 py-1.5 text-[11px] font-medium transition-colors " +
                  (category.id === active
                    ? "bg-blue-500/10 text-blue-600 dark:bg-blue-400/15 dark:text-blue-300"
                    : "text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-white/5")
                }
              >
                {category.label}
              </button>
            ))}
          </div>

          <div className="grid max-h-56 grid-cols-8 gap-0.5 overflow-y-auto p-2">
            {current.emojis.map((emoji, index) => (
              <button
                key={current.id + "-" + index}
                type="button"
                onClick={() => onSelect(emoji)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-lg transition-transform hover:scale-110 hover:bg-slate-100 dark:hover:bg-white/10"
                aria-label={"Insert " + emoji}
              >
                {emoji}
              </button>
            ))}
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export default EmojiPicker;