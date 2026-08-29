"use client";

import { motion } from "framer-motion";
import { Search, SlidersHorizontal, ArrowUpDown, LayoutGrid, List, Plus } from "lucide-react";

interface StudentSearchProps {
  search: string;
  setSearch: (v: string) => void;
  showFilters: boolean;
  setShowFilters: (v: boolean) => void;
  viewMode: "grid" | "list";
  setViewMode: (v: "grid" | "list") => void;
  sort: string;
  setSort: (v: string) => void;
  isAdmin: boolean;
  onAddStudent: () => void;
}

export default function StudentSearch({
  search,
  setSearch,
  showFilters,
  setShowFilters,
  viewMode,
  setViewMode,
  sort,
  setSort,
  isAdmin,
  onAddStudent,
}: StudentSearchProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col md:flex-row items-stretch md:items-center gap-4 w-full"
    >
      <div className="relative flex-1">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-400/70" />
        <input
          type="text"
          placeholder="Search by name, ID, department..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white/10 dark:bg-white/5 backdrop-blur-xl border border-white/20 dark:border-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
        />
      </div>
      
      <div className="flex items-center gap-3">
        <motion.button 
          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          onClick={() => setShowFilters(!showFilters)}
          className={`p-3.5 rounded-2xl backdrop-blur-xl border transition-all ${showFilters ? 'bg-blue-500/30 border-blue-400/50 text-white' : 'bg-white/10 dark:bg-white/5 border-white/20 dark:border-white/10 text-white/70 hover:text-white hover:bg-white/20'}`}
        >
          <SlidersHorizontal className="w-5 h-5" />
        </motion.button>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="p-3.5 rounded-2xl bg-white/10 dark:bg-white/5 backdrop-blur-xl border border-white/20 dark:border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 appearance-none"
        >
          <option value="newest" className="bg-slate-900">Newest</option>
          <option value="oldest" className="bg-slate-900">Oldest</option>
          <option value="az" className="bg-slate-900">Name A-Z</option>
          <option value="za" className="bg-slate-900">Name Z-A</option>
          <option value="year" className="bg-slate-900">Grad Year</option>
        </select>

        <div className="p-1.5 rounded-2xl bg-white/10 dark:bg-white/5 backdrop-blur-xl border border-white/20 dark:border-white/10 flex gap-1">
          <button onClick={() => setViewMode("grid")} className={`p-2 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-blue-500/40 text-white' : 'text-white/50 hover:text-white'}`}><LayoutGrid className="w-4 h-4" /></button>
          <button onClick={() => setViewMode("list")} className={`p-2 rounded-xl transition-all ${viewMode === 'list' ? 'bg-blue-500/40 text-white' : 'text-white/50 hover:text-white'}`}><List className="w-4 h-4" /></button>
        </div>

        {isAdmin && (
          <motion.button 
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={onAddStudent}
            className="flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-blue-600 text-white font-medium shadow-lg shadow-blue-500/30 hover:bg-blue-500 transition-all"
          >
            <Plus className="w-5 h-5" /> Add
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}
