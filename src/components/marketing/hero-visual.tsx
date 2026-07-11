"use client";

import { LineChart, Timer, TrendingUp, Wallet } from "lucide-react";

// An honest empty-state preview of the product. It shows the dashboard frame
// and the metrics that WILL appear — but never fabricates values or a chart.
// Real numbers and the cash-flow line render only once the user adds data.
const METRICS = [
  { icon: Wallet, label: "Cash position" },
  { icon: TrendingUp, label: "Net profit" },
  { icon: Timer, label: "Runway" },
];

export function HeroVisual() {
  return (
    <div className="clay relative overflow-hidden p-3 animate-fade-up">
      {/* window chrome */}
      <div className="mb-3 flex items-center gap-2 px-2 pt-1">
        <span className="h-2.5 w-2.5 rounded-full bg-danger/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-warning/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-primary/70" />
        <span className="ml-2 font-mono text-[11px] tracking-wide text-muted-foreground">
          aicfo — cash overview
        </span>
      </div>

      <div className="surface-2 rounded-lg p-5">
        {/* metric placeholders — labels only, no fabricated figures */}
        <div className="grid grid-cols-3 gap-3">
          {METRICS.map((m, i) => (
            <div
              key={m.label}
              className="rounded-lg border border-border bg-surface p-3 animate-fade-up"
              style={{ animationDelay: `${0.15 + i * 0.08}s` }}
            >
              <m.icon className="h-4 w-4 text-muted-foreground" aria-hidden />
              <p className="mt-2 text-[11px] font-medium text-muted-foreground">
                {m.label}
              </p>
              <p className="tnum mt-1.5 text-lg font-semibold text-muted-foreground/40">
                —
              </p>
            </div>
          ))}
        </div>

        {/* chart region — empty state, not a fabricated line */}
        <div className="relative mt-4 h-[190px] w-full overflow-hidden rounded-lg border border-dashed border-border/70">
          {/* faint gridlines for context only */}
          <svg
            viewBox="0 0 760 190"
            preserveAspectRatio="none"
            className="absolute inset-0 h-full w-full"
            aria-hidden
          >
            {[38, 76, 114, 152].map((y) => (
              <line
                key={y}
                x1="0"
                y1={y}
                x2="760"
                y2={y}
                stroke="hsl(var(--grid-line))"
                strokeOpacity="0.45"
                strokeWidth="1"
              />
            ))}
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
            <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <LineChart className="h-5 w-5" aria-hidden />
            </span>
            <p className="mt-3 text-sm font-semibold">Your cash flow, visualized</p>
            <p className="mt-1 max-w-xs text-xs text-muted-foreground">
              Add your first entry — every line here is drawn from your real
              numbers, never sample data.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
