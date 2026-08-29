"use client";

import { BriefcaseBusiness, Plus, Search } from "lucide-react";

export default function OpportunitiesPage() {
  return (
    <main className="space-y-8">
      <section className="relative overflow-hidden rounded-[36px] border border-white/60 bg-gradient-to-br from-sky-500 via-blue-600 to-indigo-700 p-8 text-white shadow-[0_35px_100px_rgba(37,99,235,.28)] sm:p-10">
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/15 blur-3xl" />
        <div className="absolute -bottom-24 left-1/3 h-64 w-64 rounded-full bg-cyan-300/10 blur-3xl" />

        <div className="relative z-10">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/20 bg-white/10 backdrop-blur-xl">
            <BriefcaseBusiness size={22} />
          </div>

          <h1 className="text-4xl font-black tracking-tight">
            Opportunities
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-7 text-white/75 sm:text-base">
            Discover jobs, internships, mentorship opportunities and career
            connections from the AlumniConnect community.
          </p>
        </div>
      </section>

      <section className="rounded-[30px] border border-white/60 bg-white/55 p-5 shadow-[0_24px_70px_rgba(15,23,42,.10)] backdrop-blur-3xl dark:border-white/10 dark:bg-white/[0.045] dark:shadow-[0_28px_75px_rgba(0,0,0,.28)] sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="flex flex-1 items-center gap-3 rounded-2xl border border-white/60 bg-white/55 px-4 py-3 dark:border-white/10 dark:bg-white/[0.05]">
            <Search size={18} className="text-slate-400 dark:text-white/30" />
            <input
              placeholder="Search opportunities..."
              className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400 dark:text-white dark:placeholder:text-white/30"
            />
          </div>

          <button className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 px-5 py-3 text-sm font-bold text-white shadow-[0_14px_35px_rgba(37,99,235,.25)]">
            <Plus size={17} />
            Post Opportunity
          </button>
        </div>
      </section>

      <section className="rounded-[30px] border border-dashed border-slate-300 bg-white/35 p-16 text-center backdrop-blur-2xl dark:border-white/10 dark:bg-white/[0.025]">
        <BriefcaseBusiness className="mx-auto h-10 w-10 text-slate-300 dark:text-white/20" />

        <h2 className="mt-4 text-xl font-bold text-slate-800 dark:text-white">
          No opportunities yet
        </h2>

        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500 dark:text-white/40">
          Career opportunities will appear here when they are posted to the
          AlumniConnect community.
        </p>
      </section>
    </main>
  );
}
