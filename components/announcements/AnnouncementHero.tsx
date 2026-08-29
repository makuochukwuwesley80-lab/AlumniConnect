"use client";

import { useRouter } from "next/navigation";
import { useState, useCallback, type KeyboardEvent, type MouseEvent } from "react";
import { motion } from "framer-motion";
import { CalendarDays, MapPin, Sparkles, ArrowUpRight, ImageOff } from "lucide-react";

type Announcement = {
  id: string;
  title: string;
  body?: string | null;
  image_url?: string | null;
  event_date?: string | null;
  venue?: string | null;
  action_label?: string | null;
  action_url?: string | null;
  featured?: boolean | null;
};

type AnnouncementHeroProps = {
  announcement: Announcement;
};

function formatEventDate(dateString?: string | null): string | null {
  if (!dateString) return null;
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export default function AnnouncementHero({ announcement }: AnnouncementHeroProps) {
  const router = useRouter();
  const [imageFailed, setImageFailed] = useState(false);

  const {
    id,
    title,
    body,
    image_url,
    event_date,
    venue,
    action_label,
    action_url,
    featured,
  } = announcement;

  const formattedDate = formatEventDate(event_date);
  const hasImage = Boolean(image_url) && !imageFailed;
  const hasAction = Boolean(action_url);

  const navigateToDetail = useCallback(() => {
    router.push(`/announcements/${id}`);
  }, [router, id]);

  const handleCardClick = useCallback(() => {
    navigateToDetail();
  }, [navigateToDetail]);

  const handleCardKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        navigateToDetail();
      }
    },
    [navigateToDetail]
  );

  const handleActionClick = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation();
      if (action_url) {
        window.open(action_url, "_blank", "noopener,noreferrer");
      }
    },
    [action_url]
  );

  return (
    <div className="relative px-2 pb-16 pt-2 md:px-4">
      <motion.div
        role="button"
        tabIndex={0}
        aria-label={`View announcement: ${title}`}
        onClick={handleCardClick}
        onKeyDown={handleCardKeyDown}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        whileHover={{ y: -10 }}
        whileTap={{ scale: 0.99 }}
        className="group before:pointer-events-none before:absolute before:-bottom-12 before:left-12 before:right-12 before:h-28 before:rounded-full before:bg-cyan-500/30 before:opacity-80 before:blur-[80px] before:transition-opacity before:duration-500 group-hover:before:opacity-100 relative isolate flex h-[500px] w-full cursor-pointer flex-col justify-end overflow-hidden rounded-[44px] md:h-[600px] md:rounded-[48px] shadow-[0_35px_90px_rgba(0,0,0,.35),0_80px_140px_rgba(0,90,255,.18)] transition-shadow duration-500 ease-out hover:shadow-[0_45px_110px_rgba(0,0,0,.45),0_100px_170px_rgba(0,120,255,.28)] focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/70 focus-visible:ring-offset-4 focus-visible:ring-offset-black"
      >
        <motion.div
          aria-hidden
          className="pointer-events-none absolute -inset-16 -z-10 rounded-[64px] bg-cyan-400/20 blur-3xl"
          animate={{ opacity: [0.35, 0.6, 0.35] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          aria-hidden
          className="pointer-events-none absolute -left-24 -top-24 -z-10 h-72 w-72 rounded-full bg-blue-500/30 blur-[100px]"
          animate={{ opacity: [0.4, 0.7, 0.4], x: [0, 20, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          aria-hidden
          className="pointer-events-none absolute -right-24 -bottom-24 -z-10 h-80 w-80 rounded-full bg-cyan-500/25 blur-[110px]"
          animate={{ opacity: [0.3, 0.6, 0.3], x: [0, -20, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="absolute inset-0 -z-10 bg-neutral-900">
          {hasImage ? (
            <motion.img
              src={image_url ?? undefined}
              alt={title}
              onError={() => setImageFailed(true)}
              className="h-full w-full object-cover"
              initial={{ scale: 1.05 }}
              animate={{ scale: 1.05 }}
              whileHover={{ scale: 1.16 }}
              transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-neutral-900 via-blue-950 to-neutral-950">
              <ImageOff className="h-16 w-16 text-white/20" strokeWidth={1} />
            </div>
          )}
        </div>

        <div className="pointer-events-none absolute inset-0 -z-[5] bg-gradient-to-t from-black/85 via-black/40 to-black/10" />
        <div className="pointer-events-none absolute inset-0 -z-[5] bg-gradient-to-br from-blue-950/40 via-transparent to-cyan-900/30" />
        <div className="pointer-events-none absolute inset-0 -z-[5] bg-gradient-to-r from-black/50 via-transparent to-black/20" />

        <div className="pointer-events-none absolute inset-0 -z-[4] backdrop-blur-[2px] [mask-image:linear-gradient(to_top,black,black_45%,transparent_75%)]" />

        <div className="pointer-events-none absolute inset-0 -z-[4] opacity-0 transition-opacity duration-700 group-hover:opacity-100">
          <motion.div
            aria-hidden
            className="absolute inset-y-0 -left-1/3 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            animate={{ x: ["0%", "400%"] }}
            transition={{ duration: 1.4, ease: "easeInOut" }}
          />
        </div>

        <div className="pointer-events-none absolute inset-0 -z-[4] rounded-[44px] ring-1 ring-inset ring-white/15 transition-all duration-500 group-hover:ring-cyan-200/30 md:rounded-[48px]" />
        <div className="pointer-events-none absolute inset-x-0 top-0 -z-[4] h-1/2 rounded-t-[44px] bg-gradient-to-b from-white/12 to-transparent md:rounded-t-[48px]" />
        <div className="pointer-events-none absolute inset-0 -z-[4] rounded-[44px] shadow-[inset_0_1px_1px_rgba(255,255,255,0.35),inset_0_-1px_1px_rgba(255,255,255,0.05)] md:rounded-[48px]" />

        <div className="relative z-10 flex flex-wrap items-center gap-3 px-8 pt-8 md:px-14 md:pt-12">
          {featured ? (
            <motion.span
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-xs font-medium tracking-wide text-white backdrop-blur-xl"
            >
              <Sparkles className="h-3.5 w-3.5 text-cyan-300" strokeWidth={2} />
              Featured
            </motion.span>
          ) : null}

          {formattedDate ? (
            <motion.span
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-medium tracking-wide text-white/90 backdrop-blur-xl"
            >
              <CalendarDays className="h-3.5 w-3.5 text-white/70" strokeWidth={2} />
              {formattedDate}
            </motion.span>
          ) : null}

          {venue ? (
            <motion.span
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-medium tracking-wide text-white/90 backdrop-blur-xl"
            >
              <MapPin className="h-3.5 w-3.5 text-white/70" strokeWidth={2} />
              {venue}
            </motion.span>
          ) : null}
        </div>

        <div className="relative z-10 flex flex-col gap-5 px-8 pb-8 md:px-14 md:pb-14">
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-3xl text-4xl font-semibold leading-[1.05] tracking-tight text-white drop-shadow-sm sm:text-5xl md:text-6xl"
          >
            {title}
          </motion.h2>

          {body ? (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-xl text-base font-normal leading-relaxed text-white/75 md:text-lg"
            >
              {body}
            </motion.p>
          ) : null}

          {hasAction ? (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="pt-2"
            >
              <motion.button
                type="button"
                onClick={handleActionClick}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="group/btn relative inline-flex items-center gap-2 overflow-hidden rounded-full border border-white/20 bg-white px-7 py-3.5 text-sm font-semibold tracking-tight text-neutral-900 shadow-[0_8px_30px_rgba(0,0,0,0.35)] transition-colors duration-300 hover:bg-white/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
              >
                <span className="relative z-10">{action_label || "Learn more"}</span>
                <ArrowUpRight
                  className="relative z-10 h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5"
                  strokeWidth={2.5}
                />
                <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-cyan-100/60 to-transparent transition-transform duration-700 group-hover/btn:translate-x-full" />
              </motion.button>
            </motion.div>
          ) : null}
        </div>
      </motion.div>
    </div>
  );
}
