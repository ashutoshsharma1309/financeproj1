"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { uid } from "./utils";
import type {
  Account,
  AIChat,
  AuditLog,
  Category,
  Company,
  Expense,
  Forecast,
  Invoice,
  Notification,
  Revenue,
  Settings,
  TeamMember,
  Transaction,
} from "./types";

// Default categories seeded for a fresh company so entries can be classified
// immediately. These are *classification labels*, not financial data.
const DEFAULT_CATEGORIES: Omit<Category, "id">[] = [
  { name: "Sales", kind: "INCOME", color: "#22c55e" },
  { name: "Services", kind: "INCOME", color: "#14b8a6" },
  { name: "Other Income", kind: "INCOME", color: "#84cc16" },
  { name: "Payroll", kind: "EXPENSE", color: "#6366f1" },
  { name: "Rent", kind: "EXPENSE", color: "#a855f7" },
  { name: "Software", kind: "EXPENSE", color: "#ec4899" },
  { name: "Marketing", kind: "EXPENSE", color: "#f97316" },
  { name: "Utilities", kind: "EXPENSE", color: "#eab308" },
  { name: "Travel", kind: "EXPENSE", color: "#06b6d4" },
  { name: "Other Expense", kind: "EXPENSE", color: "#64748b" },
];

export interface FinanceState {
  onboarded: boolean;
  company: Company | null;
  categories: Category[];
  accounts: Account[];
  transactions: Transaction[];
  revenues: Revenue[];
  expenses: Expense[];
  invoices: Invoice[];
  forecasts: Forecast[];
  chats: AIChat[];
  notifications: Notification[];
  team: TeamMember[];
  auditLogs: AuditLog[];
  settings: Settings;

  // company / onboarding
  setCompany: (company: Company) => void;

  // categories
  addCategory: (c: Omit<Category, "id">) => void;
  deleteCategory: (id: string) => void;

  // accounts
  addAccount: (a: Omit<Account, "id">) => void;
  updateAccount: (id: string, a: Partial<Account>) => void;
  deleteAccount: (id: string) => void;

  // transactions
  addTransaction: (t: Omit<Transaction, "id" | "createdAt">) => void;
  updateTransaction: (id: string, t: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;

  // revenue
  addRevenue: (r: Omit<Revenue, "id" | "createdAt">) => void;
  updateRevenue: (id: string, r: Partial<Revenue>) => void;
  deleteRevenue: (id: string) => void;

  // expenses
  addExpense: (e: Omit<Expense, "id" | "createdAt">) => void;
  updateExpense: (id: string, e: Partial<Expense>) => void;
  deleteExpense: (id: string) => void;

  // invoices
  addInvoice: (i: Omit<Invoice, "id" | "createdAt">) => void;
  updateInvoice: (id: string, i: Partial<Invoice>) => void;
  deleteInvoice: (id: string) => void;

  // forecasts
  addForecast: (f: Omit<Forecast, "id" | "createdAt">) => void;
  deleteForecast: (id: string) => void;

  // ai chats
  createChat: (title: string) => string;
  addMessage: (chatId: string, role: "user" | "assistant", content: string) => void;
  deleteChat: (id: string) => void;

  // notifications
  pushNotification: (n: Omit<Notification, "id" | "createdAt" | "read">) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  clearNotifications: () => void;

  // team
  addTeamMember: (m: Omit<TeamMember, "id" | "createdAt">) => void;
  updateTeamMember: (id: string, m: Partial<TeamMember>) => void;
  removeTeamMember: (id: string) => void;

  // settings
  updateSettings: (s: Partial<Settings>) => void;

  // danger zone
  resetAll: () => void;
}

const initialState = {
  onboarded: false,
  company: null as Company | null,
  categories: [] as Category[],
  accounts: [] as Account[],
  transactions: [] as Transaction[],
  revenues: [] as Revenue[],
  expenses: [] as Expense[],
  invoices: [] as Invoice[],
  forecasts: [] as Forecast[],
  chats: [] as AIChat[],
  notifications: [] as Notification[],
  team: [] as TeamMember[],
  auditLogs: [] as AuditLog[],
  settings: {
    emailNotifications: true,
    lowCashAlert: true,
    lowCashThreshold: 0,
  } as Settings,
};

function logAction(
  logs: AuditLog[],
  action: string,
  entity: string,
  detail: string,
): AuditLog[] {
  const entry: AuditLog = {
    id: uid("log"),
    action,
    entity,
    detail,
    actor: "You",
    createdAt: new Date().toISOString(),
  };
  return [entry, ...logs].slice(0, 500);
}

export const useFinanceStore = create<FinanceState>()(
  persist(
    (set, get) => ({
      ...initialState,

      setCompany: (company) =>
        set((s) => {
          const seeded =
            s.categories.length === 0
              ? DEFAULT_CATEGORIES.map((c) => ({ ...c, id: uid("cat") }))
              : s.categories;
          return {
            company,
            onboarded: true,
            categories: seeded,
            auditLogs: logAction(
              s.auditLogs,
              s.company ? "update" : "create",
              "Company",
              `${company.name} profile ${s.company ? "updated" : "created"}`,
            ),
          };
        }),

      addCategory: (c) =>
        set((s) => ({
          categories: [...s.categories, { ...c, id: uid("cat") }],
          auditLogs: logAction(s.auditLogs, "create", "Category", c.name),
        })),
      deleteCategory: (id) =>
        set((s) => ({
          categories: s.categories.filter((c) => c.id !== id),
          auditLogs: logAction(s.auditLogs, "delete", "Category", id),
        })),

      addAccount: (a) =>
        set((s) => ({
          accounts: [...s.accounts, { ...a, id: uid("acc") }],
          auditLogs: logAction(s.auditLogs, "create", "Account", a.name),
        })),
      updateAccount: (id, a) =>
        set((s) => ({
          accounts: s.accounts.map((x) => (x.id === id ? { ...x, ...a } : x)),
          auditLogs: logAction(s.auditLogs, "update", "Account", id),
        })),
      deleteAccount: (id) =>
        set((s) => ({
          accounts: s.accounts.filter((x) => x.id !== id),
          auditLogs: logAction(s.auditLogs, "delete", "Account", id),
        })),

      addTransaction: (t) =>
        set((s) => ({
          transactions: [
            { ...t, id: uid("txn"), createdAt: new Date().toISOString() },
            ...s.transactions,
          ],
          auditLogs: logAction(
            s.auditLogs,
            "create",
            "Transaction",
            `${t.type} · ${t.description}`,
          ),
        })),
      updateTransaction: (id, t) =>
        set((s) => ({
          transactions: s.transactions.map((x) =>
            x.id === id ? { ...x, ...t } : x,
          ),
          auditLogs: logAction(s.auditLogs, "update", "Transaction", id),
        })),
      deleteTransaction: (id) =>
        set((s) => ({
          transactions: s.transactions.filter((x) => x.id !== id),
          auditLogs: logAction(s.auditLogs, "delete", "Transaction", id),
        })),

      addRevenue: (r) =>
        set((s) => ({
          revenues: [
            { ...r, id: uid("rev"), createdAt: new Date().toISOString() },
            ...s.revenues,
          ],
          auditLogs: logAction(s.auditLogs, "create", "Revenue", r.source),
        })),
      updateRevenue: (id, r) =>
        set((s) => ({
          revenues: s.revenues.map((x) => (x.id === id ? { ...x, ...r } : x)),
          auditLogs: logAction(s.auditLogs, "update", "Revenue", id),
        })),
      deleteRevenue: (id) =>
        set((s) => ({
          revenues: s.revenues.filter((x) => x.id !== id),
          auditLogs: logAction(s.auditLogs, "delete", "Revenue", id),
        })),

      addExpense: (e) =>
        set((s) => ({
          expenses: [
            { ...e, id: uid("exp"), createdAt: new Date().toISOString() },
            ...s.expenses,
          ],
          auditLogs: logAction(s.auditLogs, "create", "Expense", e.vendor),
        })),
      updateExpense: (id, e) =>
        set((s) => ({
          expenses: s.expenses.map((x) => (x.id === id ? { ...x, ...e } : x)),
          auditLogs: logAction(s.auditLogs, "update", "Expense", id),
        })),
      deleteExpense: (id) =>
        set((s) => ({
          expenses: s.expenses.filter((x) => x.id !== id),
          auditLogs: logAction(s.auditLogs, "delete", "Expense", id),
        })),

      addInvoice: (i) =>
        set((s) => ({
          invoices: [
            { ...i, id: uid("inv"), createdAt: new Date().toISOString() },
            ...s.invoices,
          ],
          auditLogs: logAction(
            s.auditLogs,
            "create",
            "Invoice",
            `${i.number} · ${i.clientName}`,
          ),
        })),
      updateInvoice: (id, i) =>
        set((s) => ({
          invoices: s.invoices.map((x) => (x.id === id ? { ...x, ...i } : x)),
          auditLogs: logAction(s.auditLogs, "update", "Invoice", id),
        })),
      deleteInvoice: (id) =>
        set((s) => ({
          invoices: s.invoices.filter((x) => x.id !== id),
          auditLogs: logAction(s.auditLogs, "delete", "Invoice", id),
        })),

      addForecast: (f) =>
        set((s) => ({
          forecasts: [
            { ...f, id: uid("fc"), createdAt: new Date().toISOString() },
            ...s.forecasts,
          ],
          auditLogs: logAction(s.auditLogs, "create", "Forecast", f.name),
        })),
      deleteForecast: (id) =>
        set((s) => ({
          forecasts: s.forecasts.filter((x) => x.id !== id),
          auditLogs: logAction(s.auditLogs, "delete", "Forecast", id),
        })),

      createChat: (title) => {
        const id = uid("chat");
        set((s) => ({
          chats: [
            {
              id,
              title,
              messages: [],
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
            ...s.chats,
          ],
        }));
        return id;
      },
      addMessage: (chatId, role, content) =>
        set((s) => ({
          chats: s.chats.map((c) =>
            c.id === chatId
              ? {
                  ...c,
                  messages: [...c.messages, { role, content, ts: Date.now() }],
                  updatedAt: new Date().toISOString(),
                }
              : c,
          ),
        })),
      deleteChat: (id) =>
        set((s) => ({ chats: s.chats.filter((c) => c.id !== id) })),

      pushNotification: (n) =>
        set((s) => ({
          notifications: [
            {
              ...n,
              id: uid("ntf"),
              read: false,
              createdAt: new Date().toISOString(),
            },
            ...s.notifications,
          ].slice(0, 100),
        })),
      markNotificationRead: (id) =>
        set((s) => ({
          notifications: s.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n,
          ),
        })),
      markAllNotificationsRead: () =>
        set((s) => ({
          notifications: s.notifications.map((n) => ({ ...n, read: true })),
        })),
      clearNotifications: () => set({ notifications: [] }),

      addTeamMember: (m) =>
        set((s) => ({
          team: [
            { ...m, id: uid("mem"), createdAt: new Date().toISOString() },
            ...s.team,
          ],
          auditLogs: logAction(s.auditLogs, "create", "TeamMember", m.email),
        })),
      updateTeamMember: (id, m) =>
        set((s) => ({
          team: s.team.map((x) => (x.id === id ? { ...x, ...m } : x)),
          auditLogs: logAction(s.auditLogs, "update", "TeamMember", id),
        })),
      removeTeamMember: (id) =>
        set((s) => ({
          team: s.team.filter((x) => x.id !== id),
          auditLogs: logAction(s.auditLogs, "delete", "TeamMember", id),
        })),

      updateSettings: (s2) =>
        set((s) => ({ settings: { ...s.settings, ...s2 } })),

      resetAll: () =>
        set(() => ({
          ...initialState,
          settings: { ...initialState.settings },
        })),
    }),
    {
      name: "aicfo-data",
      version: 1,
    },
  ),
);
