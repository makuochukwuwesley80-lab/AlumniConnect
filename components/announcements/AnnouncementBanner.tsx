"use client";

import { ArrowRight, CalendarDays, MapPin, Megaphone } from "lucide-react";

type Announcement = {
  title: string;
  body?: string | null;
  image_url?: string | null;
  event_date?: string | null;
  venue?: string | null;
  action_label?: string | null;
  action_url?: string | null;
};

type Props = {
  announcement: Announcement;
};

export default function AnnouncementBanner({ announcement }: Props) {
  const date = announcement.event_date
    ? new Date(announcement.event_date).toLocaleDateString(undefined, {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : null;

  return (
    <article className="relative overflow-hidden rounded-[28px] border border-white/10 bg-slate-950 shadow-xl">
      {announcement.image_url ? (
        <img
          src={announcement.image_url}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-blue-900 to-slate-950" />
      )}

      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-black/20" />

      <div className="relative z-10 flex min-h-[230px] items-end justify-between gap-6 p-5 sm:p-7">
        <div className="max-w-2xl">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-cyan-200 backdrop-blur-xl">
            <Megaphone size={13} />
            Featured Announcement
          </div>

          <h2 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
            {announcement.title}
          </h2>

          {announcement.body && (
            <p className="mt-2 line-clamp-2 text-sm leading-6 text-white/70">
              {announcement.body}
            </p>
          )}

          <div className="mt-4 flex flex-wrap gap-2">
            {date && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-black/30 px-3 py-1.5 text-[11px] text-white/75 backdrop-blur-xl">
                <CalendarDays size={13} />
                {date}
              </span>
            )}

            {announcement.venue && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-black/30 px-3 py-1.5 text-[11px] text-white/75 backdrop-blur-xl">
                <MapPin size={13} />
                {announcement.venue}
              </span>
            )}
          </div>
        </div>

        {announcement.action_url && (
          <a
            href={announcement.action_url}
            target="_blank"
            rel="noreferrer"
            className="hidden shrink-0 items-center gap-2 rounded-2xl bg-white px-4 py-3 text-xs font-bold text-slate-900 transition hover:scale-[1.02] sm:inline-flex"
          >
            {announcement.action_label || "View Details"}
            <ArrowRight size={15} />
          </a>
        )}
      </div>
    </article>
  );
}
