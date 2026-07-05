"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Bot, ArrowUpRight, Wallet, TrendingUp, Timer } from "lucide-react";

// Abstract "financial pulse" — decorative brand art, not business data.
// A smooth path that draws itself, with a glowing node riding the crest.
const PATH =
  "M0,150 C40,150 60,120 100,118 C150,116 170,90 210,92 C260,95 280,60 330,58 C380,56 405,95 450,80 C500,64 520,30 560,34 C600,38 620,70 660,58 C700,46 720,20 760,26";

const NODE = { x: 560, y: 34 };

export function HeroVisual() {
  const reduce = useReducedMotion();

  return (
    <div className="relative">
      <motion.div
        initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="clay relative overflow-hidden p-3"
      >
        {/* window chrome */}
        <div className="mb-3 flex items-center gap-2 px-2 pt-1">
          <span className="h-2.5 w-2.5 rounded-full bg-danger/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-accent/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-primary/70" />
          <span className="ml-2 font-mono text-[11px] tracking-wide text-muted-foreground">
            aicfo — cash overview
          </span>
          <span className="ml-auto ticker-chip flex items-center gap-1.5 px-2 py-1 text-primary">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
            live
          </span>
        </div>

        <div className="rounded-[var(--radius)] surface-2 p-5">
          {/* stat row — labels only, no fabricated figures */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: Wallet, label: "Cash position", tone: "text-primary" },
              { icon: TrendingUp, label: "Net profit", tone: "text-accent" },
              { icon: Timer, label: "Runway", tone: "text-primary" },
            ].map((s, i) => (
              <motion.div
                key={s.label}
                initial={reduce ? { opacity: 0 } : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + i * 0.12, duration: 0.5 }}
                className="rounded-xl border border-border bg-surface p-3"
              >
                <s.icon className={`h-4 w-4 ${s.tone}`} />
                <p className="mt-2 text-[11px] font-medium text-muted-foreground">
                  {s.label}
                </p>
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
                    initial={{ width: 0 }}
                    animate={{ width: ["0%", "62%", "44%"][i] }}
                    transition={{ delay: 0.9 + i * 0.12, duration: 1.1, ease: "easeOut" }}
                  />
                </div>
              </motion.div>
            ))}
          </div>

          {/* the drawing pulse */}
          <div className="relative mt-4 h-[190px] w-full">
            <svg
              viewBox="0 0 760 190"
              fill="none"
              preserveAspectRatio="none"
              className="h-full w-full"
            >
              <defs>
                <linearGradient id="hero-stroke" x1="0" y1="0" x2="760" y2="0">
                  <stop offset="0%" stopColor="hsl(var(--primary))" />
                  <stop offset="100%" stopColor="hsl(var(--accent))" />
                </linearGradient>
                <linearGradient id="hero-fill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.28" />
                  <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* gridlines */}
              {[38, 76, 114, 152].map((y) => (
                <line
                  key={y}
                  x1="0"
                  y1={y}
                  x2="760"
                  y2={y}
                  stroke="hsl(var(--grid-line))"
                  strokeOpacity="0.5"
                  strokeWidth="1"
                />
              ))}

              {/* area under curve */}
              <motion.path
                d={`${PATH} L760,190 L0,190 Z`}
                fill="url(#hero-fill)"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.6, duration: 0.8 }}
              />

              {/* the line, drawing itself */}
              <motion.path
                d={PATH}
                stroke="url(#hero-stroke)"
                strokeWidth="3"
                strokeLinecap="round"
                initial={{ pathLength: reduce ? 1 : 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: 0.6, duration: 1.8, ease: "easeInOut" }}
              />

              {/* glowing node at the crest */}
              <motion.g
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.1, duration: 0.4 }}
              >
                <circle cx={NODE.x} cy={NODE.y} r="12" fill="hsl(var(--primary))" opacity="0.18">
                  <animate attributeName="r" values="8;16;8" dur="2.4s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.3;0;0.3" dur="2.4s" repeatCount="indefinite" />
                </circle>
                <circle cx={NODE.x} cy={NODE.y} r="4.5" fill="hsl(var(--primary))" />
                <circle cx={NODE.x} cy={NODE.y} r="8" fill="none" stroke="hsl(var(--background))" strokeWidth="2" />
              </motion.g>
            </svg>
          </div>
        </div>
      </motion.div>

      {/* Floating AI insight card */}
      <motion.div
        initial={reduce ? { opacity: 0 } : { opacity: 0, y: 20, x: 10 }}
        animate={{ opacity: 1, y: 0, x: 0 }}
        transition={{ delay: 1.5, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="clay-sm absolute -bottom-6 -left-4 hidden max-w-[280px] items-start gap-3 p-4 sm:flex md:-left-10"
      >
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
          <Bot className="h-5 w-5" />
        </span>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-primary">
            AI CFO
          </p>
          <p className="mt-0.5 text-sm leading-snug">
            Add your first entry and I&apos;ll surface exactly where your cash is
            going.
          </p>
        </div>
      </motion.div>

      {/* Floating ticker chip */}
      <motion.div
        initial={reduce ? { opacity: 0 } : { opacity: 0, y: -14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.8, duration: 0.5 }}
        className="clay-sm absolute -right-3 top-10 hidden items-center gap-2 px-3 py-2 md:flex"
      >
        <ArrowUpRight className="h-4 w-4 text-primary" />
        <span className="tnum text-sm font-semibold">Insights, from your data</span>
      </motion.div>
    </div>
  );
}
