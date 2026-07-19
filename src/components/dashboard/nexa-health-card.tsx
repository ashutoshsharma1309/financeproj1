"use client";

import * as React from "react";
import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useFinanceData, useCurrency } from "@/hooks/use-finance-data";
import { buildFinancialContext } from "@/lib/ai/context";
import { computeBusinessHealth, type BusinessHealth } from "@/lib/ai/nexa/health";
import { cn } from "@/lib/utils";

const GRADE_TONE: Record<BusinessHealth["grade"], string> = {
  Strong: "text-success",
  Stable: "text-primary",
  Watch: "text-warning",
  "At risk": "text-danger",
  "No data": "text-muted-foreground",
};
const BAR_TONE = (score: number) =>
  score >= 70 ? "bg-success" : score >= 45 ? "bg-warning" : "bg-danger";

export function NexaHealthCard() {
  const data = useFinanceData();
  const currency = useCurrency();
  const health = React.useMemo(
    () => computeBusinessHealth(buildFinancialContext(data, currency)),
    [data, currency],
  );

  return (
    <Card className="flex flex-col">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10 text-primary">
            <Sparkles className="h-4 w-4" aria-hidden />
          </span>
          <div>
            <h2 className="text-sm font-semibold leading-tight">
              Nexa · Business Health
            </h2>
            <p className="text-xs text-muted-foreground">AI Business Strategist</p>
          </div>
        </div>
        <Link
          href="/assistant"
          className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
        >
          Ask Nexa <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {health.score === null ? (
        <p className="mt-6 text-sm text-muted-foreground">
          Add revenue, expenses and account balances and Nexa will score your
          financial health across five pillars — grounded only in your data.
        </p>
      ) : (
        <div className="mt-5 grid gap-6 sm:grid-cols-[auto_1fr] sm:items-center">
          {/* Score dial */}
          <div className="flex items-center gap-4">
            <div
              className="relative grid h-24 w-24 shrink-0 place-items-center rounded-full"
              style={{
                background: `conic-gradient(hsl(var(--primary)) ${health.score * 3.6}deg, hsl(var(--muted)) 0deg)`,
              }}
              role="img"
              aria-label={`Business health ${health.score} out of 100, ${health.grade}`}
            >
              <div className="grid h-[76px] w-[76px] place-items-center rounded-full bg-surface">
                <span className="tnum text-2xl font-semibold leading-none">
                  {health.score}
                </span>
                <span className="text-[10px] text-muted-foreground">/ 100</span>
              </div>
            </div>
            <div className="sm:hidden">
              <p className={cn("text-lg font-semibold", GRADE_TONE[health.grade])}>
                {health.grade}
              </p>
            </div>
          </div>

          {/* Pillars */}
          <div className="space-y-2.5">
            <p
              className={cn(
                "hidden text-sm font-semibold sm:block",
                GRADE_TONE[health.grade],
              )}
            >
              {health.grade}
            </p>
            {health.pillars.map((p) => (
              <div key={p.key} className="flex items-center gap-3 text-xs">
                <span className="w-24 shrink-0 text-muted-foreground">
                  {p.label}
                </span>
                <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                  {p.score !== null && (
                    <span
                      className={cn("block h-full rounded-full", BAR_TONE(p.score))}
                      style={{ width: `${p.score}%` }}
                    />
                  )}
                </span>
                <span className="tnum w-8 shrink-0 text-right font-medium">
                  {p.score === null ? "—" : Math.round(p.score)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}
