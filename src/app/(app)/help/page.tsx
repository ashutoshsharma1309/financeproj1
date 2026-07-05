"use client";

import * as React from "react";
import Link from "next/link";
import {
  LifeBuoy,
  Search,
  Wallet,
  Receipt,
  FileText,
  Bot,
  LineChart,
  Users,
  Mail,
  BookOpen,
} from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const topics = [
  { icon: Wallet, title: "Recording revenue", desc: "Add income by source and category from the Revenue page.", href: "/revenue" },
  { icon: Receipt, title: "Tracking expenses", desc: "Log spend by vendor and category from the Expenses page.", href: "/expenses" },
  { icon: FileText, title: "Creating invoices", desc: "Build line-item invoices and track paid vs. overdue.", href: "/invoices" },
  { icon: LineChart, title: "Understanding cash flow", desc: "Add accounts and see your balance and runway.", href: "/cash-flow" },
  { icon: Bot, title: "Using the AI Assistant", desc: "Ask questions answered only from your data.", href: "/assistant" },
  { icon: Users, title: "Managing your team", desc: "Invite members and assign roles.", href: "/team" },
];

const faqs = [
  { q: "Why do I see empty states instead of numbers?", a: "AI CFO never shows fabricated data. Until you enter revenue, expenses or accounts, modules display guidance instead of fake figures." },
  { q: "How is my data stored?", a: "In this build your data is saved securely in your browser so the app works instantly. The schema and API architecture are ready to connect a database for production." },
  { q: "How do I enable full AI answers?", a: "Add a GEMINI_API_KEY to your environment. Without one, the assistant still answers using deterministic analysis of your data." },
  { q: "Can I export my reports?", a: "Yes — every report and most tables can be exported to CSV, and reports and invoices to PDF." },
  { q: "How do roles work?", a: "Owners have full access, Accountants manage finances and reports, and Employees have view-only access to dashboards and reports." },
];

export default function HelpPage() {
  const [query, setQuery] = React.useState("");
  const filteredFaqs = faqs.filter(
    (f) => !query || `${f.q} ${f.a}`.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div>
      <PageHeader title="Help Center" description="Guides and answers to get the most out of AI CFO." />

      <Card clay className="mb-6 flex flex-col items-center py-10 text-center mesh-bg">
        <span className="clay-sm mb-4 flex h-14 w-14 items-center justify-center rounded-2xl text-primary">
          <LifeBuoy className="h-7 w-7" />
        </span>
        <h2 className="text-xl font-bold">How can we help?</h2>
        <div className="relative mt-5 w-full max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search help articles…" className="pl-9" />
        </div>
      </Card>

      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Popular topics</h3>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {topics.map((t) => (
          <Link key={t.title} href={t.href}>
            <Card className="h-full transition-transform duration-200 hover:-translate-y-1">
              <span className="clay-sm flex h-11 w-11 items-center justify-center rounded-xl text-primary">
                <t.icon className="h-5 w-5" />
              </span>
              <h4 className="mt-4 font-semibold">{t.title}</h4>
              <p className="mt-1.5 text-sm text-muted-foreground">{t.desc}</p>
            </Card>
          </Link>
        ))}
      </div>

      <h3 className="mb-3 mt-10 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        Frequently asked questions
      </h3>
      <div className="space-y-3">
        {filteredFaqs.length === 0 ? (
          <p className="text-sm text-muted-foreground">No articles match your search.</p>
        ) : (
          filteredFaqs.map((f) => (
            <details key={f.q} className="surface-card group p-5 [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex cursor-pointer items-center justify-between gap-4 text-sm font-semibold">
                {f.q}
                <span className="text-muted-foreground transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
            </details>
          ))
        )}
      </div>

      <Card className="mt-8 flex flex-col items-center justify-between gap-4 sm:flex-row">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/12 text-primary">
            <BookOpen className="h-5 w-5" />
          </span>
          <div>
            <p className="font-semibold">Still need help?</p>
            <p className="text-sm text-muted-foreground">Reach our team and we&apos;ll get back to you.</p>
          </div>
        </div>
        <Link href="/contact">
          <Button>
            <Mail className="h-4 w-4" /> Contact support
          </Button>
        </Link>
      </Card>
    </div>
  );
}
