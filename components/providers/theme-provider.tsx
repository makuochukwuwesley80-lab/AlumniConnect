"use client";

import * as React from "react";

type Theme = "light" | "dark" | "system";

type ThemeContextValue = {
  theme: Theme;
  setTheme: (theme: Theme | string) => void;
  resolvedTheme: "light" | "dark" | undefined;
};

const ThemeContext = React.createContext<ThemeContextValue | null>(null);

function getSystemTheme(): "light" | "dark" {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  const resolved = theme === "system" ? getSystemTheme() : theme;
  root.classList.remove("light", "dark");
  root.classList.add(resolved);
  root.style.colorScheme = resolved;
}

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "theme",
}: {
  children: React.ReactNode;
  attribute?: string;
  defaultTheme?: string;
  enableSystem?: boolean;
  disableTransitionOnChange?: boolean;
  storageKey?: string;
}) {
  const [theme, setThemeState] = React.useState<Theme>(defaultTheme as Theme);
  const [resolvedTheme, setResolvedTheme] = React.useState<
    "light" | "dark" | undefined
  >(undefined);

  React.useEffect(() => {
    const stored =
      (localStorage.getItem(storageKey) as Theme | null) ??
      (defaultTheme as Theme);
    setThemeState(stored);
    setResolvedTheme(stored === "system" ? getSystemTheme() : stored);
    applyTheme(stored);

    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      const current =
        (localStorage.getItem(storageKey) as Theme | null) ?? "system";
      if (current === "system") {
        applyTheme("system");
        setResolvedTheme(getSystemTheme());
      }
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [defaultTheme, storageKey]);

  const setTheme = React.useCallback(
    (next: Theme | string) => {
      const value = next as Theme;
      localStorage.setItem(storageKey, value);
      setThemeState(value);
      const resolved = value === "system" ? getSystemTheme() : value;
      setResolvedTheme(resolved);
      applyTheme(value);
    },
    [storageKey]
  );

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = React.useContext(ThemeContext);
  if (!ctx) {
    return {
      theme: "system" as Theme,
      setTheme: () => {},
      resolvedTheme: undefined as "light" | "dark" | undefined,
    };
  }
  return ctx;
}
