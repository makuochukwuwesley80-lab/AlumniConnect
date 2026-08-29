"use client";

import { useEffect, useState } from "react";
import { Moon, Sun, Monitor } from "lucide-react";

type Theme = "light" | "dark" | "system";

function applyTheme(theme: Theme) {
  const root = document.documentElement;

  root.classList.remove("light", "dark");

  if (theme === "dark") {
    root.classList.add("dark");
  }

  if (theme === "light") {
    root.classList.add("light");
  }

  if (theme === "system") {
    const isDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    root.classList.add(isDark ? "dark" : "light");
  }
}

export default function ThemeSwitcher() {
  const [theme, setTheme] = useState<Theme>("system");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(
      "alumniconnect-theme"
    ) as Theme | null;

    const initial =
      saved === "light" ||
      saved === "dark" ||
      saved === "system"
        ? saved
        : "system";

    setTheme(initial);
    applyTheme(initial);
    setReady(true);
  }, []);

  function changeTheme(nextTheme: Theme) {
    setTheme(nextTheme);
    localStorage.setItem(
      "alumniconnect-theme",
      nextTheme
    );

    applyTheme(nextTheme);
  }

  if (!ready) {
    return (
      <div
        className="
          h-12 w-[164px]
          rounded-2xl
          border border-white/20
          bg-white/50 dark:bg-white/10
          backdrop-blur-3xl
        "
      />
    );
  }

  return (
    <div
      className="
        flex items-center gap-1
        rounded-2xl
        border border-white/30
        bg-white/70
        dark:bg-slate-900/70
        p-1
        shadow-xl
        backdrop-blur-3xl
      "
    >
      <button
        type="button"
        onClick={() => changeTheme("light")}
        aria-label="Use light theme"
        className={`
          flex h-10 w-10 items-center justify-center
          rounded-xl
          transition-all duration-200
          active:scale-90
          ${
            theme === "light"
              ? "bg-white text-sky-500 shadow-md"
              : "text-slate-500 hover:bg-white/60"
          }
        `}
      >
        <Sun size={19} />
      </button>

      <button
        type="button"
        onClick={() => changeTheme("system")}
        aria-label="Use system theme"
        className={`
          flex h-10 w-10 items-center justify-center
          rounded-xl
          transition-all duration-200
          active:scale-90
          ${
            theme === "system"
              ? "bg-sky-500 text-white shadow-md"
              : "text-slate-500 hover:bg-white/60"
          }
        `}
      >
        <Monitor size={18} />
      </button>

      <button
        type="button"
        onClick={() => changeTheme("dark")}
        aria-label="Use dark theme"
        className={`
          flex h-10 w-10 items-center justify-center
          rounded-xl
          transition-all duration-200
          active:scale-90
          ${
            theme === "dark"
              ? "bg-slate-950 text-white shadow-md"
              : "text-slate-500 hover:bg-white/60"
          }
        `}
      >
        <Moon size={19} />
      </button>
    </div>
  );
}
