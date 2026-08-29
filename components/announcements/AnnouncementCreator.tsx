"use client";

import { ChangeEvent, FormEvent, useMemo, useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  ImagePlus,
  Loader2,
  MapPin,
  Megaphone,
  Send,
  Sparkles,
  Trash2,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import AnnouncementHero from "./AnnouncementHero";
import AnnouncementBanner from "./AnnouncementBanner";

type Props = {
  onPublished?: () => void;
};

export default function AnnouncementCreator({ onPublished }: Props) {
  const supabase = useMemo(() => createClient(), []);

  const [title, setTitle] = useState("AlumniConnect Annual Meetup 2026");
  const [body, setBody] = useState(
    "It’s time to reconnect! Join fellow alumni for an unforgettable day of conversations, networking, memories, and friendship. Let’s come together and strengthen the AlumniConnect family."
  );
  const [eventDate, setEventDate] = useState("");
  const [venue, setVenue] = useState("AlumniConnect Event Venue");
  const [actionLabel, setActionLabel] = useState("View Meetup Details");
  const [actionUrl, setActionUrl] = useState("");
  const [featured, setFeatured] = useState(true);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file.");
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      setError("Please choose an image smaller than 8MB.");
      return;
    }

    setError("");
    setImageFile(file);

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  }

  function removeImage() {
    setImageFile(null);
    setPreviewUrl("");
  }

  async function publish(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setMessage("");

    if (!title.trim()) {
      setError("Please enter an announcement title.");
      return;
    }

    if (!body.trim()) {
      setError("Please enter the announcement message.");
      return;
    }

    setUploading(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("You must be logged in as an administrator.");
      }

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (profileError || profile?.role !== "admin") {
        throw new Error("Only administrators can publish announcements.");
      }

      let imageUrl: string | null = null;

      if (imageFile) {
        const extension =
          imageFile.name.split(".").pop()?.toLowerCase() || "jpg";

        const filePath = `${user.id}/${crypto.randomUUID()}.${extension}`;

        const { error: uploadError } = await supabase.storage
          .from("announcement-images")
          .upload(filePath, imageFile, {
            cacheControl: "3600",
            upsert: false,
            contentType: imageFile.type,
          });

        if (uploadError) {
          throw new Error(uploadError.message);
        }

        const { data: publicUrl } = supabase.storage
          .from("announcement-images")
          .getPublicUrl(filePath);

        imageUrl = publicUrl.publicUrl;
      }

      const { error: insertError } = await supabase
        .from("announcements")
        .insert({
          title: title.trim(),
          body: body.trim(),
          image_url: imageUrl,
          event_date: eventDate
            ? new Date(`${eventDate}T12:00:00`).toISOString()
            : null,
          venue: venue.trim() || null,
          action_label: actionLabel.trim() || null,
          action_url: actionUrl.trim() || null,
          featured,
          created_by: user.id,
        });

      if (insertError) {
        throw new Error(insertError.message);
      }

      setMessage("Announcement published successfully.");
      onPublished?.();
    } catch (publishError) {
      setError(
        publishError instanceof Error
          ? publishError.message
          : "Unable to publish announcement."
      );
    } finally {
      setUploading(false);
    }
  }

  const previewAnnouncement = {
    id: "preview",
    title,
    body,
    image_url: previewUrl || null,
    event_date: eventDate
      ? new Date(`${eventDate}T12:00:00`).toISOString()
      : null,
    venue,
    action_label: actionLabel,
    action_url: actionUrl || null,
    featured,
    created_at: new Date().toISOString(),
  };

  return (
    <div className="space-y-6">
      <form
        onSubmit={publish}
        className="rounded-[30px] border border-white/10 bg-white/[0.04] p-5 shadow-2xl backdrop-blur-3xl sm:p-7"
      >
        <div className="mb-7 flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400/20 to-blue-600/20 text-cyan-300">
            <Megaphone size={22} />
          </div>

          <div>
            <h2 className="text-xl font-bold text-white">
              Create Announcement
            </h2>

            <p className="mt-1 text-sm text-white/40">
              Publish a beautiful community announcement with its own image.
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-5 rounded-2xl border border-red-400/20 bg-red-500/10 p-4 text-sm text-red-200">
            {error}
          </div>
        )}

        {message && (
          <div className="mb-5 flex items-center gap-2 rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-4 text-sm text-emerald-200">
            <CheckCircle2 size={17} />
            {message}
          </div>
        )}

        <div className="grid gap-5 lg:grid-cols-2">
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-white/45">
              Title
            </label>

            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Announcement title"
              className="h-12 w-full rounded-2xl border border-white/10 bg-black/20 px-4 text-sm text-white outline-none placeholder:text-white/25 focus:border-cyan-400/40"
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-white/45">
              Venue
            </label>

            <div className="relative">
              <MapPin
                size={17}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30"
              />

              <input
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
                placeholder="Event venue"
                className="h-12 w-full rounded-2xl border border-white/10 bg-black/20 pl-11 pr-4 text-sm text-white outline-none placeholder:text-white/25 focus:border-cyan-400/40"
              />
            </div>
          </div>

          <div className="lg:col-span-2">
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-white/45">
              Message
            </label>

            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={5}
              placeholder="Write your announcement..."
              className="w-full resize-none rounded-2xl border border-white/10 bg-black/20 p-4 text-sm leading-6 text-white outline-none placeholder:text-white/25 focus:border-cyan-400/40"
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-white/45">
              Event Date
            </label>

            <div className="relative">
              <CalendarDays
                size={17}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30"
              />

              <input
                type="date"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                className="h-12 w-full rounded-2xl border border-white/10 bg-black/20 pl-11 pr-4 text-sm text-white outline-none focus:border-cyan-400/40"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-white/45">
              Button Text
            </label>

            <input
              value={actionLabel}
              onChange={(e) => setActionLabel(e.target.value)}
              placeholder="View Details"
              className="h-12 w-full rounded-2xl border border-white/10 bg-black/20 px-4 text-sm text-white outline-none placeholder:text-white/25 focus:border-cyan-400/40"
            />
          </div>

          <div className="lg:col-span-2">
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-white/45">
              Button URL
            </label>

            <input
              value={actionUrl}
              onChange={(e) => setActionUrl(e.target.value)}
              placeholder="https://..."
              className="h-12 w-full rounded-2xl border border-white/10 bg-black/20 px-4 text-sm text-white outline-none placeholder:text-white/25 focus:border-cyan-400/40"
            />
          </div>

          <div className="lg:col-span-2">
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-white/45">
              Announcement Image
            </label>

            {!previewUrl ? (
              <label className="flex min-h-[180px] cursor-pointer flex-col items-center justify-center rounded-3xl border border-dashed border-white/15 bg-black/15 p-6 text-center transition hover:border-cyan-400/30 hover:bg-white/[0.03]">
                <ImagePlus size={32} className="text-cyan-300" />

                <span className="mt-3 text-sm font-semibold text-white">
                  Upload meetup image
                </span>

                <span className="mt-1 text-xs text-white/35">
                  JPG, PNG or WEBP · Maximum 8MB
                </span>

                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            ) : (
              <div className="relative overflow-hidden rounded-3xl border border-white/10">
                <img
                  src={previewUrl}
                  alt="Announcement preview"
                  className="h-56 w-full object-cover"
                />

                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-xl bg-black/60 text-white backdrop-blur-xl transition hover:bg-red-500/80"
                  aria-label="Remove image"
                >
                  <Trash2 size={17} />
                </button>

                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-5 pt-12">
                  <p className="text-xs text-white/70">
                    {imageFile?.name}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <label className="mt-5 flex cursor-pointer items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <input
            type="checkbox"
            checked={featured}
            onChange={(e) => setFeatured(e.target.checked)}
            className="h-4 w-4 accent-cyan-500"
          />

          <div>
            <p className="text-sm font-semibold text-white">
              Feature this announcement
            </p>

            <p className="mt-1 text-xs text-white/35">
              Show it prominently on the dashboard.
            </p>
          </div>

          <Sparkles size={18} className="ml-auto text-cyan-300" />
        </label>

        <button
          type="submit"
          disabled={uploading}
          className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-600 text-sm font-bold text-white shadow-lg shadow-blue-950/30 transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {uploading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Uploading & Publishing...
            </>
          ) : (
            <>
              <Send size={18} />
              Publish Announcement
            </>
          )}
        </button>
      </form>

      <section>
        <div className="mb-4 flex items-center gap-2">
          <Sparkles size={17} className="text-cyan-300" />

          <h2 className="text-sm font-bold uppercase tracking-[0.15em] text-white/60">
            Full Hero Preview
          </h2>
        </div>

        <AnnouncementHero announcement={previewAnnouncement} />
      </section>

      <section>
        <div className="mb-4 flex items-center gap-2">
          <Sparkles size={17} className="text-cyan-300" />

          <h2 className="text-sm font-bold uppercase tracking-[0.15em] text-white/60">
            Dashboard Banner Preview
          </h2>
        </div>

        <AnnouncementBanner announcement={previewAnnouncement} />
      </section>
    </div>
  );
}
