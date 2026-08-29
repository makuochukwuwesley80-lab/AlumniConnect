"use client";

import Link from "next/link";
import {
  CalendarDays,
  MapPin,
  ArrowRight,
  Megaphone,
  Sparkles,
} from "lucide-react";

export type Announcement = {
  id: string;
  title: string;
  body?: string | null;
  content?: string | null;
  image_url?: string | null;
  action_label?: string | null;
  action_url?: string | null;
  event_date?: string | null;
  venue?: string | null;
  created_at?: string | null;
};

type AnnouncementCardProps = {
  announcement: Announcement;
  featured?: boolean;
};

export default function AnnouncementCard({
  announcement,
  featured = false,
}: AnnouncementCardProps) {
  const text = announcement.body ?? announcement.content ?? "";

  const imageUrl = announcement.image_url?.trim();

  const formattedDate = announcement.event_date
    ? new Date(announcement.event_date).toLocaleDateString("en-NG", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : null;

  return (
    <article
      className={[
        "group relative isolate overflow-hidden rounded-[30px]",
        "border border-white/10 bg-white/[0.045]",
        "shadow-2xl shadow-black/20 backdrop-blur-3xl",
        "transition duration-500 hover:-translate-y-1 hover:border-cyan-300/20",
        featured ? "min-h-[390px]" : "min-h-[300px]",
      ].join(" ")}
    >
      {imageUrl ? (
        <div
          className="absolute inset-0 -z-20 bg-cover bg-center transition duration-700 group-hover:scale-105"
          style={{ backgroundImage: `url("${imageUrl}")` }}
        />
      ) : (
        <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.24),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(37,99,235,0.28),transparent_40%),linear-gradient(135deg,#081426,#071a38,#020617)]" />
      )}

      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/90 via-black/55 to-black/15" />

      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-cyan-400/[0.08] via-transparent to-blue-600/[0.12]" />

      <div className="flex min-h-full flex-col justify-between p-6 sm:p-7">
        <div>
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-cyan-200 backdrop-blur-xl">
                <Megaphone size={18} />
              </div>

              <span className="rounded-full border border-white/15 bg-black/20 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-white/75 backdrop-blur-xl">
                Announcement
              </span>
            </div>

            {featured && (
              <div className="flex items-center gap-1 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1.5 text-[10px] font-bold text-cyan-200 backdrop-blur-xl">
                <Sparkles size={12} />
                Featured
              </div>
            )}
          </div>

          <div className="mt-10 max-w-3xl">
            <h2
              className={[
                "font-black tracking-tight text-white drop-shadow-lg",
                featured
                  ? "text-3xl sm:text-5xl"
                  : "text-2xl sm:text-3xl",
              ].join(" ")}
            >
              {announcement.title}
            </h2>

            {text && (
              <p className="mt-4 max-w-2xl whitespace-pre-wrap text-sm leading-6 text-white/75 sm:text-base">
                {text}
              </p>
            )}
          </div>
        </div>

        <div className="mt-8">
          {(formattedDate || announcement.venue) && (
            <div className="mb-5 flex flex-wrap gap-2">
              {formattedDate && (
                <div className="flex items-center gap-2 rounded-full border border-white/10 bg-black/25 px-3 py-2 text-xs font-medium text-white/75 backdrop-blur-xl">
                  <CalendarDays size={14} className="text-cyan-300" />
                  {formattedDate}
                </div>
              )}

              {announcement.venue && (
                <div className="flex items-center gap-2 rounded-full border border-white/10 bg-black/25 px-3 py-2 text-xs font-medium text-white/75 backdrop-blur-xl">
                  <MapPin size={14} className="text-cyan-300" />
                  {announcement.venue}
                </div>
              )}
            </div>
          )}

          {announcement.action_url && announcement.action_label ? (
            <Link
              href={announcement.action_url}
              className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-5 py-3 text-sm font-bold text-white shadow-xl backdrop-blur-xl transition hover:bg-white/20"
            >
              {announcement.action_label}
              <ArrowRight size={17} />
            </Link>
          ) : (
            <div className="text-[11px] font-medium text-white/35">
              AlumniConnect Community
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
