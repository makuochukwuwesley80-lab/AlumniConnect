"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Send, Smile, Loader2 } from "lucide-react";
import EmojiPicker from "@/components/chat/EmojiPicker";

interface ChatComposerProps {
  onSend: (content: string) => Promise<boolean>;
  disabled?: boolean;
}

const MAX_LENGTH = 4000;

export function ChatComposer({ onSend, disabled = false }: ChatComposerProps) {
  const [value, setValue] = React.useState("");
  const [sending, setSending] = React.useState(false);
  const [pickerOpen, setPickerOpen] = React.useState(false);
  const textareaRef = React.useRef<HTMLTextAreaElement | null>(null);
  const inFlight = React.useRef(false);

  const resize = React.useCallback(() => {
    const node = textareaRef.current;
    if (!node) return;
    node.style.height = "auto";
    node.style.height = Math.min(node.scrollHeight, 160) + "px";
  }, []);

  React.useEffect(() => {
    resize();
  }, [value, resize]);

  const submit = React.useCallback(async () => {
    if (inFlight.current || disabled) return;

    const trimmed = value.trim();
    if (trimmed.length === 0 || trimmed.length > MAX_LENGTH) return;

    inFlight.current = true;
    setSending(true);
    setPickerOpen(false);

    const ok = await onSend(trimmed);

    if (ok) setValue("");

    setSending(false);
    inFlight.current = false;
    textareaRef.current?.focus();
  }, [value, disabled, onSend]);

  function handleKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void submit();
    }
  }

  function insertEmoji(emoji: string) {
    const node = textareaRef.current;

    if (!node) {
      setValue((previous) => previous + emoji);
      return;
    }

    const start = node.selectionStart ?? value.length;
    const end = node.selectionEnd ?? value.length;
    const next = value.slice(0, start) + emoji + value.slice(end);

    setValue(next);

    requestAnimationFrame(() => {
      node.focus();
      const caret = start + emoji.length;
      node.setSelectionRange(caret, caret);
    });
  }

  const canSend =
    value.trim().length > 0 &&
    value.trim().length <= MAX_LENGTH &&
    !sending &&
    !disabled;

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        void submit();
      }}
      className="relative border-t border-slate-200/70 bg-white/80 p-3 backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.03] sm:p-4"
    >
      <div className="relative flex items-end gap-2">
        <div className="relative">
          <EmojiPicker
            open={pickerOpen}
            onClose={() => setPickerOpen(false)}
            onSelect={insertEmoji}
          />
          <motion.button
            type="button"
            whileTap={{ scale: 0.92 }}
            onClick={() => setPickerOpen((previous) => !previous)}
            aria-label="Insert emoji"
            aria-expanded={pickerOpen}
            disabled={disabled}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-slate-200/70 bg-white text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-700 disabled:opacity-50 dark:border-white/10 dark:bg-white/[0.05] dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white"
          >
            <Smile className="h-5 w-5" />
          </motion.button>
        </div>

        <div className="relative flex-1">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(event) => setValue(event.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            maxLength={MAX_LENGTH}
            disabled={disabled}
            placeholder="Write a message..."
            className="w-full resize-none rounded-2xl border border-slate-200/70 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-blue-400/70 focus:ring-4 focus:ring-blue-500/10 disabled:opacity-50 dark:border-white/10 dark:bg-white/[0.05] dark:text-white dark:placeholder:text-slate-500 dark:focus:border-blue-400/40"
          />
        </div>

        <motion.button
          type="submit"
          whileTap={{ scale: 0.94 }}
          disabled={!canSend}
          className="flex h-11 shrink-0 items-center gap-2 rounded-2xl bg-gradient-to-b from-blue-500 to-blue-600 px-4 text-sm font-medium text-white shadow-[0_6px_18px_rgba(37,99,235,0.28)] transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
        >
          {sending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
          <span className="hidden sm:inline">
            {sending ? "Sending..." : "Send"}
          </span>
        </motion.button>
      </div>

      <p className="mt-2 px-1 text-[11px] text-slate-400 dark:text-slate-500">
        Enter to send &middot; Shift + Enter for a new line
      </p>
    </form>
  );
}

export default ChatComposer;