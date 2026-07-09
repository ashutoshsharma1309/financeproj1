"use client";

import {
  Bell,
  CheckCheck,
  Trash2,
  Info,
  CheckCircle2,
  AlertTriangle,
  XCircle,
} from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { useFinanceStore } from "@/lib/store";
import { cn, formatDate } from "@/lib/utils";
import type { NotificationType } from "@/lib/types";

const icons: Record<NotificationType, typeof Info> = {
  INFO: Info,
  SUCCESS: CheckCircle2,
  WARNING: AlertTriangle,
  DANGER: XCircle,
};
const tones: Record<NotificationType, string> = {
  INFO: "bg-primary/12 text-primary",
  SUCCESS: "bg-success/15 text-success",
  WARNING: "bg-warning/18 text-warning",
  DANGER: "bg-danger/15 text-danger",
};

export default function NotificationsPage() {
  const notifications = useFinanceStore((s) => s.notifications);
  const markRead = useFinanceStore((s) => s.markNotificationRead);
  const markAllRead = useFinanceStore((s) => s.markAllNotificationsRead);
  const clear = useFinanceStore((s) => s.clearNotifications);

  const empty = notifications.length === 0;

  return (
    <div>
      <PageHeader
        title="Notifications"
        description="Alerts and updates derived from your financial data."
        action={
          notifications.length > 0 ? (
            <div className="flex gap-3">
              <Button variant="outline" onClick={markAllRead}>
                <CheckCheck className="h-4 w-4" /> Mark all read
              </Button>
              <Button variant="ghost" onClick={clear}>
                <Trash2 className="h-4 w-4" /> Clear
              </Button>
            </div>
          ) : null
        }
      />

      {empty ? (
        <EmptyState
          icon={Bell}
          title="You're all caught up"
          description="Notifications about overdue invoices, low cash and important changes will appear here as they happen."
        />
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => {
            const Icon = icons[n.type];
            return (
              <Card
                key={n.id}
                className={cn(
                  "flex items-start gap-4 p-4 transition-colors",
                  !n.read && "bg-primary/[0.04]",
                )}
              >
                <span className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl", tones[n.type])}>
                  <Icon className="h-5 w-5" />
                </span>
                <div className="flex-1">
                  <p className="font-medium">{n.title}</p>
                  <p className="mt-0.5 text-sm text-muted-foreground">{n.body}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{formatDate(n.createdAt)}</p>
                </div>
                {!n.read && (
                  <button
                    onClick={() => markRead(n.id)}
                    className="text-xs font-medium text-primary hover:underline"
                  >
                    Mark read
                  </button>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
