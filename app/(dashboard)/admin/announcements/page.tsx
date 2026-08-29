import Link from "next/link";
import { Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import GlassButton from "@/components/apple/GlassButton";
import { AdminAnnouncementList } from "@/components/admin/AdminAnnouncementList";
import type { AdminAnnouncement } from "@/types/announcement";

export default async function AdminAnnouncementsPage() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("announcements")
    .select(
      "id, title, body, image_url, event_date, venue, action_label, action_url, featured, created_by, created_at, updated_at, is_published"
    )
    .order("created_at", { ascending: false });

  const announcements = (data ?? []) as AdminAnnouncement[];

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-black dark:text-white">
            Announcements
          </h1>
          <p className="mt-1 text-sm text-black/50 dark:text-white/50">
            Manage, publish and curate announcements across AlumniConnect.
          </p>
        </div>

        <Link href="/admin/announcements/new">
          <GlassButton className="gap-1.5">
            <Plus className="h-4 w-4" />
            New Announcement
          </GlassButton>
        </Link>
      </div>

      {error ? (
        <div className="rounded-2xl border border-red-400/30 bg-red-400/10 px-5 py-4 text-sm text-red-600 dark:text-red-400">
          Failed to load announcements: {error.message}
        </div>
      ) : (
        <AdminAnnouncementList initialAnnouncements={announcements} />
      )}
    </div>
  );
}
