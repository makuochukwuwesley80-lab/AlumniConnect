import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { GENERAL_ROOM, resolveConversationId } from "@/lib/chat/rooms";
import type { ChatAuthor, ChatMessage } from "@/types/chat";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type SupabaseServerClient = Awaited<ReturnType<typeof createClient>>;

const MAX_LENGTH = 4000;
const PAGE_SIZE = 200;

interface MessageRow {
  id: string;
  conversation_id: string;
  room: string | null;
  content: string;
  created_at: string;
  sender_id: string;
}

interface ProfileRow {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  role: string | null;
}

function fail(error: string, status: number) {
  return NextResponse.json({ success: false, error }, { status });
}

function resolveRoom(raw: string | null): string {
  const value = raw?.trim();
  return value && value.length > 0 ? value : GENERAL_ROOM;
}

async function attachAuthors(
  supabase: SupabaseServerClient,
  rows: MessageRow[],
  fallbackRoom: string
): Promise<ChatMessage[]> {
  if (rows.length === 0) return [];

  const ids = Array.from(
    new Set(rows.map((row) => row.sender_id).filter(Boolean))
  );
  const authors = new Map<string, ChatAuthor>();

  if (ids.length > 0) {
    const { data } = await supabase
      .from("profiles")
      .select("id, full_name, avatar_url, role")
      .in("id", ids);

    for (const profile of (data ?? []) as ProfileRow[]) {
      authors.set(profile.id, {
        id: profile.id,
        full_name: profile.full_name ?? null,
        avatar_url: profile.avatar_url ?? null,
        role: profile.role ?? null,
      });
    }
  }

  return rows.map((row) => ({
    id: row.id,
    room: row.room ?? fallbackRoom,
    conversation_id: row.conversation_id,
    content: row.content,
    created_at: row.created_at,
    sender_id: row.sender_id,
    author: authors.get(row.sender_id) ?? null,
  }));
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return fail("Authentication required.", 401);
    }

    const room = resolveRoom(request.nextUrl.searchParams.get("room"));
    const conversationId = await resolveConversationId(supabase, room);

    if (!conversationId) {
      return fail("Chat room \"" + room + "\" was not found.", 404);
    }

    const { data, error } = await supabase
      .from("messages")
      .select("id, conversation_id, room, content, created_at, sender_id")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: false })
      .limit(PAGE_SIZE);

    if (error) {
      return fail("Could not load messages: " + error.message, 500);
    }

    const rows = ((data ?? []) as MessageRow[]).slice().reverse();
    const messages = await attachAuthors(supabase, rows, room);

    return NextResponse.json({ success: true, messages }, { status: 200 });
  } catch {
    return fail("Unexpected server error while loading messages.", 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return fail("Authentication required.", 401);
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return fail("Request body must be valid JSON.", 400);
    }

    const record =
      body && typeof body === "object"
        ? (body as Record<string, unknown>)
        : {};

    const rawContent =
      typeof record.content === "string" ? record.content : "";
    const content = rawContent.trim();
    const room = resolveRoom(
      typeof record.room === "string" ? record.room : null
    );

    if (content.length === 0) {
      return fail("Message cannot be empty.", 400);
    }
    if (content.length > MAX_LENGTH) {
      return fail(
        "Message is too long (max " + MAX_LENGTH + " characters).",
        400
      );
    }

    const conversationId = await resolveConversationId(supabase, room);

    if (!conversationId) {
      return fail("Chat room \"" + room + "\" was not found.", 404);
    }

    const { data, error } = await supabase
      .from("messages")
      .insert({
        conversation_id: conversationId,
        sender_id: user.id,
        content,
        room,
      })
      .select("id, conversation_id, room, content, created_at, sender_id")
      .single();

    if (error || !data) {
      const detail = error?.message ?? "Unknown database error.";
      const status = error?.code === "42501" ? 403 : 500;
      return fail("Could not send message: " + detail, status);
    }

    const [message] = await attachAuthors(
      supabase,
      [data as MessageRow],
      room
    );

    return NextResponse.json({ success: true, message }, { status: 201 });
  } catch {
    return fail("Unexpected server error while sending message.", 500);
  }
}