"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type CreateAnnouncementInput = {
  title: string;
  body?: string | null;
  image_url?: string | null;
  event_date?: string | null;
  venue?: string | null;
  action_label?: string | null;
  action_url?: string | null;
  featured?: boolean | null;
  is_published?: boolean | null;
};

export type UpdateAnnouncementInput = {
  id: string;
  title: string;
  body?: string | null;
  image_url?: string | null;
  event_date?: string | null;
  venue?: string | null;
  action_label?: string | null;
  action_url?: string | null;
  featured?: boolean | null;
  is_published?: boolean | null;
};

function extractStoragePath(publicUrl: string | null | undefined): string | null {
  if (!publicUrl) return null;
  try {
    const url = new URL(publicUrl);
    // Expected format: .../storage/v1/object/public/announcements/covers/xxxxx.jpg
    const marker = "/object/public/announcements/";
    const idx = url.pathname.indexOf(marker);
    if (idx === -1) return null;
    return decodeURIComponent(url.pathname.slice(idx + marker.length));
  } catch {
    return null;
  }
}

export async function createAnnouncement(input: CreateAnnouncementInput) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false as const, error: "You must be signed in" };
  }

  const title = input.title?.trim();
  if (!title) {
    return { success: false as const, error: "Title is required" };
  }

  const { data, error } = await supabase
    .from("announcements")
    .insert({
      title,
      body: input.body ?? null,
      image_url: input.image_url ?? null,
      event_date: input.event_date ? input.event_date : null,
      venue: input.venue ?? null,
      action_label: input.action_label ?? null,
      action_url: input.action_url ?? null,
      featured: Boolean(input.featured),
      is_published: input.is_published ?? true,
      created_by: user.id,
    })
    .select("id")
    .single();

  if (error) {
    return { success: false as const, error: error.message };
  }

  revalidatePath("/admin/announcements");
  revalidatePath("/announcements");
  revalidatePath("/dashboard");

  return { success: true as const, id: data.id };
}

export async function updateAnnouncement(input: UpdateAnnouncementInput) {
  const supabase = await createClient();

  if (!input.id) {
    return { success: false as const, error: "Missing announcement id" };
  }

  const title = input.title?.trim();
  if (!title) {
    return { success: false as const, error: "Title is required" };
  }

  const { error } = await supabase
    .from("announcements")
    .update({
      title,
      body: input.body ?? null,
      image_url: input.image_url ?? null,
      event_date: input.event_date ? input.event_date : null,
      venue: input.venue ?? null,
      action_label: input.action_label ?? null,
      action_url: input.action_url ?? null,
      featured: Boolean(input.featured),
      is_published: input.is_published ?? true,
      updated_at: new Date().toISOString(),
    })
    .eq("id", input.id);

  if (error) {
    return { success: false as const, error: error.message };
  }

  revalidatePath("/admin/announcements");
  revalidatePath(`/announcements/${input.id}`);
  revalidatePath("/announcements");
  revalidatePath("/dashboard");

  return { success: true as const };
}

export async function deleteAnnouncement(id: string) {
  const supabase = await createClient();

  // 1. Fetch the row so we can delete the storage object
  const { data: row, error: fetchError } = await supabase
    .from("announcements")
    .select("id, image_url")
    .eq("id", id)
    .maybeSingle();

  if (fetchError) {
    return { success: false as const, error: fetchError.message };
  }

  if (!row) {
    return { success: false as const, error: "Announcement not found" };
  }

  // 2. Delete image from storage if it exists
  const storagePath = extractStoragePath(row.image_url);
  if (storagePath) {
    const { error: storageError } = await supabase.storage
      .from("announcements")
      .remove([storagePath]);

    // We intentionally do not fail the whole operation if storage delete fails.
    // The DB row is the source of truth for the UI.
    if (storageError) {
      console.error("Failed to delete announcement image:", storageError.message);
    }
  }

  // 3. Delete the database row
  const { error } = await supabase.from("announcements").delete().eq("id", id);

  if (error) {
    return { success: false as const, error: error.message };
  }

  revalidatePath("/admin/announcements");
  revalidatePath("/announcements");
  revalidatePath("/dashboard");

  return { success: true as const };
}

export async function togglePublished(id: string, currentValue: boolean) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("announcements")
    .update({
      is_published: !currentValue,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    return { success: false as const, error: error.message };
  }

  revalidatePath("/admin/announcements");
  revalidatePath("/announcements");
  revalidatePath("/dashboard");

  return { success: true as const, newValue: !currentValue };
}

export async function toggleFeatured(id: string, currentValue: boolean) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("announcements")
    .update({
      featured: !currentValue,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    return { success: false as const, error: error.message };
  }

  revalidatePath("/admin/announcements");
  revalidatePath("/announcements");
  revalidatePath("/dashboard");

  return { success: true as const, newValue: !currentValue };
}
