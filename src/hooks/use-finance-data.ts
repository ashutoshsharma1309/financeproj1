"use client";

import { useShallow } from "zustand/react/shallow";
import { useFinanceStore } from "@/lib/store";
import type { FinanceData } from "@/lib/calculations";

/** Convenience selector returning the slice needed by the calculation engine. */
export function useFinanceData(): FinanceData {
  return useFinanceStore(
    useShallow((s) => ({
      transactions: s.transactions,
      revenues: s.revenues,
      expenses: s.expenses,
      invoices: s.invoices,
      accounts: s.accounts,
      categories: s.categories,
    })),
  );
}

/** The active company currency, defaulting to INR before onboarding. */
export function useCurrency() {
  return useFinanceStore((s) => s.company?.currency ?? "INR");
}
