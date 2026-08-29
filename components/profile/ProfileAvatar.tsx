"use client";

import { useRef, useState } from "react";
import {
  Camera,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

export default function ProfileAvatar({
  initialUrl,
  initials,
}: {
  initialUrl?: string | null;
  initials: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [avatarUrl, setAvatarUrl] = useState(
    initialUrl ?? ""
  );
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function uploadAvatar(file: File) {
    setUploading(true);
    setMessage("");
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(
        "/api/profile/avatar",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? "Upload failed.");
        return;
      }

      setAvatarUrl(data.avatar_url);
      setMessage("Profile photo updated.");
    } catch {
      setError("Unable to upload your photo.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="flex flex-col items-center gap-4">

      <div className="relative">
        <div
          className="
            flex h-28 w-28
            items-center justify-center
            overflow-hidden
            rounded-[32px]
            border-4 border-white/80
            bg-gradient-to-br
            from-sky-400
            via-blue-500
            to-indigo-700
            text-3xl font-bold
            text-white
            shadow-2xl
            dark:border-slate-800/80
          "
        >
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt="Profile photo"
              className="h-full w-full object-cover"
            />
          ) : (
            initials
          )}

          {uploading && (
            <div
              className="
                absolute inset-0
                flex items-center justify-center
                bg-black/50
                backdrop-blur-sm
              "
            >
              <Loader2
                size={28}
                className="animate-spin text-white"
              />
            </div>
          )}
        </div>

        <button
          type="button"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
          className="
            absolute
            -bottom-2
            -right-2
            flex h-11 w-11
            items-center justify-center
            rounded-2xl
            border-4
            border-white
            bg-sky-500
            text-white
            shadow-xl
            transition
            hover:scale-105
            active:scale-90
            disabled:opacity-50
            dark:border-slate-900
          "
          aria-label="Change profile photo"
        >
          <Camera size={19} />
        </button>

        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={(event) => {
            const file = event.target.files?.[0];

            if (file) {
              uploadAvatar(file);
            }

            event.target.value = "";
          }}
        />
      </div>

      <p className="text-xs text-slate-400">
        JPG, PNG or WebP · Maximum 5MB
      </p>

      {message && (
        <div className="flex items-center gap-2 text-xs font-medium text-emerald-500">
          <CheckCircle2 size={15} />
          {message}
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 text-xs font-medium text-red-500">
          <AlertCircle size={15} />
          {error}
        </div>
      )}
    </div>
  );
}
