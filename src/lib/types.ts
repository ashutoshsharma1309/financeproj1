// ─────────────────────────────────────────────────────────────
// Domain types — client-side mirror of the Prisma schema.
// All monetary values are plain numbers in the company currency.
// ─────────────────────────────────────────────────────────────

export type Role = "OWNER" | "ACCOUNTANT" | "EMPLOYEE";

export type CategoryKind = "INCOME" | "EXPENSE";
export type TransactionType = "INCOME" | "EXPENSE";
export type AccountKind = "CASH" | "BANK" | "CREDIT" | "ASSET" | "LIABILITY";

export type InvoiceStatus =
  | "DRAFT"
  | "SENT"
  | "PAID"
  | "OVERDUE"
  | "CANCELLED";

export type NotificationType = "INFO" | "SUCCESS" | "WARNING" | "DANGER";

export interface Company {
  name: string;
  legalName?: string;
  industry?: string;
  currency: string;
  taxId?: string;
  fiscalYearStart: number; // 1-12
  address?: string;
  phone?: string;
  website?: string;
}

export interface Category {
  id: string;
  name: string;
  kind: CategoryKind;
  color: string;
}

export interface Account {
  id: string;
  name: string;
  kind: AccountKind;
  balance: number;
}

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  description: string;
  date: string; // ISO
  categoryId?: string;
  accountId?: string;
  createdAt: string;
}

export interface Revenue {
  id: string;
  source: string;
  amount: number;
  date: string;
  notes?: string;
  categoryId?: string;
  createdAt: string;
}

export interface Expense {
  id: string;
  vendor: string;
  amount: number;
  date: string;
  notes?: string;
  categoryId?: string;
  createdAt: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface Invoice {
  id: string;
  number: string;
  clientName: string;
  clientEmail?: string;
  issueDate: string;
  dueDate: string;
  status: InvoiceStatus;
  taxRate: number;
  notes?: string;
  items: InvoiceItem[];
  createdAt: string;
}

export interface Forecast {
  id: string;
  name: string;
  horizon: number;
  revenueGrowth: number; // % per month
  expenseGrowth: number; // % per month
  startingCash: number;
  createdAt: string;
}

export interface AIMessage {
  role: "user" | "assistant";
  content: string;
  ts: number;
}

export interface AIChat {
  id: string;
  title: string;
  messages: AIMessage[];
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: "ACTIVE" | "INVITED";
  createdAt: string;
}

export interface AuditLog {
  id: string;
  action: string;
  entity: string;
  detail: string;
  actor: string;
  createdAt: string;
}

export interface Settings {
  emailNotifications: boolean;
  lowCashAlert: boolean;
  lowCashThreshold: number;
}
