"use client";

import * as React from "react";
import {
  Plus,
  FileText,
  Pencil,
  Trash2,
  MoreVertical,
  Download,
  Eye,
  X,
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
import { Input, Select, Field } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { useFinanceStore } from "@/lib/store";
import { useCurrency } from "@/hooks/use-finance-data";
import { invoiceSchema, fieldErrors } from "@/lib/validators";
import { formatCurrency, formatDate, uid, todayISO, plusDaysISO } from "@/lib/utils";
import { invoiceSubtotal, invoiceTax, invoiceTotal, invoiceStats, effectiveInvoiceStatus } from "@/lib/calculations";
import { exportToPDF } from "@/lib/export";
import { INVOICE_STATUSES } from "@/lib/constants";
import type { Invoice, InvoiceItem, InvoiceStatus } from "@/lib/types";

const statusTone: Record<InvoiceStatus, "neutral" | "primary" | "success" | "warning" | "danger"> = {
  DRAFT: "neutral",
  SENT: "primary",
  PAID: "success",
  OVERDUE: "danger",
  CANCELLED: "warning",
};

interface FormState {
  number: string;
  clientName: string;
  clientEmail: string;
  issueDate: string;
  dueDate: string;
  status: InvoiceStatus;
  taxRate: string;
  notes: string;
  items: InvoiceItem[];
}

function blankForm(nextNumber: string): FormState {
  return {
    number: nextNumber,
    clientName: "",
    clientEmail: "",
    issueDate: todayISO(),
    dueDate: plusDaysISO(30),
    status: "DRAFT",
    taxRate: "0",
    notes: "",
    items: [{ id: uid("it"), description: "", quantity: 1, unitPrice: 0 }],
  };
}

export default function InvoicesPage() {
  const currency = useCurrency();
  const { toast } = useToast();
  const company = useFinanceStore((s) => s.company);
  const invoices = useFinanceStore((s) => s.invoices);
  const addInvoice = useFinanceStore((s) => s.addInvoice);
  const updateInvoice = useFinanceStore((s) => s.updateInvoice);
  const deleteInvoice = useFinanceStore((s) => s.deleteInvoice);

  const [open, setOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Invoice | null>(null);
  const [viewing, setViewing] = React.useState<Invoice | null>(null);
  const [toDelete, setToDelete] = React.useState<string | null>(null);
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [form, setForm] = React.useState<FormState>(blankForm("INV-0001"));

  const stats = React.useMemo(() => invoiceStats(invoices), [invoices]);
  const nextNumber = `INV-${String(invoices.length + 1).padStart(4, "0")}`;

  const previewSubtotal = React.useMemo(
    () => form.items.reduce((a, i) => a + i.quantity * i.unitPrice, 0),
    [form.items],
  );
  const previewTax = React.useMemo(
    () => (previewSubtotal * (Number(form.taxRate) || 0)) / 100,
    [previewSubtotal, form.taxRate],
  );

  function openNew() {
    setEditing(null);
    setForm(blankForm(nextNumber));
    setErrors({});
    setOpen(true);
  }

  function openEdit(inv: Invoice) {
    setEditing(inv);
    setForm({
      number: inv.number,
      clientName: inv.clientName,
      clientEmail: inv.clientEmail ?? "",
      issueDate: inv.issueDate.slice(0, 10),
      dueDate: inv.dueDate.slice(0, 10),
      status: inv.status,
      taxRate: String(inv.taxRate),
      notes: inv.notes ?? "",
      items: inv.items.map((it) => ({ ...it })),
    });
    setErrors({});
    setOpen(true);
  }

  function updateItem(id: string, patch: Partial<InvoiceItem>) {
    setForm((f) => ({
      ...f,
      items: f.items.map((it) => (it.id === id ? { ...it, ...patch } : it)),
    }));
  }
  function addItem() {
    setForm((f) => ({
      ...f,
      items: [...f.items, { id: uid("it"), description: "", quantity: 1, unitPrice: 0 }],
    }));
  }
  function removeItem(id: string) {
    setForm((f) => ({
      ...f,
      items: f.items.length > 1 ? f.items.filter((it) => it.id !== id) : f.items,
    }));
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload = {
      number: form.number.trim(),
      clientName: form.clientName.trim(),
      clientEmail: form.clientEmail.trim(),
      issueDate: form.issueDate,
      dueDate: form.dueDate,
      status: form.status,
      taxRate: Number(form.taxRate) || 0,
      notes: form.notes.trim() || undefined,
      items: form.items.map((it) => ({
        description: it.description.trim(),
        quantity: Number(it.quantity),
        unitPrice: Number(it.unitPrice),
      })),
    };
    const parsed = invoiceSchema.safeParse(payload);
    if (!parsed.success) {
      setErrors(fieldErrors(parsed.error));
      return;
    }
    const withIds = {
      ...parsed.data,
      clientEmail: parsed.data.clientEmail || undefined,
      items: parsed.data.items.map((it) => ({ ...it, id: uid("it") })),
    };
    if (editing) {
      updateInvoice(editing.id, withIds);
      toast({ tone: "success", title: "Invoice updated" });
    } else {
      addInvoice(withIds);
      toast({ tone: "success", title: "Invoice created" });
    }
    setOpen(false);
  }

  function exportInvoicePDF(inv: Invoice) {
    const rows = inv.items
      .map(
        (it) => `<tr>
          <td>${it.description}</td>
          <td class="num">${it.quantity}</td>
          <td class="num">${formatCurrency(it.unitPrice, currency)}</td>
          <td class="num">${formatCurrency(it.quantity * it.unitPrice, currency)}</td>
        </tr>`,
      )
      .join("");
    exportToPDF(
      `Invoice ${inv.number}`,
      `<h1>Invoice ${inv.number}</h1>
       <p class="muted">${company?.name ?? "Your company"} · Issued ${formatDate(inv.issueDate)} · Due ${formatDate(inv.dueDate)}</p>
       <h2>Bill to</h2>
       <p>${inv.clientName}${inv.clientEmail ? ` &lt;${inv.clientEmail}&gt;` : ""}</p>
       <table>
         <thead><tr><th>Description</th><th class="num">Qty</th><th class="num">Unit price</th><th class="num">Amount</th></tr></thead>
         <tbody>
           ${rows}
           <tr><td colspan="3" class="num">Subtotal</td><td class="num">${formatCurrency(invoiceSubtotal(inv), currency)}</td></tr>
           <tr><td colspan="3" class="num">Tax (${inv.taxRate}%)</td><td class="num">${formatCurrency(invoiceTax(inv), currency)}</td></tr>
           <tr class="total-row"><td colspan="3" class="num">Total</td><td class="num">${formatCurrency(invoiceTotal(inv), currency)}</td></tr>
         </tbody>
       </table>
       ${inv.notes ? `<h2>Notes</h2><p class="muted">${inv.notes}</p>` : ""}`,
    );
  }

  return (
    <div>
      <PageHeader
        title="Invoices"
        description="Create invoices, track what's paid, and see exactly what you're owed."
        action={
          <Button onClick={openNew}>
            <Plus className="h-4 w-4" /> New invoice
          </Button>
        }
      />

      {invoices.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No invoices yet"
          description="Create your first invoice to start tracking payments and outstanding balances."
          action={
            <Button onClick={openNew}>
              <Plus className="h-4 w-4" /> Create your first invoice
            </Button>
          }
        />
      ) : (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard label="Paid" value={formatCurrency(stats.paidAmount, currency)} icon={FileText} tone="success" hint={`${stats.paidCount} invoice(s)`} delta={null} />
            <StatCard label="Outstanding" value={formatCurrency(stats.outstandingAmount, currency)} icon={FileText} tone="warning" hint={`${stats.outstandingCount} invoice(s)`} delta={null} />
            <StatCard label="Overdue" value={formatCurrency(stats.overdueAmount, currency)} icon={FileText} tone="danger" hint={`${stats.overdueCount} invoice(s)`} delta={null} />
            <StatCard label="Drafts" value={String(stats.draftCount)} icon={FileText} tone="accent" hint="Not yet sent" delta={null} />
          </div>

          <Card className="overflow-hidden p-0">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                    <th scope="col" className="px-5 py-3 font-semibold">Invoice</th>
                    <th scope="col" className="px-5 py-3 font-semibold">Client</th>
                    <th scope="col" className="px-5 py-3 font-semibold">Due</th>
                    <th scope="col" className="px-5 py-3 font-semibold">Status</th>
                    <th scope="col" className="px-5 py-3 text-right font-semibold">Total</th>
                    <th scope="col" className="px-5 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((inv) => {
                    const status = effectiveInvoiceStatus(inv);
                    return (
                      <tr key={inv.id} className="border-b border-border last:border-0 transition-colors hover:bg-muted/40">
                        <td className="px-5 py-3.5 font-medium">{inv.number}</td>
                        <td className="px-5 py-3.5">
                          <p className="font-medium">{inv.clientName}</p>
                          {inv.clientEmail && <p className="text-xs text-muted-foreground">{inv.clientEmail}</p>}
                        </td>
                        <td className="px-5 py-3.5 text-muted-foreground">{formatDate(inv.dueDate)}</td>
                        <td className="px-5 py-3.5">
                          <Badge tone={statusTone[status]}>{status}</Badge>
                        </td>
                        <td className="px-5 py-3.5 text-right font-semibold tabular-nums">
                          {formatCurrency(invoiceTotal(inv), currency)}
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <Dropdown
                            trigger={
                              <button className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted" aria-label="Row actions">
                                <MoreVertical className="h-4 w-4" />
                              </button>
                            }
                          >
                            <DropdownItem onClick={() => setViewing(inv)}>
                              <Eye className="h-4 w-4" /> View
                            </DropdownItem>
                            <DropdownItem onClick={() => exportInvoicePDF(inv)}>
                              <Download className="h-4 w-4" /> Download PDF
                            </DropdownItem>
                            <DropdownItem onClick={() => openEdit(inv)}>
                              <Pencil className="h-4 w-4" /> Edit
                            </DropdownItem>
                            <DropdownItem danger onClick={() => setToDelete(inv.id)}>
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

      {/* Create / edit */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title={editing ? "Edit invoice" : "New invoice"}
        className="max-w-2xl"
        footer={
          <>
            <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" form="invoice-form">{editing ? "Save changes" : "Create invoice"}</Button>
          </>
        }
      >
        <form id="invoice-form" onSubmit={onSubmit} className="space-y-4" noValidate>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Invoice number" htmlFor="number" error={errors.number}>
              <Input id="number" value={form.number} onChange={(e) => setForm((f) => ({ ...f, number: e.target.value }))} />
            </Field>
            <Field label="Status" htmlFor="status">
              <Select id="status" value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as InvoiceStatus }))}>
                {INVOICE_STATUSES.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </Select>
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Client name" htmlFor="clientName" error={errors.clientName}>
              <Input id="clientName" value={form.clientName} onChange={(e) => setForm((f) => ({ ...f, clientName: e.target.value }))} placeholder="Acme Corp" />
            </Field>
            <Field label="Client email" htmlFor="clientEmail" error={errors["clientEmail"]}>
              <Input id="clientEmail" type="email" value={form.clientEmail} onChange={(e) => setForm((f) => ({ ...f, clientEmail: e.target.value }))} placeholder="billing@acme.com" />
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Issue date" htmlFor="issueDate" error={errors.issueDate}>
              <Input id="issueDate" type="date" value={form.issueDate} onChange={(e) => setForm((f) => ({ ...f, issueDate: e.target.value }))} />
            </Field>
            <Field label="Due date" htmlFor="dueDate" error={errors.dueDate}>
              <Input id="dueDate" type="date" value={form.dueDate} onChange={(e) => setForm((f) => ({ ...f, dueDate: e.target.value }))} />
            </Field>
            <Field label="Tax rate (%)" htmlFor="taxRate">
              <Input id="taxRate" type="number" min="0" max="100" step="0.01" value={form.taxRate} onChange={(e) => setForm((f) => ({ ...f, taxRate: e.target.value }))} />
            </Field>
          </div>

          {/* Line items */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium">Line items</span>
              <Button type="button" variant="ghost" size="sm" onClick={addItem}>
                <Plus className="h-4 w-4" /> Add item
              </Button>
            </div>
            {errors.items && <p className="mb-2 text-xs text-danger">{errors.items}</p>}
            <div className="space-y-2">
              {form.items.map((it) => (
                <div key={it.id} className="grid grid-cols-[1fr_70px_100px_auto] items-center gap-2">
                  <Input
                    value={it.description}
                    onChange={(e) => updateItem(it.id, { description: e.target.value })}
                    placeholder="Description"
                    className="h-10"
                  />
                  <Input
                    type="number"
                    min="0"
                    step="1"
                    value={it.quantity}
                    onChange={(e) => updateItem(it.id, { quantity: Number(e.target.value) })}
                    placeholder="Qty"
                    className="h-10"
                    aria-label="Quantity"
                  />
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={it.unitPrice}
                    onChange={(e) => updateItem(it.id, { unitPrice: Number(e.target.value) })}
                    placeholder="Price"
                    className="h-10"
                    aria-label="Unit price"
                  />
                  <button
                    type="button"
                    onClick={() => removeItem(it.id)}
                    className="rounded-lg p-2 text-muted-foreground hover:bg-danger/10 hover:text-danger disabled:opacity-30"
                    disabled={form.items.length === 1}
                    aria-label="Remove item"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Totals preview */}
          <div className="rounded-xl bg-muted/60 p-4 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-medium tabular-nums">{formatCurrency(previewSubtotal, currency)}</span>
            </div>
            <div className="mt-1 flex justify-between">
              <span className="text-muted-foreground">Tax ({form.taxRate || 0}%)</span>
              <span className="font-medium tabular-nums">{formatCurrency(previewTax, currency)}</span>
            </div>
            <div className="mt-2 flex justify-between border-t border-border pt-2 text-base font-semibold">
              <span>Total</span>
              <span className="tabular-nums">{formatCurrency(previewSubtotal + previewTax, currency)}</span>
            </div>
          </div>
        </form>
      </Dialog>

      {/* View */}
      <Dialog
        open={!!viewing}
        onClose={() => setViewing(null)}
        title={viewing ? `Invoice ${viewing.number}` : ""}
        className="max-w-lg"
        footer={
          viewing ? (
            <>
              <Button variant="ghost" onClick={() => setViewing(null)}>Close</Button>
              <Button onClick={() => exportInvoicePDF(viewing)}>
                <Download className="h-4 w-4" /> Download PDF
              </Button>
            </>
          ) : null
        }
      >
        {viewing && (
          <div className="space-y-4 text-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold">{viewing.clientName}</p>
                {viewing.clientEmail && <p className="text-muted-foreground">{viewing.clientEmail}</p>}
              </div>
              <Badge tone={statusTone[effectiveInvoiceStatus(viewing)]}>
                {effectiveInvoiceStatus(viewing)}
              </Badge>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Issued {formatDate(viewing.issueDate)}</span>
              <span>Due {formatDate(viewing.dueDate)}</span>
            </div>
            <div className="divide-y divide-border rounded-xl border border-border">
              {viewing.items.map((it) => (
                <div key={it.id} className="flex items-center justify-between px-4 py-2.5">
                  <span>{it.description}</span>
                  <span className="text-muted-foreground">
                    {it.quantity} × {formatCurrency(it.unitPrice, currency)}
                  </span>
                </div>
              ))}
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span className="tabular-nums">{formatCurrency(invoiceSubtotal(viewing), currency)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Tax ({viewing.taxRate}%)</span>
                <span className="tabular-nums">{formatCurrency(invoiceTax(viewing), currency)}</span>
              </div>
              <div className="flex justify-between border-t border-border pt-2 text-base font-semibold">
                <span>Total</span>
                <span className="tabular-nums">{formatCurrency(invoiceTotal(viewing), currency)}</span>
              </div>
            </div>
            {viewing.notes && (
              <p className="rounded-xl bg-muted/60 p-3 text-muted-foreground">{viewing.notes}</p>
            )}
          </div>
        )}
      </Dialog>

      <ConfirmDialog
        open={!!toDelete}
        onClose={() => setToDelete(null)}
        onConfirm={() => {
          if (toDelete) {
            deleteInvoice(toDelete);
            toast({ tone: "success", title: "Invoice deleted" });
          }
        }}
        title="Delete this invoice?"
        description="This will remove it and its impact on your outstanding totals."
      />
    </div>
  );
}
