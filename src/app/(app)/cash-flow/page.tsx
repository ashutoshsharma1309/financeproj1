"use client";

import * as React from "react";
import {
  LineChart as LineIcon,
  Wallet,
  Landmark,
  Plus,
  Trash2,
  TrendingDown,
  Timer,
  Pencil,
} from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { Dialog } from "@/components/ui/dialog";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Input, Select, Field } from "@/components/ui/input";
import { CashLineChart, CompareBarChart } from "@/components/charts";
import { useToast } from "@/components/ui/toast";
import { useFinanceStore } from "@/lib/store";
import { useFinanceData, useCurrency } from "@/hooks/use-finance-data";
import { accountSchema, fieldErrors } from "@/lib/validators";
import {
  cashFlowSeries,
  cashPosition,
  hasAnyData,
  monthlyBurn,
  runwayMonths,
  totalAssets,
  totalLiabilities,
} from "@/lib/calculations";
import { ACCOUNT_KINDS } from "@/lib/constants";
import { formatCurrency } from "@/lib/utils";
import type { Account, AccountKind } from "@/lib/types";

export default function CashFlowPage() {
  const currency = useCurrency();
  const { toast } = useToast();
  const data = useFinanceData();
  const accounts = useFinanceStore((s) => s.accounts);
  const addAccount = useFinanceStore((s) => s.addAccount);
  const updateAccount = useFinanceStore((s) => s.updateAccount);
  const deleteAccount = useFinanceStore((s) => s.deleteAccount);

  const [open, setOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Account | null>(null);
  const [toDelete, setToDelete] = React.useState<string | null>(null);
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [form, setForm] = React.useState({ name: "", kind: "BANK" as AccountKind, balance: "" });

  const cash = cashPosition(accounts);
  const burn = monthlyBurn(data);
  const runway = runwayMonths(data);
  const series = cashFlowSeries(data, 12);
  const hasFlow = hasAnyData(data);

  function openNew() {
    setEditing(null);
    setForm({ name: "", kind: "BANK", balance: "" });
    setErrors({});
    setOpen(true);
  }
  function openEdit(a: Account) {
    setEditing(a);
    setForm({ name: a.name, kind: a.kind, balance: String(a.balance) });
    setErrors({});
    setOpen(true);
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload = { name: form.name.trim(), kind: form.kind, balance: Number(form.balance) };
    const parsed = accountSchema.safeParse(payload);
    if (!parsed.success) {
      setErrors(fieldErrors(parsed.error));
      return;
    }
    if (editing) {
      updateAccount(editing.id, parsed.data);
      toast({ tone: "success", title: "Account updated" });
    } else {
      addAccount(parsed.data);
      toast({ tone: "success", title: "Account added" });
    }
    setOpen(false);
  }

  return (
    <div>
      <PageHeader
        title="Cash Flow"
        description="Track money in and out, your balance over time, and your runway."
        action={
          <Button onClick={openNew}>
            <Plus className="h-4 w-4" /> Add account
          </Button>
        }
      />

      {!hasFlow && accounts.length === 0 ? (
        <EmptyState
          icon={LineIcon}
          title="No cash flow data yet"
          description="Add your bank or cash accounts and record income and expenses to see how money moves through your business."
          action={
            <Button onClick={openNew}>
              <Plus className="h-4 w-4" /> Add your first account
            </Button>
          }
        />
      ) : (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard label="Cash position" value={formatCurrency(cash, currency)} icon={Wallet} tone={cash >= 0 ? "success" : "danger"} delta={null} />
            <StatCard label="Monthly net" value={formatCurrency(burn, currency)} icon={TrendingDown} tone={burn >= 0 ? "success" : "warning"} delta={null} hint="Recent average" />
            <StatCard label="Runway" value={Number.isFinite(runway) ? `${runway.toFixed(1)} mo` : "∞"} icon={Timer} tone={Number.isFinite(runway) && runway < 6 ? "danger" : "primary"} delta={null} hint={Number.isFinite(runway) ? "At current burn" : "Cash-flow positive"} />
            <StatCard label="Net worth" value={formatCurrency(totalAssets(accounts) - totalLiabilities(accounts), currency)} icon={Landmark} tone="accent" delta={null} hint="Assets − liabilities" />
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <div>
                  <CardTitle>Cash balance trend</CardTitle>
                  <CardDescription>Projected from your net monthly flow</CardDescription>
                </div>
              </CardHeader>
              {hasFlow ? (
                <CashLineChart data={series} currency={currency} />
              ) : (
                <p className="py-16 text-center text-sm text-muted-foreground">
                  Record income and expenses to see your balance trend.
                </p>
              )}
            </Card>
            <Card>
              <CardHeader>
                <div>
                  <CardTitle>Inflow vs. outflow</CardTitle>
                  <CardDescription>Monthly, trailing 12 months</CardDescription>
                </div>
              </CardHeader>
              {hasFlow ? (
                <CompareBarChart
                  data={series.map((s) => ({ label: s.label, income: s.inflow, expense: s.outflow }))}
                  currency={currency}
                />
              ) : (
                <p className="py-16 text-center text-sm text-muted-foreground">
                  Record income and expenses to compare inflow and outflow.
                </p>
              )}
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Accounts</CardTitle>
              <Button variant="ghost" size="sm" onClick={openNew}>
                <Plus className="h-4 w-4" /> Add
              </Button>
            </CardHeader>
            {accounts.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                No accounts added. Add cash, bank, credit, asset or liability accounts to compute your true cash position.
              </p>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {accounts.map((a) => {
                  const kind = ACCOUNT_KINDS.find((k) => k.value === a.kind);
                  const isNeg = a.kind === "CREDIT" || a.kind === "LIABILITY";
                  return (
                    <div key={a.id} className="surface-card flex items-center justify-between p-4">
                      <div>
                        <p className="font-medium">{a.name}</p>
                        <Badge tone={isNeg ? "danger" : "primary"} className="mt-1">
                          {kind?.label}
                        </Badge>
                      </div>
                      <div className="text-right">
                        <p className={`font-semibold tabular-nums ${isNeg ? "text-danger" : ""}`}>
                          {isNeg ? "−" : ""}{formatCurrency(a.balance, currency)}
                        </p>
                        <div className="mt-1 flex justify-end gap-1">
                          <button onClick={() => openEdit(a)} className="rounded-md p-1 text-muted-foreground hover:bg-muted" aria-label="Edit account">
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                          <button onClick={() => setToDelete(a.id)} className="rounded-md p-1 text-muted-foreground hover:bg-danger/10 hover:text-danger" aria-label="Delete account">
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </div>
      )}

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title={editing ? "Edit account" : "Add account"}
        description="Cash and bank balances feed your cash position; credit and liabilities reduce it."
        footer={
          <>
            <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" form="account-form">{editing ? "Save" : "Add account"}</Button>
          </>
        }
      >
        <form id="account-form" onSubmit={onSubmit} className="space-y-4" noValidate>
          <Field label="Account name" htmlFor="name" error={errors.name}>
            <Input id="name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="e.g. HDFC Current A/C" />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Type" htmlFor="kind">
              <Select id="kind" value={form.kind} onChange={(e) => setForm((f) => ({ ...f, kind: e.target.value as AccountKind }))}>
                {ACCOUNT_KINDS.map((k) => (
                  <option key={k.value} value={k.value}>{k.label}</option>
                ))}
              </Select>
            </Field>
            <Field label={`Balance (${currency})`} htmlFor="balance" error={errors.balance}>
              <Input id="balance" type="number" step="0.01" value={form.balance} onChange={(e) => setForm((f) => ({ ...f, balance: e.target.value }))} placeholder="0.00" />
            </Field>
          </div>
        </form>
      </Dialog>

      <ConfirmDialog
        open={!!toDelete}
        onClose={() => setToDelete(null)}
        onConfirm={() => {
          if (toDelete) {
            deleteAccount(toDelete);
            toast({ tone: "success", title: "Account deleted" });
          }
        }}
        title="Delete this account?"
        description="This will remove its balance from your cash position."
      />
    </div>
  );
}
