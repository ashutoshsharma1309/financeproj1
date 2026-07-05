"use client";

import * as React from "react";
import { ScrollText, Download, Plus, Pencil, Trash2, Search } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs } from "@/components/ui/misc";
import { EmptyState } from "@/components/ui/empty-state";
import { useFinanceStore } from "@/lib/store";
import { exportToCSV } from "@/lib/export";
import { formatDate } from "@/lib/utils";

const actionMeta: Record<string, { tone: "success" | "primary" | "danger"; icon: typeof Plus }> = {
  create: { tone: "success", icon: Plus },
  update: { tone: "primary", icon: Pencil },
  delete: { tone: "danger", icon: Trash2 },
};

export default function AuditLogsPage() {
  const logs = useFinanceStore((s) => s.auditLogs);
  const [filter, setFilter] = React.useState("ALL");
  const [query, setQuery] = React.useState("");

  const filtered = logs
    .filter((l) => (filter === "ALL" ? true : l.action === filter.toLowerCase()))
    .filter((l) =>
      query
        ? `${l.entity} ${l.detail}`.toLowerCase().includes(query.toLowerCase())
        : true,
    );

  function handleExport() {
    exportToCSV(
      "audit-logs",
      [
        { key: "action", label: "Action" },
        { key: "entity", label: "Entity" },
        { key: "detail", label: "Detail" },
        { key: "actor", label: "Actor" },
        { key: "date", label: "Date" },
      ],
      logs.map((l) => ({
        action: l.action,
        entity: l.entity,
        detail: l.detail,
        actor: l.actor,
        date: new Date(l.createdAt).toLocaleString(),
      })),
    );
  }

  return (
    <div>
      <PageHeader
        title="Audit Logs"
        description="A record of every create, update and delete across your workspace."
        action={
          logs.length > 0 ? (
            <Button variant="outline" onClick={handleExport}>
              <Download className="h-4 w-4" /> Export
            </Button>
          ) : null
        }
      />

      {logs.length === 0 ? (
        <EmptyState
          icon={ScrollText}
          title="No activity logged yet"
          description="As you add, edit and remove financial records, a full audit trail will build here automatically."
        />
      ) : (
        <div className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Tabs
              tabs={[
                { value: "ALL", label: "All" },
                { value: "CREATE", label: "Created" },
                { value: "UPDATE", label: "Updated" },
                { value: "DELETE", label: "Deleted" },
              ]}
              value={filter}
              onValueChange={setFilter}
            />
            <div className="relative sm:w-64">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search logs…" className="pl-9" />
            </div>
          </div>

          <Card className="p-0">
            {filtered.length === 0 ? (
              <p className="py-10 text-center text-sm text-muted-foreground">No logs match your filter.</p>
            ) : (
              <ul className="divide-y divide-border">
                {filtered.map((l) => {
                  const meta = actionMeta[l.action] ?? actionMeta.update;
                  const Icon = meta.icon;
                  return (
                    <li key={l.id} className="flex items-center gap-4 px-5 py-3.5">
                      <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                        meta.tone === "success" ? "bg-success/15 text-success" :
                        meta.tone === "danger" ? "bg-danger/15 text-danger" :
                        "bg-primary/12 text-primary"
                      }`}>
                        <Icon className="h-4 w-4" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm">
                          <span className="font-medium capitalize">{l.action}d</span>{" "}
                          <Badge tone="neutral" className="mx-0.5">{l.entity}</Badge>
                          <span className="text-muted-foreground"> — {l.detail}</span>
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">{formatDate(l.createdAt)}</p>
                        <p className="text-xs text-muted-foreground">{l.actor}</p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}
