import type { FinanceData } from "./calculations";
import { invoiceStats, runwayMonths } from "./calculations";
import type { Notification, NotificationType, Settings } from "./types";

/**
 * Alerts are *derived* from the user's real financial data — never fabricated.
 * Each alert carries a stable `key` describing its condition (not its current
 * value), so the same condition persists exactly one notification and re-visits
 * don't create duplicates.
 */
export interface DerivedAlert {
  key: string;
  type: NotificationType;
  title: string;
  body: string;
}

/** Runway below this many months raises a low-cash warning. */
export const RUNWAY_THRESHOLD_MONTHS = 6;

/**
 * Compute the set of alerts that currently hold, from real data only. Pure:
 * given the same data + settings it always returns the same alerts. Returns an
 * empty array when nothing is wrong (the correct empty state).
 */
export function deriveAlerts(
  data: FinanceData,
  settings: Settings,
): DerivedAlert[] {
  const alerts: DerivedAlert[] = [];

  const stats = invoiceStats(data.invoices);
  if (stats.overdueCount > 0) {
    alerts.push({
      key: "invoices-overdue",
      type: "DANGER",
      title: `${stats.overdueCount} overdue invoice${stats.overdueCount === 1 ? "" : "s"}`,
      body: "You have collectible cash sitting in overdue invoices. Consider following up.",
    });
  }

  const runway = runwayMonths(data);
  if (
    settings.lowCashAlert &&
    Number.isFinite(runway) &&
    runway < RUNWAY_THRESHOLD_MONTHS
  ) {
    alerts.push({
      key: "runway-low",
      type: "WARNING",
      title: `Runway below ${RUNWAY_THRESHOLD_MONTHS} months`,
      body: `At your current burn rate, your cash covers about ${runway.toFixed(1)} more months.`,
    });
  }

  return alerts;
}

/**
 * De-duplicate derived alerts against what is already persisted: return only the
 * alerts whose `key` is not already present in `existing`. Pure — this is the
 * function that guarantees "no duplicates on re-visit".
 */
export function pickNewAlerts(
  existing: Pick<Notification, "key">[],
  derived: DerivedAlert[],
): DerivedAlert[] {
  const seen = new Set(
    existing.map((n) => n.key).filter((k): k is string => Boolean(k)),
  );
  return derived.filter((a) => !seen.has(a.key));
}
