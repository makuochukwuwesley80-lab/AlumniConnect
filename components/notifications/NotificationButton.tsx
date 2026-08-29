"use client";

import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import NotificationCenter from "./NotificationCenter";

export default function NotificationButton() {
  const [open, setOpen] = useState(false);
  const [unread, setUnread] = useState(0);

  async function checkUnread() {
    try {
      const response = await fetch("/api/notifications", {
        cache: "no-store",
      });

      if (!response.ok) return;

      const data = await response.json();

      const count = (data.notifications ?? []).filter(
        (notification: { read: boolean }) =>
          !notification.read
      ).length;

      setUnread(count);
    } catch {
      // Keep the notification button usable if polling fails.
    }
  }

  useEffect(() => {
    checkUnread();

    const interval = setInterval(checkUnread, 15000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setOpen((value) => !value);
          checkUnread();
        }}
        aria-label="Notifications"
        className="
          relative
          flex h-11 w-11
          items-center justify-center
          rounded-2xl
          border border-white/20
          bg-white/50
          dark:bg-white/10
          text-slate-700
          dark:text-white
          shadow-sm
          backdrop-blur-2xl
          transition-all
          active:scale-90
          hover:bg-white/80
          dark:hover:bg-white/15
        "
      >
        <Bell size={20} />

        {unread > 0 && (
          <span
            className="
              absolute
              -right-1
              -top-1
              flex h-5 min-w-5
              items-center justify-center
              rounded-full
              bg-sky-500
              px-1
              text-[10px]
              font-bold
              text-white
              shadow-lg
              ring-2
              ring-white
              dark:ring-slate-950
            "
          >
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <NotificationCenter
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}
