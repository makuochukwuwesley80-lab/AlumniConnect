"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import {
  Bell,
  BriefcaseBusiness,
  CalendarDays,
  Home,
  LogOut,
  Mail,
  Megaphone,
  Moon,
  Search,
  Settings,
  Sun,
  Users,
  X,
} from "lucide-react";
import { supabase } from "@/lib/supabase/client";

const navigation = [
  { label: "Overview", href: "/dashboard", icon: Home },
  { label: "Students", href: "/students", icon: Users },
  { label: "Events", href: "/events", icon: CalendarDays },
  { label: "Messages", href: "/messages", icon: Mail },
  { label: "Announcements", href: "/announcements", icon: Megaphone },
  { label: "Opportunities", href: "/opportunities", icon: BriefcaseBusiness },
];

export default function AppShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  async function logout() {
    await supabase.auth.signOut();
    router.replace("/login");
    router.refresh();
  }

  const isDark = mounted && (theme === "dark" || resolvedTheme === "dark");

  return (
    <div className="min-h-screen bg-[#edf5ff] text-slate-950 transition-colors duration-500 dark:bg-[#020617] dark:text-white">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-32 h-[500px] w-[500px] rounded-full bg-sky-400/20 blur-[140px] dark:bg-sky-500/10" />
        <div className="absolute -right-40 top-20 h-[520px] w-[520px] rounded-full bg-blue-500/15 blur-[150px] dark:bg-blue-600/10" />
        <div className="absolute bottom-[-240px] left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-cyan-400/10 blur-[150px] dark:bg-cyan-500/5" />
      </div>

      {open && (
        <button
          aria-label="Close navigation"
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/30 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[280px] flex-col border-r border-white/60 bg-white/60 p-5 backdrop-blur-3xl transition-transform duration-300 dark:border-white/10 dark:bg-[#06101f]/75 ${
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex items-center justify-between">
          <Link href="/dashboard" onClick={() => setOpen(false)} className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-[18px] bg-gradient-to-br from-sky-400 via-blue-600 to-cyan-400 text-lg font-black text-white shadow-[0_16px_40px_rgba(37,99,235,.30)]">
              A
            </div>

            <div>
              <p className="text-sm font-black tracking-tight text-slate-950 dark:text-white">
                AlumniConnect
              </p>
              <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400 dark:text-white/30">
                Alumni Community
              </p>
            </div>
          </Link>

          <button
            onClick={() => setOpen(false)}
            className="rounded-xl p-2 text-slate-400 hover:bg-slate-900/5 dark:hover:bg-white/10 lg:hidden"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mt-10">
          <p className="px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-white/25">
            Workspace
          </p>

          <nav className="mt-3 space-y-1.5">
            {navigation.map((item) => {
              const Icon = item.icon;
              const active =
                pathname === item.href ||
                pathname.startsWith(`${item.href}/`);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`group flex items-center gap-3 rounded-2xl px-3 py-3 transition-all duration-200 ${
                    active
                      ? "bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-[0_12px_32px_rgba(37,99,235,.28)]"
                      : "text-slate-500 hover:bg-white/70 hover:text-slate-950 dark:text-white/50 dark:hover:bg-white/[0.07] dark:hover:text-white"
                  }`}
                >
                  <span
                    className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                      active
                        ? "bg-white/15"
                        : "bg-slate-900/[0.04] dark:bg-white/[0.04]"
                    }`}
                  >
                    <Icon size={18} />
                  </span>

                  <span className="text-sm font-semibold">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="mt-auto space-y-3">
          <Link
            href="/settings"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 rounded-2xl px-3 py-3 text-slate-500 transition hover:bg-white/70 hover:text-slate-950 dark:text-white/45 dark:hover:bg-white/[0.07] dark:hover:text-white"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900/[0.04] dark:bg-white/[0.04]">
              <Settings size={18} />
            </span>
            <span className="text-sm font-semibold">Settings</span>
          </Link>

          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-slate-500 transition hover:bg-red-500/10 hover:text-red-500 dark:text-white/45 dark:hover:text-red-300"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/5 dark:bg-red-500/10">
              <LogOut size={18} />
            </span>
            <span className="text-sm font-semibold">Log out</span>
          </button>
        </div>
      </aside>

      <div className="relative lg:pl-[280px]">
        <header className="sticky top-0 z-30 border-b border-white/60 bg-white/45 backdrop-blur-3xl dark:border-white/10 dark:bg-[#020617]/55">
          <div className="flex h-[76px] items-center gap-4 px-4 sm:px-6 lg:px-8">
            <button
              onClick={() => setOpen(true)}
              className="rounded-2xl border border-white/60 bg-white/55 p-2.5 text-slate-600 shadow-sm dark:border-white/10 dark:bg-white/[0.05] dark:text-white/70 lg:hidden"
            >
              <MenuIcon />
            </button>

            <div className="hidden flex-1 md:block">
              <div className="mx-auto max-w-xl rounded-2xl border border-white/60 bg-white/50 px-4 py-3 backdrop-blur-2xl dark:border-white/10 dark:bg-white/[0.04]">
                <div className="flex items-center gap-3">
                  <Search size={17} className="text-slate-400 dark:text-white/30" />
                  <input
                    aria-label="Search AlumniConnect"
                    placeholder="Search AlumniConnect"
                    className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400 dark:text-white dark:placeholder:text-white/25"
                  />
                  <span className="hidden rounded-lg bg-slate-900/5 px-2 py-1 text-[10px] text-slate-400 dark:bg-white/5 dark:text-white/25 lg:block">
                    /
                  </span>
                </div>
              </div>
            </div>

            <div className="ml-auto flex items-center gap-2">
              <button className="relative rounded-2xl border border-white/60 bg-white/50 p-3 text-slate-500 shadow-sm backdrop-blur-2xl transition hover:bg-white dark:border-white/10 dark:bg-white/[0.04] dark:text-white/55 dark:hover:bg-white/[0.07]">
                <Bell size={18} />
                <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-sky-500" />
              </button>

              {mounted && (
                <div className="flex items-center rounded-2xl border border-white/60 bg-white/50 p-1 backdrop-blur-2xl dark:border-white/10 dark:bg-white/[0.04]">
                  <button
                    onClick={() => setTheme("light")}
                    className={`rounded-xl p-2.5 transition ${
                      !isDark
                        ? "bg-white text-blue-600 shadow-sm"
                        : "text-slate-400 hover:text-slate-800 dark:text-white/35 dark:hover:text-white"
                    }`}
                    aria-label="Light mode"
                  >
                    <Sun size={16} />
                  </button>

                  <button
                    onClick={() => setTheme("dark")}
                    className={`rounded-xl p-2.5 transition ${
                      isDark
                        ? "bg-blue-600 text-white shadow-sm"
                        : "text-slate-400 hover:text-slate-800"
                    }`}
                    aria-label="Dark mode"
                  >
                    <Moon size={16} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="min-h-[calc(100vh-76px)] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="mx-auto w-full max-w-[1600px]"
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}

function MenuIcon() {
  return (
    <span className="flex h-5 w-5 flex-col justify-center gap-1.5">
      <span className="block h-0.5 w-5 rounded-full bg-current" />
      <span className="block h-0.5 w-3.5 rounded-full bg-current" />
      <span className="block h-0.5 w-5 rounded-full bg-current" />
    </span>
  );
}
