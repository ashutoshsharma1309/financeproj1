"use client";

import Link from "next/link";
import { CreditCard, Check, Sparkles, Info } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const currentPlan = {
  name: "Starter",
  price: "Free",
  features: [
    "Revenue, expense & transaction tracking",
    "Up to 25 invoices / month",
    "Cash flow & basic reports",
    "AI CFO (offline analysis)",
  ],
};

export default function BillingPage() {
  return (
    <div>
      <PageHeader title="Billing" description="Manage your subscription and payment method." />

      <div className="mb-6 flex items-start gap-3 rounded-xl bg-primary/8 p-4 text-sm">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
        <p className="text-muted-foreground">
          Billing is a placeholder in this build. The plan structure and UI are
          ready — connect a payment provider (e.g. Stripe) to go live.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Current plan</CardTitle>
              <CardDescription>You are on the free Starter plan.</CardDescription>
            </div>
            <Badge tone="primary">{currentPlan.name}</Badge>
          </CardHeader>
          <div className="flex items-end gap-1.5">
            <span className="text-4xl font-bold">{currentPlan.price}</span>
            <span className="mb-1 text-sm text-muted-foreground">forever</span>
          </div>
          <ul className="mt-5 space-y-2.5">
            {currentPlan.features.map((f) => (
              <li key={f} className="flex items-start gap-2.5 text-sm">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                <span className="text-muted-foreground">{f}</span>
              </li>
            ))}
          </ul>
          <div className="mt-6 flex gap-3">
            <Link href="/pricing">
              <Button>
                <Sparkles className="h-4 w-4" /> Upgrade plan
              </Button>
            </Link>
            <Button variant="outline" disabled>Manage subscription</Button>
          </div>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-primary" />
              <CardTitle>Payment method</CardTitle>
            </div>
          </CardHeader>
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-10 text-center">
            <CreditCard className="h-8 w-8 text-muted-foreground" />
            <p className="mt-3 text-sm font-medium">No payment method</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Add one when you upgrade to a paid plan.
            </p>
          </div>
          <h4 className="mt-6 text-sm font-semibold">Billing history</h4>
          <p className="mt-2 text-sm text-muted-foreground">
            No invoices yet. Your billing history will appear here.
          </p>
        </Card>
      </div>
    </div>
  );
}
