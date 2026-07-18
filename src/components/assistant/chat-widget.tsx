"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bot, Send, X, Sparkles, ArrowUpRight, MessageSquare } from "lucide-react";
import { MessageContent } from "@/components/assistant/message-content";
import { useFinanceData, useCurrency } from "@/hooks/use-finance-data";
import { buildFinancialContext } from "@/lib/ai/context";
import { matchHelp, HELP_SUGGESTIONS } from "@/lib/ai/help";
import { cn } from "@/lib/utils";

interface Msg {
  id: number;
  role: "user" | "assistant";
  content: string;
  href?: string;
  cta?: string;
}

const GREETING: Msg = {
  id: 0,
  role: "assistant",
  content:
    "Hi — I'm your **AI CFO helper**. Ask me *how to use the app* (\"how do I add an invoice?\") or a question about *your finances* (\"what's my runway?\"). Every answer comes from your real data.",
};

// A question is a "how-to" if it reads like navigation/product help rather than
// a request for a figure — those go to the grounded financial AI instead.
function isHelpIntent(q: string) {
  return /\b(how|where|help|guide|add|create|set ?up|export|import|invite|delete|edit|change|find|start|begin|can i|show me|what can)\b/i.test(
    q,
  );
}

export function ChatWidget() {
  const pathname = usePathname();
  const data = useFinanceData();
  const currency = useCurrency();

  const [open, setOpen] = React.useState(false);
  const [messages, setMessages] = React.useState<Msg[]>([GREETING]);
  const [input, setInput] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const idRef = React.useRef(1);
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLTextAreaElement>(null);

  const nextId = () => idRef.current++;

  React.useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, loading, open]);

  React.useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => inputRef.current?.focus(), 60);
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(t);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  async function send(text: string) {
    const q = text.trim();
    if (!q || loading) return;
    setMessages((m) => [...m, { id: nextId(), role: "user", content: q }]);
    setInput("");

    // Product/how-to questions → curated knowledge base (instant, accurate).
    const help = isHelpIntent(q) ? matchHelp(q) : null;
    if (help) {
      setMessages((m) => [
        ...m,
        {
          id: nextId(),
          role: "assistant",
          content: help.answer,
          href: help.href,
          cta: help.cta,
        },
      ]);
      return;
    }

    // Financial questions → grounded AI chain (OpenAI → Gemini → local).
    setLoading(true);
    try {
      const context = buildFinancialContext(data, currency);
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q, context }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Request failed");
      setMessages((m) => [
        ...m,
        { id: nextId(), role: "assistant", content: json.answer },
      ]);
    } catch {
      setMessages((m) => [
        ...m,
        {
          id: nextId(),
          role: "assistant",
          content:
            "I couldn't reach the assistant just now. Try again, or open the full **AI Assistant** for a deeper look.",
          href: "/assistant",
          cta: "Open AI Assistant",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  // The full-page assistant already covers this surface.
  if (pathname === "/assistant") return null;

  return (
    <>
      {/* Launcher */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          aria-label="Open help assistant"
          className="fixed bottom-5 right-5 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lift transition-[transform,filter] duration-150 hover:brightness-[1.08] active:scale-95 sm:bottom-6 sm:right-6"
        >
          <MessageSquare className="h-[22px] w-[22px]" aria-hidden />
        </button>
      )}

      {/* Panel */}
      {open && (
        <div
          role="dialog"
          aria-label="AI CFO help assistant"
          className="surface-card fixed bottom-0 right-0 z-50 flex h-[min(560px,100dvh-1.5rem)] w-full max-w-[calc(100vw-1.5rem)] flex-col overflow-hidden rounded-2xl shadow-overlay animate-scale-in sm:bottom-6 sm:right-6 sm:w-[380px] m-3 sm:m-0"
        >
          {/* Header */}
          <div className="flex items-center gap-3 border-b border-border px-4 py-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Bot className="h-5 w-5" aria-hidden />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold leading-tight">AI CFO helper</p>
              <p className="flex items-center gap-1 text-xs text-muted-foreground">
                <Sparkles className="h-3 w-3" aria-hidden /> Grounded in your data
              </p>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close help assistant"
              className="-mr-1 rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages */}
          <div
            ref={scrollRef}
            className="flex-1 space-y-4 overflow-y-auto p-4"
            aria-live="polite"
          >
            {messages.map((m) => (
              <div
                key={m.id}
                className={cn(
                  "flex gap-2.5",
                  m.role === "user" && "flex-row-reverse",
                )}
              >
                {m.role === "assistant" && (
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                    <Bot className="h-4 w-4" aria-hidden />
                  </span>
                )}
                <div
                  className={cn(
                    "max-w-[85%] rounded-xl px-3 py-2",
                    m.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted",
                  )}
                >
                  {m.role === "assistant" ? (
                    <MessageContent text={m.content} />
                  ) : (
                    <p className="text-sm leading-relaxed">{m.content}</p>
                  )}
                  {m.href && m.cta && (
                    <Link
                      href={m.href}
                      onClick={() => setOpen(false)}
                      className="mt-2 inline-flex items-center gap-1 rounded-md bg-surface px-2.5 py-1 text-xs font-medium text-primary ring-1 ring-border transition-colors hover:bg-surface-2"
                    >
                      {m.cta} <ArrowUpRight className="h-3 w-3" />
                    </Link>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex gap-2.5" role="status">
                <span className="sr-only">Thinking…</span>
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <Bot className="h-4 w-4" aria-hidden />
                </span>
                <div className="flex items-center gap-1 rounded-xl bg-muted px-3 py-3">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground/60"
                      style={{ animationDelay: `${i * 0.15}s` }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Suggestions — shown until the user has asked something */}
            {messages.length <= 1 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {HELP_SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="rounded-full border border-border bg-surface px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Composer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex items-end gap-2 border-t border-border p-3"
          >
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send(input);
                }
              }}
              rows={1}
              placeholder="Ask for help or about your finances…"
              aria-label="Message the help assistant"
              className="max-h-28 min-h-[40px] flex-1 resize-none rounded-lg border border-input bg-surface px-3 py-2.5 text-sm outline-none transition-colors focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring/40"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              aria-label="Send message"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-[filter] hover:brightness-[1.08] disabled:pointer-events-none disabled:opacity-50"
            >
              <Send className="h-[18px] w-[18px]" aria-hidden />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
