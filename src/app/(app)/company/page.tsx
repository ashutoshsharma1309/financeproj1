"use client";

import * as React from "react";
import { Building2, Plus, Trash2, Tag, AlertTriangle } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input, Select, Field } from "@/components/ui/input";
import { Switch } from "@/components/ui/misc";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useToast } from "@/components/ui/toast";
import { useFinanceStore } from "@/lib/store";
import { companySchema, fieldErrors } from "@/lib/validators";
import { CURRENCIES, INDUSTRIES, MONTHS, CATEGORY_COLORS } from "@/lib/constants";
import type { CategoryKind } from "@/lib/types";

export default function CompanyPage() {
  const { toast } = useToast();
  const company = useFinanceStore((s) => s.company);
  const setCompany = useFinanceStore((s) => s.setCompany);
  const categories = useFinanceStore((s) => s.categories);
  const addCategory = useFinanceStore((s) => s.addCategory);
  const deleteCategory = useFinanceStore((s) => s.deleteCategory);
  const settings = useFinanceStore((s) => s.settings);
  const updateSettings = useFinanceStore((s) => s.updateSettings);
  const resetAll = useFinanceStore((s) => s.resetAll);

  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [confirmReset, setConfirmReset] = React.useState(false);
  const [form, setForm] = React.useState({
    name: company?.name ?? "",
    legalName: company?.legalName ?? "",
    industry: company?.industry ?? INDUSTRIES[0],
    currency: company?.currency ?? "INR",
    taxId: company?.taxId ?? "",
    fiscalYearStart: String(company?.fiscalYearStart ?? 4),
    address: company?.address ?? "",
    phone: company?.phone ?? "",
    website: company?.website ?? "",
  });

  const [newCat, setNewCat] = React.useState({ name: "", kind: "EXPENSE" as CategoryKind, color: CATEGORY_COLORS[0] });

  function saveCompany(e: React.FormEvent) {
    e.preventDefault();
    const payload = {
      name: form.name.trim(),
      legalName: form.legalName.trim() || undefined,
      industry: form.industry,
      currency: form.currency,
      taxId: form.taxId.trim() || undefined,
      fiscalYearStart: Number(form.fiscalYearStart),
      address: form.address.trim() || undefined,
      phone: form.phone.trim() || undefined,
      website: form.website.trim() || undefined,
    };
    const parsed = companySchema.safeParse(payload);
    if (!parsed.success) {
      setErrors(fieldErrors(parsed.error));
      return;
    }
    setErrors({});
    setCompany(parsed.data);
    toast({ tone: "success", title: "Company settings saved" });
  }

  function handleAddCategory() {
    if (!newCat.name.trim()) return;
    addCategory({ name: newCat.name.trim(), kind: newCat.kind, color: newCat.color });
    setNewCat({ name: "", kind: newCat.kind, color: CATEGORY_COLORS[0] });
    toast({ tone: "success", title: "Category added" });
  }

  const income = categories.filter((c) => c.kind === "INCOME");
  const expense = categories.filter((c) => c.kind === "EXPENSE");

  return (
    <div>
      <PageHeader
        title="Company Settings"
        description="Manage your business profile, categories and preferences."
      />

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-primary" />
              <CardTitle>Business profile</CardTitle>
            </div>
          </CardHeader>
          <form onSubmit={saveCompany} className="space-y-4" noValidate>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Company name" htmlFor="name" error={errors.name}>
                <Input id="name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
              </Field>
              <Field label="Legal name" htmlFor="legalName">
                <Input id="legalName" value={form.legalName} onChange={(e) => setForm((f) => ({ ...f, legalName: e.target.value }))} placeholder="Optional" />
              </Field>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="Industry" htmlFor="industry">
                <Select id="industry" value={form.industry} onChange={(e) => setForm((f) => ({ ...f, industry: e.target.value }))}>
                  {INDUSTRIES.map((i) => <option key={i} value={i}>{i}</option>)}
                </Select>
              </Field>
              <Field label="Currency" htmlFor="currency">
                <Select id="currency" value={form.currency} onChange={(e) => setForm((f) => ({ ...f, currency: e.target.value }))}>
                  {CURRENCIES.map((c) => <option key={c.code} value={c.code}>{c.label}</option>)}
                </Select>
              </Field>
              <Field label="Fiscal year starts" htmlFor="fy">
                <Select id="fy" value={form.fiscalYearStart} onChange={(e) => setForm((f) => ({ ...f, fiscalYearStart: e.target.value }))}>
                  {MONTHS.map((m, i) => <option key={m} value={String(i + 1)}>{m}</option>)}
                </Select>
              </Field>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="Tax ID" htmlFor="taxId">
                <Input id="taxId" value={form.taxId} onChange={(e) => setForm((f) => ({ ...f, taxId: e.target.value }))} placeholder="GST / VAT / EIN" />
              </Field>
              <Field label="Phone" htmlFor="phone">
                <Input id="phone" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} />
              </Field>
              <Field label="Website" htmlFor="website">
                <Input id="website" value={form.website} onChange={(e) => setForm((f) => ({ ...f, website: e.target.value }))} placeholder="https://" />
              </Field>
            </div>
            <Field label="Address" htmlFor="address">
              <Input id="address" value={form.address} onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))} />
            </Field>
            <div className="flex justify-end">
              <Button type="submit">Save changes</Button>
            </div>
          </form>
        </Card>

        {/* Categories */}
        <Card>
          <CardHeader>
            <div>
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4 text-primary" />
                <CardTitle>Categories</CardTitle>
              </div>
              <CardDescription>Classify revenue and expenses for cleaner reports.</CardDescription>
            </div>
          </CardHeader>

          <div className="flex flex-col gap-3 rounded-xl bg-muted/50 p-4 sm:flex-row sm:items-end">
            <Field label="Name" className="flex-1">
              <Input value={newCat.name} onChange={(e) => setNewCat((c) => ({ ...c, name: e.target.value }))} placeholder="e.g. Advertising" />
            </Field>
            <Field label="Type" className="sm:w-40">
              <Select value={newCat.kind} onChange={(e) => setNewCat((c) => ({ ...c, kind: e.target.value as CategoryKind }))}>
                <option value="EXPENSE">Expense</option>
                <option value="INCOME">Income</option>
              </Select>
            </Field>
            <Field label="Color" className="sm:w-auto">
              <div className="flex gap-1.5">
                {CATEGORY_COLORS.slice(0, 6).map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setNewCat((n) => ({ ...n, color: c }))}
                    className={`h-8 w-8 rounded-lg transition-transform ${newCat.color === c ? "ring-2 ring-offset-2 ring-offset-background scale-110" : ""}`}
                    style={{ backgroundColor: c, ...(newCat.color === c ? { boxShadow: `0 0 0 2px ${c}` } : {}) }}
                    aria-label={`Color ${c}`}
                  />
                ))}
              </div>
            </Field>
            <Button type="button" onClick={handleAddCategory}>
              <Plus className="h-4 w-4" /> Add
            </Button>
          </div>

          <div className="mt-5 grid gap-6 sm:grid-cols-2">
            {[
              { title: "Income categories", list: income, tone: "success" as const },
              { title: "Expense categories", list: expense, tone: "danger" as const },
            ].map((group) => (
              <div key={group.title}>
                <p className="mb-2 text-sm font-medium text-muted-foreground">{group.title}</p>
                <div className="flex flex-wrap gap-2">
                  {group.list.length === 0 ? (
                    <p className="text-sm text-muted-foreground">None yet.</p>
                  ) : (
                    group.list.map((c) => (
                      <span key={c.id} className="group inline-flex items-center gap-1.5 rounded-full bg-muted py-1 pl-2.5 pr-1.5 text-sm">
                        <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: c.color }} />
                        {c.name}
                        <button
                          onClick={() => deleteCategory(c.id)}
                          className="rounded-full p-0.5 text-muted-foreground hover:bg-danger/15 hover:text-danger"
                          aria-label={`Delete ${c.name}`}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </span>
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Preferences */}
        <Card>
          <CardHeader>
            <CardTitle>Preferences</CardTitle>
          </CardHeader>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Email notifications</p>
                <p className="text-sm text-muted-foreground">Receive alerts for important financial events.</p>
              </div>
              <Switch checked={settings.emailNotifications} onCheckedChange={(v) => updateSettings({ emailNotifications: v })} label="Email notifications" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Low-cash alert</p>
                <p className="text-sm text-muted-foreground">Warn me when cash drops below a threshold.</p>
              </div>
              <Switch checked={settings.lowCashAlert} onCheckedChange={(v) => updateSettings({ lowCashAlert: v })} label="Low cash alert" />
            </div>
            {settings.lowCashAlert && (
              <Field label={`Low-cash threshold (${company?.currency ?? "INR"})`} className="sm:w-64">
                <Input
                  type="number"
                  value={settings.lowCashThreshold}
                  onChange={(e) => updateSettings({ lowCashThreshold: Number(e.target.value) })}
                />
              </Field>
            )}
          </div>
        </Card>

        {/* Danger zone */}
        <Card className="border-danger/30">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-danger" />
              <CardTitle>Danger zone</CardTitle>
            </div>
          </CardHeader>
          <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <p className="text-sm font-medium">Reset all data</p>
              <p className="text-sm text-muted-foreground">
                Permanently remove all finances, categories and settings. This
                cannot be undone.
              </p>
            </div>
            <Button variant="danger" onClick={() => setConfirmReset(true)}>
              Reset workspace
            </Button>
          </div>
        </Card>
      </div>

      <ConfirmDialog
        open={confirmReset}
        onClose={() => setConfirmReset(false)}
        onConfirm={() => {
          resetAll();
          toast({ tone: "success", title: "Workspace reset" });
        }}
        title="Reset your entire workspace?"
        description="All companies, transactions, invoices and settings will be permanently deleted."
        confirmLabel="Yes, reset everything"
      />
    </div>
  );
}
