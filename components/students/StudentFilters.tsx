"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { Student } from "@/types/student";

interface StudentFiltersProps {
  showFilters: boolean;
  students: Student[];
  filters: Record<string, string>;
  setFilters: (v: Record<string, string>) => void;
  applyFilters: () => void;
  clearFilters: () => void;
}

export default function StudentFilters({ showFilters, students, filters, setFilters, applyFilters, clearFilters }: StudentFiltersProps) {
  const uniqueValues = (key: keyof Student) => [...new Set(students.map(s => s[key]).filter(Boolean) as string[])];

  return (
    <AnimatePresence>
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden w-full"
        >
          <div className="mt-6 p-6 rounded-3xl bg-white/10 dark:bg-white/5 backdrop-blur-3xl border border-white/20 dark:border-white/10 shadow-[0_35px_90px_rgba(0,0,0,.35)]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-white">Filters</h3>
              <button onClick={clearFilters} className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1"><X className="w-3 h-3"/> Clear</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <select value={filters.graduation_year || ""} onChange={(e) => setFilters({...filters, graduation_year: e.target.value})} className="p-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-blue-500/50">
                <option value="" className="bg-slate-900">All Years</option>
                {uniqueValues("graduation_year").sort().map(y => <option key={y} value={y} className="bg-slate-900">{y}</option>)}
              </select>
              <select value={filters.faculty || ""} onChange={(e) => setFilters({...filters, faculty: e.target.value})} className="p-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-blue-500/50">
                <option value="" className="bg-slate-900">All Faculties</option>
                {uniqueValues("faculty").sort().map(f => <option key={f} value={f} className="bg-slate-900">{f}</option>)}
              </select>
              <select value={filters.department || ""} onChange={(e) => setFilters({...filters, department: e.target.value})} className="p-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-blue-500/50">
                <option value="" className="bg-slate-900">All Departments</option>
                {uniqueValues("department").sort().map(d => <option key={d} value={d} className="bg-slate-900">{d}</option>)}
              </select>
              <select value={filters.role || ""} onChange={(e) => setFilters({...filters, role: e.target.value})} className="p-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-blue-500/50">
                <option value="" className="bg-slate-900">All Roles</option>
                {uniqueValues("role").sort().map(r => <option key={r} value={r} className="bg-slate-900">{r}</option>)}
              </select>
            </div>
            <div className="mt-6 flex justify-end">
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={applyFilters} className="px-6 py-2.5 rounded-xl bg-blue-600 text-white font-medium shadow-lg shadow-blue-500/30 hover:bg-blue-500 transition-all">
                Apply Filters
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
