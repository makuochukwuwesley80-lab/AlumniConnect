import type { createClient } from "@/lib/supabase/server";

type ServerClient = Awaited<ReturnType<typeof createClient>>;

export const GENERAL_ROOM = "general";

const conversationCache = new Map<string, string>();

export async function resolveConversationId(
  supabase: ServerClient,
  room: string
): Promise<string | null> {
  const key = room.trim().toLowerCase();
  if (key.length === 0) return null;

  const cached = conversationCache.get(key);
  if (cached) return cached;

  const { data, error } = await supabase
    .from("conversations")
    .select("id")
    .eq("type", key)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (error || !data) return null;

  const id = data.id as string;
  conversationCache.set(key, id);
  return id;
}