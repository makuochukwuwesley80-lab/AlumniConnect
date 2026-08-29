"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Menu,
  X,
  Sun,
  Moon,
  GraduationCap,
  LayoutDashboard,
  Users,
  Bell,
  UserCircle,
  MessageCircle,
} from "lucide-react";

export default function MobileHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dark, setDark] = useState(false);

  function toggleTheme() {
    const nextDark = !dark;
    setDark(nextDark);

    if (nextDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }

  return (
    <>
      <header
        className="
          sticky top-0 z-50
          flex h-16 items-center justify-between
          border-b border-white/20
          bg-white/70 px-4
          backdrop-blur-3xl
          dark:border-white/10
          dark:bg-slate-950/70
          md:hidden
        "
      >
        <Link
          href="/dashboard"
          className="flex items-center gap-3"
          onClick={() => setMenuOpen(false)}
        >
          <div
            className="
              flex h-10 w-10 items-center justify-center
              rounded-2xl
              bg-blue-500
              text-white
              shadow-lg shadow-blue-500/25
            "
          >
            <GraduationCap size={22} strokeWidth={2.2} />
          </div>

          <div className="leading-tight">
            <div className="text-sm font-semibold tracking-tight text-slate-900 dark:text-white">
              AlumniConnect
            </div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400">
              Alumni Network
            </div>
          </div>
        </Link>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="
              flex h-10 w-10 items-center justify-center
              rounded-full
              border border-black/5
              bg-white/60
              text-slate-700
              shadow-sm
              backdrop-blur-xl
              transition
              hover:scale-105
              dark:border-white/10
              dark:bg-white/10
              dark:text-white
            "
          >
            {dark ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <button
            type="button"
            onClick={() => setMenuOpen((value) => !value)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            className="
              flex h-10 w-10 items-center justify-center
              rounded-full
              border border-black/5
              bg-white/60
              text-slate-700
              shadow-sm
              backdrop-blur-xl
              transition
              hover:scale-105
              dark:border-white/10
              dark:bg-white/10
              dark:text-white
            "
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {menuOpen && (
        <div
          className="
            fixed inset-0 z-40 md:hidden
            bg-black/20 backdrop-blur-sm
          "
          onClick={() => setMenuOpen(false)}
        >
          <nav
            onClick={(event) => event.stopPropagation()}
            className="
              absolute right-3 top-[72px] w-[calc(100%-24px)]
              overflow-hidden rounded-3xl
              border border-white/30
              bg-white/85
              p-3
              shadow-2xl shadow-black/10
              backdrop-blur-3xl
              dark:border-white/10
              dark:bg-slate-950/90
            "
          >
            <MobileLink
              href="/dashboard"
              icon={<LayoutDashboard size={19} />}
              label="Dashboard"
              close={() => setMenuOpen(false)}
            />

            <MobileLink
              href="/alumni"
              icon={<Users size={19} />}
              label="Alumni Directory"
              close={() => setMenuOpen(false)}
            />

            <MobileLink
              href="/messages"
              icon={<MessageCircle size={19} />}
              label="Messages"
              close={() => setMenuOpen(false)}
            />

            <MobileLink
              href="/notifications"
              icon={<Bell size={19} />}
              label="Notifications"
              close={() => setMenuOpen(false)}
            />

            <MobileLink
              href="/profile"
              icon={<UserCircle size={19} />}
              label="My Profile"
              close={() => setMenuOpen(false)}
            />
          </nav>
        </div>
      )}
    </>
  );
}

function MobileLink({
  href,
  icon,
  label,
  close,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  close: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={close}
      className="
        flex items-center gap-3
        rounded-2xl px-4 py-3
        text-sm font-medium
        text-slate-700
        transition
        hover:bg-blue-500/10
        hover:text-blue-600
        dark:text-slate-200
        dark:hover:bg-blue-500/15
        dark:hover:text-blue-400
      "
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}
