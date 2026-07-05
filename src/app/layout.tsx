import type { Metadata, Viewport } from "next";
import "./globals.css";
import { fontDisplay, fontSans, fontMono } from "./fonts";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { ToastProvider } from "@/components/ui/toast";

export const metadata: Metadata = {
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
  openGraph: {
    title: "AI CFO",
    description: "Your AI-powered Chief Financial Officer for Small & Medium Businesses.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5f5fb" },
    { media: "(prefers-color-scheme: dark)", color: "#14161f" },
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
