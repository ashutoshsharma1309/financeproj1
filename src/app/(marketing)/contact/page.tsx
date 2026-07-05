"use client";

import * as React from "react";
import { Mail, MapPin, MessageSquare, Send } from "lucide-react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input, Textarea, Field } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/toast";
import { fieldErrors } from "@/lib/validators";
import { sanitize } from "@/lib/utils";

const contactSchema = z.object({
  name: z.string().min(2, "Please enter your name"),
  email: z.string().email("Enter a valid email"),
  subject: z.string().min(2, "Add a subject"),
  message: z.string().min(10, "Message should be at least 10 characters"),
});

export default function ContactPage() {
  const { toast } = useToast();
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [loading, setLoading] = React.useState(false);
  const [form, setForm] = React.useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  function update(key: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = contactSchema.safeParse({
      ...form,
      name: sanitize(form.name),
      subject: sanitize(form.subject),
      message: sanitize(form.message),
    });
    if (!parsed.success) {
      setErrors(fieldErrors(parsed.error));
      return;
    }
    setErrors({});
    setLoading(true);
    // Front-end submission. Wire to your inbox / CRM endpoint in production.
    setTimeout(() => {
      setLoading(false);
      setForm({ name: "", email: "", subject: "", message: "" });
      toast({
        tone: "success",
        title: "Message sent",
        description: "Thanks for reaching out — we'll get back to you soon.",
      });
    }, 700);
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-2xl text-center">
        <Badge tone="primary" className="mb-4">
          Contact
        </Badge>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Let&apos;s talk
        </h1>
        <p className="mt-5 text-lg text-muted-foreground">
          Questions, feedback or partnership ideas — we&apos;d love to hear from
          you.
        </p>
      </div>

      <div className="mt-14 grid gap-8 lg:grid-cols-[1fr_1.4fr]">
        <div className="space-y-4">
          {[
            { icon: Mail, title: "Email", value: "hello@aicfo.app" },
            { icon: MessageSquare, title: "Support", value: "support@aicfo.app" },
            { icon: MapPin, title: "Location", value: "Remote-first · Worldwide" },
          ].map((c) => (
            <div key={c.title} className="surface-card flex items-center gap-4 p-5">
              <span className="clay-sm flex h-11 w-11 items-center justify-center rounded-xl text-primary">
                <c.icon className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-semibold">{c.title}</p>
                <p className="text-sm text-muted-foreground">{c.value}</p>
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={onSubmit} className="surface-card space-y-4 p-6 sm:p-8" noValidate>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Name" htmlFor="name" error={errors.name}>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                placeholder="Jane Founder"
              />
            </Field>
            <Field label="Email" htmlFor="email" error={errors.email}>
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                placeholder="jane@company.com"
              />
            </Field>
          </div>
          <Field label="Subject" htmlFor="subject" error={errors.subject}>
            <Input
              id="subject"
              value={form.subject}
              onChange={(e) => update("subject", e.target.value)}
              placeholder="How can we help?"
            />
          </Field>
          <Field label="Message" htmlFor="message" error={errors.message}>
            <Textarea
              id="message"
              value={form.message}
              onChange={(e) => update("message", e.target.value)}
              placeholder="Tell us a bit more…"
              rows={5}
            />
          </Field>
          <Button type="submit" loading={loading} className="w-full sm:w-auto">
            <Send className="h-4 w-4" />
            Send message
          </Button>
        </form>
      </div>
    </div>
  );
}
