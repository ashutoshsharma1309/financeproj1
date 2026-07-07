"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { NAV_GROUPS } from "./nav-config";
import { useAuthStore } from "@/lib/auth";
import { can } from "@/lib/security";
import { cn } from "@/lib/utils";

export function Sidebar({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();
  const role = useAuthStore((s) => s.user?.role);

  const content = (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center justify-between px-5">
        <Logo href="/dashboard" />
        <button
          className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted lg:hidden"
          onClick={onClose}
          aria-label="Close sidebar"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <nav className="flex-1 space-y-6 overflow-y-auto px-3 pb-6 pt-2">
        {NAV_GROUPS.map((group) => {
          const items = group.items.filter(
            (item) => !item.permission || can(role, item.permission),
          );
          if (items.length === 0) return null;
          return (
            <div key={group.title}>
              <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {group.title}
              </p>
              <ul className="space-y-1">
                {items.map((item) => {
                  const active =
                    pathname === item.href ||
                    (item.href !== "/dashboard" &&
                      pathname.startsWith(item.href));
                  const Icon = item.icon;
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={onClose}
                        aria-current={active ? "page" : undefined}
                        className={cn(
                          "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                          active
                            ? "bg-primary text-primary-foreground shadow-soft"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground",
                        )}
                      >
                        <Icon
                          className={cn(
                            "h-5 w-5 shrink-0",
                            active ? "" : "text-muted-foreground group-hover:text-foreground",
                          )}
                        />
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </nav>
    </div>
  );

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-foreground/40 backdrop-blur-sm lg:hidden"
          onClick={onClose}
          aria-hidden
        />
      )}
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 border-r border-border bg-surface transition-transform duration-300 lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {content}
      </aside>
    </>
  );
}
