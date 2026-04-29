import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import type { CartItem } from "@workspace/api-client-react";

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: string) => void;
  updateQty: (productId: string, quantity: number) => void;
  clearCart: () => void;
  subtotal: number;
  totalItems: number;
  paymentMethod: string;
  setPaymentMethod: (method: string) => void;
}

const CartContext = createContext<CartContextType | null>(null);

export const useCartContext = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCartContext must be used within CartProvider");
  return ctx;
};

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState("wire");

  // Load from local storage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("pg_cart");
      if (stored) setItems(JSON.parse(stored));
    } catch (e) {}
  }, []);

  // Save to local storage
  useEffect(() => {
    localStorage.setItem("pg_cart", JSON.stringify(items));
  }, [items]);

  const addItem = (item: CartItem) => {
    setItems(prev => {
      const existing = prev.find(i => i.productId === item.productId);
      if (existing) {
        return prev.map(i => i.productId === item.productId ? { ...i, quantity: i.quantity + item.quantity } : i);
      }
      return [...prev, item];
    });
  };

  const removeItem = (productId: string) => {
    setItems(prev => prev.filter(i => i.productId !== productId));
  };

  const updateQty = (productId: string, quantity: number) => {
    setItems(prev => prev.map(i => i.productId === productId ? { ...i, quantity } : i));
  };

  const clearCart = () => {
    setItems([]);
    localStorage.removeItem("pg_cart");
  };

  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      items, addItem, removeItem, updateQty, clearCart, subtotal, totalItems, paymentMethod, setPaymentMethod
    }}>
      {children}
    </CartContext.Provider>
  );
}
