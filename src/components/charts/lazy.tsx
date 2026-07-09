"use client";

import dynamic from "next/dynamic";

// Recharts is heavy (~130 kB). Loading it eagerly inflates the first-load JS of
// every chart route. These wrappers defer it to a separate async chunk fetched
// after the shell paints, with a height-matched skeleton so there's no layout
// shift. `ssr: false` is safe because the charts render client-side only
// (Recharts' ResponsiveContainer needs the DOM).
//
// Note: `next/dynamic` options must be an inline object literal (SWC analyzes it
// statically), so the fallback is spelled out per chart rather than factored out.

function ChartFallback({ height }: { height: number }) {
  return <div className="skeleton rounded-xl" style={{ height }} aria-hidden />;
}

export const TrendAreaChart = dynamic(
  () => import("./index").then((m) => m.TrendAreaChart),
  { ssr: false, loading: () => <ChartFallback height={300} /> },
);

export const CompareBarChart = dynamic(
  () => import("./index").then((m) => m.CompareBarChart),
  { ssr: false, loading: () => <ChartFallback height={300} /> },
);

export const CashLineChart = dynamic(
  () => import("./index").then((m) => m.CashLineChart),
  { ssr: false, loading: () => <ChartFallback height={300} /> },
);

export const ForecastChart = dynamic(
  () => import("./index").then((m) => m.ForecastChart),
  { ssr: false, loading: () => <ChartFallback height={300} /> },
);

export const BreakdownDonut = dynamic(
  () => import("./index").then((m) => m.BreakdownDonut),
  { ssr: false, loading: () => <ChartFallback height={260} /> },
);
