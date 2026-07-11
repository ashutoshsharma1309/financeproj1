"use client";

import * as React from "react";
import { Users, Plus, Trash2, Mail, Shield } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { Dialog } from "@/components/ui/dialog";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Input, Select, Field } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { useFinanceStore } from "@/lib/store";
import { useAuthStore } from "@/lib/auth";
import { teamMemberSchema, fieldErrors } from "@/lib/validators";
import { ROLE_LABELS, ROLE_DESCRIPTIONS } from "@/lib/security";
import { formatDate } from "@/lib/utils";
import type { Role } from "@/lib/types";

export default function TeamPage() {
  const { toast } = useToast();
  const currentUser = useAuthStore((s) => s.user);
  const team = useFinanceStore((s) => s.team);
  const addMember = useFinanceStore((s) => s.addTeamMember);
  const updateMember = useFinanceStore((s) => s.updateTeamMember);
  const removeMember = useFinanceStore((s) => s.removeTeamMember);

  const [open, setOpen] = React.useState(false);
  const [toDelete, setToDelete] = React.useState<string | null>(null);
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [form, setForm] = React.useState({ name: "", email: "", role: "EMPLOYEE" as Role });

  // Include the signed-in owner as the anchor member of the workspace.
  const owner = currentUser
    ? {
        id: "__owner",
        name: currentUser.name,
        email: currentUser.email,
        role: currentUser.role,
        status: "ACTIVE" as const,
        createdAt: currentUser.createdAt,
        isYou: true,
      }
    : null;

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload = {
      name: form.name.trim(),
      email: form.email.trim(),
      role: form.role,
      status: "INVITED" as const,
    };
    const parsed = teamMemberSchema.safeParse(payload);
    if (!parsed.success) {
      setErrors(fieldErrors(parsed.error));
      return;
    }
    addMember(parsed.data);
    toast({ tone: "success", title: "Invitation sent", description: `${form.email} was invited as ${ROLE_LABELS[form.role]}.` });
    setForm({ name: "", email: "", role: "EMPLOYEE" });
    setErrors({});
    setOpen(false);
  }

  const allMembers = [owner, ...team].filter(Boolean) as Array<{
    id: string;
    name: string;
    email: string;
    role: Role;
    status: "ACTIVE" | "INVITED";
    createdAt: string;
    isYou?: boolean;
  }>;

  return (
    <div>
      <PageHeader
        title="Team Members"
        description="Invite teammates and control what each role can access."
        action={
          <Button onClick={() => setOpen(true)}>
            <Plus className="h-4 w-4" /> Invite member
          </Button>
        }
      />

      <div className="mb-6 grid gap-3 sm:grid-cols-3">
        {(["OWNER", "ACCOUNTANT", "EMPLOYEE"] as Role[]).map((r) => (
          <Card key={r} className="p-4">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              <p className="font-semibold">{ROLE_LABELS[r]}</p>
            </div>
            <p className="mt-1.5 text-sm text-muted-foreground">{ROLE_DESCRIPTIONS[r]}</p>
          </Card>
        ))}
      </div>

      {allMembers.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No team members yet"
          description="Invite your accountant or teammates to collaborate on your finances."
          action={<Button onClick={() => setOpen(true)}><Plus className="h-4 w-4" /> Invite your first member</Button>}
        />
      ) : (
        <Card className="overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <th scope="col" className="px-5 py-3 font-semibold">Member</th>
                  <th scope="col" className="px-5 py-3 font-semibold">Role</th>
                  <th scope="col" className="px-5 py-3 font-semibold">Status</th>
                  <th scope="col" className="px-5 py-3 font-semibold">Added</th>
                  <th scope="col" className="px-5 py-3" />
                </tr>
              </thead>
              <tbody>
                {allMembers.map((m) => {
                  const initials = m.name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();
                  return (
                    <tr key={m.id} className="border-b border-border last:border-0">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent text-xs font-semibold text-primary-foreground">
                            {initials}
                          </span>
                          <div>
                            <p className="font-medium">
                              {m.name} {m.isYou && <span className="text-xs text-muted-foreground">(you)</span>}
                            </p>
                            <p className="text-xs text-muted-foreground">{m.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        {m.isYou ? (
                          <Badge tone="primary">{ROLE_LABELS[m.role]}</Badge>
                        ) : (
                          <Select
                            value={m.role}
                            onChange={(e) => updateMember(m.id, { role: e.target.value as Role })}
                            className="h-9 w-full sm:w-40"
                            aria-label="Change role"
                          >
                            {(["OWNER", "ACCOUNTANT", "EMPLOYEE"] as Role[]).map((r) => (
                              <option key={r} value={r}>{ROLE_LABELS[r]}</option>
                            ))}
                          </Select>
                        )}
                      </td>
                      <td className="px-5 py-3.5">
                        <Badge tone={m.status === "ACTIVE" ? "success" : "warning"}>{m.status}</Badge>
                      </td>
                      <td className="px-5 py-3.5 text-muted-foreground">{formatDate(m.createdAt)}</td>
                      <td className="px-5 py-3.5 text-right">
                        {!m.isYou && (
                          <button
                            onClick={() => setToDelete(m.id)}
                            className="rounded-lg p-1.5 text-muted-foreground hover:bg-danger/10 hover:text-danger"
                            aria-label="Remove member"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title="Invite team member"
        description="They'll be added with the role you choose. Configure SMTP to send real invite emails."
        footer={
          <>
            <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" form="team-form">
              <Mail className="h-4 w-4" /> Send invite
            </Button>
          </>
        }
      >
        <form id="team-form" onSubmit={onSubmit} className="space-y-4" noValidate>
          <Field label="Name" htmlFor="name" error={errors.name}>
            <Input id="name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="Full name" />
          </Field>
          <Field label="Email" htmlFor="email" error={errors.email}>
            <Input id="email" type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} placeholder="teammate@company.com" />
          </Field>
          <Field label="Role" htmlFor="role">
            <Select id="role" value={form.role} onChange={(e) => setForm((f) => ({ ...f, role: e.target.value as Role }))}>
              {(["OWNER", "ACCOUNTANT", "EMPLOYEE"] as Role[]).map((r) => (
                <option key={r} value={r}>{ROLE_LABELS[r]} — {ROLE_DESCRIPTIONS[r]}</option>
              ))}
            </Select>
          </Field>
        </form>
      </Dialog>

      <ConfirmDialog
        open={!!toDelete}
        onClose={() => setToDelete(null)}
        onConfirm={() => {
          if (toDelete) {
            removeMember(toDelete);
            toast({ tone: "success", title: "Member removed" });
          }
        }}
        title="Remove this member?"
        description="They will lose access to this workspace."
        confirmLabel="Remove"
      />
    </div>
  );
}
