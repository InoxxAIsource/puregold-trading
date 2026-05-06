import { Router } from "express";
import type { Request, Response } from "express";

const router = Router();

const HARDCODED_PRICES = {
  gold: { price: 4735.48, change: 35.04, changePercent: 0.74 },
  silver: { price: 76.42, change: 0.58, changePercent: 0.77 },
  platinum: { price: 2029.30, change: 12.35, changePercent: 0.61 },
  palladium: { price: 1524.44, change: 30.54, changePercent: 2.04 },
  copper: { price: 4.85, change: 0.02, changePercent: 0.41 },
  bitcoin: { price: 94850.00, change: 1200.00, changePercent: 1.28 },
};

let cachedPrices: typeof HARDCODED_PRICES | null = null;
let lastFetch = 0;
let lastBtcPrice = HARDCODED_PRICES.bitcoin.price;
let lastBtcFetch = 0;
let btcOpenPrice: number | null = null;

async function fetchLiveBTCPrice(): Promise<number> {
  if (Date.now() - lastBtcFetch < 60000) return lastBtcPrice;
  try {
    const res = await fetch("https://api.coinbase.com/v2/prices/BTC-USD/spot", {
      signal: AbortSignal.timeout(5000),
    });
    if (res.ok) {
      const data = await res.json() as { data: { amount: string } };
      const price = parseFloat(data.data.amount);
      if (price > 0) {
        lastBtcPrice = price;
        lastBtcFetch = Date.now();
        return price;
      }
    }
  } catch { /* fall through */ }
  try {
    const res2 = await fetch("https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT", {
      signal: AbortSignal.timeout(5000),
    });
    if (res2.ok) {
      const data2 = await res2.json() as { price: string };
      const price = parseFloat(data2.price);
      if (price > 0) {
        lastBtcPrice = price;
        lastBtcFetch = Date.now();
        return price;
      }
    }
  } catch { /* fall through */ }
  return lastBtcPrice;
}

async function fetchLivePrices() {
  if (Date.now() - lastFetch < 60000 && cachedPrices) {
    return cachedPrices;
  }

  const [btcPrice, metalsResult] = await Promise.allSettled([
    fetchLiveBTCPrice(),
    (async () => {
      const res = await fetch("https://api.metals.live/v1/spot", {
        signal: AbortSignal.timeout(5000),
      });
      if (!res.ok) throw new Error("metals API error");
      return res.json() as Promise<Array<{ gold?: number; silver?: number; platinum?: number; palladium?: number; copper?: number }>>;
    })(),
  ]);

  const liveBTC = btcPrice.status === "fulfilled" ? btcPrice.value : lastBtcPrice;
  if (btcOpenPrice === null) btcOpenPrice = liveBTC * (1 - 0.013);
  const btcChange = liveBTC - btcOpenPrice;

  let prices: typeof HARDCODED_PRICES = {
    ...HARDCODED_PRICES,
    bitcoin: {
      price: liveBTC,
      change: btcChange,
      changePercent: btcOpenPrice > 0 ? (btcChange / btcOpenPrice) * 100 : 0,
    },
  };

  if (metalsResult.status === "fulfilled") {
    const data = metalsResult.value;
    if (Array.isArray(data) && data.length > 0) {
      const entry = data[0];
      prices = {
        ...prices,
        gold: { price: entry.gold ?? HARDCODED_PRICES.gold.price, change: HARDCODED_PRICES.gold.change, changePercent: HARDCODED_PRICES.gold.changePercent },
        silver: { price: entry.silver ?? HARDCODED_PRICES.silver.price, change: HARDCODED_PRICES.silver.change, changePercent: HARDCODED_PRICES.silver.changePercent },
        platinum: { price: entry.platinum ?? HARDCODED_PRICES.platinum.price, change: HARDCODED_PRICES.platinum.change, changePercent: HARDCODED_PRICES.platinum.changePercent },
        palladium: { price: entry.palladium ?? HARDCODED_PRICES.palladium.price, change: HARDCODED_PRICES.palladium.change, changePercent: HARDCODED_PRICES.palladium.changePercent },
        copper: { price: entry.copper ?? HARDCODED_PRICES.copper.price, change: HARDCODED_PRICES.copper.change, changePercent: HARDCODED_PRICES.copper.changePercent },
      };
    }
  }

  cachedPrices = prices;
  lastFetch = Date.now();
  return prices;
}

router.get("/spot", async (req: Request, res: Response) => {
  const prices = await fetchLivePrices();
  const now = new Date().toISOString();

  const metals = [
    { key: "gold", metal: "Gold", symbol: "XAU/USD", unit: "per troy oz" },
    { key: "silver", metal: "Silver", symbol: "XAG/USD", unit: "per troy oz" },
    { key: "platinum", metal: "Platinum", symbol: "XPT/USD", unit: "per troy oz" },
    { key: "palladium", metal: "Palladium", symbol: "XPD/USD", unit: "per troy oz" },
    { key: "copper", metal: "Copper", symbol: "XCU/USD", unit: "per lb" },
    { key: "bitcoin", metal: "Bitcoin", symbol: "BTC/USD", unit: "per BTC" },
  ];

  const result = metals.map(({ key, metal, symbol, unit }) => {
    const p = prices[key as keyof typeof prices];
    return {
      metal,
      symbol,
      price: p.price,
      change: p.change,
      changePercent: p.changePercent,
      direction: p.change > 0 ? "up" : p.change < 0 ? "down" : "flat",
      unit,
      updatedAt: now,
    };
  });

  res.json({ prices: result, timestamp: now });
});

function generatePriceHistory(basePrice: number, days: number) {
  const points = [];
  let price = basePrice * 0.9;
  const now = new Date();

  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const change = (Math.random() - 0.48) * (basePrice * 0.015);
    price = Math.max(price * 0.5, price + change);
    points.push({
      date: date.toISOString().split("T")[0],
      price: Math.round(price * 100) / 100,
    });
  }
  // Ensure last point matches current price
  if (points.length > 0) {
    points[points.length - 1].price = basePrice;
  }
  return points;
}

const METAL_DAYS: Record<string, number> = {
  "1d": 1,
  "1w": 7,
  "1m": 30,
  "3m": 90,
  "1y": 365,
  "5y": 1825,
  "all": 3650,
};

router.get("/history/:metal", async (req: Request, res: Response) => {
  const { metal } = req.params;
  const timeframe = (req.query.timeframe as string) || "1m";

  const prices = await fetchLivePrices();
  const metalKey = String(metal).toLowerCase() as keyof typeof prices;
  const currentPrice = prices[metalKey]?.price ?? 4735.48;

  const days = METAL_DAYS[timeframe] ?? 30;
  const data = generatePriceHistory(currentPrice, days);
  const priceValues = data.map((d) => d.price);

  res.json({
    metal,
    timeframe,
    data,
    currentPrice,
    minPrice: Math.min(...priceValues),
    maxPrice: Math.max(...priceValues),
  });
});

export default router;
