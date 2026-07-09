"use client";

import * as React from "react";
import { useFinanceStore } from "@/lib/store";
import { useFinanceData } from "@/hooks/use-finance-data";
import { deriveAlerts } from "@/lib/notifications";

/**
 * Watches the user's real financial data and persists derived alerts (overdue
 * invoices, low runway) into the notification feed, de-duplicated by condition.
 * Renders nothing. Mounted once inside the authenticated shell so the bell count
 * stays accurate on every page, not just the notifications page.
 */
export function NotificationSync() {
  const data = useFinanceData();
  const settings = useFinanceStore((s) => s.settings);
  const ingestAlerts = useFinanceStore((s) => s.ingestAlerts);

  const alerts = React.useMemo(
    () => deriveAlerts(data, settings),
    [data, settings],
  );

  React.useEffect(() => {
    if (alerts.length > 0) ingestAlerts(alerts);
  }, [alerts, ingestAlerts]);

  return null;
}
