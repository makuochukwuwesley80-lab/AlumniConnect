"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  Briefcase,
  CalendarDays,
  MessageSquare,
  Settings,
  LogOut,
  Shield,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Students", href: "/students", icon: Users },
  { name: "Alumni", href: "/alumni", icon: GraduationCap },
  { name: "Opportunities", href: "/opportunities", icon: Briefcase },
  { name: "Events", href: "/events", icon: CalendarDays },
  { name: "Messages", href: "/messages", icon: MessageSquare },
  { name: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="
        hidden
        lg:flex
        w-[280px]
        flex-col
        border-r
        border-white/10
        bg-white/10
        dark:bg-white/5
        backdrop-blur-3xl
      "
    >
      <div className="p-8">
        <div
          className="
            flex
            items-center
            gap-4
            rounded-3xl
            border
            border-white/20
            bg-white/20
            dark:bg-white/10
            p-4
            shadow-xl
          "
        >
          <div
            className="
              flex
              h-14
              w-14
              items-center
              justify-center
              rounded-2xl
              bg-gradient-to-br
              from-sky-400
              via-blue-500
              to-indigo-700
              text-white
            "
          >
            <Shield size={28} />
          </div>

          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              INCUSAAF
            </h2>

            <p className="text-sm text-slate-500 dark:text-slate-300">
              AlumniConnect
            </p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-5">
        <div className="space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;

            const active =
              pathname === item.href ||
              pathname.startsWith(item.href + "/");

            return (
              <Link
                key={item.href}
                href={item.href}
                className={
                  active
                    ? "flex items-center gap-4 rounded-2xl bg-sky-500 px-5 py-4 font-medium text-white shadow-lg transition-all"
                    : "flex items-center gap-4 rounded-2xl px-5 py-4 font-medium text-slate-700 transition-all hover:bg-white/20 dark:text-slate-300 dark:hover:bg-white/10"
                }
              >
                <Icon size={22} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      <div className="p-6">
        <div
          className="
            rounded-3xl
            border
            border-white/20
            bg-white/20
            dark:bg-white/10
            p-5
            backdrop-blur-3xl
          "
        >
          <p className="font-semibold text-slate-900 dark:text-white">
            Welcome back
          </p>

          <p className="mb-5 text-sm text-slate-500 dark:text-slate-300">
            INCUSAAF Member
          </p>

          <button
            className="
              flex
              w-full
              items-center
              justify-center
              gap-2
              rounded-2xl
              bg-red-500
              py-3
              font-medium
              text-white
              transition-all
              hover:bg-red-600
            "
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
}
