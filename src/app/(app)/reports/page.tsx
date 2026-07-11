"use client";

import * as React from "react";
import { BarChart3, Download, FileText, TrendingUp, TrendingDown } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, Field } from "@/components/ui/input";
import { Tabs } from "@/components/ui/misc";
import { EmptyState } from "@/components/ui/empty-state";
import { BreakdownDonut } from "@/components/charts/lazy";
import { useFinanceStore } from "@/lib/store";
import { useFinanceData, useCurrency } from "@/hooks/use-finance-data";
import { buildProfitLoss, hasAnyData } from "@/lib/calculations";
import { formatCurrency, formatDate } from "@/lib/utils";
import { exportToCSV, exportToPDF } from "@/lib/export";

type Period = "MONTH" | "QUARTER" | "YEAR" | "ALL";

function periodRange(period: Period): { from?: Date; to?: Date; label: string } {
  const now = new Date();
  if (period === "ALL") return { label: "All time" };
  if (period === "MONTH") {
    const from = new Date(now.getFullYear(), now.getMonth(), 1);
    return { from, to: now, label: "This month" };
  }
  if (period === "QUARTER") {
    const q = Math.floor(now.getMonth() / 3);
    const from = new Date(now.getFullYear(), q * 3, 1);
    return { from, to: now, label: "This quarter" };
  }
  const from = new Date(now.getFullYear(), 0, 1);
  return { from, to: now, label: "This year" };
}

export default function ReportsPage() {
  const currency = useCurrency();
  const data = useFinanceData();
  const company = useFinanceStore((s) => s.company);
  const [period, setPeriod] = React.useState<Period>("ALL");
  const [reportType, setReportType] = React.useState<"PL" | "BREAKDOWN">("PL");

  const range = React.useMemo(() => periodRange(period), [period]);
  const pl = React.useMemo(
    () => buildProfitLoss(data, range.from, range.to),
    [data, range],
  );
  const has = hasAnyData(data);

  function exportPDF() {
    const incomeRows = pl.incomeByCategory
      .map((c) => `<tr><td>${c.name}</td><td class="num">${formatCurrency(c.value, currency)}</td><td class="num">${c.share.toFixed(1)}%</td></tr>`)
      .join("");
    const expenseRows = pl.expenseByCategory
      .map((c) => `<tr><td>${c.name}</td><td class="num">${formatCurrency(c.value, currency)}</td><td class="num">${c.share.toFixed(1)}%</td></tr>`)
      .join("");
    exportToPDF(
      `Profit & Loss — ${range.label}`,
      `<h1>Profit &amp; Loss</h1>
       <p class="muted">${company?.name ?? ""} · ${range.label}${range.from ? ` · ${formatDate(range.from)} – ${formatDate(range.to!)}` : ""}</p>
       <div class="kpis">
         <div class="kpi"><div class="label">Total income</div><div class="value pos">${formatCurrency(pl.totalIncome, currency)}</div></div>
         <div class="kpi"><div class="label">Total expenses</div><div class="value neg">${formatCurrency(pl.totalExpense, currency)}</div></div>
         <div class="kpi"><div class="label">Net profit</div><div class="value ${pl.net >= 0 ? "pos" : "neg"}">${formatCurrency(pl.net, currency)}</div></div>
         <div class="kpi"><div class="label">Margin</div><div class="value">${pl.margin.toFixed(1)}%</div></div>
       </div>
       <h2>Income by category</h2>
       <table><thead><tr><th>Category</th><th class="num">Amount</th><th class="num">Share</th></tr></thead><tbody>
         ${incomeRows || `<tr><td colspan="3" class="muted">No income in this period</td></tr>`}
         <tr class="total-row"><td>Total income</td><td class="num">${formatCurrency(pl.totalIncome, currency)}</td><td></td></tr>
       </tbody></table>
       <h2>Expenses by category</h2>
       <table><thead><tr><th>Category</th><th class="num">Amount</th><th class="num">Share</th></tr></thead><tbody>
         ${expenseRows || `<tr><td colspan="3" class="muted">No expenses in this period</td></tr>`}
         <tr class="total-row"><td>Total expenses</td><td class="num">${formatCurrency(pl.totalExpense, currency)}</td><td></td></tr>
       </tbody></table>`,
    );
  }

  function exportCSV() {
    exportToCSV(
      `profit-loss-${period.toLowerCase()}`,
      [
        { key: "section", label: "Section" },
        { key: "category", label: "Category" },
        { key: "amount", label: "Amount" },
        { key: "share", label: "Share %" },
      ],
      [
        ...pl.incomeByCategory.map((c) => ({ section: "Income", category: c.name, amount: c.value, share: c.share.toFixed(1) })),
        ...pl.expenseByCategory.map((c) => ({ section: "Expense", category: c.name, amount: c.value, share: c.share.toFixed(1) })),
      ],
    );
  }

  return (
    <div>
      <PageHeader
        title="Reports"
        description="Profit & loss, cash flow and category breakdowns — export anytime."
        action={
          has ? (
            <div className="flex gap-3">
              <Button variant="outline" onClick={exportCSV}>
                <Download className="h-4 w-4" /> CSV
              </Button>
              <Button onClick={exportPDF}>
                <FileText className="h-4 w-4" /> PDF
              </Button>
            </div>
          ) : null
        }
      />

      {!has ? (
        <EmptyState
          icon={BarChart3}
          title="No data to report on yet"
          description="Once you record revenue and expenses, your profit & loss and breakdowns will appear here, ready to export."
        />
      ) : (
        <div className="space-y-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Tabs
              tabs={[
                { value: "PL", label: "Profit & Loss" },
                { value: "BREAKDOWN", label: "Breakdown" },
              ]}
              value={reportType}
              onValueChange={(v) => setReportType(v as "PL" | "BREAKDOWN")}
            />
            <Field label="" className="sm:w-52">
              <Select value={period} onChange={(e) => setPeriod(e.target.value as Period)} aria-label="Period">
                <option value="ALL">All time</option>
                <option value="MONTH">This month</option>
                <option value="QUARTER">This quarter</option>
                <option value="YEAR">This year</option>
              </Select>
            </Field>
          </div>

          {reportType === "PL" ? (
            <>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  { label: "Total income", value: pl.totalIncome, tone: "text-success" },
                  { label: "Total expenses", value: pl.totalExpense, tone: "text-danger" },
                  { label: "Net profit", value: pl.net, tone: pl.net >= 0 ? "text-success" : "text-danger" },
                  { label: "Margin", value: null, tone: "" },
                ].map((k) => (
                  <Card key={k.label} className="p-5">
                    <p className="text-sm text-muted-foreground">{k.label}</p>
                    <p className={`mt-1.5 text-2xl font-bold tabular-nums ${k.tone}`}>
                      {k.value === null ? `${pl.margin.toFixed(1)}%` : formatCurrency(k.value, currency)}
                    </p>
                  </Card>
                ))}
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-success" />
                      <CardTitle>Income by category</CardTitle>
                    </div>
                  </CardHeader>
                  <ReportTable rows={pl.incomeByCategory} total={pl.totalIncome} currency={currency} tone="success" />
                </Card>
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <TrendingDown className="h-4 w-4 text-danger" />
                      <CardTitle>Expenses by category</CardTitle>
                    </div>
                  </CardHeader>
                  <ReportTable rows={pl.expenseByCategory} total={pl.totalExpense} currency={currency} tone="danger" />
                </Card>
              </div>
            </>
          ) : (
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <div>
                    <CardTitle>Revenue breakdown</CardTitle>
                    <CardDescription>{range.label}</CardDescription>
                  </div>
                </CardHeader>
                {pl.incomeByCategory.length ? (
                  <BreakdownDonut data={pl.incomeByCategory} currency={currency} />
                ) : (
                  <p className="py-14 text-center text-sm text-muted-foreground">No income in this period.</p>
                )}
              </Card>
              <Card>
                <CardHeader>
                  <div>
                    <CardTitle>Expense breakdown</CardTitle>
                    <CardDescription>{range.label}</CardDescription>
                  </div>
                </CardHeader>
                {pl.expenseByCategory.length ? (
                  <BreakdownDonut data={pl.expenseByCategory} currency={currency} />
                ) : (
                  <p className="py-14 text-center text-sm text-muted-foreground">No expenses in this period.</p>
                )}
              </Card>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ReportTable({
  rows,
  total,
  currency,
  tone,
}: {
  rows: { categoryId: string; name: string; color: string; value: number; share: number }[];
  total: number;
  currency: string;
  tone: "success" | "danger";
}) {
  if (rows.length === 0) {
    return <p className="py-10 text-center text-sm text-muted-foreground">No entries in this period.</p>;
  }
  return (
    <div>
      <table className="w-full text-sm">
        <tbody>
          {rows.map((r) => (
            <tr key={r.categoryId} className="border-b border-border last:border-0">
              <td className="py-2.5">
                <span className="flex items-center gap-2.5">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: r.color }} />
                  {r.name}
                </span>
              </td>
              <td className="py-2.5 text-right text-muted-foreground tabular-nums">{r.share.toFixed(1)}%</td>
              <td className="py-2.5 text-right font-medium tabular-nums">{formatCurrency(r.value, currency)}</td>
            </tr>
          ))}
          <tr className="border-t-2 border-foreground/20">
            <td className="py-3 font-semibold">Total</td>
            <td />
            <td className={`py-3 text-right font-bold tabular-nums ${tone === "success" ? "text-success" : "text-danger"}`}>
              {formatCurrency(total, currency)}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
