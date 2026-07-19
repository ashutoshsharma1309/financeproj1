"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, PasswordInput, Field } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { useAuthStore } from "@/lib/auth";
import { signupSchema, fieldErrors } from "@/lib/validators";
import { cn } from "@/lib/utils";

function strength(pw: string) {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return score; // 0..4
}

export default function SignupPage() {
  const router = useRouter();
  const { toast } = useToast();
  const signup = useAuthStore((s) => s.signup);
  const [form, setForm] = React.useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [loading, setLoading] = React.useState(false);

  const pwScore = strength(form.password);
  const scoreLabel = ["Too weak", "Weak", "Fair", "Good", "Strong"][pwScore];
  const scoreTone = ["bg-danger", "bg-danger", "bg-warning", "bg-primary", "bg-success"][pwScore];

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = signupSchema.safeParse(form);
    if (!parsed.success) {
      setErrors(fieldErrors(parsed.error));
      return;
    }
    setErrors({});
    setLoading(true);
    const res = signup({
      name: parsed.data.name,
      email: parsed.data.email,
      password: parsed.data.password,
    });
    if (!res.ok) {
      setLoading(false);
      setErrors({ email: res.error });
      toast({ tone: "error", title: "Sign up failed", description: res.error });
      return;
    }
    toast({
      tone: "success",
      title: "Account created",
      description: "Let's set up your company.",
    });
    router.push("/dashboard");
  }

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Create your account</h1>
      <p className="mt-1.5 text-sm text-muted-foreground">
        Start managing your finances in minutes.
      </p>

      <form onSubmit={onSubmit} className="mt-8 space-y-4" noValidate>
        <Field label="Full name" htmlFor="name" error={errors.name}>
          <Input
            id="name"
            autoComplete="name"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            placeholder="Jane Founder"
          />
        </Field>
        <Field label="Work email" htmlFor="email" error={errors.email}>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            placeholder="you@company.com"
          />
        </Field>
        <Field label="Password" htmlFor="password" error={errors.password}>
          <PasswordInput
            id="password"
            autoComplete="new-password"
            value={form.password}
            onChange={(e) =>
              setForm((f) => ({ ...f, password: e.target.value }))
            }
            placeholder="At least 8 characters"
          />
          {form.password && (
            <div className="mt-2 flex items-center gap-2">
              <div className="flex flex-1 gap-1">
                {[0, 1, 2, 3].map((i) => (
                  <span
                    key={i}
                    className={cn(
                      "h-1.5 flex-1 rounded-full transition-colors",
                      i < pwScore ? scoreTone : "bg-muted",
                    )}
                  />
                ))}
              </div>
              <span className="text-xs text-muted-foreground">{scoreLabel}</span>
            </div>
          )}
        </Field>
        <Field label="Confirm password" htmlFor="confirm" error={errors.confirm}>
          <PasswordInput
            id="confirm"
            autoComplete="new-password"
            value={form.confirm}
            onChange={(e) => setForm((f) => ({ ...f, confirm: e.target.value }))}
            placeholder="Re-enter your password"
          />
        </Field>

        <p className="flex items-start gap-2 text-xs text-muted-foreground">
          <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success" />
          The first account created becomes the company Owner with full access.
        </p>

        <Button type="submit" className="w-full" loading={loading}>
          Create account
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-primary hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
