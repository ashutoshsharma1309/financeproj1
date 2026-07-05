import { z } from "zod";

// ── Auth ─────────────────────────────────────────────────────

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const signupSchema = z
  .object({
    name: z.string().min(2, "Name is too short"),
    email: z.string().email("Enter a valid email address"),
    password: z.string().min(8, "Use at least 8 characters"),
    confirm: z.string(),
  })
  .refine((d) => d.password === d.confirm, {
    message: "Passwords do not match",
    path: ["confirm"],
  });

export const forgotSchema = z.object({
  email: z.string().email("Enter a valid email address"),
});

// ── Finance ──────────────────────────────────────────────────

const amount = z
  .number({ invalid_type_error: "Enter an amount" })
  .positive("Amount must be greater than zero");

export const companySchema = z.object({
  name: z.string().min(2, "Company name is required"),
  legalName: z.string().optional(),
  industry: z.string().optional(),
  currency: z.string().min(3),
  taxId: z.string().optional(),
  fiscalYearStart: z.number().min(1).max(12),
  address: z.string().optional(),
  phone: z.string().optional(),
  website: z.string().optional(),
});

export const transactionSchema = z.object({
  type: z.enum(["INCOME", "EXPENSE"]),
  amount,
  description: z.string().min(1, "Description is required"),
  date: z.string().min(1, "Date is required"),
  categoryId: z.string().optional(),
  accountId: z.string().optional(),
});

export const revenueSchema = z.object({
  source: z.string().min(1, "Source is required"),
  amount,
  date: z.string().min(1, "Date is required"),
  categoryId: z.string().optional(),
  notes: z.string().optional(),
});

export const expenseSchema = z.object({
  vendor: z.string().min(1, "Vendor is required"),
  amount,
  date: z.string().min(1, "Date is required"),
  categoryId: z.string().optional(),
  notes: z.string().optional(),
});

export const accountSchema = z.object({
  name: z.string().min(1, "Account name is required"),
  kind: z.enum(["CASH", "BANK", "CREDIT", "ASSET", "LIABILITY"]),
  balance: z.number(),
});

export const categorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  kind: z.enum(["INCOME", "EXPENSE"]),
  color: z.string(),
});

export const invoiceItemSchema = z.object({
  description: z.string().min(1, "Required"),
  quantity: z.number().positive("Qty > 0"),
  unitPrice: z.number().nonnegative("Price ≥ 0"),
});

export const invoiceSchema = z.object({
  number: z.string().min(1, "Invoice number is required"),
  clientName: z.string().min(1, "Client name is required"),
  clientEmail: z.string().email("Invalid email").optional().or(z.literal("")),
  issueDate: z.string().min(1, "Issue date is required"),
  dueDate: z.string().min(1, "Due date is required"),
  status: z.enum(["DRAFT", "SENT", "PAID", "OVERDUE", "CANCELLED"]),
  taxRate: z.number().min(0).max(100),
  notes: z.string().optional(),
  items: z.array(invoiceItemSchema).min(1, "Add at least one line item"),
});

export const forecastSchema = z.object({
  name: z.string().min(1, "Name is required"),
  horizon: z.number().min(1).max(36),
  revenueGrowth: z.number().min(-100).max(200),
  expenseGrowth: z.number().min(-100).max(200),
  startingCash: z.number(),
});

export const teamMemberSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email required"),
  role: z.enum(["OWNER", "ACCOUNTANT", "EMPLOYEE"]),
  status: z.enum(["ACTIVE", "INVITED"]),
});

/** Flatten a ZodError into a { field: message } map for form UIs. */
export function fieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".");
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}
