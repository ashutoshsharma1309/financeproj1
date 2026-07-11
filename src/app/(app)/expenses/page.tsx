"use client";

import * as React from "react";
import { Plus, TrendingDown, Pencil, Trash2, MoreVertical, Download, Receipt } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { Dialog } from "@/components/ui/dialog";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Dropdown, DropdownItem } from "@/components/ui/dropdown";
import { Input, Select, Textarea, Field } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { useFinanceStore } from "@/lib/store";
import { useCurrency } from "@/hooks/use-finance-data";
import { expenseSchema, fieldErrors } from "@/lib/validators";
import { formatCurrency, formatDate, sumBy, monthKey, todayISO } from "@/lib/utils";
import { exportToCSV } from "@/lib/export";
import type { Expense } from "@/lib/types";

export default function ExpensesPage() {
  const currency = useCurrency();
  const { toast } = useToast();
  const expenses = useFinanceStore((s) => s.expenses);
  const allCategories = useFinanceStore((s) => s.categories);
  const categories = React.useMemo(
    () => allCategories.filter((c) => c.kind === "EXPENSE"),
    [allCategories],
  );
  const addExpense = useFinanceStore((s) => s.addExpense);
  const updateExpense = useFinanceStore((s) => s.updateExpense);
  const deleteExpense = useFinanceStore((s) => s.deleteExpense);

  const [open, setOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Expense | null>(null);
  const [toDelete, setToDelete] = React.useState<string | null>(null);
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [form, setForm] = React.useState({
    vendor: "",
    amount: "",
    date: todayISO(),
    categoryId: "",
    notes: "",
  });

  const total = React.useMemo(() => sumBy(expenses, (e) => e.amount), [expenses]);
  const thisMonth = React.useMemo(
    () =>
      sumBy(
        expenses.filter((e) => monthKey(e.date) === monthKey(new Date())),
        (e) => e.amount,
      ),
    [expenses],
  );
  const avg = React.useMemo(
    () => (expenses.length ? total / expenses.length : 0),
    [total, expenses.length],
  );

  function openNew() {
    setEditing(null);
    setForm({ vendor: "", amount: "", date: todayISO(), categoryId: "", notes: "" });
    setErrors({});
    setOpen(true);
  }

  function openEdit(x: Expense) {
    setEditing(x);
    setForm({
      vendor: x.vendor,
      amount: String(x.amount),
      date: x.date.slice(0, 10),
      categoryId: x.categoryId ?? "",
      notes: x.notes ?? "",
    });
    setErrors({});
    setOpen(true);
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload = {
      vendor: form.vendor.trim(),
      amount: Number(form.amount),
      date: form.date,
      categoryId: form.categoryId || undefined,
      notes: form.notes.trim() || undefined,
    };
    const parsed = expenseSchema.safeParse(payload);
    if (!parsed.success) {
      setErrors(fieldErrors(parsed.error));
      return;
    }
    if (editing) {
      updateExpense(editing.id, parsed.data);
      toast({ tone: "success", title: "Expense updated" });
    } else {
      addExpense(parsed.data);
      toast({ tone: "success", title: "Expense added" });
    }
    setOpen(false);
  }

  function handleExport() {
    exportToCSV(
      "expenses",
      [
        { key: "vendor", label: "Vendor" },
        { key: "amount", label: "Amount" },
        { key: "date", label: "Date" },
        { key: "category", label: "Category" },
        { key: "notes", label: "Notes" },
      ],
      expenses.map((x) => ({
        vendor: x.vendor,
        amount: x.amount,
        date: formatDate(x.date),
        category: categories.find((c) => c.id === x.categoryId)?.name ?? "",
        notes: x.notes ?? "",
      })),
    );
  }

  return (
    <div>
      <PageHeader
        title="Expenses"
        description="Track spending by vendor and category to control costs."
        action={
          <div className="flex gap-3">
            {expenses.length > 0 && (
              <Button variant="outline" onClick={handleExport}>
                <Download className="h-4 w-4" /> Export
              </Button>
            )}
            <Button onClick={openNew}>
              <Plus className="h-4 w-4" /> Add expense
            </Button>
          </div>
        }
      />

      {expenses.length === 0 ? (
        <EmptyState
          icon={Receipt}
          title="No expenses recorded"
          description="Add your first expense to understand where your money is going."
          action={
            <Button onClick={openNew}>
              <Plus className="h-4 w-4" /> Add your first expense
            </Button>
          }
        />
      ) : (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <StatCard label="Total expenses" value={formatCurrency(total, currency)} icon={TrendingDown} tone="danger" delta={null} />
            <StatCard label="This month" value={formatCurrency(thisMonth, currency)} icon={TrendingDown} tone="warning" delta={null} />
            <StatCard label="Average entry" value={formatCurrency(avg, currency)} icon={Receipt} tone="accent" delta={null} />
          </div>

          <Card className="overflow-hidden p-0">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                    <th scope="col" className="px-5 py-3 font-semibold">Vendor</th>
                    <th scope="col" className="px-5 py-3 font-semibold">Category</th>
                    <th scope="col" className="px-5 py-3 font-semibold">Date</th>
                    <th scope="col" className="px-5 py-3 text-right font-semibold">Amount</th>
                    <th scope="col" className="px-5 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {expenses.map((x) => {
                    const cat = categories.find((c) => c.id === x.categoryId);
                    return (
                      <tr key={x.id} className="border-b border-border last:border-0 transition-colors hover:bg-muted/40">
                        <td className="px-5 py-3.5">
                          <p className="font-medium">{x.vendor}</p>
                          {x.notes && <p className="text-xs text-muted-foreground">{x.notes}</p>}
                        </td>
                        <td className="px-5 py-3.5">
                          {cat ? (
                            <Badge tone="danger">{cat.name}</Badge>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </td>
                        <td className="px-5 py-3.5 text-muted-foreground">{formatDate(x.date)}</td>
                        <td className="px-5 py-3.5 text-right font-semibold tabular-nums">
                          −{formatCurrency(x.amount, currency)}
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <Dropdown
                            trigger={
                              <button className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted" aria-label="Row actions">
                                <MoreVertical className="h-4 w-4" />
                              </button>
                            }
                          >
                            <DropdownItem onClick={() => openEdit(x)}>
                              <Pencil className="h-4 w-4" /> Edit
                            </DropdownItem>
                            <DropdownItem danger onClick={() => setToDelete(x.id)}>
                              <Trash2 className="h-4 w-4" /> Delete
                            </DropdownItem>
                          </Dropdown>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title={editing ? "Edit expense" : "Add expense"}
        description="Record a spending entry for your business."
        footer={
          <>
            <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" form="expense-form">{editing ? "Save changes" : "Add expense"}</Button>
          </>
        }
      >
        <form id="expense-form" onSubmit={onSubmit} className="space-y-4" noValidate>
          <Field label="Vendor" htmlFor="vendor" error={errors.vendor}>
            <Input id="vendor" value={form.vendor} onChange={(e) => setForm((f) => ({ ...f, vendor: e.target.value }))} placeholder="e.g. AWS, Office rent, Payroll" />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label={`Amount (${currency})`} htmlFor="amount" error={errors.amount}>
              <Input id="amount" type="number" min="0" step="0.01" value={form.amount} onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))} placeholder="0.00" />
            </Field>
            <Field label="Date" htmlFor="date" error={errors.date}>
              <Input id="date" type="date" value={form.date} onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))} />
            </Field>
          </div>
          <Field label="Category" htmlFor="category">
            <Select id="category" value={form.categoryId} onChange={(e) => setForm((f) => ({ ...f, categoryId: e.target.value }))}>
              <option value="">Uncategorized</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </Select>
          </Field>
          <Field label="Notes (optional)" htmlFor="notes">
            <Textarea id="notes" value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} placeholder="Any additional detail" rows={3} />
          </Field>
        </form>
      </Dialog>

      <ConfirmDialog
        open={!!toDelete}
        onClose={() => setToDelete(null)}
        onConfirm={() => {
          if (toDelete) {
            deleteExpense(toDelete);
            toast({ tone: "success", title: "Expense deleted" });
          }
        }}
        title="Delete this expense?"
        description="This will remove it from all totals and reports."
      />
    </div>
  );
}
