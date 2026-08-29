"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import AnnouncementCreator from "@/components/announcements/AnnouncementCreator";
import AnnouncementHero from "@/components/announcements/AnnouncementHero";

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

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  async function loadAnnouncements() {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    setIsAdmin(profile?.role === "admin");

    const { data } = await supabase
      .from("announcements")
      .select(
        "id,title,body,image_url,event_date,venue,action_label,action_url,featured,created_at"
      )
      .order("featured", { ascending: false })
      .order("created_at", { ascending: false });

    setAnnouncements(data || []);
    setLoading(false);
  }

  useEffect(() => {
    loadAnnouncements();
  }, []);

  return (
    <main className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-300/70">
            AlumniConnect
          </p>

          <h1 className="mt-2 text-3xl font-black tracking-tight text-white sm:text-4xl">
            Announcements
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-white/40">
            Important moments, community news, meetups and celebrations from
            the AlumniConnect family.
          </p>
        </header>

        {isAdmin && (
          <div className="mb-10">
            <AnnouncementCreator onPublished={loadAnnouncements} />
          </div>
        )}

        {!loading && announcements.length > 0 && (
          <section className="space-y-6">
            <AnnouncementHero announcement={announcements[0]} />

            {announcements.length > 1 && (
              <div className="grid gap-5 md:grid-cols-2">
                {announcements.slice(1).map((announcement) => (
                  <AnnouncementHero
                    key={announcement.id}
                    announcement={announcement}
                  />
                ))}
              </div>
            )}
          </section>
        )}

        {!loading && announcements.length === 0 && !isAdmin && (
          <div className="rounded-[30px] border border-white/10 bg-white/[0.04] p-12 text-center backdrop-blur-3xl">
            <p className="text-sm text-white/40">
              No announcements have been published yet.
            </p>
          </div>
        )}

        {loading && (
          <div className="rounded-[30px] border border-white/10 bg-white/[0.04] p-12 text-center">
            <p className="text-sm text-white/40">
              Loading announcements...
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
