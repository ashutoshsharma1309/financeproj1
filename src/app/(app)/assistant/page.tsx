"use client";

import * as React from "react";
import { Bot, Send, Sparkles, User, Trash2, Info } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageContent } from "@/components/assistant/message-content";
import { useToast } from "@/components/ui/toast";
import { useFinanceStore } from "@/lib/store";
import { useFinanceData, useCurrency } from "@/hooks/use-finance-data";
import { buildFinancialContext } from "@/lib/ai/context";
import { NEXA_SUGGESTED_PROMPTS as SUGGESTED_PROMPTS } from "@/lib/ai/nexa/persona";
import { cn } from "@/lib/utils";
import type { AIMessage } from "@/lib/types";

export default function AssistantPage() {
  const { toast } = useToast();
  const data = useFinanceData();
  const currency = useCurrency();

  const chats = useFinanceStore((s) => s.chats);
  const createChat = useFinanceStore((s) => s.createChat);
  const addMessage = useFinanceStore((s) => s.addMessage);
  const deleteChat = useFinanceStore((s) => s.deleteChat);

  const [activeId, setActiveId] = React.useState<string | null>(null);
  const [input, setInput] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const active = chats.find((c) => c.id === activeId) ?? chats[0] ?? null;
  const messages: AIMessage[] = active?.messages ?? [];

  React.useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages.length, loading]);

  async function send(question: string) {
    const trimmed = question.trim();
    if (!trimmed || loading) return;

    let chatId = active?.id;
    if (!chatId) {
      chatId = createChat(trimmed.slice(0, 40));
      setActiveId(chatId);
    }
    addMessage(chatId, "user", trimmed);
    setInput("");
    setLoading(true);

    try {
      const context = buildFinancialContext(data, currency);
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: trimmed, context }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Request failed");
      addMessage(chatId, "assistant", json.answer);
    } catch (err) {
      addMessage(
        chatId,
        "assistant",
        "I couldn't complete that request. Please try again in a moment.",
      );
      toast({
        tone: "error",
        title: "Assistant error",
        description: err instanceof Error ? err.message : "Unknown error",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <PageHeader
        title="Nexa"
        description="Your AI Business Strategist — advice and forecasts grounded only in your data."
        action={
          <div className="flex items-center gap-3">
            <Badge tone="primary">
              <Sparkles className="h-3.5 w-3.5" /> Grounded in your data
            </Badge>
            {active && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  deleteChat(active.id);
                  setActiveId(null);
                }}
              >
                <Trash2 className="h-4 w-4" /> Clear
              </Button>
            )}
          </div>
        }
      />

      <div className="surface-card flex h-[calc(100dvh-13rem)] min-h-[460px] flex-col p-0">
        {/* Messages */}
        <div ref={scrollRef} className="flex-1 space-y-5 overflow-y-auto p-5 sm:p-6">
          {messages.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <span className="clay-sm mb-4 flex h-16 w-16 items-center justify-center rounded-2xl text-primary">
                <Bot className="h-8 w-8" />
              </span>
              <h3 className="text-lg font-semibold">Nexa is ready</h3>
              <p className="mt-1.5 max-w-md text-sm text-muted-foreground">
                I&apos;m your AI Business Strategist. I analyze only the revenue,
                expenses, invoices and accounts you&apos;ve entered — then advise
                on health, growth and risk. Ask me anything below.
              </p>
              <div className="mt-6 grid w-full max-w-2xl gap-2.5 sm:grid-cols-2">
                {SUGGESTED_PROMPTS.slice(0, 6).map((p) => (
                  <button
                    key={p}
                    onClick={() => send(p)}
                    className="rounded-xl border border-border bg-surface px-4 py-3 text-left text-sm text-muted-foreground transition-all hover:border-primary hover:text-foreground"
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((m, i) => (
              <div
                key={i}
                className={cn("flex gap-3", m.role === "user" && "flex-row-reverse")}
              >
                <span
                  className={cn(
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                    m.role === "user"
                      ? "bg-muted text-foreground"
                      : "bg-primary/10 text-primary",
                  )}
                >
                  {m.role === "user" ? (
                    <User className="h-5 w-5" aria-hidden />
                  ) : (
                    <Bot className="h-5 w-5" aria-hidden />
                  )}
                </span>
                <div
                  className={cn(
                    "max-w-[80%] rounded-2xl px-4 py-3",
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
                </div>
              </div>
            ))
          )}

          {loading && (
            <div className="flex gap-3" role="status">
              <span className="sr-only">The assistant is thinking…</span>
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Bot className="h-5 w-5" aria-hidden />
              </span>
              <div className="flex items-center gap-1.5 rounded-xl bg-muted px-4 py-4">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/60"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Composer */}
        <div className="border-t border-border p-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex items-end gap-2"
          >
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send(input);
                }
              }}
              placeholder="Ask about runway, spending, hiring, or run a what-if…"
              rows={1}
              aria-label="Ask the AI CFO a question"
              className="max-h-32 min-h-[40px] flex-1 resize-none rounded-lg border border-input bg-surface px-3.5 py-2.5 text-sm outline-none transition-colors focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring/40"
            />
            <Button
              type="submit"
              size="icon"
              className="h-10 w-10"
              loading={loading}
              disabled={!input.trim()}
              aria-label="Send message"
            >
              {!loading && <Send className="h-[18px] w-[18px]" />}
            </Button>
          </form>
          <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
            <Info className="h-3.5 w-3.5" />
            Configure a Gemini API key to enable full generative answers. Without
            one, responses are computed directly from your data.
          </p>
        </div>
      </div>
    </div>
  );
}
