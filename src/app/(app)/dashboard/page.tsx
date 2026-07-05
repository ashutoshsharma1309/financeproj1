"use client";

import Link from "next/link";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  PiggyBank,
  ArrowRight,
  Bot,
  Plus,
  FileText,
  LineChart as LineIcon,
} from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { Progress } from "@/components/ui/misc";
import { TrendAreaChart, BreakdownDonut } from "@/components/charts";
import { useFinanceStore } from "@/lib/store";
import { useFinanceData, useCurrency } from "@/hooks/use-finance-data";
import {
  categoryBreakdown,
  expenseStream,
  hasAnyData,
  invoiceStats,
  monthlySeries,
  monthOverMonth,
  netProfit,
  totalExpenses,
  totalRevenue,
} from "@/lib/calculations";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function DashboardPage() {
  const data = useFinanceData();
  const currency = useCurrency();
  const company = useFinanceStore((s) => s.company);

  const has = hasAnyData(data);
  const revenue = totalRevenue(data);
  const expenses = totalExpenses(data);
  const profit = netProfit(data);
  const mom = monthOverMonth(data);
  const series = monthlySeries(data, 12);
  const expenseBreakdown = categoryBreakdown(expenseStream(data), data.categories).slice(0, 5);
  const invStats = invoiceStats(data.invoices);

  const recentActivity = [
    ...data.revenues.map((r) => ({
      id: r.id,
      label: r.source,
      amount: r.amount,
      type: "INCOME" as const,
      date: r.date,
    })),
    ...data.expenses.map((e) => ({
      id: e.id,
      label: e.vendor,
      amount: e.amount,
      type: "EXPENSE" as const,
      date: e.date,
    })),
    ...data.transactions.map((t) => ({
      id: t.id,
      label: t.description,
      amount: t.amount,
      type: t.type,
      date: t.date,
    })),
  ]
    .sort((a, b) => +new Date(b.date) - +new Date(a.date))
    .slice(0, 6);

  return (
    <div>
      <PageHeader
        title={`Welcome${company ? `, ${company.name}` : ""}`}
        description="Your financial position at a glance — every figure from your own data."
        action={
          <Link href="/transactions">
            <Button>
              <Plus className="h-4 w-4" />
              Add transaction
            </Button>
          </Link>
        }
      />

      {!has ? (
        <EmptyState
          icon={LineIcon}
          title="No financial data available yet"
          description="Add your first transaction, revenue or expense to start generating real insights — nothing here is ever simulated."
          action={
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/revenue">
                <Button>
                  <Plus className="h-4 w-4" /> Add revenue
                </Button>
              </Link>
              <Link href="/expenses">
                <Button variant="outline">
                  <Plus className="h-4 w-4" /> Add expense
                </Button>
              </Link>
            </div>
          }
        />
      ) : (
        <div className="space-y-6">
          {/* KPIs */}
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              label="Total Revenue"
              value={formatCurrency(revenue, currency)}
              icon={TrendingUp}
              tone="success"
              delta={mom.revenueDelta}
            />
            <StatCard
              label="Total Expenses"
              value={formatCurrency(expenses, currency)}
              icon={TrendingDown}
              tone="danger"
              delta={mom.expenseDelta}
            />
            <StatCard
              label="Net Profit"
              value={formatCurrency(profit, currency)}
              icon={PiggyBank}
              tone={profit >= 0 ? "success" : "danger"}
              delta={mom.netDelta}
            />
            <StatCard
              label="Outstanding"
              value={formatCurrency(invStats.outstandingAmount, currency)}
              icon={FileText}
              tone="warning"
              hint={`${invStats.outstandingCount} unpaid invoice(s)`}
              delta={null}
            />
          </div>

          {/* Charts */}
          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader>
                <div>
                  <CardTitle>Income vs. Expenses</CardTitle>
                  <CardDescription>Trailing 12 months</CardDescription>
                </div>
                <Link href="/cash-flow">
                  <Button variant="ghost" size="sm">
                    Details <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </CardHeader>
              <TrendAreaChart data={series} currency={currency} />
            </Card>

            <Card>
              <CardHeader>
                <div>
                  <CardTitle>Expense breakdown</CardTitle>
                  <CardDescription>By category</CardDescription>
                </div>
              </CardHeader>
              {expenseBreakdown.length === 0 ? (
                <p className="py-10 text-center text-sm text-muted-foreground">
                  No expenses recorded yet.
                </p>
              ) : (
                <>
                  <BreakdownDonut data={expenseBreakdown} currency={currency} />
                  <div className="mt-4 space-y-2.5">
                    {expenseBreakdown.map((c) => (
                      <div key={c.categoryId} className="flex items-center gap-3 text-sm">
                        <span
                          className="h-2.5 w-2.5 rounded-full"
                          style={{ backgroundColor: c.color }}
                        />
                        <span className="text-muted-foreground">{c.name}</span>
                        <span className="ml-auto font-medium tabular-nums">
                          {formatCurrency(c.value, currency)}
                        </span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </Card>
          </div>

          {/* Activity + AI teaser */}
          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Recent activity</CardTitle>
              </CardHeader>
              {recentActivity.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted-foreground">
                  No activity yet.
                </p>
              ) : (
                <ul className="divide-y divide-border">
                  {recentActivity.map((a) => (
                    <li key={a.id} className="flex items-center gap-3 py-3">
                      <span
                        className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                          a.type === "INCOME"
                            ? "bg-success/15 text-success"
                            : "bg-danger/15 text-danger"
                        }`}
                      >
                        {a.type === "INCOME" ? (
                          <TrendingUp className="h-4 w-4" />
                        ) : (
                          <TrendingDown className="h-4 w-4" />
                        )}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">{a.label}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(a.date)}
                        </p>
                      </div>
                      <span
                        className={`ml-auto text-sm font-semibold tabular-nums ${
                          a.type === "INCOME" ? "text-success" : "text-foreground"
                        }`}
                      >
                        {a.type === "INCOME" ? "+" : "−"}
                        {formatCurrency(a.amount, currency)}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </Card>

            <Card clay className="flex flex-col justify-between">
              <div>
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/15 text-primary">
                  <Bot className="h-6 w-6" />
                </span>
                <h3 className="mt-4 text-base font-semibold">Ask your AI CFO</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  Get plain-English answers about runway, spending and
                  scenarios — grounded only in these numbers.
                </p>
              </div>
              <Link href="/assistant" className="mt-5">
                <Button className="w-full">
                  Open assistant <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </Card>
          </div>

          {/* Invoice health */}
          {invStats.count > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Invoice health</CardTitle>
                <Link href="/invoices">
                  <Button variant="ghost" size="sm">
                    Manage <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </CardHeader>
              <div className="grid gap-6 sm:grid-cols-3">
                {[
                  { label: "Paid", amount: invStats.paidAmount, count: invStats.paidCount, tone: "success" as const },
                  { label: "Outstanding", amount: invStats.outstandingAmount, count: invStats.outstandingCount, tone: "warning" as const },
                  { label: "Overdue", amount: invStats.overdueAmount, count: invStats.overdueCount, tone: "danger" as const },
                ].map((s) => {
                  const totalAmt = invStats.paidAmount + invStats.outstandingAmount || 1;
                  return (
                    <div key={s.label}>
                      <div className="flex items-center justify-between">
                        <Badge tone={s.tone}>{s.label}</Badge>
                        <span className="text-xs text-muted-foreground">
                          {s.count} invoice(s)
                        </span>
                      </div>
                      <p className="mt-2 text-xl font-bold tabular-nums">
                        {formatCurrency(s.amount, currency)}
                      </p>
                      <div className="mt-2">
                        <Progress value={(s.amount / totalAmt) * 100} tone={s.tone} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
