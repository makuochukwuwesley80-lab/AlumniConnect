"use client";

import { useEffect, useState } from "react";
import ProfileAvatar from "./ProfileAvatar";
import {
  Save,
  Loader2,
  User,
  GraduationCap,
  MapPin,
  BriefcaseBusiness,
} from "lucide-react";

type Profile = {
  first_name: string;
  last_name: string;
  bio: string;
  graduation_year: number | null;
  avatar_url: string | null;
  course: string;
  department: string;
  faculty: string;
  location: string;
  current_role: string;
  company: string;
};

const emptyProfile: Profile = {
  first_name: "",
  last_name: "",
  bio: "",
  graduation_year: null,
  avatar_url: null,
  course: "",
  department: "",
  faculty: "",
  location: "",
  current_role: "",
  company: "",
};

export default function ProfileEditor() {
  const [profile, setProfile] = useState<Profile>(emptyProfile);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProfile() {
      try {
        const response = await fetch("/api/profile");

        if (!response.ok) {
          throw new Error("Unable to load profile.");
        }

        const data = await response.json();

        setProfile({
          ...emptyProfile,
          ...(data?.profile ?? data),
        });
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load profile."
        );
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  function updateField<K extends keyof Profile>(
    field: K,
    value: Profile[K]
  ) {
    setProfile((current) => ({
      ...current,
      [field]: value,
    }));
    setMessage("");
    setError("");
  }

  async function saveProfile(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSaving(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch("/api/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profile),
      });

      if (!response.ok) {
        throw new Error("Unable to save profile.");
      }

      const data = await response.json();

      if (data?.profile) {
        setProfile({
          ...emptyProfile,
          ...data.profile,
        });
      }

      setMessage("Profile saved successfully.");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to save profile."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div
        className="
          flex min-h-[300px]
          items-center justify-center
          rounded-[30px]
          border border-black/10 dark:border-white/10
          bg-white/60 dark:bg-white/[0.05]
          backdrop-blur-3xl
        "
      >
        <Loader2 className="h-7 w-7 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <form onSubmit={saveProfile} className="space-y-6">
      <section
        className="
          rounded-[30px]
          border border-black/10 dark:border-white/10
          bg-white/60 dark:bg-white/[0.05]
          p-6
          shadow-xl shadow-black/5
          backdrop-blur-3xl
        "
      >
        <div className="flex flex-col items-center gap-4 sm:flex-row">
          <ProfileAvatar
            initialUrl={profile.avatar_url}
            initials={
              `${profile.first_name?.[0] ?? ""}${profile.last_name?.[0] ?? ""}`
                .toUpperCase() || "A"
            }
          />

          <div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
              Profile photo
            </h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Keep your alumni profile recognizable.
            </p>
          </div>
        </div>
      </section>

      <section
        className="
          rounded-[30px]
          border border-black/10 dark:border-white/10
          bg-white/60 dark:bg-white/[0.05]
          p-6
          shadow-xl shadow-black/5
          backdrop-blur-3xl
        "
      >
        <div className="mb-6 flex items-center gap-3">
          <User className="h-5 w-5 text-blue-500" />
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
            Personal information
          </h2>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            label="First name"
            value={profile.first_name}
            onChange={(value) => updateField("first_name", value)}
          />

          <Field
            label="Last name"
            value={profile.last_name}
            onChange={(value) => updateField("last_name", value)}
          />

          <Field
            label="Location"
            value={profile.location}
            onChange={(value) => updateField("location", value)}
          />

          <Field
            label="Graduation year"
            type="number"
            value={profile.graduation_year?.toString() ?? ""}
            onChange={(value) =>
              updateField(
                "graduation_year",
                value ? Number(value) : null
              )
            }
          />
        </div>

        <div className="mt-5">
          <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Bio
          </label>

          <textarea
            value={profile.bio}
            onChange={(event) =>
              updateField("bio", event.target.value)
            }
            rows={4}
            placeholder="Tell fellow alumni a little about yourself..."
            className="
              w-full resize-none rounded-2xl
              border border-black/10 dark:border-white/10
              bg-white/70 dark:bg-black/20
              px-4 py-3
              text-slate-900 dark:text-white
              outline-none
              transition
              focus:border-blue-500/50
              focus:ring-4 focus:ring-blue-500/10
            "
          />
        </div>
      </section>

      <section
        className="
          rounded-[30px]
          border border-black/10 dark:border-white/10
          bg-white/60 dark:bg-white/[0.05]
          p-6
          shadow-xl shadow-black/5
          backdrop-blur-3xl
        "
      >
        <div className="mb-6 flex items-center gap-3">
          <GraduationCap className="h-5 w-5 text-blue-500" />
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
            Education
          </h2>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            label="Course"
            value={profile.course}
            onChange={(value) => updateField("course", value)}
          />

          <Field
            label="Department"
            value={profile.department}
            onChange={(value) => updateField("department", value)}
          />

          <Field
            label="Faculty"
            value={profile.faculty}
            onChange={(value) => updateField("faculty", value)}
          />
        </div>
      </section>

      <section
        className="
          rounded-[30px]
          border border-black/10 dark:border-white/10
          bg-white/60 dark:bg-white/[0.05]
          p-6
          shadow-xl shadow-black/5
          backdrop-blur-3xl
        "
      >
        <div className="mb-6 flex items-center gap-3">
          <BriefcaseBusiness className="h-5 w-5 text-blue-500" />
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
            Career
          </h2>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            label="Current role"
            value={profile.current_role}
            onChange={(value) =>
              updateField("current_role", value)
            }
          />

          <Field
            label="Company"
            value={profile.company}
            onChange={(value) =>
              updateField("company", value)
            }
          />
        </div>
      </section>

      {message ? (
        <div className="rounded-2xl bg-emerald-500/10 px-4 py-3 text-sm text-emerald-600 dark:text-emerald-300">
          {message}
        </div>
      ) : null}

      {error ? (
        <div className="rounded-2xl bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-300">
          {error}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={saving}
        className="
          inline-flex items-center justify-center gap-2
          rounded-2xl
          bg-blue-600
          px-6 py-3
          font-semibold text-white
          shadow-lg shadow-blue-600/20
          transition
          hover:bg-blue-500
          disabled:cursor-not-allowed
          disabled:opacity-60
        "
      >
        {saving ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <Save className="h-5 w-5" />
        )}

        {saving ? "Saving..." : "Save profile"}
      </button>
    </form>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="
          w-full rounded-2xl
          border border-black/10 dark:border-white/10
          bg-white/70 dark:bg-black/20
          px-4 py-3
          text-slate-900 dark:text-white
          outline-none
          transition
          focus:border-blue-500/50
          focus:ring-4 focus:ring-blue-500/10
        "
      />
    </div>
  );
}


