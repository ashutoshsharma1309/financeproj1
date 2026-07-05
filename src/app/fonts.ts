import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";

// Display — characterful geometric grotesque for headings & the wordmark.
export const fontDisplay = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

// Body — highly legible workhorse for prose and UI.
export const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

// Data — tabular monospace for every figure. The finance signature.
export const fontMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-mono",
  display: "swap",
});
