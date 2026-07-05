import * as React from "react";
import { ArrowDownRight, ArrowUpRight, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatPercent } from "@/lib/utils";

export function StatCard({
  label,
  value,
  icon: Icon,
  delta,
  tone = "primary",
  hint,
}: {
  label: string;
  value: string;
  icon: LucideIcon;
  delta?: number | null;
  tone?: "primary" | "success" | "warning" | "danger" | "accent";
  hint?: string;
}) {
  const toneBg: Record<string, string> = {
    primary: "bg-primary/12 text-primary",
    success: "bg-success/15 text-success",
    warning: "bg-warning/18 text-warning",
    danger: "bg-danger/15 text-danger",
    accent: "bg-accent/15 text-accent",
  };
  const positive = (delta ?? 0) >= 0;

  return (
    <div className="surface-card group relative overflow-hidden p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lift">
      <span className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-primary/5 blur-2xl transition-opacity group-hover:opacity-100" />
      <div className="flex items-start justify-between">
        <span className="text-[13px] font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </span>
        <span
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-xl transition-transform group-hover:scale-105",
            toneBg[tone],
          )}
        >
          <Icon className="h-5 w-5" />
        </span>
      </div>
      <p className="tnum mt-3 text-[26px] font-semibold leading-none">{value}</p>
      {delta === null || delta === undefined ? (
        hint && <p className="mt-2 text-xs text-muted-foreground">{hint}</p>
      ) : (
        <div className="mt-2 flex items-center gap-1.5 text-xs">
          <span
            className={cn(
              "inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 font-medium",
              positive ? "bg-success/15 text-success" : "bg-danger/15 text-danger",
            )}
          >
            {positive ? (
              <ArrowUpRight className="h-3 w-3" />
            ) : (
              <ArrowDownRight className="h-3 w-3" />
            )}
            {formatPercent(Math.abs(delta))}
          </span>
          <span className="text-muted-foreground">{hint ?? "vs last month"}</span>
        </div>
      )}
    </div>
  );
}
