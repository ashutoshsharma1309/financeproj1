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
      <span className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <svg viewBox="0 0 24 24" fill="none" className="h-[17px] w-[17px]" aria-hidden>
          {/* candlestick + trendline mark */}
          <rect x="5" y="8" width="2.4" height="8" rx="1" fill="currentColor" opacity="0.9" />
          <rect x="11" y="5" width="2.4" height="12" rx="1" fill="currentColor" opacity="0.6" />
          <rect x="16.6" y="10" width="2.4" height="5" rx="1" fill="currentColor" opacity="0.9" />
          <path d="M4 18 L20 18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      </span>
      {showText && (
        <span className="font-display text-[15px] font-semibold tracking-tight">
          AI<span className="text-primary"> CFO</span>
        </span>
      )}
    </Link>
  );
}
