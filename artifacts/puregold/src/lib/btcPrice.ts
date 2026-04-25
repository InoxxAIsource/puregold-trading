import { useState, useEffect, useRef } from "react";

export const BTC_SPREAD_TIERS = [
  { minBtc: 0.20, maxBtc: 0.99, spread: 0.0125, label: "0.20 – 0.99" },
  { minBtc: 1.00, maxBtc: 2.99, spread: 0.0100, label: "1.00 – 2.99" },
  { minBtc: 3.00, maxBtc: 4.99, spread: 0.0085, label: "3.00 – 4.99" },
  { minBtc: 5.00, maxBtc: 7.99, spread: 0.0075, label: "5.00 – 7.99" },
  { minBtc: 8.00, maxBtc: 10.00, spread: 0.0060, label: "8.00 – 10.00" },
];

export function getSpread(btcAmount: number): number {
  const tier = BTC_SPREAD_TIERS.find(t => btcAmount >= t.minBtc && btcAmount <= t.maxBtc);
  return tier ? tier.spread : 0.0125;
}

export function calcTotal(btcAmount: number, spotPrice: number): number {
  const spread = getSpread(btcAmount);
  return btcAmount * spotPrice * (1 + spread);
}

export async function fetchBTCPrice(): Promise<number> {
  try {
    const res = await fetch("https://api.coinbase.com/v2/prices/BTC-USD/spot");
    if (!res.ok) throw new Error("Coinbase failed");
    const data = await res.json();
    return parseFloat(data.data.amount);
  } catch {
    try {
      const res2 = await fetch("https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT");
      if (!res2.ok) throw new Error("Binance failed");
      const data2 = await res2.json();
      return parseFloat(data2.price);
    } catch {
      return 94250.0;
    }
  }
}

export interface BTCPriceData {
  price: number;
  openPrice: number;
  change: number;
  changePercent: number;
  direction: "up" | "down";
  lastUpdated: Date;
}

export function useBTCPrice(refreshIntervalMs = 30000): BTCPriceData & { isLoading: boolean } {
  const [data, setData] = useState<BTCPriceData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const openPriceRef = useRef<number | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      const price = await fetchBTCPrice();
      if (cancelled) return;
      if (openPriceRef.current === null) {
        openPriceRef.current = price * (1 - 0.013);
      }
      const open = openPriceRef.current;
      const change = price - open;
      const changePercent = (change / open) * 100;
      setData({
        price,
        openPrice: open,
        change,
        changePercent,
        direction: change >= 0 ? "up" : "down",
        lastUpdated: new Date(),
      });
      setIsLoading(false);
    };

    load();
    const interval = setInterval(load, refreshIntervalMs);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [refreshIntervalMs]);

  return {
    price: data?.price ?? 94250,
    openPrice: data?.openPrice ?? 93010,
    change: data?.change ?? 1240,
    changePercent: data?.changePercent ?? 1.33,
    direction: data?.direction ?? "up",
    lastUpdated: data?.lastUpdated ?? new Date(),
    isLoading,
  };
}
