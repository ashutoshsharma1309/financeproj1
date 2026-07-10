import { ArrowDownRight, ArrowUpRight, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

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
    primary: "bg-primary/10 text-primary",
    success: "bg-success/12 text-success",
    warning: "bg-warning/15 text-warning",
    danger: "bg-danger/12 text-danger",
    accent: "bg-accent/12 text-accent",
  };
  const positive = (delta ?? 0) >= 0;

  return (
    <div className="surface-card p-5 sm:p-6">
      <div className="flex items-start justify-between">
        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </span>
        <span
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-lg",
            toneBg[tone],
          )}
        >
          <Icon className="h-[18px] w-[18px]" />
        </span>
      </div>
      <p className="tnum mt-4 text-2xl font-semibold leading-none tracking-tight">
        {value}
      </p>
      {delta === null || delta === undefined ? (
        hint && <p className="mt-2.5 text-xs text-muted-foreground">{hint}</p>
      ) : (
        <div className="mt-2.5 flex items-center gap-1.5 text-xs">
          <span
            className={cn(
              "inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 font-medium tabular-nums",
              positive ? "bg-success/12 text-success" : "bg-danger/12 text-danger",
            )}
          >
            {positive ? (
              <ArrowUpRight className="h-3 w-3" />
            ) : (
              <ArrowDownRight className="h-3 w-3" />
            )}
            {Math.abs(delta).toFixed(1)}%
          </span>
          <span className="text-muted-foreground">{hint ?? "vs last month"}</span>
        </div>
      )}
    </div>
  );
}
