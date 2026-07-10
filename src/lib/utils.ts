import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge Tailwind classes intelligently. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format a number as currency using the given ISO code. */
export function formatCurrency(
  value: number,
  currency = "INR",
  opts: Intl.NumberFormatOptions = {},
) {
  const locale = currency === "INR" ? "en-IN" : "en-US";
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
    ...opts,
  }).format(Number.isFinite(value) ? value : 0);
}

/** Compact currency, e.g. ₹1.2L / $1.2K. */
export function formatCompact(value: number, currency = "INR") {
  const locale = currency === "INR" ? "en-IN" : "en-US";
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(Number.isFinite(value) ? value : 0);
}

/** Format a percentage delta with a sign. */
export function formatPercent(value: number, fractionDigits = 1) {
  if (!Number.isFinite(value)) return "—";
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(fractionDigits)}%`;
}

/** Human date, e.g. 5 Jul 2026. */
export function formatDate(input: string | number | Date) {
  const d = new Date(input);
  if (Number.isNaN(d.getTime())) return "—";
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(d);
}

/** YYYY-MM key for a date. */
export function monthKey(input: string | number | Date) {
  const d = new Date(input);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

/** Readable "Jul 2026" label from a YYYY-MM key. */
export function monthLabel(key: string) {
  const [y, m] = key.split("-").map(Number);
  return new Intl.DateTimeFormat("en-IN", {
    month: "short",
    year: "numeric",
  }).format(new Date(y, (m || 1) - 1, 1));
}

// Monotonic counter guarantees uniqueness even for ids minted in the same tick
// (e.g. seeding many categories synchronously) — `performance.now()` resolution
// is clamped in browsers, so a timestamp alone collides under bulk creation.
let uidCounter = 0;

/** Collision-resistant id without external deps. */
export function uid(prefix = "id") {
  uidCounter = (uidCounter + 1) % 0xffffffff;
  const time = Math.floor(performance.now()).toString(36);
  const count = uidCounter.toString(36);
  const rand = Math.floor(Math.random() * 46656).toString(36); // 3 base-36 chars
  return `${prefix}_${time}${count}${rand}`;
}

/** Clamp a number. */
export function clamp(n: number, min: number, max: number) {
  return Math.min(Math.max(n, min), max);
}

/** Safe percentage change between two numbers. */
export function pctChange(current: number, previous: number) {
  if (previous === 0) return current === 0 ? 0 : 100;
  return ((current - previous) / Math.abs(previous)) * 100;
}

/** Sum a numeric field over a list. */
export function sumBy<T>(items: T[], get: (item: T) => number) {
  return items.reduce((acc, item) => acc + (get(item) || 0), 0);
}

/** Basic input sanitizer for free text fields. */
export function sanitize(input: string) {
  return input.replace(/[<>]/g, "").trim();
}

/** Download a text blob as a file (client only). */
export function downloadFile(filename: string, content: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
