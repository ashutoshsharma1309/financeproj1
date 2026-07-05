import type { Metadata } from "next";
import Link from "next/link";
import {
  Bot,
  LineChart,
  Receipt,
  TrendingUp,
  Wallet,
  FileText,
  ShieldCheck,
  Bell,
  Users,
  ScrollText,
  Layers,
  Gauge,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Features",
  description:
    "Revenue, expenses, invoicing, cash flow, forecasting and an AI CFO — all grounded in your own data.",
};

const groups = [
  {
    title: "Track every rupee",
    items: [
      { icon: Wallet, title: "Revenue tracking", desc: "Record income by source and category with automatic totals and trends." },
      { icon: Receipt, title: "Expense management", desc: "Log spend against vendors and categories; spot your biggest cost drivers." },
      { icon: Layers, title: "Transactions ledger", desc: "A unified, filterable ledger of every income and expense entry." },
    ],
  },
  {
    title: "Get paid & plan ahead",
    items: [
      { icon: FileText, title: "Invoicing", desc: "Line-item invoices with tax, statuses and outstanding balances." },
      { icon: LineChart, title: "Cash flow & runway", desc: "Monthly inflow/outflow with a running balance and runway estimate." },
      { icon: TrendingUp, title: "Forecasting", desc: "Project revenue, expenses and cash from growth assumptions you set." },
    ],
  },
  {
    title: "Understand & decide",
    items: [
      { icon: Bot, title: "AI CFO assistant", desc: "Ask questions in plain English — answered only from your numbers." },
      { icon: Gauge, title: "Reports & exports", desc: "P&L, cash flow and breakdowns exported to PDF or CSV." },
      { icon: Bell, title: "Notifications", desc: "Alerts for overdue invoices and low-cash thresholds you define." },
    ],
  },
  {
    title: "Run it as a team",
    items: [
      { icon: Users, title: "Team & roles", desc: "Owner, Accountant and Employee roles with scoped access." },
      { icon: ScrollText, title: "Audit logs", desc: "A record of every create, update and delete across your workspace." },
      { icon: ShieldCheck, title: "Secure architecture", desc: "JWT auth, RBAC, validation and input sanitization by design." },
    ],
  },
];

export default function FeaturesPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-2xl text-center">
        <Badge tone="primary" className="mb-4">
          Features
        </Badge>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          One platform for every financial job
        </h1>
        <p className="mt-5 text-lg text-muted-foreground">
          From the first invoice to a full forecast — always powered by the data
          you actually enter.
        </p>
      </div>

      <div className="mt-16 space-y-16">
        {groups.map((g) => (
          <div key={g.title}>
            <h2 className="text-xl font-semibold tracking-tight">{g.title}</h2>
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {g.items.map((it) => (
                <div
                  key={it.title}
                  className="surface-card p-6 transition-transform duration-200 hover:-translate-y-1"
                >
                  <span className="clay-sm flex h-12 w-12 items-center justify-center rounded-xl text-primary">
                    <it.icon className="h-6 w-6" />
                  </span>
                  <h3 className="mt-5 font-semibold">{it.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{it.desc}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-20 flex flex-col items-center gap-4 text-center">
        <h2 className="text-2xl font-bold">Ready to see it with your numbers?</h2>
        <Link href="/signup">
          <Button size="lg">
            Get started free
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
