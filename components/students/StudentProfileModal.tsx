"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, MapPin, GraduationCap, Building, Mail, Phone, BadgeCheck, MessageCircle, User, Edit, Trash2 } from "lucide-react";
import { Student } from "@/types/student";
import { useState } from "react";

interface StudentProfileModalProps {
  student: Student | null;
  onClose: () => void;
  isAdmin: boolean;
}

export default function StudentProfileModal({ student, onClose, isAdmin }: StudentProfileModalProps) {
  const [imgError, setImgError] = useState(false);
  if (!student) return null;

  const initials = (student.full_name || "U N").split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xl"
        onClick={onClose}
      >
        <motion.div 
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white/10 dark:bg-white/5 backdrop-blur-3xl border border-white/20 dark:border-white/10 shadow-[0_35px_90px_rgba(0,0,0,.35)] p-8"
        >
          <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-blue-600/20 to-transparent pointer-events-none rounded-t-3xl" />
          
          <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-10">
            <X className="w-5 h-5" />
          </button>

          <div className="relative flex flex-col items-center text-center mb-8">
            <div className="relative mb-4">
              <div className="absolute inset-0 bg-blue-500/30 blur-xl rounded-full" />
              {student.avatar_url && !imgError ? (
                <img 
                  src={student.avatar_url} 
                  alt={student.full_name || "Avatar"}
                  onError={() => setImgError(true)}
                  className="w-32 h-32 rounded-full object-cover ring-4 ring-blue-400/40 ring-offset-4 ring-offset-transparent shadow-2xl"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center text-5xl font-bold text-white ring-4 ring-blue-400/40 ring-offset-4 ring-offset-transparent shadow-2xl">
                  {initials}
                </div>
              )}
              {student.is_active && (
                <div className="absolute bottom-2 right-2 w-5 h-5 bg-emerald-500 rounded-full border-4 border-slate-900 shadow-lg shadow-emerald-500/50" />
              )}
            </div>
            <h2 className="text-3xl font-bold text-white tracking-tight">{student.full_name || "Unknown"}</h2>
            <div className="flex items-center gap-2 text-blue-300/80 text-sm font-mono mt-1">
              <BadgeCheck className="w-4 h-4" /> {student.student_id || "N/A"}
            </div>
            {student.role && (
              <span className="mt-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-xs font-medium uppercase tracking-wider">
                {student.role}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left mb-8 text-white/80">
            {student.graduation_year && <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5"><GraduationCap className="w-5 h-5 text-blue-400" /> Class of {student.graduation_year}</div>}
            {student.department && <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5"><Building className="w-5 h-5 text-blue-400" /> {student.department}</div>}
            {student.faculty && <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5"><Building className="w-5 h-5 text-blue-400" /> {student.faculty}</div>}
            {student.location && <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5"><MapPin className="w-5 h-5 text-blue-400" /> {student.location}</div>}
            {student.email && <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5"><Mail className="w-5 h-5 text-blue-400" /> {student.email}</div>}
            {student.phone && <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5"><Phone className="w-5 h-5 text-blue-400" /> {student.phone}</div>}
          </div>

          {student.bio && (
            <div className="mb-8 text-left">
              <h4 className="text-sm font-semibold text-white/40 uppercase tracking-wider mb-2">Bio</h4>
              <p className="text-white/70 leading-relaxed">{student.bio}</p>
            </div>
          )}

          <div className="flex flex-col md:flex-row gap-3">
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1 py-3 rounded-xl bg-blue-600 text-white font-medium shadow-lg shadow-blue-500/30 hover:bg-blue-500 transition-all flex items-center justify-center gap-2">
              <User className="w-4 h-4" /> View Profile
            </motion.button>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1 py-3 rounded-xl bg-white/10 border border-white/20 text-white font-medium hover:bg-white/20 transition-all flex items-center justify-center gap-2">
              <MessageCircle className="w-4 h-4" /> Message
            </motion.button>
            {isAdmin && (
              <>
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="py-3 px-4 rounded-xl bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-all flex items-center justify-center gap-2">
                  <Edit className="w-4 h-4" />
                </motion.button>
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="py-3 px-4 rounded-xl bg-red-500/20 border border-red-400/30 text-red-300 hover:bg-red-500/30 transition-all flex items-center justify-center gap-2">
                  <Trash2 className="w-4 h-4" />
                </motion.button>
              </>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
