export const CURRENCIES = [
  { code: "INR", label: "Indian Rupee (₹)" },
  { code: "USD", label: "US Dollar ($)" },
  { code: "EUR", label: "Euro (€)" },
  { code: "GBP", label: "British Pound (£)" },
  { code: "AED", label: "UAE Dirham (د.إ)" },
  { code: "SGD", label: "Singapore Dollar (S$)" },
  { code: "AUD", label: "Australian Dollar (A$)" },
  { code: "CAD", label: "Canadian Dollar (C$)" },
];

export const INDUSTRIES = [
  "Software / SaaS",
  "E-commerce / Retail",
  "Consulting / Services",
  "Manufacturing",
  "Hospitality / F&B",
  "Healthcare",
  "Education",
  "Real Estate",
  "Media / Creative",
  "Other",
];

export const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const ACCOUNT_KINDS = [
  { value: "CASH", label: "Cash" },
  { value: "BANK", label: "Bank Account" },
  { value: "CREDIT", label: "Credit Card" },
  { value: "ASSET", label: "Asset" },
  { value: "LIABILITY", label: "Liability" },
] as const;

export const INVOICE_STATUSES = [
  { value: "DRAFT", label: "Draft" },
  { value: "SENT", label: "Sent" },
  { value: "PAID", label: "Paid" },
  { value: "OVERDUE", label: "Overdue" },
  { value: "CANCELLED", label: "Cancelled" },
] as const;

export const CATEGORY_COLORS = [
  "#6366f1",
  "#8b5cf6",
  "#ec4899",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#14b8a6",
  "#06b6d4",
  "#3b82f6",
  "#64748b",
];
