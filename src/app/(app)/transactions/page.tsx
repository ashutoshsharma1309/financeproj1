"use client";

import * as React from "react";
import {
  Plus,
  ArrowLeftRight,
  Pencil,
  Trash2,
  MoreVertical,
  Download,
  TrendingUp,
  TrendingDown,
  Search,
} from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { Dialog } from "@/components/ui/dialog";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Dropdown, DropdownItem } from "@/components/ui/dropdown";
import { Tabs } from "@/components/ui/misc";
import { Input, Select, Field } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { useFinanceStore } from "@/lib/store";
import { useCurrency } from "@/hooks/use-finance-data";
import { transactionSchema, fieldErrors } from "@/lib/validators";
import { formatCurrency, formatDate, sumBy } from "@/lib/utils";
import { exportToCSV } from "@/lib/export";
import type { Transaction } from "@/lib/types";

const todayISO = () => new Date().toISOString().slice(0, 10);

export default function TransactionsPage() {
  const currency = useCurrency();
  const { toast } = useToast();
  const transactions = useFinanceStore((s) => s.transactions);
  const categories = useFinanceStore((s) => s.categories);
  const accounts = useFinanceStore((s) => s.accounts);
  const addTransaction = useFinanceStore((s) => s.addTransaction);
  const updateTransaction = useFinanceStore((s) => s.updateTransaction);
  const deleteTransaction = useFinanceStore((s) => s.deleteTransaction);

  const [open, setOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Transaction | null>(null);
  const [toDelete, setToDelete] = React.useState<string | null>(null);
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [filter, setFilter] = React.useState("ALL");
  const [query, setQuery] = React.useState("");
  const [form, setForm] = React.useState({
    type: "EXPENSE" as "INCOME" | "EXPENSE",
    amount: "",
    description: "",
    date: todayISO(),
    categoryId: "",
    accountId: "",
  });

  const income = sumBy(transactions.filter((t) => t.type === "INCOME"), (t) => t.amount);
  const expense = sumBy(transactions.filter((t) => t.type === "EXPENSE"), (t) => t.amount);

  const filtered = transactions
    .filter((t) => (filter === "ALL" ? true : t.type === filter))
    .filter((t) =>
      query ? t.description.toLowerCase().includes(query.toLowerCase()) : true,
    );

  const formCategories = categories.filter(
    (c) => c.kind === (form.type === "INCOME" ? "INCOME" : "EXPENSE"),
  );

  function openNew() {
    setEditing(null);
    setForm({ type: "EXPENSE", amount: "", description: "", date: todayISO(), categoryId: "", accountId: "" });
    setErrors({});
    setOpen(true);
  }

  function openEdit(t: Transaction) {
    setEditing(t);
    setForm({
      type: t.type,
      amount: String(t.amount),
      description: t.description,
      date: t.date.slice(0, 10),
      categoryId: t.categoryId ?? "",
      accountId: t.accountId ?? "",
    });
    setErrors({});
    setOpen(true);
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload = {
      type: form.type,
      amount: Number(form.amount),
      description: form.description.trim(),
      date: form.date,
      categoryId: form.categoryId || undefined,
      accountId: form.accountId || undefined,
    };
    const parsed = transactionSchema.safeParse(payload);
    if (!parsed.success) {
      setErrors(fieldErrors(parsed.error));
      return;
    }
    if (editing) {
      updateTransaction(editing.id, parsed.data);
      toast({ tone: "success", title: "Transaction updated" });
    } else {
      addTransaction(parsed.data);
      toast({ tone: "success", title: "Transaction added" });
    }
    setOpen(false);
  }

  function handleExport() {
    exportToCSV(
      "transactions",
      [
        { key: "type", label: "Type" },
        { key: "description", label: "Description" },
        { key: "amount", label: "Amount" },
        { key: "date", label: "Date" },
        { key: "category", label: "Category" },
      ],
      transactions.map((t) => ({
        type: t.type,
        description: t.description,
        amount: t.amount,
        date: formatDate(t.date),
        category: categories.find((c) => c.id === t.categoryId)?.name ?? "",
      })),
    );
  }

  return (
    <div>
      <PageHeader
        title="Transactions"
        description="A unified ledger of every income and expense entry."
        action={
          <div className="flex gap-3">
            {transactions.length > 0 && (
              <Button variant="outline" onClick={handleExport}>
                <Download className="h-4 w-4" /> Export
              </Button>
            )}
            <Button onClick={openNew}>
              <Plus className="h-4 w-4" /> Add transaction
            </Button>
          </div>
        }
      />

      {transactions.length === 0 ? (
        <EmptyState
          icon={ArrowLeftRight}
          title="No transactions yet"
          description="Add your first transaction to build your financial ledger. Income and expenses flow into every dashboard."
          action={
            <Button onClick={openNew}>
              <Plus className="h-4 w-4" /> Add your first transaction
            </Button>
          }
        />
      ) : (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <StatCard label="Total income" value={formatCurrency(income, currency)} icon={TrendingUp} tone="success" delta={null} />
            <StatCard label="Total expense" value={formatCurrency(expense, currency)} icon={TrendingDown} tone="danger" delta={null} />
            <StatCard label="Net" value={formatCurrency(income - expense, currency)} icon={ArrowLeftRight} tone={income - expense >= 0 ? "success" : "danger"} delta={null} />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Tabs
              tabs={[
                { value: "ALL", label: "All" },
                { value: "INCOME", label: "Income" },
                { value: "EXPENSE", label: "Expense" },
              ]}
              value={filter}
              onValueChange={setFilter}
            />
            <div className="relative sm:w-64">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search descriptions…"
                className="pl-9"
              />
            </div>
          </div>

          <Card className="overflow-hidden p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                    <th className="px-5 py-3 font-semibold">Description</th>
                    <th className="px-5 py-3 font-semibold">Category</th>
                    <th className="px-5 py-3 font-semibold">Date</th>
                    <th className="px-5 py-3 text-right font-semibold">Amount</th>
                    <th className="px-5 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-5 py-10 text-center text-sm text-muted-foreground">
                        No transactions match your filter.
                      </td>
                    </tr>
                  ) : (
                    filtered.map((t) => {
                      const cat = categories.find((c) => c.id === t.categoryId);
                      const isIncome = t.type === "INCOME";
                      return (
                        <tr key={t.id} className="border-b border-border last:border-0 transition-colors hover:bg-muted/40">
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-3">
                              <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${isIncome ? "bg-success/15 text-success" : "bg-danger/15 text-danger"}`}>
                                {isIncome ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                              </span>
                              <span className="font-medium">{t.description}</span>
                            </div>
                          </td>
                          <td className="px-5 py-3.5">
                            {cat ? <Badge tone={isIncome ? "success" : "danger"}>{cat.name}</Badge> : <span className="text-muted-foreground">—</span>}
                          </td>
                          <td className="px-5 py-3.5 text-muted-foreground">{formatDate(t.date)}</td>
                          <td className={`px-5 py-3.5 text-right font-semibold tabular-nums ${isIncome ? "text-success" : ""}`}>
                            {isIncome ? "+" : "−"}{formatCurrency(t.amount, currency)}
                          </td>
                          <td className="px-5 py-3.5 text-right">
                            <Dropdown
                              trigger={
                                <button className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted" aria-label="Row actions">
                                  <MoreVertical className="h-4 w-4" />
                                </button>
                              }
                            >
                              <DropdownItem onClick={() => openEdit(t)}>
                                <Pencil className="h-4 w-4" /> Edit
                              </DropdownItem>
                              <DropdownItem danger onClick={() => setToDelete(t.id)}>
                                <Trash2 className="h-4 w-4" /> Delete
                              </DropdownItem>
                            </Dropdown>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title={editing ? "Edit transaction" : "Add transaction"}
        footer={
          <>
            <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" form="txn-form">{editing ? "Save changes" : "Add transaction"}</Button>
          </>
        }
      >
        <form id="txn-form" onSubmit={onSubmit} className="space-y-4" noValidate>
          <Field label="Type">
            <div className="grid grid-cols-2 gap-3">
              {(["EXPENSE", "INCOME"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, type: t, categoryId: "" }))}
                  className={`rounded-xl border px-4 py-2.5 text-sm font-medium transition-all ${
                    form.type === t
                      ? t === "INCOME"
                        ? "border-success bg-success/10 text-success"
                        : "border-danger bg-danger/10 text-danger"
                      : "border-border text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {t === "INCOME" ? "Income" : "Expense"}
                </button>
              ))}
            </div>
          </Field>
          <Field label="Description" htmlFor="description" error={errors.description}>
            <Input id="description" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} placeholder="What was this for?" />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label={`Amount (${currency})`} htmlFor="amount" error={errors.amount}>
              <Input id="amount" type="number" min="0" step="0.01" value={form.amount} onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))} placeholder="0.00" />
            </Field>
            <Field label="Date" htmlFor="date" error={errors.date}>
              <Input id="date" type="date" value={form.date} onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))} />
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Category" htmlFor="category">
              <Select id="category" value={form.categoryId} onChange={(e) => setForm((f) => ({ ...f, categoryId: e.target.value }))}>
                <option value="">Uncategorized</option>
                {formCategories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </Select>
            </Field>
            <Field label="Account" htmlFor="account">
              <Select id="account" value={form.accountId} onChange={(e) => setForm((f) => ({ ...f, accountId: e.target.value }))}>
                <option value="">None</option>
                {accounts.map((a) => (
                  <option key={a.id} value={a.id}>{a.name}</option>
                ))}
              </Select>
            </Field>
          </div>
        </form>
      </Dialog>

      <ConfirmDialog
        open={!!toDelete}
        onClose={() => setToDelete(null)}
        onConfirm={() => {
          if (toDelete) {
            deleteTransaction(toDelete);
            toast({ tone: "success", title: "Transaction deleted" });
          }
        }}
        title="Delete this transaction?"
        description="This will remove it from all totals and reports."
      />
    </div>
  );
}
