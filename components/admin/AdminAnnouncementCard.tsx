"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Calendar,
  MapPin,
  Pencil,
  Star,
  Trash2,
  Eye,
  EyeOff,
} from "lucide-react";
import { toast } from "sonner";
import GlassCard from "@/components/apple/GlassCard";
import GlassButton from "@/components/apple/GlassButton";
import { StatusBadge } from "@/components/admin/StatusBadge";
import {
  deleteAnnouncement,
  togglePublished,
  toggleFeatured,
} from "@/lib/actions/announcements";
import type { AdminAnnouncement } from "@/types/announcement";
import { cn } from "@/lib/utils";

type AdminAnnouncementCardProps = {
  announcement: AdminAnnouncement;
  onDeleted: (id: string) => void;
  onUpdated?: (updated: AdminAnnouncement) => void;
};

export function AdminAnnouncementCard({
  announcement: initial,
  onDeleted,
  onUpdated,
}: AdminAnnouncementCardProps) {
  const [announcement, setAnnouncement] = useState(initial);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isTogglingPublish, setIsTogglingPublish] = useState(false);
  const [isTogglingFeatured, setIsTogglingFeatured] = useState(false);

  const formattedDate = new Date(announcement.created_at).toLocaleDateString(
    "en-US",
    { month: "short", day: "numeric", year: "numeric" }
  );

  const eventDate = announcement.event_date
    ? new Date(announcement.event_date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null;

  async function handleDelete() {
    const confirmed = window.confirm(
      `Delete "${announcement.title}"? This cannot be undone.`
    );
    if (!confirmed) return;

    setIsDeleting(true);
    const result = await deleteAnnouncement(announcement.id);

    if (result.success) {
      toast.success("Announcement deleted");
      onDeleted(announcement.id);
    } else {
      toast.error(result.error ?? "Failed to delete announcement");
      setIsDeleting(false);
    }
  }

  async function handleTogglePublished() {
    setIsTogglingPublish(true);
    const previous = announcement.is_published;

    const optimistic = { ...announcement, is_published: !previous };
    setAnnouncement(optimistic);
    onUpdated?.(optimistic);

    const result = await togglePublished(announcement.id, previous);

    if (result.success) {
      toast.success(result.newValue ? "Published" : "Unpublished");
    } else {
      setAnnouncement(announcement);
      onUpdated?.(announcement);
      toast.error(result.error ?? "Failed to update status");
    }

    setIsTogglingPublish(false);
  }

  async function handleToggleFeatured() {
    setIsTogglingFeatured(true);
    const previous = Boolean(announcement.featured);

    const optimistic = { ...announcement, featured: !previous };
    setAnnouncement(optimistic);
    onUpdated?.(optimistic);

    const result = await toggleFeatured(announcement.id, previous);

    if (result.success) {
      toast.success(
        result.newValue ? "Marked as featured" : "Removed from featured"
      );
    } else {
      setAnnouncement(announcement);
      onUpdated?.(announcement);
      toast.error(result.error ?? "Failed to update featured status");
    }

    setIsTogglingFeatured(false);
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: isDeleting ? 0.4 : 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <GlassCard className="flex flex-col overflow-hidden p-0">
        {/* Cover */}
        <div className="relative h-40 w-full overflow-hidden bg-black/5 dark:bg-white/5">
          {announcement.image_url ? (
            <Image
              src={announcement.image_url}
              alt={announcement.title}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm text-black/30 dark:text-white/30">
              No image
            </div>
          )}

          <div className="absolute left-3 top-3 flex gap-2">
            <StatusBadge isPublished={announcement.is_published} />
            {announcement.featured ? (
              <span className="inline-flex items-center gap-1 rounded-full border border-blue-400/30 bg-blue-400/10 px-3 py-1 text-xs font-medium text-blue-600 backdrop-blur-md dark:text-blue-400">
                <Star className="h-3 w-3 fill-current" />
                Featured
              </span>
            ) : null}
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col gap-3 p-5">
          <div>
            <h3 className="line-clamp-1 text-base font-semibold text-black dark:text-white">
              {announcement.title}
            </h3>
            {announcement.body ? (
              <p className="mt-1 line-clamp-2 text-sm text-black/60 dark:text-white/60">
                {announcement.body}
              </p>
            ) : null}
          </div>

          <div className="flex flex-col gap-1.5 text-xs text-black/50 dark:text-white/50">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              <span>
                {eventDate ? `Event: ${eventDate}` : `Created ${formattedDate}`}
              </span>
            </div>
            {announcement.venue ? (
              <div className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5" />
                <span className="line-clamp-1">{announcement.venue}</span>
              </div>
            ) : null}
          </div>

          {/* Quick Action Toggles */}
          <div className="mt-1 flex gap-2">
            <button
              type="button"
              onClick={handleTogglePublished}
              disabled={isTogglingPublish || isDeleting}
              className={cn(
                "inline-flex flex-1 items-center justify-center gap-1.5 rounded-full border px-3 py-2 text-xs font-medium backdrop-blur-md transition",
                announcement.is_published
                  ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-700 hover:bg-emerald-400/20 dark:text-emerald-400"
                  : "border-amber-400/30 bg-amber-400/10 text-amber-700 hover:bg-amber-400/20 dark:text-amber-400"
              )}
            >
              {announcement.is_published ? (
                <>
                  <Eye className="h-3.5 w-3.5" />
                  Published
                </>
              ) : (
                <>
                  <EyeOff className="h-3.5 w-3.5" />
                  Draft
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleToggleFeatured}
              disabled={isTogglingFeatured || isDeleting}
              className={cn(
                "inline-flex flex-1 items-center justify-center gap-1.5 rounded-full border px-3 py-2 text-xs font-medium backdrop-blur-md transition",
                announcement.featured
                  ? "border-blue-400/30 bg-blue-400/10 text-blue-700 hover:bg-blue-400/20 dark:text-blue-400"
                  : "border-black/10 bg-black/5 text-black/60 hover:bg-black/10 dark:border-white/10 dark:bg-white/5 dark:text-white/60 dark:hover:bg-white/10"
              )}
            >
              <Star
                className={cn(
                  "h-3.5 w-3.5",
                  announcement.featured && "fill-current"
                )}
              />
              {announcement.featured ? "Featured" : "Feature"}
            </button>
          </div>

          {/* Edit + Delete */}
          <div className="mt-auto flex gap-2 pt-1">
            <Link
              href={`/admin/announcements/${announcement.id}/edit`}
              className="flex-1"
            >
              <GlassButton className="w-full justify-center gap-1.5" type="button">
                <Pencil className="h-3.5 w-3.5" />
                Edit
              </GlassButton>
            </Link>

            <GlassButton
              type="button"
              onClick={handleDelete}
              disabled={isDeleting}
              className="flex-1 justify-center gap-1.5 border-red-400/30 text-red-600 hover:bg-red-400/10 dark:text-red-400"
            >
              <Trash2 className="h-3.5 w-3.5" />
              {isDeleting ? "Deleting…" : "Delete"}
            </GlassButton>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
}
