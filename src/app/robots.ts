import type { MetadataRoute } from "next";

const base = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Authenticated app surfaces shouldn't be crawled.
      disallow: ["/dashboard", "/transactions", "/revenue", "/expenses", "/invoices", "/cash-flow", "/forecasts", "/reports", "/assistant", "/company", "/profile", "/notifications", "/team", "/audit-logs", "/billing", "/api/"],
    },
    sitemap: `${base}/sitemap.xml`,
  };
}
