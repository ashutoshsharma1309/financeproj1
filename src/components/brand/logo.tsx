import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({
  className,
  href = "/",
  showText = true,
}: {
  className?: string;
  href?: string;
  showText?: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn("group inline-flex items-center gap-2.5", className)}
      aria-label="AI CFO home"
    >
      <span className="relative flex h-9 w-9 items-center justify-center rounded-[11px] bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-glow transition-transform group-hover:scale-105 group-hover:rotate-3">
        <svg viewBox="0 0 24 24" fill="none" className="h-[18px] w-[18px]" aria-hidden>
          {/* candlestick + trendline mark */}
          <rect x="5" y="8" width="2.4" height="8" rx="1" fill="currentColor" opacity="0.85" />
          <rect x="11" y="5" width="2.4" height="12" rx="1" fill="currentColor" opacity="0.55" />
          <rect x="16.6" y="10" width="2.4" height="5" rx="1" fill="currentColor" opacity="0.85" />
          <path d="M4 18 L20 18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" opacity="0.9" />
        </svg>
      </span>
      {showText && (
        <span className="font-display text-lg font-bold tracking-tight">
          AI<span className="gradient-text"> CFO</span>
        </span>
      )}
    </Link>
  );
}
