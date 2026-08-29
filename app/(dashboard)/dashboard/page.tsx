import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import DashboardView from "@/components/dashboard/DashboardView";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const [
    alumniCount,
    eventsCount,
    messagesCount,
    announcementsCount,
    { data: recentAnnouncements },
    { data: opportunities },
  ] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("events").select("*", { count: "exact", head: true }),
    supabase.from("messages").select("*", { count: "exact", head: true }),
    supabase
      .from("announcements")
      .select("*", { count: "exact", head: true }),
    supabase
      .from("announcements")
      .select("id, title, content, created_at")
      .order("created_at", { ascending: false })
      .limit(3),
    supabase
      .from("opportunities")
      .select("id, title, company")
      .order("created_at", { ascending: false })
      .limit(3),
  ]);

  return (
    <DashboardView
      counts={{
        alumni: alumniCount.count || 0,
        events: eventsCount.count || 0,
        messages: messagesCount.count || 0,
        announcements: announcementsCount.count || 0,
      }}
      recentAnnouncements={recentAnnouncements || []}
      opportunities={opportunities || []}
    />
  );
}
