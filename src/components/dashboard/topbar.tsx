"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bell, LogOut, Menu, Search, Settings, User as UserIcon } from "lucide-react";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Dropdown, DropdownItem } from "@/components/ui/dropdown";
import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/lib/auth";
import { useFinanceStore } from "@/lib/store";
import { ALL_NAV_ITEMS } from "./nav-config";
import { ROLE_LABELS } from "@/lib/security";
import { cn } from "@/lib/utils";

export function Topbar({ onMenu }: { onMenu: () => void }) {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const unread = useFinanceStore(
    (s) => s.notifications.filter((n) => !n.read).length,
  );

  const [query, setQuery] = React.useState("");
  const [focused, setFocused] = React.useState(false);
  const results = query
    ? ALL_NAV_ITEMS.filter((i) =>
        i.label.toLowerCase().includes(query.toLowerCase()),
      )
    : [];

  const searchRef = React.useRef<HTMLInputElement>(null);
  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const el = document.activeElement;
      const typing =
        el instanceof HTMLInputElement ||
        el instanceof HTMLTextAreaElement ||
        (el as HTMLElement | null)?.isContentEditable;
      if (e.key === "/" && !typing) {
        e.preventDefault();
        searchRef.current?.focus();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const initials = (user?.name ?? "U")
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur-xl sm:px-6">
      <button
        className="rounded-lg p-2 text-muted-foreground hover:bg-muted lg:hidden"
        onClick={onMenu}
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Search */}
      <div className="relative max-w-md flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          ref={searchRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 150)}
          placeholder="Search pages…"
          className="h-10 w-full rounded-xl border border-input bg-surface pl-9 pr-10 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-ring/30"
          aria-label="Search pages"
        />
        <kbd
          className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 rounded-md border border-border bg-muted px-1.5 py-0.5 font-mono text-[11px] text-muted-foreground sm:block"
          aria-hidden
        >
          /
        </kbd>
        {focused && results.length > 0 && (
          <div className="absolute left-0 right-0 top-12 z-40 overflow-hidden rounded-xl bg-surface p-1.5 shadow-clay">
            {results.slice(0, 6).map((r) => (
              <button
                key={r.href}
                onMouseDown={() => {
                  router.push(r.href);
                  setQuery("");
                }}
                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm font-medium hover:bg-muted"
              >
                <r.icon className="h-4 w-4 text-muted-foreground" />
                {r.label}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
        <ThemeToggle compact />

        <Link
          href="/notifications"
          className="relative flex h-10 w-10 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
          {unread > 0 && (
            <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-danger px-1 text-[10px] font-bold text-danger-foreground">
              {unread > 9 ? "9+" : unread}
            </span>
          )}
        </Link>

        <Dropdown
          trigger={
            <button
              className="flex items-center gap-2.5 rounded-xl p-1 pr-2 transition-colors hover:bg-muted"
              aria-label="Account menu"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent text-sm font-semibold text-primary-foreground">
                {initials}
              </span>
              <span className="hidden text-left sm:block">
                <span className="block text-sm font-semibold leading-tight">
                  {user?.name ?? "User"}
                </span>
                <span className="block text-xs text-muted-foreground">
                  {user ? ROLE_LABELS[user.role] : ""}
                </span>
              </span>
            </button>
          }
        >
          <div className="px-3 py-2">
            <p className="text-sm font-semibold">{user?.name}</p>
            <p className="truncate text-xs text-muted-foreground">
              {user?.email}
            </p>
            {user && (
              <Badge tone="primary" className="mt-1.5">
                {ROLE_LABELS[user.role]}
              </Badge>
            )}
          </div>
          <div className="my-1 h-px bg-border" />
          <DropdownItem onClick={() => router.push("/profile")}>
            <UserIcon className="h-4 w-4" />
            Profile
          </DropdownItem>
          <DropdownItem onClick={() => router.push("/company")}>
            <Settings className="h-4 w-4" />
            Company settings
          </DropdownItem>
          <div className="my-1 h-px bg-border" />
          <DropdownItem
            danger
            onClick={() => {
              logout();
              router.push("/login");
            }}
          >
            <LogOut className="h-4 w-4" />
            Log out
          </DropdownItem>
        </Dropdown>
      </div>
    </header>
  );
}
