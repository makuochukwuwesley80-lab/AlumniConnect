"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Student } from "@/types/student";
import StudentCard from "./StudentCard";
import StudentSkeleton from "./StudentSkeleton";
import { Search } from "lucide-react";

interface StudentGridProps {
  students: Student[];
  loading: boolean;
  viewMode: "grid" | "list";
  onSelect: (student: Student) => void;
  hasFilters: boolean;
  clearFilters: () => void;
}

export default function StudentGrid({ students, loading, viewMode, onSelect, hasFilters, clearFilters }: StudentGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
        {Array.from({ length: 8 }).map((_, i) => <StudentSkeleton key={i} />)}
      </div>
    );
  }

  if (students.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mt-16 flex flex-col items-center justify-center p-12 rounded-3xl bg-white/10 dark:bg-white/5 backdrop-blur-3xl border border-white/20 dark:border-white/10 shadow-[0_35px_90px_rgba(0,0,0,.35)] text-center"
      >
        <div className="w-20 h-20 rounded-full bg-blue-500/20 flex items-center justify-center mb-6">
          <Search className="w-10 h-10 text-blue-400/70" />
        </div>
        <h3 className="text-2xl font-semibold text-white mb-2">No students found</h3>
        <p className="text-white/50 mb-6 max-w-md">Try changing your search or filters to find who you are looking for.</p>
        {hasFilters && (
          <motion.button 
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={clearFilters}
            className="px-6 py-2.5 rounded-xl bg-blue-600 text-white font-medium shadow-lg shadow-blue-500/30 hover:bg-blue-500 transition-all"
          >
            Clear Filters
          </motion.button>
        )}
      </motion.div>
    );
  }

  return (
    <AnimatePresence>
      <motion.div 
        layout
        className={`grid gap-6 mt-8 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4' : 'grid-cols-1 md:grid-cols-2'}`}
      >
        {students.map((student, index) => (
          <StudentCard key={student.id} student={student} index={index} onSelect={onSelect} />
        ))}
      </motion.div>
    </AnimatePresence>
  );
}
