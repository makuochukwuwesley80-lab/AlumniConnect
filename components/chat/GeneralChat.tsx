"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, Loader2, RefreshCw, Hash } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { safeFetch } from "@/lib/api/safe-fetch";
import MessageList from "@/components/chat/MessageList";
import ChatComposer from "@/components/chat/ChatComposer";
import type {
  ChatAuthor,
  ChatMessage,
  MessagePayload,
  MessagesPayload,
} from "@/types/chat";

interface GeneralChatProps {
  currentUserId: string;
  room?: string;
  conversationId: string | null;
}

type LoadState = "loading" | "ready" | "error";

export function GeneralChat({
  currentUserId,
  room = "general",
  conversationId,
}: GeneralChatProps) {
  const [messages, setMessages] = React.useState<ChatMessage[]>([]);
  const [state, setState] = React.useState<LoadState>("loading");
  const [loadError, setLoadError] = React.useState<string | null>(null);
  const [sendError, setSendError] = React.useState<string | null>(null);

  const scrollRef = React.useRef<HTMLDivElement | null>(null);
  const authorCache = React.useRef<Map<string, ChatAuthor>>(new Map());
  const supabase = React.useMemo(() => createClient(), []);

  const scrollToBottom = React.useCallback((smooth: boolean) => {
    requestAnimationFrame(() => {
      const node = scrollRef.current;
      if (!node) return;
      node.scrollTo({
        top: node.scrollHeight,
        behavior: smooth ? "smooth" : "auto",
      });
    });
  }, []);

  const upsert = React.useCallback((incoming: ChatMessage) => {
    setMessages((previous) => {
      if (previous.some((item) => item.id === incoming.id)) return previous;
      const next = [...previous, incoming];
      next.sort((a, b) => a.created_at.localeCompare(b.created_at));
      return next;
    });
  }, []);

  const load = React.useCallback(async () => {
    setState("loading");
    setLoadError(null);

    const result = await safeFetch<MessagesPayload>(
      "/api/chat/messages?room=" + encodeURIComponent(room),
      { method: "GET", cache: "no-store" }
    );

    if (!result.ok) {
      setLoadError(result.error);
      setState("error");
      return;
    }

    for (const message of result.data.messages) {
      if (message.author) {
        authorCache.current.set(message.sender_id, message.author);
      }
    }

    setMessages(result.data.messages);
    setState("ready");
    scrollToBottom(false);
  }, [room, scrollToBottom]);

  React.useEffect(() => {
    void load();
  }, [load]);

  React.useEffect(() => {
    if (!conversationId) return;

    const channel = supabase
      .channel("chat-conversation-" + conversationId)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: "conversation_id=eq." + conversationId,
        },
        (payload) => {
          const row = payload.new as Record<string, unknown>;
          const id = typeof row.id === "string" ? row.id : null;
          const senderId =
            typeof row.sender_id === "string" ? row.sender_id : null;
          if (!id || !senderId) return;

          const base: ChatMessage = {
            id,
            room: typeof row.room === "string" ? row.room : room,
            conversation_id: conversationId,
            content: typeof row.content === "string" ? row.content : "",
            created_at:
              typeof row.created_at === "string"
                ? row.created_at
                : new Date().toISOString(),
            sender_id: senderId,
            author: authorCache.current.get(senderId) ?? null,
          };

          upsert(base);
          scrollToBottom(true);

          if (!base.author) {
            void supabase
              .from("profiles")
              .select("id, full_name, avatar_url, role")
              .eq("id", senderId)
              .maybeSingle()
              .then(({ data }) => {
                if (!data) return;
                const author: ChatAuthor = {
                  id: data.id as string,
                  full_name: (data.full_name as string | null) ?? null,
                  avatar_url: (data.avatar_url as string | null) ?? null,
                  role: (data.role as string | null) ?? null,
                };
                authorCache.current.set(senderId, author);
                setMessages((previous) =>
                  previous.map((item) =>
                    item.sender_id === senderId && !item.author
                      ? { ...item, author }
                      : item
                  )
                );
              });
          }
        }
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [supabase, conversationId, room, upsert, scrollToBottom]);

  const handleSend = React.useCallback(
    async (content: string): Promise<boolean> => {
      setSendError(null);

      const result = await safeFetch<MessagePayload>("/api/chat/messages", {
        method: "POST",
        body: JSON.stringify({ content, room }),
      });

      if (!result.ok) {
        setSendError(result.error);
        return false;
      }

      const message = result.data.message;
      if (message.author) {
        authorCache.current.set(message.sender_id, message.author);
      }

      upsert(message);
      scrollToBottom(true);
      return true;
    },
    [room, upsert, scrollToBottom]
  );

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="mx-auto flex h-[calc(100vh-9rem)] w-full max-w-4xl flex-col overflow-hidden rounded-3xl border border-slate-200/70 bg-white/90 shadow-[0_4px_16px_rgba(15,23,42,0.04)] backdrop-blur-2xl dark:border-white/10 dark:bg-white/[0.04] dark:shadow-[0_28px_70px_rgba(0,0,0,0.5)]"
    >
      <header className="flex items-center gap-3 border-b border-slate-200/70 px-5 py-4 dark:border-white/10">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-[0_6px_18px_rgba(37,99,235,0.25)]">
          <Hash className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-base font-semibold text-slate-900 dark:text-white">
            General Chat
          </h1>
          <p className="truncate text-xs text-slate-500 dark:text-slate-400">
            Everyone in the AlumniConnect community
          </p>
        </div>
        <button
          type="button"
          onClick={() => void load()}
          aria-label="Reload messages"
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200/70 bg-white text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-800 dark:border-white/10 dark:bg-white/[0.05] dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white"
        >
          <RefreshCw className="h-4 w-4" />
        </button>
      </header>

      <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto">
        {state === "loading" ? (
          <div className="flex h-full flex-col items-center justify-center gap-3">
            <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Loading messages...
            </p>
          </div>
        ) : null}

        {state === "error" ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex h-full flex-col items-center justify-center gap-3 px-6 text-center"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500/10 text-red-500">
              <AlertCircle className="h-6 w-6" />
            </div>
            <p className="text-sm font-medium text-slate-800 dark:text-slate-100">
              Could not load the conversation
            </p>
            <p className="max-w-sm text-xs text-slate-500 dark:text-slate-400">
              {loadError}
            </p>
            <button
              type="button"
              onClick={() => void load()}
              className="mt-1 rounded-xl bg-slate-900 px-4 py-2 text-xs font-medium text-white transition-opacity hover:opacity-90 dark:bg-white dark:text-slate-900"
            >
              Try again
            </button>
          </motion.div>
        ) : null}

        {state === "ready" ? (
          <MessageList messages={messages} currentUserId={currentUserId} />
        ) : null}
      </div>

      <AnimatePresence>
        {sendError ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-t border-red-200/60 bg-red-50/80 px-5 py-2.5 dark:border-red-400/20 dark:bg-red-500/10"
          >
            <div className="flex items-start gap-2">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
              <p className="flex-1 text-xs text-red-700 dark:text-red-300">
                {sendError}
              </p>
              <button
                type="button"
                onClick={() => setSendError(null)}
                className="text-xs font-medium text-red-600 hover:underline dark:text-red-300"
              >
                Dismiss
              </button>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <ChatComposer onSend={handleSend} disabled={state === "error"} />
    </motion.section>
  );
}

export default GeneralChat;