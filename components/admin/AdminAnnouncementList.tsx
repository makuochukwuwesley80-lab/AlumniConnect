"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AdminAnnouncementCard } from "@/components/admin/AdminAnnouncementCard";
import type { AdminAnnouncement } from "@/types/announcement";

type AdminAnnouncementListProps = {
  initialAnnouncements: AdminAnnouncement[];
};

export function AdminAnnouncementList({
  initialAnnouncements,
}: AdminAnnouncementListProps) {
  const [announcements, setAnnouncements] = useState(initialAnnouncements);

  function handleDeleted(id: string) {
    setAnnouncements((current) => current.filter((item) => item.id !== id));
  }

  function handleUpdated(updated: AdminAnnouncement) {
    setAnnouncements((current) =>
      current.map((item) => (item.id === updated.id ? updated : item))
    );
  }

  if (announcements.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-3xl border border-black/5 bg-white/40 py-24 text-center backdrop-blur-xl dark:border-white/10 dark:bg-white/5">
        <p className="text-lg font-medium text-black/70 dark:text-white/70">
          No announcements yet
        </p>
        <p className="mt-1 text-sm text-black/40 dark:text-white/40">
          Create your first announcement to see it here.
        </p>
      </div>
    );
  }

  return (
    <motion.div
      layout
      className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
    >
      <AnimatePresence mode="popLayout">
        {announcements.map((announcement) => (
          <AdminAnnouncementCard
            key={announcement.id}
            announcement={announcement}
            onDeleted={handleDeleted}
            onUpdated={handleUpdated}
          />
        ))}
      </AnimatePresence>
    </motion.div>
  );
}
