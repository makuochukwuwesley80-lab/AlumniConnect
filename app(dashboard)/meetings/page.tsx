"use client";

import { useEffect, useState } from "react";
import { MeetingRoom } from "@/components/meetings/MeetingRoom";
import { supabase } from "@/lib/supabase/client";

export default function MeetingsPage() {
const [loading, setLoading] = useState(true);
const [email, setEmail] = useState<string | null>(null);

useEffect(() => {
const loadUser = async () => {
const { data } = await supabase.auth.getUser();
setEmail(data.user?.email ?? null);
setLoading(false);
};

loadUser();

}, []);

if (loading) {
return (
<main className="min-h-screen p-8 flex items-center justify-center">
<p className="text-white/70">Loading meeting...</p>
</main>
);
}

if (!email) {
return (
<main className="min-h-screen p-8 flex items-center justify-center">
<p className="text-white/70">Please sign in to join this meeting.</p>
</main>
);
}

return (
<main className="min-h-screen p-8">
<MeetingRoom
roomName="AlumniConnect-General"
displayName={email.split("@")[0]}
email={email}
/>
</main>
);
}
