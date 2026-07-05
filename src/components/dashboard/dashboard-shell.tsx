"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";
import { Onboarding } from "./onboarding";
import { useAuthStore } from "@/lib/auth";
import { useFinanceStore } from "@/lib/store";
import { useHydrated } from "@/hooks/use-hydrated";
import { Loader2 } from "lucide-react";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const hydrated = useHydrated();
  const user = useAuthStore((s) => s.user);
  const onboarded = useFinanceStore((s) => s.onboarded);
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  React.useEffect(() => {
    if (hydrated && !user) {
      router.replace("/login");
    }
  }, [hydrated, user, router]);

  // Loading gate while persisted state rehydrates.
  if (!hydrated || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!onboarded) {
    return <Onboarding />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="lg:pl-72">
        <Topbar onMenu={() => setSidebarOpen(true)} />
        <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="animate-fade-in">{children}</div>
        </main>
      </div>
    </div>
  );
}
