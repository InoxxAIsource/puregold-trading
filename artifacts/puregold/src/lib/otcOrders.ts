export type OTCOrderStatus =
  | "submitted"
  | "wire_awaited"
  | "wire_received"
  | "btc_dispatched"
  | "settled"
  | "expired"
  | "cancelled";

export interface OTCOrder {
  id: string;
  btcAmount: number;
  usdTotal: number;
  spotPrice: number;
  spread: number;
  walletAddress: string;
  settlementType: string;
  settlementTimeline: "standard" | "priority";
  bankName: string;
  bankAccountLast4: string;
  bankCountry: string;
  purpose: string;
  notes: string;
  status: OTCOrderStatus;
  submittedAt: string;
  updatedAt: string;
  txHash?: string;
}

const STORAGE_KEY = "otc_orders";

export function getOTCOrders(): OTCOrder[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as OTCOrder[];
  } catch {
    return [];
  }
}

export function saveOTCOrder(order: OTCOrder): void {
  const orders = getOTCOrders();
  const existing = orders.findIndex(o => o.id === order.id);
  if (existing >= 0) {
    orders[existing] = order;
  } else {
    orders.unshift(order);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
}

export function getOTCOrderById(id: string): OTCOrder | null {
  return getOTCOrders().find(o => o.id === id) || null;
}

export function generateOrderId(): string {
  const year = new Date().getFullYear();
  const rand = Math.floor(10000 + Math.random() * 89999);
  return `OTC-${year}-${rand}`;
}

export function statusLabel(status: OTCOrderStatus): { text: string; color: string; dot: string } {
  switch (status) {
    case "submitted":     return { text: "Submitted",      color: "text-yellow-400",  dot: "bg-yellow-400" };
    case "wire_awaited":  return { text: "Awaiting Wire",  color: "text-yellow-400",  dot: "bg-yellow-400" };
    case "wire_received": return { text: "Wire Received",  color: "text-blue-400",    dot: "bg-blue-400" };
    case "btc_dispatched":return { text: "BTC Dispatched", color: "text-orange-400",  dot: "bg-orange-400" };
    case "settled":       return { text: "Settled",        color: "text-green-400",   dot: "bg-green-400" };
    case "expired":       return { text: "Expired",        color: "text-red-400",     dot: "bg-red-400" };
    case "cancelled":     return { text: "Cancelled",      color: "text-zinc-400",    dot: "bg-zinc-400" };
    default:              return { text: "Unknown",        color: "text-zinc-400",    dot: "bg-zinc-400" };
  }
}
