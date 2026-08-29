"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { AdminAnnouncement } from "@/types/announcement";
import {
  createAnnouncement,
  updateAnnouncement,
} from "@/lib/actions/announcements";
import ImageUpload from "@/components/admin/ImageUpload";
import GlassInput from "@/components/apple/GlassInput";
import GlassButton from "@/components/apple/GlassButton";

type AnnouncementFormProps = {
  announcement?: AdminAnnouncement; // if present → edit mode
};

function toDatetimeLocal(value?: string | null): string {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function toIsoOrNull(value: string): string | null {
  if (!value.trim()) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString();
}

export default function AnnouncementForm({
  announcement,
}: AnnouncementFormProps) {
  const router = useRouter();
  const isEdit = Boolean(announcement);

  const [title, setTitle] = React.useState(announcement?.title ?? "");
  const [body, setBody] = React.useState(announcement?.body ?? "");
  const [imageUrl, setImageUrl] = React.useState<string | null>(
    announcement?.image_url ?? null
  );
  const [eventDate, setEventDate] = React.useState(
    toDatetimeLocal(announcement?.event_date)
  );
  const [venue, setVenue] = React.useState(announcement?.venue ?? "");
  const [actionLabel, setActionLabel] = React.useState(
    announcement?.action_label ?? ""
  );
  const [actionUrl, setActionUrl] = React.useState(
    announcement?.action_url ?? ""
  );
  const [featured, setFeatured] = React.useState(
    Boolean(announcement?.featured)
  );
  const [isPublished, setIsPublished] = React.useState(
    announcement?.is_published ?? true
  );
  const [saving, setSaving] = React.useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }

    setSaving(true);

    try {
      if (isEdit && announcement) {
        const result = await updateAnnouncement({
          id: announcement.id,
          title: title.trim(),
          body: body.trim() || null,
          image_url: imageUrl,
          event_date: toIsoOrNull(eventDate),
          venue: venue.trim() || null,
          action_label: actionLabel.trim() || null,
          action_url: actionUrl.trim() || null,
          featured,
          is_published: isPublished,
        });

        if (!result.success) {
          toast.error(result.error || "Failed to update announcement");
          return;
        }

        toast.success("Announcement updated");
      } else {
        const result = await createAnnouncement({
          title: title.trim(),
          body: body.trim() || null,
          image_url: imageUrl,
          event_date: toIsoOrNull(eventDate),
          venue: venue.trim() || null,
          action_label: actionLabel.trim() || null,
          action_url: actionUrl.trim() || null,
          featured,
          is_published: isPublished,
        });

        if (!result.success) {
          toast.error(result.error || "Failed to create announcement");
          return;
        }

        toast.success("Announcement created");
      }

      router.push("/admin/announcements");
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error(
        isEdit ? "Failed to update announcement" : "Failed to create announcement"
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto w-full max-w-3xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/admin/announcements"
          className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/50 px-4 py-2 text-sm font-medium text-zinc-700 backdrop-blur-xl dark:bg-zinc-900/50 dark:text-zinc-200"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>

        <GlassButton type="submit" loading={saving}>
          <Save className="h-4 w-4" />
          {isEdit ? "Save changes" : "Create announcement"}
        </GlassButton>
      </div>

      <div className="overflow-hidden rounded-[28px] border border-white/20 bg-white/55 p-6 shadow-[0_12px_40px_rgba(0,0,0,0.08)] backdrop-blur-3xl dark:border-white/10 dark:bg-white/[0.06] sm:p-8">
        <h1 className="mb-6 text-2xl font-semibold tracking-tight text-zinc-900 dark:text-white">
          {isEdit ? "Edit announcement" : "New announcement"}
        </h1>

        <div className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Cover image
            </label>
            <ImageUpload value={imageUrl} onChange={setImageUrl} />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Title
            </label>
            <GlassInput
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Announcement title"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Body
            </label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={8}
              placeholder="Write the announcement..."
              className={cn(
                "w-full rounded-[24px] border border-white/20 bg-white/75 px-5 py-4 text-slate-900 outline-none",
                "backdrop-blur-3xl placeholder:text-slate-500",
                "focus:border-sky-400 focus:ring-4 focus:ring-sky-400/20",
                "dark:bg-zinc-900/60 dark:text-zinc-100"
              )}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Event date
              </label>
              <GlassInput
                type="datetime-local"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Venue
              </label>
              <GlassInput
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
                placeholder="Optional venue"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Action label
              </label>
              <GlassInput
                value={actionLabel}
                onChange={(e) => setActionLabel(e.target.value)}
                placeholder="Register, Learn more..."
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Action URL
              </label>
              <GlassInput
                type="url"
                value={actionUrl}
                onChange={(e) => setActionUrl(e.target.value)}
                placeholder="https://"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-6 pt-2">
            <label className="inline-flex items-center gap-3 text-sm font-medium text-zinc-800 dark:text-zinc-200">
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="h-5 w-5 rounded-md border-white/30 text-sky-500"
              />
              Featured
            </label>
            <label className="inline-flex items-center gap-3 text-sm font-medium text-zinc-800 dark:text-zinc-200">
              <input
                type="checkbox"
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
                className="h-5 w-5 rounded-md border-white/30 text-sky-500"
              />
              Published
            </label>
          </div>
        </div>
      </div>
    </form>
  );
}
