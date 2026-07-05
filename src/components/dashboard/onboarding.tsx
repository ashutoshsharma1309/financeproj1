"use client";

import * as React from "react";
import { Building2, Sparkles } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { Input, Select, Field } from "@/components/ui/input";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { useToast } from "@/components/ui/toast";
import { useFinanceStore } from "@/lib/store";
import { companySchema, fieldErrors } from "@/lib/validators";
import { CURRENCIES, INDUSTRIES, MONTHS } from "@/lib/constants";

export function Onboarding() {
  const setCompany = useFinanceStore((s) => s.setCompany);
  const { toast } = useToast();
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [form, setForm] = React.useState({
    name: "",
    industry: INDUSTRIES[0],
    currency: "INR",
    fiscalYearStart: "4",
    taxId: "",
  });

  function update(key: string, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload = {
      name: form.name.trim(),
      industry: form.industry,
      currency: form.currency,
      fiscalYearStart: Number(form.fiscalYearStart),
      taxId: form.taxId.trim() || undefined,
    };
    const parsed = companySchema.safeParse(payload);
    if (!parsed.success) {
      setErrors(fieldErrors(parsed.error));
      return;
    }
    setErrors({});
    setCompany(parsed.data);
    toast({
      tone: "success",
      title: "Company created",
      description: "Your workspace is ready. Start adding your finances.",
    });
  }

  return (
    <div className="mesh-bg flex min-h-screen flex-col">
      <div className="flex items-center justify-between p-5 sm:p-6">
        <Logo href="/dashboard" />
        <ThemeToggle />
      </div>
      <div className="flex flex-1 items-center justify-center px-4 pb-16">
        <div className="w-full max-w-lg animate-fade-up">
          <div className="mb-6 text-center">
            <span className="clay-sm mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl text-primary">
              <Building2 className="h-7 w-7" />
            </span>
            <h1 className="text-2xl font-bold tracking-tight">
              Set up your company
            </h1>
            <p className="mt-1.5 text-sm text-muted-foreground">
              A few details so every calculation uses the right currency and
              fiscal year.
            </p>
          </div>

          <form onSubmit={onSubmit} className="clay space-y-4 p-6 sm:p-8" noValidate>
            <Field label="Company name" htmlFor="name" error={errors.name}>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                placeholder="Acme Innovations Pvt Ltd"
              />
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Industry" htmlFor="industry">
                <Select
                  id="industry"
                  value={form.industry}
                  onChange={(e) => update("industry", e.target.value)}
                >
                  {INDUSTRIES.map((i) => (
                    <option key={i} value={i}>
                      {i}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Currency" htmlFor="currency">
                <Select
                  id="currency"
                  value={form.currency}
                  onChange={(e) => update("currency", e.target.value)}
                >
                  {CURRENCIES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.label}
                    </option>
                  ))}
                </Select>
              </Field>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Fiscal year starts" htmlFor="fy">
                <Select
                  id="fy"
                  value={form.fiscalYearStart}
                  onChange={(e) => update("fiscalYearStart", e.target.value)}
                >
                  {MONTHS.map((m, i) => (
                    <option key={m} value={String(i + 1)}>
                      {m}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Tax ID (optional)" htmlFor="taxId">
                <Input
                  id="taxId"
                  value={form.taxId}
                  onChange={(e) => update("taxId", e.target.value)}
                  placeholder="GST / VAT / EIN"
                />
              </Field>
            </div>

            <div className="flex items-start gap-2 rounded-xl bg-primary/8 p-3 text-xs text-muted-foreground">
              <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              We&apos;ll seed a set of standard income &amp; expense categories you
              can customize anytime.
            </div>

            <Button type="submit" className="w-full">
              Create workspace
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
