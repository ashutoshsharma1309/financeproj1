import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { ShieldCheck, Sparkles, TrendingUp } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Brand panel */}
      <div className="mesh-bg relative hidden flex-col justify-between overflow-hidden border-r border-border p-10 lg:flex">
        <Logo />
        <div className="max-w-md">
          <h2 className="text-3xl font-bold tracking-tight">
            Finance that tells the <span className="gradient-text">truth</span>.
          </h2>
          <p className="mt-4 text-muted-foreground">
            Every number in AI CFO comes from data you enter. No fabricated
            metrics — just clarity you can act on.
          </p>
          <ul className="mt-8 space-y-4">
            {[
              { icon: TrendingUp, text: "Live revenue, expense & cash insights" },
              { icon: Sparkles, text: "An AI CFO grounded only in your numbers" },
              { icon: ShieldCheck, text: "Role-based access & a full audit trail" },
            ].map((f) => (
              <li key={f.text} className="flex items-center gap-3">
                <span className="surface-2 flex h-10 w-10 items-center justify-center text-primary">
                  <f.icon className="h-5 w-5" />
                </span>
                <span className="text-sm font-medium">{f.text}</span>
              </li>
            ))}
          </ul>
        </div>
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} AI CFO
        </p>
      </div>

      {/* Form panel */}
      <div className="relative flex flex-col">
        <div className="flex items-center justify-between p-5 sm:p-6">
          <Link href="/" className="lg:hidden">
            <Logo />
          </Link>
          <div className="ml-auto">
            <ThemeToggle />
          </div>
        </div>
        <div className="flex flex-1 items-center justify-center px-4 pb-16 sm:px-6">
          <div className="w-full max-w-md animate-fade-up">{children}</div>
        </div>
      </div>
    </div>
  );
}
