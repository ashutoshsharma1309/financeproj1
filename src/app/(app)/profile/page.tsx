"use client";

import * as React from "react";
import { User, Mail, Shield, Calendar } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input, Field } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { useAuthStore } from "@/lib/auth";
import { ROLE_LABELS, ROLE_DESCRIPTIONS } from "@/lib/security";
import { formatDate } from "@/lib/utils";

export default function ProfilePage() {
  const { toast } = useToast();
  const user = useAuthStore((s) => s.user);
  const updateProfile = useAuthStore((s) => s.updateProfile);
  const [name, setName] = React.useState(user?.name ?? "");

  const initials = (user?.name ?? "U")
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  function save(e: React.FormEvent) {
    e.preventDefault();
    if (name.trim().length < 2) {
      toast({ tone: "error", title: "Name is too short" });
      return;
    }
    updateProfile({ name: name.trim() });
    toast({ tone: "success", title: "Profile updated" });
  }

  if (!user) return null;

  return (
    <div>
      <PageHeader title="Profile" description="Manage your personal account details." />

      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <Card className="flex flex-col items-center text-center">
          <span className="flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent text-3xl font-bold text-primary-foreground shadow-soft">
            {initials}
          </span>
          <h3 className="mt-4 text-lg font-semibold">{user.name}</h3>
          <p className="text-sm text-muted-foreground">{user.email}</p>
          <Badge tone="primary" className="mt-3">{ROLE_LABELS[user.role]}</Badge>
          <p className="mt-3 text-xs text-muted-foreground">{ROLE_DESCRIPTIONS[user.role]}</p>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Personal details</CardTitle>
            </CardHeader>
            <form onSubmit={save} className="space-y-4">
              <Field label="Full name" htmlFor="name">
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
              </Field>
              <Field label="Email" htmlFor="email" hint="Contact support to change your email.">
                <Input id="email" value={user.email} disabled />
              </Field>
              <div className="flex justify-end">
                <Button type="submit">Save changes</Button>
              </div>
            </form>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Account information</CardTitle>
            </CardHeader>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { icon: User, label: "Name", value: user.name },
                { icon: Mail, label: "Email", value: user.email },
                { icon: Shield, label: "Role", value: ROLE_LABELS[user.role] },
                { icon: Calendar, label: "Member since", value: formatDate(user.createdAt) },
              ].map((row) => (
                <div key={row.label} className="flex items-center gap-3 rounded-xl bg-muted/50 p-3.5">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface text-primary">
                    <row.icon className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-xs text-muted-foreground">{row.label}</p>
                    <p className="text-sm font-medium">{row.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
