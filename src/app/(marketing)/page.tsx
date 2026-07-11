import Link from "next/link";
import {
  ArrowRight,
  Bot,
  FileText,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Wallet,
  LineChart,
  Receipt,
  Lock,
  Plus,
  BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { HeroVisual } from "@/components/marketing/hero-visual";
import { CapabilityMarquee } from "@/components/marketing/capability-marquee";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { StructuredData } from "@/components/marketing/structured-data";

const features = [
  { icon: Wallet, title: "Revenue & expenses", desc: "Log income and spending in seconds. Every total, margin and trend recomputes from what you enter." },
  { icon: Receipt, title: "Smart invoicing", desc: "Line-item invoices with tax. Track paid vs. overdue and see exactly what you're owed." },
  { icon: LineChart, title: "Cash flow & runway", desc: "Watch money move month over month and know precisely how many months of runway remain." },
  { icon: TrendingUp, title: "Forecasting", desc: "Model growth and cost assumptions to project revenue, expenses and cash ahead." },
  { icon: Bot, title: "AI CFO assistant", desc: "Ask questions in plain English. It reasons only over your own numbers — or says it can't." },
  { icon: FileText, title: "Reports & exports", desc: "Profit & loss, cash flow and category breakdowns — export to PDF or CSV in one click." },
];

const steps = [
  { k: "01", title: "Add your company", desc: "Set your business profile, currency and financial accounts.", icon: Plus },
  { k: "02", title: "Enter your finances", desc: "Record revenue, expenses, transactions and invoices as they happen.", icon: Receipt },
  { k: "03", title: "Read the signal", desc: "Live dashboards, forecasts and an AI CFO that reason only over your data.", icon: BarChart3 },
];

const audiences = [
  { role: "Solo founder", quote: "Answer 'can I afford this?' without a spreadsheet or an accountant on call." },
  { role: "Finance lead", quote: "One clean source of truth for revenue, spend and cash — with exports your board reads." },
  { role: "Growing team", quote: "Owner, accountant and employee roles keep everyone on exactly the right visibility." },
];

const faqs = [
  { q: "Where do the numbers come from?", a: "Only from what you enter. AI CFO never generates sample data, fake metrics or placeholder analytics. Before you add data, you see a clear empty state — not invented figures." },
  { q: "How does the AI assistant work?", a: "It builds a factual summary of your finances and reasons strictly over it. It's built to say 'I don't have enough data' rather than fabricate. Bring a Gemini key for full generative answers; without one it computes deterministic analysis." },
  { q: "Is my financial data secure?", a: "The architecture centers on role-based access control, input validation and a full audit trail, and it runs on your data alone. Real authentication and server-side persistence are the next milestone." },
  { q: "Can my accountant and team use it?", a: "Yes. Invite members as Owner, Accountant or Employee — each role sees exactly what it should." },
];

export default function LandingPage() {
  return (
    <>
      <StructuredData />
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <div className="grid-bg absolute inset-0" aria-hidden />
        <div className="relative mx-auto max-w-6xl px-4 pb-24 pt-14 sm:px-6 sm:pt-20">
          <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_1fr]">
            <div>
              <div className="inline-flex animate-fade-in items-center gap-2 ticker-chip px-3 py-1.5 text-primary">
                <Sparkles className="h-3.5 w-3.5" />
                <span className="text-muted-foreground">
                  AI-native finance for SMBs
                </span>
              </div>
              <h1 className="mt-6 animate-fade-up font-display text-[2.75rem] font-semibold leading-[1.05] tracking-[-0.03em] sm:text-6xl">
                The CFO your
                <br />
                business <span className="text-primary">can afford.</span>
              </h1>
              <p
                className="mt-6 max-w-xl animate-fade-up text-lg text-muted-foreground"
                style={{ animationDelay: "0.08s" }}
              >
                Track revenue, expenses, invoices and cash flow — then ask an AI
                CFO what to do next. Every insight is computed from your own
                data. No fabricated numbers, ever.
              </p>
              <div
                className="mt-9 flex animate-fade-up flex-col gap-3 sm:flex-row"
                style={{ animationDelay: "0.16s" }}
              >
                <Link href="/signup">
                  <Button size="lg" className="w-full sm:w-auto">
                    Start free
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/features">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">
                    See how it works
                  </Button>
                </Link>
              </div>
              <p
                className="mt-4 animate-fade-up font-mono text-xs text-muted-foreground"
                style={{ animationDelay: "0.24s" }}
              >
                No credit card · Set up in minutes · Your data stays yours
              </p>
            </div>

            <div className="lg:pl-6">
              <HeroVisual />
            </div>
          </div>
        </div>
      </section>

      {/* ── Capability marquee ───────────────────────────────── */}
      <section className="border-y border-border bg-surface/40">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <CapabilityMarquee />
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-4 py-24 sm:px-6" id="features">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">The stack</p>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-[-0.02em] sm:text-[2.5rem]">
            Everything a CFO does, in one place
          </h2>
          <p className="mt-4 text-muted-foreground">
            A complete financial cockpit — every figure calculated from the data
            you own.
          </p>
        </Reveal>
        <RevealGroup className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <RevealItem key={f.title}>
              <div className="surface-card h-full p-6 transition-colors duration-150 hover:border-primary/30">
                <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <f.icon className="h-[22px] w-[22px]" />
                </span>
                <h3 className="mt-5 font-display text-[17px] font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      {/* ── How it works ─────────────────────────────────────── */}
      <section className="border-y border-border bg-surface/40">
        <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
          <Reveal className="mx-auto max-w-2xl text-center">
            <p className="eyebrow">The flow</p>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-[-0.02em] sm:text-[2.5rem]">
              Zero to clarity in three moves
            </h2>
          </Reveal>
          <RevealGroup className="mt-14 grid gap-6 md:grid-cols-3">
            {steps.map((s) => (
              <RevealItem key={s.k}>
                <div className="surface-card relative h-full overflow-hidden p-7">
                  <span className="tnum absolute right-5 top-4 text-5xl font-bold text-primary/10">
                    {s.k}
                  </span>
                  <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <s.icon className="h-[22px] w-[22px]" />
                  </span>
                  <h3 className="mt-5 font-display text-lg font-semibold">{s.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* ── Comparison ───────────────────────────────────────── */}
      <section className="mx-auto max-w-5xl px-4 py-24 sm:px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">The difference</p>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-[-0.02em] sm:text-[2.5rem]">
            Beyond the spreadsheet
          </h2>
        </Reveal>
        <div className="mt-12 grid gap-5 md:grid-cols-2">
          <Reveal>
            <div className="surface-card h-full p-7">
              <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                A spreadsheet
              </p>
              <ul className="mt-5 space-y-3 text-sm text-muted-foreground">
                {[
                  "Formulas break silently as rows grow",
                  "No view of runway or forecasts",
                  "Manual charts that go stale",
                  "One file, no roles or audit trail",
                  "Answers require you to build them",
                ].map((t) => (
                  <li key={t} className="flex items-start gap-2.5">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground/50" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <div className="surface-card h-full border-primary/30 bg-primary/[0.03] p-7">
              <p className="eyebrow text-primary">AI CFO</p>
              <ul className="mt-5 space-y-3 text-sm">
                {[
                  "Totals and margins always in sync",
                  "Runway and forecasts, live",
                  "Beautiful charts that update themselves",
                  "Roles, notifications and a full audit trail",
                  "Ask a question, get a grounded answer",
                ].map((t) => (
                  <li key={t} className="flex items-start gap-2.5">
                    <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Audiences ────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">Built for you</p>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-[-0.02em] sm:text-[2.5rem]">
            However you run the money
          </h2>
        </Reveal>
        <RevealGroup className="mt-14 grid gap-6 md:grid-cols-3">
          {audiences.map((a) => (
            <RevealItem key={a.role}>
              <figure className="surface-card h-full p-7">
                <span className="text-primary">
                  <svg viewBox="0 0 24 24" className="h-8 w-8" fill="currentColor" aria-hidden>
                    <path d="M7 7h4v4c0 2.5-1.6 4.4-4 5v-2c1.2-.5 2-1.6 2-3H7V7Zm8 0h4v4c0 2.5-1.6 4.4-4 5v-2c1.2-.5 2-1.6 2-3h-2V7Z" />
                  </svg>
                </span>
                <blockquote className="mt-4 text-[15px] leading-relaxed">
                  {a.quote}
                </blockquote>
                <figcaption className="mt-5 font-mono text-xs uppercase tracking-wider text-muted-foreground">
                  {a.role}
                </figcaption>
              </figure>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      {/* ── Trust ────────────────────────────────────────────── */}
      <section className="border-y border-border bg-surface/40">
        <div className="mx-auto grid max-w-6xl gap-5 px-4 py-16 sm:px-6 md:grid-cols-3">
          {[
            { icon: ShieldCheck, title: "Only your data", desc: "No fabricated analytics — every insight traces to an entry you made." },
            { icon: Lock, title: "Secure by design", desc: "Role-based access, input validation and a full audit trail on every change." },
            { icon: Sparkles, title: "AI you can trust", desc: "The assistant reasons over your numbers, or admits it can't." },
          ].map((t) => (
            <Reveal key={t.title}>
              <div className="flex gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <t.icon className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="font-display font-semibold">{t.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{t.desc}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────── */}
      <section className="mx-auto max-w-3xl px-4 py-24 sm:px-6">
        <Reveal className="text-center">
          <p className="eyebrow">Questions</p>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-[-0.02em] sm:text-[2.5rem]">
            Straight answers
          </h2>
        </Reveal>
        <div className="mt-12 space-y-3">
          {faqs.map((f, i) => (
            <Reveal key={f.q} delay={i * 0.04}>
              <details className="surface-card group p-5 [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex cursor-pointer items-center justify-between gap-4 font-display text-[15px] font-semibold">
                  {f.q}
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-md bg-muted text-muted-foreground transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {f.a}
                </p>
              </details>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
        <Reveal>
          <div className="surface-card relative overflow-hidden bg-surface-2/50 px-6 py-16 text-center sm:px-12">
            <div className="grid-bg absolute inset-0" aria-hidden />
            <div className="relative">
              <h2 className="font-display text-3xl font-semibold tracking-[-0.02em] sm:text-[2.5rem]">
                Take control of your finances today
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
                Set up your company, add your first numbers, and let AI CFO do
                the heavy lifting.
              </p>
              <div className="mt-8 flex justify-center">
                <Link href="/signup">
                  <Button size="lg">
                    Create your free account
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
