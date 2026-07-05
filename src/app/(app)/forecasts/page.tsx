"use client";

import * as React from "react";
import { Plus, TrendingUp, Trash2, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { Dialog } from "@/components/ui/dialog";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Input, Field } from "@/components/ui/input";
import { ForecastChart } from "@/components/charts";
import { useToast } from "@/components/ui/toast";
import { useFinanceStore } from "@/lib/store";
import { useFinanceData, useCurrency } from "@/hooks/use-finance-data";
import { forecastSchema, fieldErrors } from "@/lib/validators";
import { cashPosition, projectForecast, hasAnyData } from "@/lib/calculations";
import { formatCurrency } from "@/lib/utils";
import type { Forecast } from "@/lib/types";

export default function ForecastsPage() {
  const currency = useCurrency();
  const { toast } = useToast();
  const data = useFinanceData();
  const forecasts = useFinanceStore((s) => s.forecasts);
  const addForecast = useFinanceStore((s) => s.addForecast);
  const deleteForecast = useFinanceStore((s) => s.deleteForecast);

  const [open, setOpen] = React.useState(false);
  const [toDelete, setToDelete] = React.useState<string | null>(null);
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [form, setForm] = React.useState({
    name: "",
    horizon: "12",
    revenueGrowth: "5",
    expenseGrowth: "3",
    startingCash: String(Math.round(cashPosition(data.accounts))),
  });

  const selected = forecasts.find((f) => f.id === selectedId) ?? forecasts[0] ?? null;
  const projection = selected ? projectForecast(selected, data) : [];
  const endCash = projection.at(-1)?.cash ?? 0;
  const hasBaseline = hasAnyData(data);

  function openNew() {
    setForm({
      name: "",
      horizon: "12",
      revenueGrowth: "5",
      expenseGrowth: "3",
      startingCash: String(Math.round(cashPosition(data.accounts))),
    });
    setErrors({});
    setOpen(true);
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload = {
      name: form.name.trim(),
      horizon: Number(form.horizon),
      revenueGrowth: Number(form.revenueGrowth),
      expenseGrowth: Number(form.expenseGrowth),
      startingCash: Number(form.startingCash),
    };
    const parsed = forecastSchema.safeParse(payload);
    if (!parsed.success) {
      setErrors(fieldErrors(parsed.error));
      return;
    }
    addForecast(parsed.data);
    toast({ tone: "success", title: "Forecast created" });
    setOpen(false);
  }

  return (
    <div>
      <PageHeader
        title="Forecasts"
        description="Model growth and cost assumptions to project revenue, expenses and cash."
        action={
          <Button onClick={openNew}>
            <Plus className="h-4 w-4" /> New forecast
          </Button>
        }
      />

      {!hasBaseline && (
        <div className="mb-6 flex items-start gap-3 rounded-xl bg-warning/12 p-4 text-sm">
          <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
          <p className="text-muted-foreground">
            Forecasts use your recent revenue and expense averages as the
            baseline. Add some income and expense data first for meaningful
            projections.
          </p>
        </div>
      )}

      {forecasts.length === 0 ? (
        <EmptyState
          icon={TrendingUp}
          title="No forecasts yet"
          description="Create a scenario to project how your finances could evolve based on assumptions you control."
          action={
            <Button onClick={openNew}>
              <Plus className="h-4 w-4" /> Create your first forecast
            </Button>
          }
        />
      ) : (
        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          <div className="space-y-3">
            {forecasts.map((f) => (
              <button
                key={f.id}
                onClick={() => setSelectedId(f.id)}
                className={`w-full rounded-xl border p-4 text-left transition-all ${
                  selected?.id === f.id
                    ? "border-primary bg-primary/8"
                    : "border-border bg-surface hover:bg-muted/50"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="font-medium">{f.name}</p>
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      setToDelete(f.id);
                    }}
                    className="rounded-md p-1 text-muted-foreground hover:bg-danger/10 hover:text-danger"
                    role="button"
                    aria-label="Delete forecast"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {f.horizon} months · +{f.revenueGrowth}% rev / +{f.expenseGrowth}% exp
                </p>
              </button>
            ))}
          </div>

          {selected && (
            <div className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-3">
                <Card className="p-4">
                  <p className="text-sm text-muted-foreground">Starting cash</p>
                  <p className="mt-1 text-xl font-bold tabular-nums">
                    {formatCurrency(selected.startingCash, currency)}
                  </p>
                </Card>
                <Card className="p-4">
                  <p className="text-sm text-muted-foreground">Projected end cash</p>
                  <p className={`mt-1 text-xl font-bold tabular-nums ${endCash >= 0 ? "text-success" : "text-danger"}`}>
                    {formatCurrency(endCash, currency)}
                  </p>
                </Card>
                <Card className="p-4">
                  <p className="text-sm text-muted-foreground">Horizon</p>
                  <p className="mt-1 text-xl font-bold">{selected.horizon} months</p>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <div>
                    <CardTitle>{selected.name}</CardTitle>
                    <CardDescription>
                      Revenue, expense &amp; cash projection
                    </CardDescription>
                  </div>
                  <Badge tone="primary">Scenario</Badge>
                </CardHeader>
                <ForecastChart
                  data={projection.map((p) => ({
                    label: p.label,
                    revenue: p.revenue,
                    expense: p.expense,
                    cash: p.cash,
                  }))}
                  currency={currency}
                />
                <div className="mt-4 flex flex-wrap gap-4 text-xs">
                  <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-success" /> Revenue</span>
                  <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-danger" /> Expense</span>
                  <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-primary" /> Cash</span>
                </div>
              </Card>
            </div>
          )}
        </div>
      )}

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title="New forecast"
        description="Set your assumptions. Baseline revenue and expenses come from your recent averages."
        footer={
          <>
            <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" form="forecast-form">Create forecast</Button>
          </>
        }
      >
        <form id="forecast-form" onSubmit={onSubmit} className="space-y-4" noValidate>
          <Field label="Scenario name" htmlFor="name" error={errors.name}>
            <Input id="name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="e.g. Base case, Aggressive growth" />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Horizon (months)" htmlFor="horizon" error={errors.horizon}>
              <Input id="horizon" type="number" min="1" max="36" value={form.horizon} onChange={(e) => setForm((f) => ({ ...f, horizon: e.target.value }))} />
            </Field>
            <Field label={`Starting cash (${currency})`} htmlFor="startingCash">
              <Input id="startingCash" type="number" value={form.startingCash} onChange={(e) => setForm((f) => ({ ...f, startingCash: e.target.value }))} />
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Monthly revenue growth (%)" htmlFor="rg" error={errors.revenueGrowth}>
              <Input id="rg" type="number" step="0.1" value={form.revenueGrowth} onChange={(e) => setForm((f) => ({ ...f, revenueGrowth: e.target.value }))} />
            </Field>
            <Field label="Monthly expense growth (%)" htmlFor="eg" error={errors.expenseGrowth}>
              <Input id="eg" type="number" step="0.1" value={form.expenseGrowth} onChange={(e) => setForm((f) => ({ ...f, expenseGrowth: e.target.value }))} />
            </Field>
          </div>
        </form>
      </Dialog>

      <ConfirmDialog
        open={!!toDelete}
        onClose={() => setToDelete(null)}
        onConfirm={() => {
          if (toDelete) {
            deleteForecast(toDelete);
            if (selectedId === toDelete) setSelectedId(null);
            toast({ tone: "success", title: "Forecast deleted" });
          }
        }}
        title="Delete this forecast?"
        description="This scenario will be removed."
      />
    </div>
  );
}
