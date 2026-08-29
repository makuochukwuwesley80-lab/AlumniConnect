"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ArrowLeft,
  Check,
  CheckCheck,
  ChevronDown,
  GraduationCap,
  MessageCircle,
  MoreVertical,
  Paperclip,
  Search,
  Send,
  Smile,
  UserRound,
  Users,
} from "lucide-react";

type ChatType = "general" | "class" | "personal";

type Participant = {
  user_id: string;
};

type Conversation = {
  id: string;
  type: ChatType;
  class_year: number | null;
  created_by: string | null;
  created_at: string;
  conversation_participants?: Participant[];
};

type Message = {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  created_at: string;
};

type ChatView = {
  id: string;
  type: ChatType;
  title: string;
  subtitle: string;
  initials: string;
  color: string;
  conversation: Conversation;
};

function formatTime(value: string) {
  return new Intl.DateTimeFormat("en-NG", {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

function formatDate(value: string) {
  const date = new Date(value);
  const today = new Date();

  if (date.toDateString() === today.toDateString()) {
    return "Today";
  }

  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (date.toDateString() === yesterday.toDateString()) {
    return "Yesterday";
  }

  return new Intl.DateTimeFormat("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export default function MessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentUserId, setCurrentUserId] = useState("");
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const [mobileChatOpen, setMobileChatOpen] = useState(false);
  const [error, setError] = useState("");

  const messageEndRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    if (!selectedId) {
      return;
    }

    loadMessages(selectedId);
  }, [selectedId]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  useEffect(() => {
    if (!selectedId) {
      return;
    }

    const interval = window.setInterval(() => {
      loadMessages(selectedId, true);
    }, 4000);

    return () => window.clearInterval(interval);
  }, [selectedId]);

  async function loadConversations() {
    try {
      setLoadingConversations(true);
      setError("");

      const response = await fetch(
        "/api/messages/conversations",
        {
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Unable to load conversations."
        );
      }

      const loaded =
        (data.conversations ?? []) as Conversation[];

      setConversations(loaded);

      if (loaded.length > 0) {
        setSelectedId((current) => current ?? loaded[0].id);
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load conversations."
      );
    } finally {
      setLoadingConversations(false);
    }
  }

  async function loadMessages(
    conversationId: string,
    silent = false
  ) {
    try {
      if (!silent) {
        setLoadingMessages(true);
      }

      const response = await fetch(
        `/api/messages/conversations/${conversationId}/messages`,
        {
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Unable to load messages."
        );
      }

      setMessages(data.messages ?? []);
      setCurrentUserId(data.currentUserId ?? "");
    } catch (err) {
      if (!silent) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load messages."
        );
      }
    } finally {
      if (!silent) {
        setLoadingMessages(false);
      }
    }
  }

  async function sendMessage(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const content = message.trim();

    if (!content || !selectedId || sending) {
      return;
    }

    try {
      setSending(true);
      setError("");

      const response = await fetch(
        `/api/messages/conversations/${selectedId}/messages`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            content,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Unable to send message."
        );
      }

      setMessages((current) => [
        ...current,
        data.message as Message,
      ]);

      setMessage("");

      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
        textareaRef.current.focus();
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to send message."
      );
    } finally {
      setSending(false);
    }
  }

  function handleTextareaChange(
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) {
    setMessage(event.target.value);

    event.target.style.height = "auto";
    event.target.style.height =
      `${Math.min(event.target.scrollHeight, 130)}px`;
  }

  function handleTextareaKeyDown(
    event: React.KeyboardEvent<HTMLTextAreaElement>
  ) {
    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {
      event.preventDefault();

      event.currentTarget.form?.requestSubmit();
    }
  }

  const chatViews = useMemo<ChatView[]>(() => {
    return conversations.map((conversation) => {
      if (conversation.type === "general") {
        return {
          id: conversation.id,
          type: "general",
          title: "General Chat",
          subtitle: "AlumniConnect Community",
          initials: "AC",
          color:
            "from-cyan-400/30 via-blue-500/20 to-indigo-600/30",
          conversation,
        };
      }

      if (conversation.type === "class") {
        const year = conversation.class_year;

        return {
          id: conversation.id,
          type: "class",
          title: year
            ? `Class of ${year}`
            : "My Class",
          subtitle: "Class members only",
          initials: year
            ? String(year).slice(-2)
            : "CL",
          color:
            "from-blue-500/30 via-indigo-500/20 to-violet-600/30",
          conversation,
        };
      }

      return {
        id: conversation.id,
        type: "personal",
        title: "Personal Chat",
        subtitle: "Private conversation",
        initials: "PM",
        color:
          "from-sky-400/30 via-blue-500/20 to-purple-600/30",
        conversation,
      };
    });
  }, [conversations]);

  const filteredChats = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return chatViews;
    }

    return chatViews.filter(
      (chat) =>
        chat.title.toLowerCase().includes(query) ||
        chat.subtitle.toLowerCase().includes(query)
    );
  }, [chatViews, search]);

  const selectedChat =
    chatViews.find(
      (chat) => chat.id === selectedId
    ) ?? null;

  const groupedMessages = useMemo(() => {
    const groups: {
      date: string;
      messages: Message[];
    }[] = [];

    for (const item of messages) {
      const date = formatDate(item.created_at);
      const existing = groups.find(
        (group) => group.date === date
      );

      if (existing) {
        existing.messages.push(item);
      } else {
        groups.push({
          date,
          messages: [item],
        });
      }
    }

    return groups;
  }, [messages]);

  return (
    <main className="min-h-screen p-0 sm:p-3 lg:p-5">
      <div className="mx-auto flex h-screen max-w-[1500px] overflow-hidden border border-white/10 bg-[#07111f]/95 shadow-2xl sm:h-[calc(100vh-24px)] sm:rounded-[30px]">
        {/* =====================================================
            SIDEBAR
        ====================================================== */}

        <aside
          className={[
            "flex w-full shrink-0 flex-col border-r border-white/10 bg-[#091522]/95 lg:w-[390px]",
            mobileChatOpen
              ? "hidden lg:flex"
              : "flex",
          ].join(" ")}
        >
          {/* Header */}
          <div className="border-b border-white/10 px-4 pb-4 pt-5 sm:px-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-cyan-300/70">
                  AlumniConnect
                </p>

                <h1 className="mt-1 text-2xl font-bold tracking-tight text-white">
                  Chats
                </h1>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-white/60 transition hover:bg-white/10 hover:text-white"
                  aria-label="More options"
                >
                  <MoreVertical size={20} />
                </button>
              </div>
            </div>

            {/* Search */}
            <div className="relative mt-5">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30"
              />

              <input
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search or start new chat"
                className="h-12 w-full rounded-2xl border border-white/10 bg-white/[0.055] pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-cyan-400/30 focus:bg-white/[0.075]"
              />
            </div>
          </div>

          {/* Conversation list */}
          <div className="flex-1 overflow-y-auto">
            {loadingConversations ? (
              <div className="space-y-2 p-3">
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="flex animate-pulse items-center gap-3 rounded-2xl p-3"
                  >
                    <div className="h-14 w-14 rounded-full bg-white/5" />
                    <div className="flex-1">
                      <div className="h-3 w-32 rounded bg-white/5" />
                      <div className="mt-2 h-2 w-44 rounded bg-white/5" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredChats.length === 0 ? (
              <div className="px-6 py-16 text-center">
                <MessageCircle
                  size={38}
                  className="mx-auto text-white/15"
                />

                <p className="mt-4 text-sm font-semibold text-white/60">
                  No chats found
                </p>

                <p className="mt-1 text-xs text-white/30">
                  Search another conversation.
                </p>
              </div>
            ) : (
              <>
                {/* Pinned community chats */}
                <div className="px-3 pb-2 pt-3">
                  <p className="px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-white/25">
                    Community
                  </p>
                </div>

                {filteredChats
                  .filter(
                    (chat) =>
                      chat.type === "general" ||
                      chat.type === "class"
                  )
                  .map((chat) => (
                    <ChatListItem
                      key={chat.id}
                      chat={chat}
                      selected={chat.id === selectedId}
                      messages={messages}
                      onClick={() => {
                        setSelectedId(chat.id);
                        setMobileChatOpen(true);
                      }}
                    />
                  ))}

                <div className="px-3 pb-2 pt-5">
                  <p className="px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-white/25">
                    Personal
                  </p>
                </div>

                {filteredChats
                  .filter(
                    (chat) => chat.type === "personal"
                  )
                  .map((chat) => (
                    <ChatListItem
                      key={chat.id}
                      chat={chat}
                      selected={chat.id === selectedId}
                      messages={messages}
                      onClick={() => {
                        setSelectedId(chat.id);
                        setMobileChatOpen(true);
                      }}
                    />
                  ))}

                {/* Start personal chat */}
                <a
                  href="/alumni"
                  className="mx-3 mb-5 mt-3 flex items-center gap-3 rounded-2xl border border-dashed border-white/10 p-3 transition hover:border-cyan-400/20 hover:bg-white/[0.035]"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/5 text-white/35">
                    <UserRound size={21} />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-white/70">
                      Start a new chat
                    </p>

                    <p className="mt-1 text-xs text-white/30">
                      Find an alumni member
                    </p>
                  </div>
                </a>
              </>
            )}
          </div>
        </aside>

        {/* =====================================================
            CHAT PANEL
        ====================================================== */}

        <section
          className={[
            "min-w-0 flex-1 flex-col bg-[#06101b]",
            mobileChatOpen
              ? "flex"
              : "hidden lg:flex",
          ].join(" ")}
        >
          {selectedChat ? (
            <>
              {/* Chat header */}
              <header className="flex min-h-[72px] shrink-0 items-center gap-3 border-b border-white/10 bg-[#0a1724]/95 px-3 sm:px-5">
                <button
                  type="button"
                  onClick={() =>
                    setMobileChatOpen(false)
                  }
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white/55 hover:bg-white/5 hover:text-white lg:hidden"
                  aria-label="Back"
                >
                  <ArrowLeft size={21} />
                </button>

                <div
                  className={[
                    "flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-sm font-bold text-white shadow-lg",
                    selectedChat.color,
                  ].join(" ")}
                >
                  {selectedChat.type === "general" ? (
                    <Users size={20} />
                  ) : selectedChat.type === "class" ? (
                    <GraduationCap size={20} />
                  ) : (
                    selectedChat.initials
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <h2 className="truncate text-[15px] font-bold text-white">
                    {selectedChat.title}
                  </h2>

                  <p className="mt-0.5 truncate text-xs text-white/35">
                    {selectedChat.type === "general"
                      ? "Everyone on AlumniConnect"
                      : selectedChat.type === "class"
                        ? selectedChat.subtitle
                        : "Private conversation"}
                  </p>
                </div>

                <button
                  type="button"
                  className="flex h-10 w-10 items-center justify-center rounded-full text-white/45 transition hover:bg-white/5 hover:text-white"
                  aria-label="Search messages"
                >
                  <Search size={19} />
                </button>

                <button
                  type="button"
                  className="hidden h-10 w-10 items-center justify-center rounded-full text-white/45 transition hover:bg-white/5 hover:text-white sm:flex"
                  aria-label="Conversation options"
                >
                  <MoreVertical size={19} />
                </button>
              </header>

              {/* Error */}
              {error && (
                <div className="border-b border-red-400/10 bg-red-500/[0.06] px-5 py-2 text-center text-xs text-red-300">
                  {error}
                </div>
              )}

              {/* Messages */}
              <div
                className="relative flex-1 overflow-y-auto px-3 py-5 sm:px-6"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 20% 20%, rgba(34,211,238,0.025), transparent 30%), radial-gradient(circle at 80% 70%, rgba(59,130,246,0.025), transparent 30%)",
                }}
              >
                {selectedChat.type === "class" && (
                  <div className="mx-auto mb-5 max-w-lg rounded-2xl border border-cyan-400/10 bg-cyan-400/[0.035] px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-2 text-[11px] font-semibold text-cyan-300/70">
                      <GraduationCap size={14} />
                      Class members only
                    </div>

                    <p className="mt-1 text-[10px] text-white/25">
                      This conversation is restricted to
                      members of your graduating class.
                    </p>
                  </div>
                )}

                {selectedChat.type === "general" &&
                  messages.length === 0 && (
                    <div className="mx-auto mb-5 max-w-lg rounded-2xl border border-white/10 bg-white/[0.035] px-5 py-4 text-center">
                      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-cyan-400/10 text-cyan-300">
                        <MessageCircle size={22} />
                      </div>

                      <p className="mt-3 text-sm font-semibold text-white/70">
                        Welcome to General Chat
                      </p>

                      <p className="mt-1 text-xs leading-5 text-white/30">
                        Start the conversation with
                        the AlumniConnect community.
                      </p>
                    </div>
                  )}

                {loadingMessages ? (
                  <div className="flex h-full items-center justify-center">
                    <div className="h-7 w-7 animate-spin rounded-full border-2 border-white/10 border-t-cyan-300" />
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex min-h-[45%] items-center justify-center">
                    <div className="text-center">
                      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white/[0.04] text-white/15">
                        <MessageCircle size={28} />
                      </div>

                      <p className="mt-4 text-sm font-semibold text-white/45">
                        No messages yet
                      </p>

                      <p className="mt-1 text-xs text-white/25">
                        Send the first message.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="mx-auto max-w-4xl space-y-5">
                    {groupedMessages.map((group) => (
                      <div key={group.date}>
                        <div className="mb-4 flex justify-center">
                          <span className="rounded-full border border-white/10 bg-[#102031]/90 px-3 py-1 text-[10px] font-semibold text-white/35 shadow-lg">
                            {group.date}
                          </span>
                        </div>

                        <div className="space-y-1.5">
                          {group.messages.map(
                            (item) => {
                              const mine =
                                item.sender_id ===
                                currentUserId;

                              return (
                                <div
                                  key={item.id}
                                  className={[
                                    "flex",
                                    mine
                                      ? "justify-end"
                                      : "justify-start",
                                  ].join(" ")}
                                >
                                  <div
                                    className={[
                                      "group relative max-w-[82%] rounded-2xl px-3.5 py-2.5 shadow-lg sm:max-w-[70%]",
                                      mine
                                        ? "rounded-br-md bg-gradient-to-br from-cyan-500/90 to-blue-600/90 text-white"
                                        : "rounded-bl-md border border-white/[0.07] bg-[#142333] text-white/90",
                                    ].join(" ")}
                                  >
                                    <p className="whitespace-pre-wrap break-words pr-10 text-[13px] leading-5">
                                      {item.content}
                                    </p>

                                    <div
                                      className={[
                                        "mt-1 flex items-center justify-end gap-1",
                                        mine
                                          ? "text-white/55"
                                          : "text-white/25",
                                      ].join(" ")}
                                    >
                                      <span className="text-[9px]">
                                        {formatTime(
                                          item.created_at
                                        )}
                                      </span>

                                      {mine && (
                                        <CheckCheck
                                          size={13}
                                          className="text-cyan-100/80"
                                        />
                                      )}
                                    </div>
                                  </div>
                                </div>
                              );
                            }
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div ref={messageEndRef} />
              </div>

              {/* Composer */}
              <div className="shrink-0 border-t border-white/10 bg-[#091622]/95 px-3 py-3 sm:px-5 sm:py-4">
                <form
                  onSubmit={sendMessage}
                  className="mx-auto flex max-w-5xl items-end gap-2"
                >
                  <button
                    type="button"
                    className="mb-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white/35 transition hover:bg-white/5 hover:text-white/70"
                    aria-label="Emoji"
                  >
                    <Smile size={22} />
                  </button>

                  <button
                    type="button"
                    className="mb-1 hidden h-10 w-10 shrink-0 items-center justify-center rounded-full text-white/35 transition hover:bg-white/5 hover:text-white/70 sm:flex"
                    aria-label="Attach"
                  >
                    <Paperclip size={20} />
                  </button>

                  <div className="flex min-h-[44px] flex-1 items-center rounded-[24px] border border-white/10 bg-white/[0.055] px-4 py-1.5 transition focus-within:border-cyan-400/25 focus-within:bg-white/[0.07]">
                    <textarea
                      ref={textareaRef}
                      value={message}
                      onChange={handleTextareaChange}
                      onKeyDown={handleTextareaKeyDown}
                      rows={1}
                      placeholder="Type a message"
                      className="max-h-[130px] min-h-[28px] flex-1 resize-none bg-transparent py-1.5 text-sm leading-5 text-white outline-none placeholder:text-white/25"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={
                      !message.trim() || sending
                    }
                    className="mb-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 text-white shadow-lg shadow-blue-950/40 transition hover:scale-[1.03] disabled:cursor-not-allowed disabled:opacity-30"
                    aria-label="Send"
                  >
                    {sending ? (
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    ) : (
                      <Send
                        size={18}
                        className="translate-x-0.5"
                      />
                    )}
                  </button>
                </form>

                <p className="mt-2 hidden text-center text-[9px] text-white/15 sm:block">
                  Enter to send · Shift + Enter for a new line
                </p>
              </div>
            </>
          ) : (
            <div className="flex flex-1 items-center justify-center bg-[#06101b] p-6 text-center">
              <div>
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-cyan-400/10 bg-cyan-400/[0.04] text-cyan-300/40">
                  <MessageCircle size={34} />
                </div>

                <h2 className="mt-5 text-xl font-bold text-white/70">
                  AlumniConnect Chats
                </h2>

                <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-white/25">
                  Select a conversation to start
                  messaging.
                </p>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function ChatListItem({
  chat,
  selected,
  messages,
  onClick,
}: {
  chat: ChatView;
  selected: boolean;
  messages: Message[];
  onClick: () => void;
}) {
  const lastMessage =
    messages.length > 0
      ? messages[messages.length - 1]
      : null;

  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "flex w-full items-center gap-3 px-3 py-3 text-left transition",
        selected
          ? "bg-white/[0.065]"
          : "hover:bg-white/[0.035]",
      ].join(" ")}
    >
      <div
        className={[
          "relative flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-sm font-bold text-white shadow-lg",
          chat.color,
        ].join(" ")}
      >
        {chat.type === "general" ? (
          <Users size={21} />
        ) : chat.type === "class" ? (
          <GraduationCap size={21} />
        ) : (
          chat.initials
        )}

        {selected && (
          <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-[#091522] bg-emerald-400" />
        )}
      </div>

      <div className="min-w-0 flex-1 border-b border-white/[0.045] pb-3">
        <div className="flex items-center justify-between gap-2">
          <p className="truncate text-[14px] font-semibold text-white/90">
            {chat.title}
          </p>

          {lastMessage && (
            <span className="shrink-0 text-[10px] text-white/25">
              {formatTime(lastMessage.created_at)}
            </span>
          )}
        </div>

        <div className="mt-1 flex items-center gap-1">
          {lastMessage && (
            lastMessage.sender_id ===
              undefined ? null : (
              <Check
                size={12}
                className="shrink-0 text-white/20"
              />
            )
          )}

          <p className="truncate text-xs text-white/30">
            {lastMessage
              ? lastMessage.content
              : chat.subtitle}
          </p>
        </div>
      </div>
    </button>
  );
}
