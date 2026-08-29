import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { AdminAnnouncement } from "@/types/announcement";
import AnnouncementForm from "@/components/admin/AnnouncementForm";

export const dynamic = "force-dynamic";

export default async function EditAnnouncementPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("announcements")
    .select(
      "id, title, body, image_url, event_date, venue, action_label, action_url, featured, created_at, created_by, updated_at, is_published"
    )
    .eq("id", id)
    .maybeSingle();

  if (error || !data) {
    notFound();
  }

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      <AnnouncementForm announcement={data as AdminAnnouncement} />
    </div>
  );
}
