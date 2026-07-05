import type { Metadata } from "next";
import Link from "next/link";
import { Target, Eye, HeartHandshake, ShieldCheck, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "About",
  description: "Why we built AI CFO and the principles behind it.",
};

const values = [
  {
    icon: ShieldCheck,
    title: "Truth over vanity",
    desc: "No fabricated metrics, no inflated dashboards. If there's no data, we say so.",
  },
  {
    icon: Eye,
    title: "Clarity first",
    desc: "Finance is stressful enough. We design for calm, readable, honest numbers.",
  },
  {
    icon: HeartHandshake,
    title: "For the underserved",
    desc: "Enterprise finance tools ignore small businesses. We start with them.",
  },
  {
    icon: Target,
    title: "Decisions, not dashboards",
    desc: "Every view should help you make a real decision about your money.",
  },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <div className="text-center">
        <Badge tone="primary" className="mb-4">
          About
        </Badge>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Financial clarity for every small business
        </h1>
      </div>

      <div className="mt-10 space-y-6 text-lg leading-relaxed text-muted-foreground">
        <p>
          Most small and medium businesses run on spreadsheets and gut feel.
          Real CFO expertise — cash flow discipline, forecasting, risk
          detection — stays locked away in enterprises that can afford a finance
          team.
        </p>
        <p>
          AI CFO exists to change that. We give founders and operators a single,
          beautiful place to record their finances and an AI assistant that
          reasons over{" "}
          <span className="font-medium text-foreground">
            their real numbers
          </span>{" "}
          — never invented ones. If the data isn&apos;t there yet, the product
          tells you plainly instead of showing a fake chart.
        </p>
        <p>
          It&apos;s built to be trustworthy: secure by architecture, honest by
          default, and genuinely useful from the very first entry you make.
        </p>
      </div>

      <div className="mt-16 grid gap-5 sm:grid-cols-2">
        {values.map((v) => (
          <div key={v.title} className="surface-card p-6">
            <span className="clay-sm flex h-11 w-11 items-center justify-center rounded-xl text-primary">
              <v.icon className="h-5 w-5" />
            </span>
            <h3 className="mt-4 font-semibold">{v.title}</h3>
            <p className="mt-1.5 text-sm text-muted-foreground">{v.desc}</p>
          </div>
        ))}
      </div>

      <div className="mt-16 flex flex-col items-center gap-4 text-center">
        <h2 className="text-2xl font-bold">Join us on the mission</h2>
        <Link href="/signup">
          <Button size="lg">
            Create your account
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
