"use client";

import { Bell, Lock, Palette, UserRound } from "lucide-react";

export default function SettingsPage() {
  return (
    <main className="space-y-8">
      <section className="relative overflow-hidden rounded-[36px] border border-white/60 bg-gradient-to-br from-sky-500 via-blue-600 to-indigo-700 p-8 text-white shadow-[0_35px_100px_rgba(37,99,235,.28)] sm:p-10">
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/15 blur-3xl" />

        <div className="relative z-10">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/60">
            AlumniConnect
          </p>

          <h1 className="mt-2 text-4xl font-black tracking-tight">
            Settings
          </h1>

          <p className="mt-3 max-w-xl text-sm leading-7 text-white/75">
            Manage your account, notifications, privacy and application
            preferences.
          </p>
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-2">
        {[
          {
            icon: UserRound,
            title: "Account",
            text: "Manage your profile and personal information.",
          },
          {
            icon: Palette,
            title: "Appearance",
            text: "Control your light and dark theme preferences.",
          },
          {
            icon: Bell,
            title: "Notifications",
            text: "Choose when AlumniConnect should notify you.",
          },
          {
            icon: Lock,
            title: "Privacy & Security",
            text: "Manage account security and privacy settings.",
          },
        ].map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.title}
              className="group relative overflow-hidden rounded-[30px] border border-white/60 bg-white/55 p-6 text-left shadow-[0_24px_70px_rgba(15,23,42,.10)] backdrop-blur-3xl transition hover:-translate-y-1 hover:shadow-[0_32px_80px_rgba(15,23,42,.15)] dark:border-white/10 dark:bg-white/[0.045] dark:shadow-[0_28px_75px_rgba(0,0,0,.28)]"
            >
              <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-sky-400/10 blur-3xl" />

              <div className="relative z-10">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-600 dark:bg-blue-500/15 dark:text-blue-300">
                  <Icon size={21} />
                </div>

                <h2 className="mt-5 text-lg font-black text-slate-950 dark:text-white">
                  {item.title}
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-white/40">
                  {item.text}
                </p>
              </div>
            </button>
          );
        })}
      </section>
    </main>
  );
}
