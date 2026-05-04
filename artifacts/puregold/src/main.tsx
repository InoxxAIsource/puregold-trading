import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

document.documentElement.classList.add("dark");

// WebMCP — expose site tools to AI agents via browser (navigator.modelContext API)
// https://webmachinelearning.github.io/webmcp/
if (
  typeof navigator !== "undefined" &&
  typeof (navigator as { modelContext?: unknown }).modelContext !== "undefined"
) {
  const mc = (navigator as { modelContext: { provideContext: (ctx: unknown) => void } }).modelContext;
  mc.provideContext({
    tools: [
      {
        name: "get_spot_prices",
        description:
          "Get current live spot prices for gold, silver, platinum, palladium, and copper from GoldBuller.",
        inputSchema: { type: "object", properties: {} },
        execute: async () => {
          const res = await fetch("/api/prices/spot");
          return res.json();
        },
      },
      {
        name: "search_products",
        description:
          "Search GoldBuller's precious metals catalog. Filter by metal (gold, silver, platinum, palladium, copper) and/or type (coin, bar, round).",
        inputSchema: {
          type: "object",
          properties: {
            metal: {
              type: "string",
              enum: ["gold", "silver", "platinum", "palladium", "copper"],
              description: "Metal type to filter by",
            },
            type: {
              type: "string",
              enum: ["coin", "bar", "round"],
              description: "Product form factor to filter by",
            },
            on_sale: {
              type: "boolean",
              description: "Return only sale-priced items",
            },
          },
        },
        execute: async ({
          metal,
          type,
          on_sale,
        }: {
          metal?: string;
          type?: string;
          on_sale?: boolean;
        }) => {
          const params = new URLSearchParams();
          if (metal) params.set("metal", metal);
          if (type) params.set("type", type);
          if (on_sale) params.set("on_sale", "true");
          const res = await fetch(`/api/products?${params}`);
          return res.json();
        },
      },
      {
        name: "get_price_history",
        description:
          "Get historical price data for a precious metal. Timeframes: 1d, 1w, 1m, 3m, 1y.",
        inputSchema: {
          type: "object",
          required: ["metal"],
          properties: {
            metal: {
              type: "string",
              enum: ["gold", "silver", "platinum", "palladium"],
              description: "The metal to fetch history for",
            },
            timeframe: {
              type: "string",
              enum: ["1d", "1w", "1m", "3m", "1y"],
              description: "Time window for the history (default: 1m)",
            },
          },
        },
        execute: async ({
          metal,
          timeframe = "1m",
        }: {
          metal: string;
          timeframe?: string;
        }) => {
          const res = await fetch(
            `/api/prices/history/${metal}?timeframe=${timeframe}`,
          );
          return res.json();
        },
      },
    ],
  });
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
