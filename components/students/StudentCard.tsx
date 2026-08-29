"use client";

import { motion } from "framer-motion";
import { MapPin, GraduationCap, Building, BadgeCheck } from "lucide-react";
import { Student } from "@/types/student";
import { useState } from "react";

interface StudentCardProps {
  student: Student;
  index: number;
  onSelect: (student: Student) => void;
}

export default function StudentCard({ student, index, onSelect }: StudentCardProps) {
  const [imgError, setImgError] = useState(false);
  const initials = (student.full_name || "U N").split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      whileHover={{ y: -10, scale: 1.02 }}
      onClick={() => onSelect(student)}
      className="relative group cursor-pointer w-full rounded-3xl overflow-hidden bg-white/10 dark:bg-white/5 backdrop-blur-3xl border border-white/20 dark:border-white/10 shadow-[0_35px_90px_rgba(0,0,0,.35)] transition-all duration-500"
    >
      <div className="absolute left-8 right-8 -bottom-10 h-20 rounded-full bg-blue-500/25 blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none" />
      
      <div className="relative p-6 flex flex-col items-center text-center gap-3">
        <div className="relative mb-2">
          <div className="absolute inset-0 bg-blue-500/30 blur-xl rounded-full group-hover:blur-2xl transition-all" />
          {student.avatar_url && !imgError ? (
            <img 
              src={student.avatar_url} 
              alt={student.full_name || "Avatar"}
              onError={() => setImgError(true)}
              className="w-24 h-24 rounded-full object-cover ring-2 ring-blue-400/30 ring-offset-4 ring-offset-slate-950 dark:ring-offset-slate-950 group-hover:scale-110 transition-transform duration-500"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center text-3xl font-bold text-white ring-2 ring-blue-400/30 ring-offset-4 ring-offset-slate-950 dark:ring-offset-slate-950 group-hover:scale-110 transition-transform duration-500 shadow-inner">
              {initials}
            </div>
          )}
          {student.is_active && (
            <div className="absolute bottom-2 right-2 w-4 h-4 bg-emerald-500 rounded-full border-2 border-slate-950 shadow-lg shadow-emerald-500/50" />
          )}
        </div>

        <h3 className="text-xl font-semibold text-white tracking-tight">{student.full_name || "Unknown"}</h3>
        
        <div className="flex items-center gap-1.5 text-blue-300/80 text-sm font-mono">
          <BadgeCheck className="w-3.5 h-3.5" /> {student.student_id || "N/A"}
        </div>

        <div className="mt-2 flex flex-col gap-1.5 text-white/60 text-sm w-full">
          {student.graduation_year && (
            <div className="flex items-center gap-2 justify-center"><GraduationCap className="w-4 h-4 text-blue-400/70" /> Class of {student.graduation_year}</div>
          )}
          {student.department && (
            <div className="flex items-center gap-2 justify-center"><Building className="w-4 h-4 text-blue-400/70" /> {student.department}</div>
          )}
          {student.location && (
            <div className="flex items-center gap-2 justify-center"><MapPin className="w-4 h-4 text-blue-400/70" /> {student.location}</div>
          )}
        </div>

        {student.role && (
          <span className="mt-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-xs font-medium uppercase tracking-wider">
            {student.role}
          </span>
        )}

        <motion.button 
          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          className="mt-4 w-full py-2.5 rounded-xl bg-white/10 dark:bg-white/5 border border-white/20 dark:border-white/10 text-white/80 hover:bg-white/20 hover:text-white transition-all font-medium text-sm backdrop-blur-sm"
        >
          View Profile
        </motion.button>
      </div>
    </motion.div>
  );
}
