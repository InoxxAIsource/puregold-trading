import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useGetSpotPrices } from "@workspace/api-client-react";
import type { SpotPrice } from "@workspace/api-client-react";

interface PriceContextType {
  spotPrices: SpotPrice[];
  lastUpdated: string | null;
  isLoading: boolean;
}

const fallbackPrices: SpotPrice[] = [
  { metal: "gold", symbol: "XAU", price: 4735.48, change: 35.04, changePercent: 0.74, direction: "up", unit: "oz", updatedAt: new Date().toISOString() },
  { metal: "silver", symbol: "XAG", price: 76.42, change: 0.58, changePercent: 0.77, direction: "up", unit: "oz", updatedAt: new Date().toISOString() },
  { metal: "platinum", symbol: "XPT", price: 2029.30, change: 12.35, changePercent: 0.61, direction: "up", unit: "oz", updatedAt: new Date().toISOString() },
  { metal: "palladium", symbol: "XPD", price: 1524.44, change: 30.54, changePercent: 2.04, direction: "up", unit: "oz", updatedAt: new Date().toISOString() }
];

const PriceContext = createContext<PriceContextType>({
  spotPrices: fallbackPrices,
  lastUpdated: null,
  isLoading: true,
});

export const usePrice = () => useContext(PriceContext);

export function PriceProvider({ children }: { children: ReactNode }) {
  const { data, isLoading } = useGetSpotPrices({
    query: {
      refetchInterval: 60000,
    }
  });

  const [prices, setPrices] = useState<SpotPrice[]>(fallbackPrices);

  useEffect(() => {
    if (data?.prices && data.prices.length > 0) {
      setPrices(data.prices);
    }
  }, [data]);

  return (
    <PriceContext.Provider value={{
      spotPrices: prices,
      lastUpdated: data?.timestamp || new Date().toISOString(),
      isLoading
    }}>
      {children}
    </PriceContext.Provider>
  );
}
