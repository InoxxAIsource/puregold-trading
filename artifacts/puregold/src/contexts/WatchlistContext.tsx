import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface WatchlistContextType {
  items: string[];
  addItem: (productId: string) => void;
  removeItem: (productId: string) => void;
  hasItem: (productId: string) => boolean;
}

const WatchlistContext = createContext<WatchlistContextType | null>(null);

export const useWatchlist = () => {
  const ctx = useContext(WatchlistContext);
  if (!ctx) throw new Error("useWatchlist must be used within WatchlistProvider");
  return ctx;
};

export function WatchlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<string[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("pg_watchlist");
      if (stored) setItems(JSON.parse(stored));
    } catch (e) {}
  }, []);

  useEffect(() => {
    localStorage.setItem("pg_watchlist", JSON.stringify(items));
  }, [items]);

  const addItem = (productId: string) => {
    if (!items.includes(productId)) {
      setItems([...items, productId]);
    }
  };

  const removeItem = (productId: string) => {
    setItems(items.filter(id => id !== productId));
  };

  const hasItem = (productId: string) => items.includes(productId);

  return (
    <WatchlistContext.Provider value={{ items, addItem, removeItem, hasItem }}>
      {children}
    </WatchlistContext.Provider>
  );
}
