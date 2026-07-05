"use client";

import * as React from "react";
import { Plus, TrendingUp, Pencil, Trash2, MoreVertical, Download } from "lucide-react";
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
import { revenueSchema, fieldErrors } from "@/lib/validators";
import { formatCurrency, formatDate, sumBy, monthKey } from "@/lib/utils";
import { exportToCSV } from "@/lib/export";
import type { Revenue } from "@/lib/types";

const todayISO = () => new Date().toISOString().slice(0, 10);

export default function RevenuePage() {
  const currency = useCurrency();
  const { toast } = useToast();
  const revenues = useFinanceStore((s) => s.revenues);
  const allCategories = useFinanceStore((s) => s.categories);
  const categories = React.useMemo(
    () => allCategories.filter((c) => c.kind === "INCOME"),
    [allCategories],
  );
  const addRevenue = useFinanceStore((s) => s.addRevenue);
  const updateRevenue = useFinanceStore((s) => s.updateRevenue);
  const deleteRevenue = useFinanceStore((s) => s.deleteRevenue);

  const [open, setOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Revenue | null>(null);
  const [toDelete, setToDelete] = React.useState<string | null>(null);
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [form, setForm] = React.useState({
    source: "",
    amount: "",
    date: todayISO(),
    categoryId: "",
    notes: "",
  });

  const total = sumBy(revenues, (r) => r.amount);
  const thisMonth = sumBy(
    revenues.filter((r) => monthKey(r.date) === monthKey(new Date())),
    (r) => r.amount,
  );

  function openNew() {
    setEditing(null);
    setForm({ source: "", amount: "", date: todayISO(), categoryId: "", notes: "" });
    setErrors({});
    setOpen(true);
  }

  function openEdit(r: Revenue) {
    setEditing(r);
    setForm({
      source: r.source,
      amount: String(r.amount),
      date: r.date.slice(0, 10),
      categoryId: r.categoryId ?? "",
      notes: r.notes ?? "",
    });
    setErrors({});
    setOpen(true);
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload = {
      source: form.source.trim(),
      amount: Number(form.amount),
      date: form.date,
      categoryId: form.categoryId || undefined,
      notes: form.notes.trim() || undefined,
    };
    const parsed = revenueSchema.safeParse(payload);
    if (!parsed.success) {
      setErrors(fieldErrors(parsed.error));
      return;
    }
    if (editing) {
      updateRevenue(editing.id, parsed.data);
      toast({ tone: "success", title: "Revenue updated" });
    } else {
      addRevenue(parsed.data);
      toast({ tone: "success", title: "Revenue added" });
    }
    setOpen(false);
  }

  function handleExport() {
    exportToCSV(
      "revenue",
      [
        { key: "source", label: "Source" },
        { key: "amount", label: "Amount" },
        { key: "date", label: "Date" },
        { key: "category", label: "Category" },
        { key: "notes", label: "Notes" },
      ],
      revenues.map((r) => ({
        source: r.source,
        amount: r.amount,
        date: formatDate(r.date),
        category: categories.find((c) => c.id === r.categoryId)?.name ?? "",
        notes: r.notes ?? "",
      })),
    );
  }

  return (
    <div>
      <PageHeader
        title="Revenue"
        description="Record every income source. Totals update automatically."
        action={
          <div className="flex gap-3">
            {revenues.length > 0 && (
              <Button variant="outline" onClick={handleExport}>
                <Download className="h-4 w-4" /> Export
              </Button>
            )}
            <Button onClick={openNew}>
              <Plus className="h-4 w-4" /> Add revenue
            </Button>
          </div>
        }
      />

      {revenues.length === 0 ? (
        <EmptyState
          icon={TrendingUp}
          title="No revenue recorded"
          description="Add your first income entry to start tracking how much your business earns."
          action={
            <Button onClick={openNew}>
              <Plus className="h-4 w-4" /> Add your first revenue
            </Button>
          }
        />
      ) : (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <StatCard label="Total revenue" value={formatCurrency(total, currency)} icon={TrendingUp} tone="success" delta={null} />
            <StatCard label="This month" value={formatCurrency(thisMonth, currency)} icon={TrendingUp} tone="primary" delta={null} />
            <StatCard label="Entries" value={String(revenues.length)} icon={TrendingUp} tone="accent" delta={null} />
          </div>

          <Card className="overflow-hidden p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                    <th className="px-5 py-3 font-semibold">Source</th>
                    <th className="px-5 py-3 font-semibold">Category</th>
                    <th className="px-5 py-3 font-semibold">Date</th>
                    <th className="px-5 py-3 text-right font-semibold">Amount</th>
                    <th className="px-5 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {revenues.map((r) => {
                    const cat = categories.find((c) => c.id === r.categoryId);
                    return (
                      <tr key={r.id} className="border-b border-border last:border-0 transition-colors hover:bg-muted/40">
                        <td className="px-5 py-3.5">
                          <p className="font-medium">{r.source}</p>
                          {r.notes && <p className="text-xs text-muted-foreground">{r.notes}</p>}
                        </td>
                        <td className="px-5 py-3.5">
                          {cat ? (
                            <Badge tone="success">{cat.name}</Badge>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </td>
                        <td className="px-5 py-3.5 text-muted-foreground">{formatDate(r.date)}</td>
                        <td className="px-5 py-3.5 text-right font-semibold tabular-nums text-success">
                          +{formatCurrency(r.amount, currency)}
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <Dropdown
                            trigger={
                              <button className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted" aria-label="Row actions">
                                <MoreVertical className="h-4 w-4" />
                              </button>
                            }
                          >
                            <DropdownItem onClick={() => openEdit(r)}>
                              <Pencil className="h-4 w-4" /> Edit
                            </DropdownItem>
                            <DropdownItem danger onClick={() => setToDelete(r.id)}>
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
        title={editing ? "Edit revenue" : "Add revenue"}
        description="Record an income entry for your business."
        footer={
          <>
            <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" form="revenue-form">{editing ? "Save changes" : "Add revenue"}</Button>
          </>
        }
      >
        <form id="revenue-form" onSubmit={onSubmit} className="space-y-4" noValidate>
          <Field label="Source" htmlFor="source" error={errors.source}>
            <Input id="source" value={form.source} onChange={(e) => setForm((f) => ({ ...f, source: e.target.value }))} placeholder="e.g. Product sales, Client retainer" />
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
            deleteRevenue(toDelete);
            toast({ tone: "success", title: "Revenue deleted" });
          }
        }}
        title="Delete this revenue entry?"
        description="This will remove it from all totals and reports."
      />
    </div>
  );
}
