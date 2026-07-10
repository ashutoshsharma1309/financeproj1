import { describe, it, expect, beforeEach } from "vitest";
import { useFinanceStore } from "./store";
import type { DerivedAlert } from "./notifications";

const reset = () => useFinanceStore.getState().resetAll();

const overdue: DerivedAlert = {
  key: "invoices-overdue",
  type: "DANGER",
  title: "1 overdue invoice",
  body: "Follow up.",
};
const runway: DerivedAlert = {
  key: "runway-low",
  type: "WARNING",
  title: "Runway below 6 months",
  body: "Watch cash.",
};

describe("finance store — notifications", () => {
  beforeEach(reset);

  it("ingestAlerts persists derived alerts with their condition key", () => {
    useFinanceStore.getState().ingestAlerts([overdue, runway]);
    const n = useFinanceStore.getState().notifications;
    expect(n).toHaveLength(2);
    expect(n.map((x) => x.key).sort()).toEqual(["invoices-overdue", "runway-low"]);
    expect(n.every((x) => x.read === false)).toBe(true);
  });

  it("de-duplicates by key across repeated ingests (no re-visit dupes)", () => {
    const s = useFinanceStore.getState();
    s.ingestAlerts([overdue]);
    s.ingestAlerts([overdue, runway]); // overdue already present
    const n = useFinanceStore.getState().notifications;
    expect(n).toHaveLength(2);
    expect(n.filter((x) => x.key === "invoices-overdue")).toHaveLength(1);
  });

  it("markAllNotificationsRead flips every entry to read", () => {
    const s = useFinanceStore.getState();
    s.ingestAlerts([overdue, runway]);
    s.markAllNotificationsRead();
    expect(useFinanceStore.getState().notifications.every((x) => x.read)).toBe(true);
  });

  it("clearNotifications empties the feed so a fresh cycle can re-notify", () => {
    const s = useFinanceStore.getState();
    s.ingestAlerts([overdue]);
    s.clearNotifications();
    expect(useFinanceStore.getState().notifications).toHaveLength(0);
    s.ingestAlerts([overdue]);
    expect(useFinanceStore.getState().notifications).toHaveLength(1);
  });
});
