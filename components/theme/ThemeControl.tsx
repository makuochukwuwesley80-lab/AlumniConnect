"use client";

import ThemeSwitcher from "./ThemeSwitcher";

export default function ThemeControl() {
  return (
    <div className="fixed bottom-5 right-5 z-50">
      <ThemeSwitcher />
    </div>
  );
}
