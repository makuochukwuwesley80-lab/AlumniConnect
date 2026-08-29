"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Users,
  GraduationCap,
  MapPin,
  BriefcaseBusiness,
  Loader2,
  X,
} from "lucide-react";

type Alumni = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email?: string | null;
  avatar_url?: string | null;
  graduation_year?: number | null;
  course?: string | null;
  department?: string | null;
  faculty?: string | null;
  location?: string | null;
  current_role?: string | null;
  company?: string | null;
};

export default function AlumniSearch() {
  const [query, setQuery] = useState("");
  const [alumni, setAlumni] = useState<Alumni[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadAlumni() {
      setLoading(true);
      setError("");

      try {
        const params = new URLSearchParams();

        if (query.trim()) {
          params.set("q", query.trim());
        }

        const response = await fetch(
          `/api/alumni/search?${params.toString()}`,
          {
            signal: controller.signal,
          }
        );

        if (!response.ok) {
          throw new Error("Unable to load alumni.");
        }

        const result = await response.json();

        const people = Array.isArray(result)
          ? result
          : Array.isArray(result?.alumni)
            ? result.alumni
            : Array.isArray(result?.data)
              ? result.data
              : [];

        setAlumni(people);
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") {
          return;
        }

        setError(
          err instanceof Error
            ? err.message
            : "Unable to load alumni."
        );
      } finally {
        setLoading(false);
      }
    }

    const timer = setTimeout(loadAlumni, 250);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  const visibleAlumni = useMemo(() => {
    return alumni;
  }, [alumni]);

  function clearSearch() {
    setQuery("");
  }

  return (
    <section className="w-full">
      <div className="mb-6">
        <div
          className="
            relative flex items-center gap-3
            rounded-[28px]
            border border-black/10 dark:border-white/10
            bg-white/70 dark:bg-white/[0.06]
            px-5 py-4
            shadow-xl shadow-black/5
            backdrop-blur-3xl
          "
        >
          <Search
            className="h-5 w-5 shrink-0 text-slate-400 dark:text-white/50"
            aria-hidden="true"
          />

          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search alumni by name, course, company..."
            className="
              min-w-0 flex-1
              bg-transparent
              text-slate-900 dark:text-white
              outline-none
              placeholder:text-slate-400
              dark:placeholder:text-white/40
            "
            type="search"
            aria-label="Search alumni"
          />

          {loading ? (
            <Loader2
              className="h-5 w-5 shrink-0 animate-spin text-blue-500"
              aria-label="Searching"
            />
          ) : query ? (
            <button
              type="button"
              onClick={clearSearch}
              className="
                rounded-full p-1.5
                text-slate-400
                transition
                hover:bg-black/5 hover:text-slate-700
                dark:hover:bg-white/10 dark:hover:text-white
              "
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          ) : null}
        </div>
      </div>

      {error ? (
        <div
          className="
            mb-6 rounded-2xl
            border border-red-500/20
            bg-red-500/10
            px-5 py-4
            text-sm text-red-600
            dark:text-red-300
          "
        >
          {error}
        </div>
      ) : null}

      {!loading && !error && visibleAlumni.length === 0 ? (
        <div
          className="
            rounded-[30px]
            border border-black/10 dark:border-white/10
            bg-white/60 dark:bg-white/[0.05]
            p-10 text-center
            shadow-xl shadow-black/5
            backdrop-blur-3xl
          "
        >
          <div
            className="
              mx-auto mb-4 flex h-14 w-14
              items-center justify-center
              rounded-2xl
              bg-blue-500/10
              text-blue-500
            "
          >
            <Users className="h-7 w-7" />
          </div>

          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
            No alumni found
          </h2>

          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Try a different name, course, company, or location.
          </p>
        </div>
      ) : null}

      {visibleAlumni.length > 0 ? (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {visibleAlumni.map((person) => {
            const fullName =
              `${person.first_name ?? ""} ${person.last_name ?? ""}`.trim() ||
              "Alumni";

            const initials =
              `${person.first_name?.[0] ?? ""}${person.last_name?.[0] ?? ""}`
                .toUpperCase() || "A";

            return (
              <Link
                href={`/alumni/${person.id}`}
                key={person.id}
                className="group block"
              >
                <article
                  className="
                    h-full rounded-[30px]
                    border border-black/10 dark:border-white/10
                    bg-white/60 dark:bg-white/[0.05]
                    p-5
                    shadow-lg shadow-black/5
                    backdrop-blur-3xl
                    transition duration-300
                    hover:-translate-y-1
                    hover:shadow-2xl
                    hover:shadow-blue-500/10
                  "
                >
                  <div className="flex items-start justify-between gap-4">
                    <div
                      className="
                        flex h-14 w-14 shrink-0
                        items-center justify-center
                        overflow-hidden
                        rounded-2xl
                        bg-gradient-to-br from-blue-500 to-cyan-400
                        text-lg font-bold text-white
                        shadow-lg shadow-blue-500/20
                      "
                    >
                      {person.avatar_url ? (
                        <img
                          src={person.avatar_url}
                          alt={fullName}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        initials
                      )}
                    </div>

                    <span
                      className="
                        rounded-full
                        border border-blue-500/10
                        bg-blue-500/10
                        px-3 py-1
                        text-xs font-medium
                        text-blue-600
                        dark:text-blue-300
                      "
                    >
                      Alumni
                    </span>
                  </div>

                  <div className="mt-5">
                    <h2
                      className="
                        text-lg font-semibold
                        text-slate-900 dark:text-white
                        transition
                        group-hover:text-blue-600
                        dark:group-hover:text-blue-300
                      "
                    >
                      {fullName}
                    </h2>

                    {person.current_role || person.company ? (
                      <div className="mt-2 flex items-start gap-2 text-sm text-slate-500 dark:text-slate-400">
                        <BriefcaseBusiness className="mt-0.5 h-4 w-4 shrink-0" />
                        <span>
                          {person.current_role}
                          {person.current_role && person.company
                            ? " at "
                            : ""}
                          {person.company}
                        </span>
                      </div>
                    ) : null}

                    {person.course || person.department ? (
                      <div className="mt-2 flex items-start gap-2 text-sm text-slate-500 dark:text-slate-400">
                        <GraduationCap className="mt-0.5 h-4 w-4 shrink-0" />
                        <span>
                          {person.course ?? person.department}
                        </span>
                      </div>
                    ) : null}

                    {person.location ? (
                      <div className="mt-2 flex items-start gap-2 text-sm text-slate-500 dark:text-slate-400">
                        <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                        <span>{person.location}</span>
                      </div>
                    ) : null}

                    {person.graduation_year ? (
                      <div className="mt-4 text-xs font-medium text-slate-400 dark:text-white/40">
                        Class of {person.graduation_year}
                      </div>
                    ) : null}
                  </div>
                </article>
              </Link>
            );
          })}
        </div>
      ) : null}
    </section>
  );
}
