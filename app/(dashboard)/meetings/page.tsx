"use client";

import { MeetingRoom } from "@/components/meetings/MeetingRoom";

export default function MeetingsPage() {
  return (
    <main className="min-h-screen p-8">
      <MeetingRoom
        roomName="AlumniConnect-General"
        displayName="Alumni Member"
      />
    </main>
  );
}
