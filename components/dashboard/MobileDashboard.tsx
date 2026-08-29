"use client";

import {
  Users,
  GraduationCap,
  CalendarDays,
  Briefcase,
  Megaphone,
  Menu,
  Bell,
  ArrowUpRight,
} from "lucide-react";
import Link from "next/link";

const stats = [
  {
    title: "Students",
    key: "students",
    icon: Users,
  },
  {
    title: "Alumni",
    key: "alumni",
    icon: GraduationCap,
  },
  {
    title: "Events",
    key: "events",
    icon: CalendarDays,
  },
  {
    title: "Opportunities",
    key: "jobs",
    icon: Briefcase,
  },
];

export default function MobileDashboard({
  counts = {
    students: 0,
    alumni: 0,
    events: 0,
    jobs: 0,
    announcements: 0,
  },
  email = "alu2026001@alumniconnect.app",
}: {
  counts?: {
    students: number;
    alumni: number;
    events: number;
    jobs: number;
    announcements: number;
  };
  email?: string;
}) {
  return (
    <div className="min-h-screen bg-slate-100 dark:bg-[#020617] text-slate-900 dark:text-white">

      {/* Mobile Header */}
      <header
        className="
          sticky top-0 z-50
          border-b border-white/20
          bg-white/70 dark:bg-slate-950/70
          backdrop-blur-3xl
          lg:hidden
        "
      >
        <div className="flex items-center justify-between px-5 py-4">

          <button
            className="
              flex h-11 w-11 items-center justify-center
              rounded-2xl
              border border-white/20
              bg-white/50 dark:bg-white/10
              backdrop-blur-xl
            "
          >
            <Menu size={22} />
          </button>

          <div className="text-center">
            <p className="text-xs font-medium text-sky-500">
              INCUSAAF
            </p>

            <p className="text-sm font-bold">
              AlumniConnect
            </p>
          </div>

          <button
            className="
              relative flex h-11 w-11
              items-center justify-center
              rounded-2xl
              border border-white/20
              bg-white/50 dark:bg-white/10
            "
          >
            <Bell size={21} />

            <span
              className="
                absolute right-2 top-2
                h-2 w-2 rounded-full
                bg-sky-500
              "
            />
          </button>

        </div>
      </header>

      <main className="mx-auto max-w-7xl px-5 py-7 sm:px-8 lg:px-10">

        {/* Welcome */}
        <section
          className="
            rounded-[30px]
            border border-white/30
            bg-white/65 dark:bg-white/5
            p-6
            backdrop-blur-3xl
            shadow-xl
            sm:p-8
          "
        >
          <p className="text-sm font-medium text-sky-500">
            Welcome back 👋
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Your AlumniConnect
          </h1>

          <p className="mt-2 truncate text-sm text-slate-500 dark:text-slate-400">
            {email}
          </p>
        </section>

        {/* Stats */}
        <section className="mt-6 grid grid-cols-2 gap-4">

          {stats.map((stat) => {
            const Icon = stat.icon;
            const value =
              counts[stat.key as keyof typeof counts] ?? 0;

            return (
              <div
                key={stat.key}
                className="
                  rounded-[26px]
                  border border-white/30
                  bg-white/65 dark:bg-white/5
                  p-5
                  backdrop-blur-3xl
                  shadow-lg
                  transition-transform
                  active:scale-[0.98]
                "
              >
                <div className="flex items-center justify-between">

                  <div
                    className="
                      flex h-11 w-11
                      items-center justify-center
                      rounded-2xl
                      bg-sky-500/10
                      text-sky-500
                    "
                  >
                    <Icon size={21} />
                  </div>

                  <ArrowUpRight
                    size={18}
                    className="text-slate-400"
                  />

                </div>

                <p className="mt-5 text-xs text-slate-500 dark:text-slate-400">
                  {stat.title}
                </p>

                <p className="mt-1 text-2xl font-bold">
                  {value}
                </p>
              </div>
            );
          })}

        </section>

        {/* Announcements */}
        <section
          className="
            mt-6
            rounded-[30px]
            border border-white/30
            bg-white/65 dark:bg-white/5
            p-6
            backdrop-blur-3xl
            shadow-xl
          "
        >
          <div className="flex items-center gap-3">

            <div
              className="
                flex h-11 w-11
                items-center justify-center
                rounded-2xl
                bg-sky-500/10
                text-sky-500
              "
            >
              <Megaphone size={21} />
            </div>

            <div>
              <h2 className="font-bold">
                Announcements
              </h2>

              <p className="text-xs text-slate-500 dark:text-slate-400">
                Latest INCUSAAF updates
              </p>
            </div>

          </div>

          <div className="mt-5 rounded-2xl bg-white/40 dark:bg-white/5 p-5">
            <p className="font-medium">
              {counts.announcements} announcements
            </p>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Open announcements to see the latest community updates.
            </p>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="mt-6">

          <h2 className="mb-4 text-lg font-bold">
            Quick Access
          </h2>

          <div className="grid grid-cols-2 gap-3">

            <Link
              href="/alumni"
              className="
                rounded-2xl
                border border-white/20
                bg-white/60 dark:bg-white/5
                p-5
                backdrop-blur-2xl
                transition
                active:scale-95
              "
            >
              <GraduationCap className="text-sky-500" size={23} />

              <p className="mt-3 font-semibold">
                Alumni
              </p>
            </Link>

            <Link
              href="/events"
              className="
                rounded-2xl
                border border-white/20
                bg-white/60 dark:bg-white/5
                p-5
                backdrop-blur-2xl
                transition
                active:scale-95
              "
            >
              <CalendarDays className="text-sky-500" size={23} />

              <p className="mt-3 font-semibold">
                Events
              </p>
            </Link>

            <Link
              href="/opportunities"
              className="
                rounded-2xl
                border border-white/20
                bg-white/60 dark:bg-white/5
                p-5
                backdrop-blur-2xl
                transition
                active:scale-95
              "
            >
              <Briefcase className="text-sky-500" size={23} />

              <p className="mt-3 font-semibold">
                Opportunities
              </p>
            </Link>

            <Link
              href="/settings"
              className="
                rounded-2xl
                border border-white/20
                bg-white/60 dark:bg-white/5
                p-5
                backdrop-blur-2xl
                transition
                active:scale-95
              "
            >
              <Users className="text-sky-500" size={23} />

              <p className="mt-3 font-semibold">
                Profile
              </p>
            </Link>

          </div>

        </section>

      </main>
    </div>
  );
}
