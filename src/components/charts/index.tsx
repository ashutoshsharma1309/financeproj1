"use client";

import * as React from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatCompact, formatCurrency } from "@/lib/utils";

const AXIS = "hsl(var(--muted-foreground))";
const GRID = "hsl(var(--border))";
const PRIMARY = "hsl(var(--primary))";
const ACCENT = "hsl(var(--accent))";
const SUCCESS = "hsl(var(--success))";
const DANGER = "hsl(var(--danger))";

function ChartTooltip({
  active,
  payload,
  label,
  currency,
}: {
  active?: boolean;
  payload?: { name: string; value: number; color: string }[];
  label?: string;
  currency: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-border bg-surface px-3.5 py-2.5 shadow-clay">
      {label && <p className="mb-1.5 text-xs font-semibold">{label}</p>}
      <div className="space-y-1">
        {payload.map((p) => (
          <div key={p.name} className="flex items-center gap-2 text-xs">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: p.color }}
            />
            <span className="capitalize text-muted-foreground">{p.name}</span>
            <span className="ml-auto font-semibold tabular-nums">
              {formatCurrency(p.value, currency)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

const axisProps = {
  stroke: AXIS,
  fontSize: 12,
  tickLine: false,
  axisLine: false,
};

export function TrendAreaChart({
  data,
  currency,
  height = 300,
}: {
  data: { label: string; income: number; expense: number }[];
  currency: string;
  height?: number;
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
        <defs>
          <linearGradient id="gInc" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={SUCCESS} stopOpacity={0.35} />
            <stop offset="95%" stopColor={SUCCESS} stopOpacity={0} />
          </linearGradient>
          <linearGradient id="gExp" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={DANGER} stopOpacity={0.3} />
            <stop offset="95%" stopColor={DANGER} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke={GRID} vertical={false} />
        <XAxis dataKey="label" {...axisProps} />
        <YAxis
          {...axisProps}
          width={64}
          tickFormatter={(v) => formatCompact(Number(v), currency)}
        />
        <Tooltip content={<ChartTooltip currency={currency} />} />
        <Area
          type="monotone"
          dataKey="income"
          name="income"
          stroke={SUCCESS}
          strokeWidth={2.5}
          fill="url(#gInc)"
        />
        <Area
          type="monotone"
          dataKey="expense"
          name="expense"
          stroke={DANGER}
          strokeWidth={2.5}
          fill="url(#gExp)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function CompareBarChart({
  data,
  currency,
  height = 300,
}: {
  data: { label: string; income: number; expense: number }[];
  currency: string;
  height?: number;
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={GRID} vertical={false} />
        <XAxis dataKey="label" {...axisProps} />
        <YAxis
          {...axisProps}
          width={64}
          tickFormatter={(v) => formatCompact(Number(v), currency)}
        />
        <Tooltip
          cursor={{ fill: "hsl(var(--muted))", opacity: 0.4 }}
          content={<ChartTooltip currency={currency} />}
        />
        <Bar dataKey="income" name="income" fill={SUCCESS} radius={[6, 6, 0, 0]} maxBarSize={28} />
        <Bar dataKey="expense" name="expense" fill={DANGER} radius={[6, 6, 0, 0]} maxBarSize={28} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function CashLineChart({
  data,
  currency,
  height = 300,
}: {
  data: { label: string; balance: number }[];
  currency: string;
  height?: number;
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={GRID} vertical={false} />
        <XAxis dataKey="label" {...axisProps} />
        <YAxis
          {...axisProps}
          width={64}
          tickFormatter={(v) => formatCompact(Number(v), currency)}
        />
        <Tooltip content={<ChartTooltip currency={currency} />} />
        <Line
          type="monotone"
          dataKey="balance"
          name="balance"
          stroke={PRIMARY}
          strokeWidth={3}
          dot={{ r: 3, fill: PRIMARY }}
          activeDot={{ r: 5 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function ForecastChart({
  data,
  currency,
  height = 300,
}: {
  data: { label: string; revenue: number; expense: number; cash: number }[];
  currency: string;
  height?: number;
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={GRID} vertical={false} />
        <XAxis dataKey="label" {...axisProps} />
        <YAxis
          {...axisProps}
          width={64}
          tickFormatter={(v) => formatCompact(Number(v), currency)}
        />
        <Tooltip content={<ChartTooltip currency={currency} />} />
        <Line type="monotone" dataKey="revenue" name="revenue" stroke={SUCCESS} strokeWidth={2.5} dot={false} />
        <Line type="monotone" dataKey="expense" name="expense" stroke={DANGER} strokeWidth={2.5} dot={false} />
        <Line type="monotone" dataKey="cash" name="cash" stroke={PRIMARY} strokeWidth={3} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function BreakdownDonut({
  data,
  currency,
  height = 260,
}: {
  data: { name: string; value: number; color: string }[];
  currency: string;
  height?: number;
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          innerRadius="58%"
          outerRadius="88%"
          paddingAngle={2}
          stroke="none"
        >
          {data.map((d) => (
            <Cell key={d.name} fill={d.color} />
          ))}
        </Pie>
        <Tooltip content={<ChartTooltip currency={currency} />} />
      </PieChart>
    </ResponsiveContainer>
  );
}

export const CHART_ACCENTS = { PRIMARY, ACCENT, SUCCESS, DANGER };
