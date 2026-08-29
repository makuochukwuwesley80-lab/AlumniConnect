"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight,
  Bell,
  BriefcaseBusiness,
  CalendarDays,
  Megaphone,
  MessageCircle,
  Sparkles,
  Users,
} from "lucide-react";

interface DashboardViewProps {
  counts: {
    alumni: number;
    events: number;
    messages: number;
    announcements: number;
  };
  recentAnnouncements: any[];
  opportunities: any[];
}

const stats = [
  {
    key: "alumni",
    label: "Alumni",
    icon: Users,
    href: "/students",
    tone: "from-sky-500 to-blue-600",
  },
  {
    key: "events",
    label: "Events",
    icon: CalendarDays,
    href: "/events",
    tone: "from-violet-500 to-indigo-600",
  },
  {
    key: "messages",
    label: "Messages",
    icon: MessageCircle,
    href: "/messages",
    tone: "from-cyan-400 to-sky-600",
  },
  {
    key: "announcements",
    label: "Announcements",
    icon: Megaphone,
    href: "/announcements",
    tone: "from-blue-500 to-indigo-700",
  },
] as const;

function timeAgo(date: string) {
  const seconds = Math.max(
    0,
    Math.floor((Date.now() - new Date(date).getTime()) / 1000)
  );

  if (seconds < 60) return "Just now";

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;

  return `${Math.floor(days / 30)}mo ago`;
}

function GlassCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.25 }}
      className={`relative overflow-hidden rounded-[30px] border border-white/60 bg-white/55 p-6 shadow-[0_24px_70px_rgba(15,23,42,.10)] backdrop-blur-3xl dark:border-white/10 dark:bg-white/[0.045] dark:shadow-[0_30px_80px_rgba(0,0,0,.32)] ${className}`}
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/35 via-white/5 to-transparent dark:from-white/10 dark:via-transparent" />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}

export default function DashboardView({
  counts,
  recentAnnouncements,
  opportunities,
}: DashboardViewProps) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.08,
          },
        },
      }}
      className="space-y-7"
    >
      <motion.section
        variants={{
          hidden: { opacity: 0, y: 18 },
          visible: { opacity: 1, y: 0 },
        }}
        className="relative overflow-hidden rounded-[36px] border border-white/60 bg-gradient-to-br from-sky-500 via-blue-600 to-indigo-700 p-7 text-white shadow-[0_35px_100px_rgba(37,99,235,.28)] sm:p-9 lg:p-11"
      >
        <div className="absolute -right-24 -top-28 h-80 w-80 rounded-full bg-white/15 blur-3xl" />
        <div className="absolute -bottom-32 right-1/3 h-72 w-72 rounded-full bg-cyan-300/15 blur-3xl" />

        <div className="relative z-10 max-w-4xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold backdrop-blur-xl">
            <Sparkles size={14} />
            AlumniConnect
          </div>

          <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
            Welcome back.
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-white/75 sm:text-base">
            Your alumni community, conversations, opportunities and upcoming
            moments — beautifully organized in one place.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/students"
              className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-bold text-blue-700 shadow-xl transition hover:-translate-y-0.5"
            >
              Explore Alumni
              <ArrowRight size={16} />
            </Link>

            <Link
              href="/general"
              className="inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur-xl transition hover:bg-white/15"
            >
              Open General Chat
              <MessageCircle size={16} />
            </Link>
          </div>
        </div>
      </motion.section>

      <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const value = counts[stat.key];

          return (
            <motion.div
              key={stat.key}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.25 }}
            >
              <Link href={stat.href} className="block">
                <div className="group relative overflow-hidden rounded-[28px] border border-white/60 bg-white/55 p-5 shadow-[0_24px_70px_rgba(15,23,42,.10)] backdrop-blur-3xl dark:border-white/10 dark:bg-white/[0.045] dark:shadow-[0_28px_75px_rgba(0,0,0,.28)]">
                  <div
                    className={`absolute -right-10 -top-10 h-28 w-28 rounded-full bg-gradient-to-br ${stat.tone} opacity-15 blur-2xl`}
                  />

                  <div className="relative z-10 flex items-start justify-between">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400 dark:text-white/35">
                        {stat.label}
                      </p>
                      <p className="mt-3 text-4xl font-black tracking-tight text-slate-950 dark:text-white">
                        {value.toLocaleString()}
                      </p>
                    </div>

                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${stat.tone} text-white shadow-lg`}
                    >
                      <Icon size={21} />
                    </div>
                  </div>

                  <div className="mt-5 flex items-center gap-2 text-xs font-semibold text-blue-600 dark:text-blue-300">
                    Open section
                    <ArrowRight
                      size={14}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.45fr_.85fr]">
        <GlassCard className="min-h-[390px]">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-500 dark:text-blue-300">
                Community pulse
              </p>
              <h2 className="mt-1 text-2xl font-black tracking-tight text-slate-950 dark:text-white">
                Latest announcements
              </h2>
            </div>

            <Link
              href="/announcements"
              className="rounded-xl border border-white/60 bg-white/60 px-3 py-2 text-xs font-bold text-slate-600 shadow-sm dark:border-white/10 dark:bg-white/[0.06] dark:text-white/60"
            >
              View all
            </Link>
          </div>

          {recentAnnouncements.length === 0 ? (
            <div className="flex min-h-[250px] items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-slate-50/60 text-center dark:border-white/10 dark:bg-white/[0.025]">
              <div>
                <Megaphone className="mx-auto mb-3 text-slate-300 dark:text-white/20" />
                <p className="text-sm font-semibold text-slate-500 dark:text-white/45">
                  No announcements yet
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {recentAnnouncements.map((announcement) => (
                <Link
                  key={announcement.id}
                  href={`/announcements/${announcement.id}`}
                  className="group flex items-center gap-4 rounded-2xl border border-transparent p-4 transition hover:border-white/60 hover:bg-white/55 dark:hover:border-white/10 dark:hover:bg-white/[0.04]"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-600 dark:bg-blue-500/15 dark:text-blue-300">
                    <Megaphone size={18} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-slate-800 dark:text-white/90">
                      {announcement.title}
                    </p>
                    <p className="mt-1 truncate text-xs text-slate-400 dark:text-white/35">
                      {announcement.content || "Community announcement"}
                    </p>
                  </div>

                  <span className="shrink-0 text-[11px] font-medium text-slate-400 dark:text-white/30">
                    {timeAgo(announcement.created_at)}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </GlassCard>

        <div className="space-y-6">
          <GlassCard>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-500 dark:text-cyan-300">
                  Discover
                </p>
                <h2 className="mt-1 text-xl font-black text-slate-950 dark:text-white">
                  Opportunities
                </h2>
              </div>

              <BriefcaseBusiness className="text-slate-300 dark:text-white/20" />
            </div>

            <div className="mt-5 space-y-3">
              {opportunities.length === 0 ? (
                <p className="text-sm text-slate-400 dark:text-white/30">
                  No opportunities posted yet.
                </p>
              ) : (
                opportunities.map((opportunity) => (
                  <div
                    key={opportunity.id}
                    className="rounded-2xl border border-white/50 bg-white/40 p-3 dark:border-white/10 dark:bg-white/[0.03]"
                  >
                    <p className="truncate text-sm font-bold text-slate-800 dark:text-white">
                      {opportunity.title}
                    </p>
                    <p className="mt-1 truncate text-xs text-slate-400 dark:text-white/35">
                      {opportunity.company || "Community opportunity"}
                    </p>
                  </div>
                ))
              )}
            </div>
          </GlassCard>

          <GlassCard>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-600 dark:bg-blue-500/15 dark:text-blue-300">
                <Bell size={19} />
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400 dark:text-white/30">
                  Stay connected
                </p>
                <h3 className="mt-1 text-lg font-black text-slate-950 dark:text-white">
                  Your community is waiting.
                </h3>
              </div>
            </div>

            <p className="mt-4 text-sm leading-6 text-slate-500 dark:text-white/45">
              Discover alumni, join conversations and never miss an important
              community moment.
            </p>
          </GlassCard>
        </div>
      </section>
    </motion.div>
  );
}
