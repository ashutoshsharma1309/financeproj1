const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

/**
 * JSON-LD structured data describing AI CFO as a SoftwareApplication.
 * Helps search engines render a rich result for the landing page.
 */
export function StructuredData() {
  const data = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "AI CFO",
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    description:
      "AI-powered finance for small & medium businesses: revenue, expenses, invoices, cash flow, forecasting and an AI assistant grounded only in your own data.",
    url: appUrl,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };

  return (
    <script
      type="application/ld+json"
      // Content is a fixed, developer-authored object — safe to serialize.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
