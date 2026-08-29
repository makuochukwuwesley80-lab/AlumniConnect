"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessagesSquare } from "lucide-react";
import type { ChatMessage } from "@/types/chat";

interface MessageListProps {
  messages: ChatMessage[];
  currentUserId: string;
}

function initialsOf(name: string | null, fallback: string): string {
  const source = (name ?? "").trim();
  if (source.length === 0) return fallback.slice(0, 2).toUpperCase();
  const parts = source.split(/\s+/).filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function formatTime(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function dayKey(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toDateString();
}

function dayLabel(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";

  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (date.toDateString() === today.toDateString()) return "Today";
  if (date.toDateString() === yesterday.toDateString()) return "Yesterday";

  return new Intl.DateTimeFormat(undefined, {
    weekday: "short",
    day: "numeric",
    month: "short",
  }).format(date);
}

export function MessageList({ messages, currentUserId }: MessageListProps) {
  if (messages.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex h-full flex-col items-center justify-center gap-3 px-6 py-16 text-center"
      >
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-500 dark:bg-blue-400/10 dark:text-blue-300">
          <MessagesSquare className="h-6 w-6" />
        </div>
        <p className="text-sm font-medium text-slate-800 dark:text-slate-100">
          No messages yet
        </p>
        <p className="max-w-xs text-xs text-slate-500 dark:text-slate-400">
          Be the first to say hello to the AlumniConnect community.
        </p>
      </motion.div>
    );
  }

  let lastDay = "";

  return (
    <div className="flex flex-col gap-1 px-3 py-4 sm:px-5">
      <AnimatePresence initial={false}>
        {messages.map((message) => {
          const mine = message.sender_id === currentUserId;
          const name = message.author?.full_name ?? "Community member";
          const avatar = message.author?.avatar_url ?? null;
          const key = dayKey(message.created_at);
          const showDay = key !== lastDay;
          lastDay = key;

          return (
            <React.Fragment key={message.id}>
              {showDay ? (
                <div className="my-3 flex items-center gap-3">
                  <span className="h-px flex-1 bg-slate-200/70 dark:bg-white/10" />
                  <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500">
                    {dayLabel(message.created_at)}
                  </span>
                  <span className="h-px flex-1 bg-slate-200/70 dark:bg-white/10" />
                </div>
              ) : null}

              <motion.div
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ type: "spring", stiffness: 380, damping: 32 }}
                className={
                  "flex w-full gap-2.5 py-1 " +
                  (mine ? "flex-row-reverse" : "flex-row")
                }
              >
                <div className="mt-0.5 shrink-0">
                  {avatar ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={avatar}
                      alt={name}
                      className="h-9 w-9 rounded-full object-cover ring-1 ring-slate-200 dark:ring-white/10"
                    />
                  ) : (
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 text-[11px] font-semibold text-white ring-1 ring-white/40">
                      {initialsOf(name, message.sender_id)}
                    </div>
                  )}
                </div>

                <div
                  className={
                    "flex max-w-[78%] flex-col gap-1 sm:max-w-[68%] " +
                    (mine ? "items-end" : "items-start")
                  }
                >
                  <div className="flex items-baseline gap-2 px-1">
                    <span className="text-[11px] font-medium text-slate-600 dark:text-slate-300">
                      {mine ? "You" : name}
                    </span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500">
                      {formatTime(message.created_at)}
                    </span>
                  </div>

                  <div
                    className={
                      "whitespace-pre-wrap break-words rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed " +
                      (mine
                        ? "bg-gradient-to-b from-blue-500 to-blue-600 text-white shadow-[0_4px_14px_rgba(37,99,235,0.22)]"
                        : "border border-slate-200/70 bg-white text-slate-800 shadow-[0_2px_8px_rgba(15,23,42,0.04)] dark:border-white/10 dark:bg-white/[0.06] dark:text-slate-100 dark:shadow-none")
                    }
                  >
                    {message.content}
                  </div>
                </div>
              </motion.div>
            </React.Fragment>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

export default MessageList;