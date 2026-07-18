// Curated in-app help knowledge base. Answers product / "how do I…" questions
// instantly and accurately — no LLM, no hallucination. Financial questions are
// routed to the grounded AI chain instead (see the chat widget).

export interface HelpTopic {
  keywords: string[];
  answer: string; // lightweight markdown (**bold**, "- " bullets)
  href?: string;
  cta?: string;
}

const TOPICS: HelpTopic[] = [
  {
    keywords: ["add revenue", "add income", "record revenue", "log income", "new revenue", "sales entry"],
    answer:
      "To record income, open **Revenue** and click **Add revenue**. Enter the source, amount, date and (optionally) a category. It flows straight into your totals, charts and cash flow.",
    href: "/revenue",
    cta: "Go to Revenue",
  },
  {
    keywords: ["add expense", "record expense", "log spending", "new expense", "vendor", "cost entry"],
    answer:
      "Open **Expenses** and click **Add expense**. Enter the vendor, amount, date and category. Every total and breakdown updates from what you enter.",
    href: "/expenses",
    cta: "Go to Expenses",
  },
  {
    keywords: ["transaction", "ledger", "income or expense"],
    answer:
      "**Transactions** is a unified ledger for both income and expense entries. Click **Add transaction**, pick the type, and fill in the details.",
    href: "/transactions",
    cta: "Go to Transactions",
  },
  {
    keywords: ["invoice", "bill", "client", "receivable", "overdue", "get paid"],
    answer:
      "Open **Invoices** and click **New invoice**. Add line items, a tax rate, and a due date — the total is calculated for you. You can export any invoice to PDF, and overdue invoices surface automatically.",
    href: "/invoices",
    cta: "Go to Invoices",
  },
  {
    keywords: ["cash flow", "runway", "burn", "how long", "months left", "bank balance", "account"],
    answer:
      "**Cash Flow** shows money in vs. out, your balance trend, and your runway (how many months your cash lasts at the current burn). Add your account balances there under **Accounts** so runway can be calculated.",
    href: "/cash-flow",
    cta: "Go to Cash Flow",
  },
  {
    keywords: ["forecast", "projection", "project", "scenario", "what if", "predict"],
    answer:
      "**Forecasts** lets you model growth and cost assumptions to project revenue, expenses and cash ahead. Create a scenario and adjust the growth rates to see the impact.",
    href: "/forecasts",
    cta: "Go to Forecasts",
  },
  {
    keywords: ["report", "export", "pdf", "csv", "download", "p&l", "profit and loss", "breakdown"],
    answer:
      "**Reports** gives you a profit & loss statement and category breakdowns for any period. Use the **CSV** or **PDF** buttons at the top right to export.",
    href: "/reports",
    cta: "Go to Reports",
  },
  {
    keywords: ["team", "invite", "role", "member", "accountant", "employee", "permission", "access"],
    answer:
      "Open **Team Members** to invite people as **Owner**, **Accountant** or **Employee** — each role sees exactly what it should. Roles gate navigation and actions across the app.",
    href: "/team",
    cta: "Go to Team",
  },
  {
    keywords: ["notification", "alert", "reminder", "bell"],
    answer:
      "**Notifications** surfaces alerts derived from your data — like overdue invoices or a runway under six months. The bell in the top bar shows unread alerts.",
    href: "/notifications",
    cta: "Go to Notifications",
  },
  {
    keywords: ["company", "currency", "business profile", "fiscal", "settings", "category", "categories"],
    answer:
      "Open **Company Settings** to edit your business profile, currency, fiscal year and categories.",
    href: "/company",
    cta: "Go to Company Settings",
  },
  {
    keywords: ["theme", "dark mode", "light mode", "appearance"],
    answer:
      "Use the light / system / dark toggle in the **top bar** — your choice is remembered. The whole app, including charts, adapts.",
  },
  {
    keywords: ["assistant", "ai cfo", "ask ai", "full assistant", "chat page"],
    answer:
      "The **AI Assistant** is a full-page chat that answers financial questions grounded only in your data — runway, spending, hiring, what-if scenarios, and more.",
    href: "/assistant",
    cta: "Open AI Assistant",
  },
  {
    keywords: ["fake", "real data", "where do the numbers", "sample data", "made up", "fabricat", "trust"],
    answer:
      "Every figure comes only from data **you** enter — there's no sample or fabricated data anywhere. Before you add anything, you'll see a clear empty state rather than invented numbers. The AI reasons strictly over your real figures.",
  },
  {
    keywords: ["export data", "backup", "my data", "download data", "leave"],
    answer:
      "Your data lives in this browser. You can export **Reports** and most tables to CSV, and invoices to PDF. A future release will add database-backed sync across devices.",
    href: "/reports",
    cta: "Go to Reports",
  },
  {
    keywords: ["getting started", "help", "how do i start", "what can you do", "new here", "begin", "setup"],
    answer:
      "Welcome! Start by adding a few entries: log **Revenue** and **Expenses**, add your account balances under **Cash Flow → Accounts**, and create an **Invoice** or two. The dashboard, forecasts and AI assistant come alive from there. Ask me how to do any of these.",
    href: "/dashboard",
    cta: "Go to Dashboard",
  },
];

/** Best-matching help topic for a question, or null if it isn't a how-to. */
export function matchHelp(question: string): HelpTopic | null {
  const q = question.toLowerCase();
  let best: { topic: HelpTopic; score: number } | null = null;
  for (const topic of TOPICS) {
    let score = 0;
    for (const kw of topic.keywords) if (q.includes(kw)) score += kw.includes(" ") ? 2 : 1;
    if (score > 0 && (!best || score > best.score)) best = { topic, score };
  }
  return best?.topic ?? null;
}

export const HELP_SUGGESTIONS = [
  "How do I add revenue?",
  "How do I create an invoice?",
  "Where do I see my runway?",
  "How does the AI use my data?",
];
