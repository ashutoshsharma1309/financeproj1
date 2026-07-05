import type { Metadata } from "next";
import Link from "next/link";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Simple, transparent pricing for businesses of every size.",
};

const plans = [
  {
    name: "Starter",
    price: "Free",
    period: "forever",
    desc: "Everything a solo founder needs to get started.",
    features: [
      "1 company workspace",
      "Revenue, expense & transaction tracking",
      "Up to 25 invoices / month",
      "Cash flow & basic reports",
      "AI CFO (offline analysis)",
      "PDF & CSV exports",
    ],
    cta: "Start free",
    highlighted: false,
  },
  {
    name: "Growth",
    price: "₹1,499",
    period: "per month",
    desc: "For growing teams that need forecasting and collaboration.",
    features: [
      "Everything in Starter",
      "Unlimited invoices",
      "Financial forecasting & scenarios",
      "Team members with roles",
      "Audit logs",
      "AI CFO with Gemini (your key)",
      "Priority support",
    ],
    cta: "Start Growth",
    highlighted: true,
  },
  {
    name: "Scale",
    price: "Custom",
    period: "annual",
    desc: "For established businesses with advanced needs.",
    features: [
      "Everything in Growth",
      "Multiple company workspaces",
      "Advanced role permissions",
      "Dedicated onboarding",
      "Custom report templates",
      "SLA & premium support",
    ],
    cta: "Contact sales",
    highlighted: false,
  },
];

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-2xl text-center">
        <Badge tone="primary" className="mb-4">
          Pricing
        </Badge>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Pricing that scales with you
        </h1>
        <p className="mt-5 text-lg text-muted-foreground">
          Start free and only pay when AI CFO is saving you real time and money.
        </p>
      </div>

      <div className="mt-14 grid gap-6 lg:grid-cols-3">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={cn(
              "relative flex flex-col p-7",
              plan.highlighted
                ? "clay ring-2 ring-primary/40"
                : "surface-card",
            )}
          >
            {plan.highlighted && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge tone="primary">Most popular</Badge>
              </span>
            )}
            <h3 className="text-lg font-semibold">{plan.name}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{plan.desc}</p>
            <div className="mt-5 flex items-end gap-1.5">
              <span className="text-4xl font-bold tracking-tight">
                {plan.price}
              </span>
              <span className="mb-1 text-sm text-muted-foreground">
                {plan.period}
              </span>
            </div>
            <ul className="mt-6 flex-1 space-y-3">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                  <span className="text-muted-foreground">{f}</span>
                </li>
              ))}
            </ul>
            <Link
              href={plan.name === "Scale" ? "/contact" : "/signup"}
              className="mt-7"
            >
              <Button
                className="w-full"
                variant={plan.highlighted ? "primary" : "outline"}
              >
                {plan.cta}
              </Button>
            </Link>
          </div>
        ))}
      </div>

      <p className="mt-10 text-center text-sm text-muted-foreground">
        Prices shown in INR. All plans include unlimited data entry and no fake
        analytics — every figure is yours.
      </p>
    </div>
  );
}
