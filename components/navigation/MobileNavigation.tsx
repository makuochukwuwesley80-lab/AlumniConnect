"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  GraduationCap,
  CalendarDays,
  Briefcase,
  MessageSquare,
  Settings,
  X,
  Users,
  LogOut,
} from "lucide-react";

const items = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Alumni",
    href: "/alumni",
    icon: GraduationCap,
  },
  {
    name: "Students",
    href: "/students",
    icon: Users,
  },
  {
    name: "Events",
    href: "/events",
    icon: CalendarDays,
  },
  {
    name: "Opportunities",
    href: "/opportunities",
    icon: Briefcase,
  },
  {
    name: "Messages",
    href: "/messages",
    icon: MessageSquare,
  },
  {
    name: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

interface MobileNavigationProps {
  open: boolean;
  onClose: () => void;
}

export default function MobileNavigation({
  open,
  onClose,
}: MobileNavigationProps) {
  const pathname = usePathname();

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] lg:hidden">

      <button
        aria-label="Close navigation"
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/30 backdrop-blur-sm"
      />

      <aside
        className="
          absolute left-0 top-0
          flex h-full w-[min(86vw,340px)]
          flex-col
          border-r border-white/30
          bg-white/80 dark:bg-[#071226]/90
          backdrop-blur-3xl
          shadow-[20px_0_80px_rgba(0,0,0,.2)]
          animate-in slide-in-from-left duration-300
        "
      >

        {/* Header */}
        <div className="flex items-center justify-between p-6">

          <div className="flex items-center gap-3">

            <div
              className="
                flex h-12 w-12
                items-center justify-center
                rounded-2xl
                bg-gradient-to-br
                from-sky-400
                to-blue-700
                text-white
                shadow-lg
              "
            >
              <GraduationCap size={25} />
            </div>

            <div>
              <p className="font-bold text-slate-900 dark:text-white">
                INCUSAAF
              </p>

              <p className="text-xs text-slate-500 dark:text-slate-400">
                AlumniConnect
              </p>
            </div>

          </div>

          <button
            onClick={onClose}
            className="
              flex h-10 w-10
              items-center justify-center
              rounded-2xl
              bg-black/5 dark:bg-white/10
              text-slate-700 dark:text-white
            "
          >
            <X size={21} />
          </button>

        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-4 py-3">

          <div className="space-y-2">

            {items.map((item) => {
              const Icon = item.icon;

              const active =
                pathname === item.href ||
                pathname.startsWith(item.href + "/");

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`
                    flex items-center gap-4
                    rounded-2xl
                    px-5 py-4
                    transition-all duration-200
                    active:scale-[0.98]

                    ${
                      active
                        ? "bg-sky-500 text-white shadow-lg"
                        : "text-slate-700 dark:text-slate-200 hover:bg-black/5 dark:hover:bg-white/10"
                    }
                  `}
                >
                  <Icon size={21} />
                  <span className="font-medium">
                    {item.name}
                  </span>
                </Link>
              );
            })}

          </div>

        </nav>

        {/* Account */}
        <div className="p-5">

          <div
            className="
              rounded-3xl
              border border-white/30
              bg-white/40 dark:bg-white/5
              p-5
              backdrop-blur-2xl
            "
          >

            <p className="text-xs text-slate-500 dark:text-slate-400">
              Signed in as
            </p>

            <p className="mt-1 truncate text-sm font-semibold text-slate-900 dark:text-white">
              alu2026001@alumniconnect.app
            </p>

            <button
              className="
                mt-4 flex w-full
                items-center justify-center gap-2
                rounded-2xl
                bg-red-500
                px-4 py-3
                text-sm font-semibold
                text-white
                transition
                hover:bg-red-600
                active:scale-[0.98]
              "
            >
              <LogOut size={18} />
              Sign out
            </button>

          </div>

        </div>

      </aside>
    </div>
  );
}
