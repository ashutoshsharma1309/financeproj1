import type { Metadata, Viewport } from "next";
import "./globals.css";
import { fontDisplay, fontSans, fontMono } from "./fonts";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { ToastProvider } from "@/components/ui/toast";

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: {
    default: "AI CFO — Your AI-powered Chief Financial Officer",
    template: "%s · AI CFO",
  },
  description:
    "AI CFO helps small & medium businesses manage revenue, expenses, invoices, cash flow and forecasts — with an AI assistant that only ever analyzes your own data.",
  keywords: [
    "AI CFO",
    "finance",
    "SMB accounting",
    "cash flow",
    "financial forecasting",
    "invoicing",
  ],
  authors: [{ name: "AI CFO" }],
  applicationName: "AI CFO",
  openGraph: {
    title: "AI CFO — Your AI-powered Chief Financial Officer",
    description:
      "Manage revenue, expenses, invoices, cash flow and forecasts — with insights drawn only from your own data.",
    type: "website",
    siteName: "AI CFO",
    url: appUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: "AI CFO — Your AI-powered Chief Financial Officer",
    description:
      "Finance for SMBs, grounded only in your own data. No fabricated numbers.",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f8f5" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0e14" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${fontDisplay.variable} ${fontSans.variable} ${fontMono.variable}`}
    >
      <body className="grain">
        <ThemeProvider>
          <ToastProvider>{children}</ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
