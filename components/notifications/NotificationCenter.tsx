"use client";

import { useEffect, useState } from "react";
import {
  Bell,
  Check,
  CheckCheck,
  Loader2,
  X,
  MessageCircle,
  GraduationCap,
  Info,
} from "lucide-react";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string | null;
  read: boolean;
  created_at: string;
}

function getIcon(type: string | null) {
  if (type === "message") {
    return <MessageCircle size={19} />;
  }

  if (type === "alumni") {
    return <GraduationCap size={19} />;
  }

  return <Info size={19} />;
}

function formatDate(date: string) {
  const value = new Date(date);
  const now = new Date();

  const seconds = Math.floor(
    (now.getTime() - value.getTime()) / 1000
  );

  if (seconds < 60) return "Just now";

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;

  return value.toLocaleDateString();
}

export default function NotificationCenter({
  onClose,
}: {
  onClose?: () => void;
}) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadNotifications() {
    try {
      setLoading(true);

      const response = await fetch("/api/notifications", {
        cache: "no-store",
      });

      if (!response.ok) return;

      const data = await response.json();

      setNotifications(data.notifications ?? []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadNotifications();

    const interval = setInterval(loadNotifications, 15000);

    return () => clearInterval(interval);
  }, []);

  async function markRead(id: string) {
    await fetch("/api/notifications", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });

    setNotifications((current) =>
      current.map((notification) =>
        notification.id === id
          ? { ...notification, read: true }
          : notification
      )
    );
  }

  async function markAllRead() {
    await fetch("/api/notifications", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    });

    setNotifications((current) =>
      current.map((notification) => ({
        ...notification,
        read: true,
      }))
    );
  }

  const unread = notifications.filter(
    (notification) => !notification.read
  ).length;

  return (
    <div
      className="
        fixed right-4 top-20 z-[100]
        w-[calc(100vw-2rem)]
        max-w-[420px]
        overflow-hidden
        rounded-[30px]
        border border-white/30
        bg-white/80
        dark:bg-slate-950/80
        shadow-2xl
        backdrop-blur-3xl
      "
    >
      {/* Header */}
      <div
        className="
          flex items-center justify-between
          border-b border-black/5
          px-5 py-4
          dark:border-white/10
        "
      >
        <div className="flex items-center gap-3">
          <div
            className="
              flex h-10 w-10
              items-center justify-center
              rounded-2xl
              bg-sky-500/10
              text-sky-500
            "
          >
            <Bell size={20} />
          </div>

          <div>
            <h2 className="font-bold text-slate-900 dark:text-white">
              Notifications
            </h2>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              {unread} unread
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {unread > 0 && (
            <button
              type="button"
              onClick={markAllRead}
              title="Mark all as read"
              className="
                flex h-9 w-9
                items-center justify-center
                rounded-xl
                text-slate-500
                transition
                hover:bg-black/5
                dark:hover:bg-white/10
              "
            >
              <CheckCheck size={18} />
            </button>
          )}

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              title="Close"
              className="
                flex h-9 w-9
                items-center justify-center
                rounded-xl
                text-slate-500
                transition
                hover:bg-black/5
                dark:hover:bg-white/10
              "
            >
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-h-[65vh] overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center p-12">
            <Loader2
              className="animate-spin text-sky-500"
              size={25}
            />
          </div>
        ) : notifications.length === 0 ? (
          <div className="px-6 py-14 text-center">
            <div
              className="
                mx-auto flex h-14 w-14
                items-center justify-center
                rounded-2xl
                bg-slate-500/10
                text-slate-400
              "
            >
              <Bell size={25} />
            </div>

            <h3 className="mt-4 font-semibold text-slate-900 dark:text-white">
              You're all caught up
            </h3>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              New notifications will appear here.
            </p>
          </div>
        ) : (
          notifications.map((notification) => (
            <button
              key={notification.id}
              type="button"
              onClick={() => markRead(notification.id)}
              className={`
                flex w-full gap-4
                border-b border-black/5
                p-5 text-left
                transition
                dark:border-white/10
                ${
                  notification.read
                    ? "bg-transparent"
                    : "bg-sky-500/[0.07]"
                }
                hover:bg-black/[0.03]
                dark:hover:bg-white/[0.04]
              `}
            >
              <div
                className={`
                  mt-0.5
                  flex h-10 w-10 shrink-0
                  items-center justify-center
                  rounded-2xl
                  ${
                    notification.read
                      ? "bg-slate-500/10 text-slate-400"
                      : "bg-sky-500/10 text-sky-500"
                  }
                `}
              >
                {getIcon(notification.type)}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <h3
                    className={`
                      text-sm
                      ${
                        notification.read
                          ? "font-medium"
                          : "font-bold"
                      }
                      text-slate-900 dark:text-white
                    `}
                  >
                    {notification.title}
                  </h3>

                  {!notification.read && (
                    <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-sky-500" />
                  )}
                </div>

                <p className="mt-1 text-sm leading-5 text-slate-500 dark:text-slate-400">
                  {notification.message}
                </p>

                <div className="mt-2 flex items-center gap-2 text-xs text-slate-400">
                  <span>{formatDate(notification.created_at)}</span>

                  {notification.read && (
                    <Check size={13} />
                  )}
                </div>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
