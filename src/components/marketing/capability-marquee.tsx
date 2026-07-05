"use client";

const CAPABILITIES = [
  "Revenue tracking",
  "Expense control",
  "Smart invoicing",
  "Cash-flow runway",
  "Scenario forecasting",
  "P&L reports",
  "AI insights",
  "Risk detection",
  "Audit trail",
  "Role-based access",
  "PDF & CSV export",
  "Multi-currency",
];

export function CapabilityMarquee() {
  return (
    <div
      className="relative overflow-hidden py-6"
      style={{
        maskImage:
          "linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent)",
        WebkitMaskImage:
          "linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent)",
      }}
    >
      <div className="flex w-max animate-marquee gap-4">
        {[...CAPABILITIES, ...CAPABILITIES].map((c, i) => (
          <span
            key={i}
            className="ticker-chip flex items-center gap-2 whitespace-nowrap px-4 py-2 text-muted-foreground"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            {c}
          </span>
        ))}
      </div>
    </div>
  );
}
