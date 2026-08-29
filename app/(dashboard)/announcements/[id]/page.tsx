import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Calendar,
  MapPin,
  ArrowUpRight,
  ArrowLeft,
  Sparkles,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";

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
  created_at: string;
};

function formatEventDate(dateString?: string | null): string | null {
  if (!dateString) return null;
  try {
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return null;
    return new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(date);
  } catch {
    return null;
  }
}

function formatCreatedAt(dateString: string): string {
  try {
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return "";
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  } catch {
    return "";
  }
}

export default async function AnnouncementDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: announcement, error } = await supabase
    .from("announcements")
    .select(
      "id, title, body, image_url, event_date, venue, action_label, action_url, featured, created_at"
    )
    .eq("id", id)
    .single();

  if (error || !announcement) {
    notFound();
  }

  const data = announcement as Announcement;
  const formattedDate = formatEventDate(data.event_date);
  const publishedAt = formatCreatedAt(data.created_at);
  const hasImage = Boolean(data.image_url);

  return (
    <div className="relative min-h-screen">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-32 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-blue-500/15 blur-[120px] dark:bg-blue-600/12" />
        <div className="absolute bottom-0 right-0 h-[360px] w-[500px] rounded-full bg-indigo-500/10 blur-[100px] dark:bg-indigo-600/8" />
      </div>

      <div className="mx-auto w-full max-w-4xl px-4 pb-20 pt-6 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link
            href="/announcements"
            className={cn(
              "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium",
              "bg-white/60 text-zinc-700 backdrop-blur-xl dark:bg-zinc-900/60 dark:text-zinc-300",
              "border border-white/30 dark:border-white/10",
              "shadow-sm transition-all duration-300",
              "hover:bg-white/80 hover:text-zinc-900 dark:hover:bg-zinc-900/80 dark:hover:text-zinc-100",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50"
            )}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to announcements
          </Link>
        </div>

        <article
          className={cn(
            "overflow-hidden rounded-3xl",
            "border border-white/20 dark:border-white/10",
            "bg-white/70 dark:bg-zinc-900/60",
            "backdrop-blur-2xl backdrop-saturate-150",
            "shadow-[0_12px_48px_rgba(0,0,0,0.08)] dark:shadow-[0_12px_48px_rgba(0,0,0,0.4)]"
          )}
        >
          {hasImage && (
            <div className="relative aspect-[21/9] w-full overflow-hidden sm:aspect-[2.4/1]">
              <Image
                src={data.image_url!}
                alt={data.title}
                fill
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 896px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              {data.featured && (
                <div className="absolute left-5 top-5 sm:left-6 sm:top-6">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/95 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-white shadow-lg backdrop-blur-md">
                    <Sparkles className="h-3.5 w-3.5" />
                    Featured
                  </span>
                </div>
              )}
            </div>
          )}

          <div className="p-6 sm:p-8 md:p-10">
            {!hasImage && data.featured && (
              <div className="mb-5">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/90 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-white shadow-sm">
                  <Sparkles className="h-3.5 w-3.5" />
                  Featured
                </span>
              </div>
            )}

            <h1 className="mb-4 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl md:text-[2.75rem] md:leading-[1.15]">
              {data.title}
            </h1>

            <div className="mb-6 flex flex-wrap items-center gap-3">
              {formattedDate && (
                <div className="inline-flex items-center gap-2 rounded-full bg-zinc-100/80 px-3.5 py-1.5 text-sm font-medium text-zinc-700 dark:bg-zinc-800/80 dark:text-zinc-300">
                  <Calendar className="h-4 w-4 text-blue-500" />
                  {formattedDate}
                </div>
              )}
              {data.venue && (
                <div className="inline-flex items-center gap-2 rounded-full bg-zinc-100/80 px-3.5 py-1.5 text-sm font-medium text-zinc-700 dark:bg-zinc-800/80 dark:text-zinc-300">
                  <MapPin className="h-4 w-4 text-blue-500" />
                  {data.venue}
                </div>
              )}
              {publishedAt && (
                <span className="text-sm text-zinc-500 dark:text-zinc-400">
                  Published {publishedAt}
                </span>
              )}
            </div>

            {data.body && (
              <div className="prose prose-zinc mb-8 max-w-none dark:prose-invert prose-p:text-[16px] prose-p:leading-relaxed prose-p:text-zinc-600 dark:prose-p:text-zinc-300">
                {data.body.split("\n").map((paragraph, index) =>
                  paragraph.trim() ? (
                    <p key={index} className="mb-4 last:mb-0">
                      {paragraph}
                    </p>
                  ) : null
                )}
              </div>
            )}

            {data.action_url && data.action_label && (
              <div className="pt-2">
                <a
                  href={data.action_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "inline-flex items-center gap-2.5 rounded-full px-6 py-3 text-[15px] font-semibold",
                    "bg-blue-500 text-white shadow-lg shadow-blue-500/25",
                    "transition-all duration-300",
                    "hover:bg-blue-600 hover:shadow-blue-500/40 hover:scale-[1.03]",
                    "active:scale-100",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  )}
                >
                  {data.action_label}
                  <ArrowUpRight className="h-4.5 w-4.5" />
                </a>
              </div>
            )}
          </div>
        </article>
      </div>
    </div>
  );
}
