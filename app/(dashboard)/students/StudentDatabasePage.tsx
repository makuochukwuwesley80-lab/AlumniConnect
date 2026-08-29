"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { Student } from "@/types/student";
import StudentSearch from "@/components/students/StudentSearch";
import StudentFilters from "@/components/students/StudentFilters";
import StudentGrid from "@/components/students/StudentGrid";
import StudentProfileModal from "@/components/students/StudentProfileModal";
import { AnimatePresence, motion } from "framer-motion";

export default function StudentDatabasePage({ isAdmin, userId }: { isAdmin: boolean; userId: string }) {
  const supabase = createClient();

  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [appliedFilters, setAppliedFilters] = useState<Record<string, string>>({});
  
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });
    if (!error && data) setStudents(data as Student[]);
    setLoading(false);
  }, [supabase]);

  useEffect(() => { fetchStudents() }, [fetchStudents]);

  const applyFilters = () => {
    setAppliedFilters(filters);
    setShowFilters(false);
  };

  const clearFilters = () => {
    setFilters({});
    setAppliedFilters({});
  };

  useEffect(() => {
    let result = [...students];

    if (search) {
      const s = search.toLowerCase();
      result = result.filter(st => 
        (st.full_name?.toLowerCase().includes(s)) ||
        (st.student_id?.toLowerCase().includes(s)) ||
        (st.department?.toLowerCase().includes(s)) ||
        (st.faculty?.toLowerCase().includes(s)) ||
        (st.graduation_year?.toString().includes(s)) ||
        (st.location?.toLowerCase().includes(s))
      );
    }

    Object.entries(appliedFilters).forEach(([key, value]) => {
      if (value) result = result.filter(st => String(st[key as keyof Student]) === value);
    });

    if (sort === "newest") result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    else if (sort === "oldest") result.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    else if (sort === "az") result.sort((a, b) => (a.full_name || "").localeCompare(b.full_name || ""));
    else if (sort === "za") result.sort((a, b) => (b.full_name || "").localeCompare(a.full_name || ""));
    else if (sort === "year") result.sort((a, b) => (b.graduation_year || 0) - (a.graduation_year || 0));

    setFilteredStudents(result);
  }, [search, sort, students, appliedFilters]);

  return (
    <div className="min-h-screen w-full bg-slate-950 bg-gradient-to-br from-slate-950 via-blue-950/20 to-slate-950 text-white p-4 md:p-8 lg:p-12 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-blue-600/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative max-w-7xl mx-auto z-10">
        <motion.div 
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mb-10"
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent mb-3 tracking-tight">
            Student Database
          </h1>
          <p className="text-lg text-white/50 max-w-2xl">
            Discover and connect with members of the AlumniConnect community.
          </p>
        </motion.div>

        <StudentSearch 
          search={search}
          setSearch={setSearch}
          showFilters={showFilters}
          setShowFilters={setShowFilters}
          viewMode={viewMode}
          setViewMode={setViewMode}
          sort={sort}
          setSort={setSort}
          isAdmin={isAdmin}
          onAddStudent={() => {}}
        />

        <StudentFilters 
          showFilters={showFilters}
          students={students}
          filters={filters}
          setFilters={setFilters}
          applyFilters={applyFilters}
          clearFilters={clearFilters}
        />

        <StudentGrid 
          students={filteredStudents}
          loading={loading}
          viewMode={viewMode}
          onSelect={setSelectedStudent}
          hasFilters={Object.keys(appliedFilters).length > 0 || search !== ""}
          clearFilters={clearFilters}
        />
      </div>

      <AnimatePresence>
        {selectedStudent && (
          <StudentProfileModal 
            student={selectedStudent}
            onClose={() => setSelectedStudent(null)}
            isAdmin={isAdmin}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
