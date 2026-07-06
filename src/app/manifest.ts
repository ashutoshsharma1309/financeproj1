import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "AI CFO — Your AI-powered Chief Financial Officer",
    short_name: "AI CFO",
    description:
      "Manage revenue, expenses, invoices, cash flow and forecasts with an AI CFO that analyzes only your own data.",
    start_url: "/dashboard",
    display: "standalone",
    background_color: "#0a0e14",
    theme_color: "#10d9a3",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
