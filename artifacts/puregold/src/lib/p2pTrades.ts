import { P2POffer } from "./p2pOffers";

export type TradeStatus =
  | "initiated"
  | "escrow_locked"
  | "payment_sent"
  | "payment_confirmed"
  | "asset_releasing"
  | "completed"
  | "cancelled"
  | "disputed"
  | "dispute_resolved";

export interface ChatMessage {
  id: string;
  sender: "buyer" | "seller" | "system";
  senderName: string;
  text: string;
  timestamp: string;
  isPaymentProof?: boolean;
}

export interface P2PTrade {
  id: string;
  offerId: string;
  merchantId: string;
  merchantName: string;
  merchantAvatar: string;
  merchantRating: number;
  asset: string;
  assetLabel: string;
  assetIcon: string;
  qty: number;
  pricePerUnit: number;
  priceUnit: string;
  totalUSD: number;
  paymentMethod: string;
  deliveryAddress?: string;
  walletAddress?: string;
  status: TradeStatus;
  createdAt: string;
  escrowExpiresAt: string;
  paymentSentAt?: string;
  completedAt?: string;
  isBuyer: boolean;
  messages: ChatMessage[];
  rating?: { overall: number; speed: number; comms: number; asDescribed: number; review: string };
}

const STORAGE_KEY = "p2p_trades";

export function getP2PTrades(): P2PTrade[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveTrades(trades: P2PTrade[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(trades));
}

export function getTradeById(id: string): P2PTrade | undefined {
  return getP2PTrades().find(t => t.id === id);
}

export function generateTradeId(): string {
  const suffix = Math.floor(100000 + Math.random() * 900000);
  return `P2P-2026-${suffix}`;
}

export function createTrade(offer: P2POffer, qty: number, paymentMethod: string, deliveryAddress?: string, walletAddress?: string): P2PTrade {
  const tradeId = generateTradeId();
  const now = new Date();
  const escrowExpiry = new Date(now.getTime() + 30 * 60 * 1000);

  const initialMessages: ChatMessage[] = [
    {
      id: "sys_01",
      sender: "system",
      senderName: "SYSTEM",
      text: `Trade started. Escrow locked: ${qty} ${offer.availableUnit} ${offer.assetLabel}. Timer: 30 minutes. Payment required.`,
      timestamp: now.toISOString(),
    },
    {
      id: "merchant_01",
      sender: "seller",
      senderName: offer.merchantName,
      text: `Hi! Ready to trade. Here are my ${paymentMethod === "bankwire" ? "wire" : paymentMethod} details:\n${paymentMethod === "bankwire" ? `Bank: Chase\nRouting: 021000021\nAccount: ****${Math.floor(1000 + Math.random() * 9000)}\nName: ${offer.merchantName.replace("_", " ")} LLC\nRef: ${tradeId}\nPlease send $${(qty * offer.pricePerUnit).toLocaleString(undefined, { minimumFractionDigits: 2 })} exactly.` : `Send to: ${offer.merchantName}@goldbuller.com\nAmount: $${(qty * offer.pricePerUnit).toLocaleString(undefined, { minimumFractionDigits: 2 })}\nNote: ${tradeId}`}`,
      timestamp: new Date(now.getTime() + 45000).toISOString(),
    },
  ];

  const trade: P2PTrade = {
    id: tradeId,
    offerId: offer.id,
    merchantId: offer.merchantId,
    merchantName: offer.merchantName,
    merchantAvatar: offer.merchantAvatar,
    merchantRating: offer.merchantRating,
    asset: offer.asset,
    assetLabel: offer.assetLabel,
    assetIcon: offer.assetIcon,
    qty,
    pricePerUnit: offer.pricePerUnit,
    priceUnit: offer.priceUnit,
    totalUSD: qty * offer.pricePerUnit,
    paymentMethod,
    deliveryAddress,
    walletAddress,
    status: "escrow_locked",
    createdAt: now.toISOString(),
    escrowExpiresAt: escrowExpiry.toISOString(),
    isBuyer: true,
    messages: initialMessages,
  };

  const trades = getP2PTrades();
  trades.unshift(trade);
  saveTrades(trades);
  return trade;
}

export function updateTradeStatus(id: string, status: TradeStatus): P2PTrade | null {
  const trades = getP2PTrades();
  const idx = trades.findIndex(t => t.id === id);
  if (idx === -1) return null;

  trades[idx].status = status;

  if (status === "payment_sent") {
    trades[idx].paymentSentAt = new Date().toISOString();
    trades[idx].messages.push({
      id: `sys_${Date.now()}`,
      sender: "system",
      senderName: "SYSTEM",
      text: "Buyer marked payment as sent. Waiting for seller confirmation.",
      timestamp: new Date().toISOString(),
    });
    setTimeout(() => {
      trades[idx].messages.push({
        id: `merchant_${Date.now()}`,
        sender: "seller",
        senderName: trades[idx].merchantName,
        text: "Perfect, I'll watch for the payment. Will confirm as soon as I receive notification.",
        timestamp: new Date().toISOString(),
      });
    }, 2000);
  }

  if (status === "completed") {
    trades[idx].completedAt = new Date().toISOString();
    trades[idx].messages.push({
      id: `sys_${Date.now()}`,
      sender: "system",
      senderName: "SYSTEM",
      text: `Trade completed successfully. ${trades[idx].assetIcon} ${trades[idx].qty} ${trades[idx].priceUnit} ${trades[idx].assetLabel} ${trades[idx].asset === "btc" ? "sent to your wallet." : "shipment arranged."}`,
      timestamp: new Date().toISOString(),
    });
  }

  saveTrades(trades);
  return trades[idx];
}

export function addChatMessage(tradeId: string, text: string, sender: "buyer" | "seller" | "system" = "buyer"): P2PTrade | null {
  const trades = getP2PTrades();
  const idx = trades.findIndex(t => t.id === tradeId);
  if (idx === -1) return null;

  const trade = trades[idx];
  const senderName = sender === "buyer" ? "You" : sender === "system" ? "SYSTEM" : trade.merchantName;
  
  trade.messages.push({
    id: `msg_${Date.now()}`,
    sender,
    senderName,
    text,
    timestamp: new Date().toISOString(),
  });

  if (sender === "buyer" && Math.random() > 0.3) {
    const autoReplies = [
      "Got it, thank you!",
      "Understood. Standing by.",
      "Acknowledged. Let me know if you need anything.",
      "Perfect. I'll confirm as soon as payment arrives.",
    ];
    setTimeout(() => {
      const trades2 = getP2PTrades();
      const idx2 = trades2.findIndex(t => t.id === tradeId);
      if (idx2 !== -1) {
        trades2[idx2].messages.push({
          id: `merchant_${Date.now()}`,
          sender: "seller",
          senderName: trade.merchantName,
          text: autoReplies[Math.floor(Math.random() * autoReplies.length)],
          timestamp: new Date().toISOString(),
        });
        saveTrades(trades2);
      }
    }, 3000 + Math.random() * 5000);
  }

  saveTrades(trades);
  return trades[idx];
}

export function rateTradePartner(tradeId: string, rating: { overall: number; speed: number; comms: number; asDescribed: number; review: string }) {
  const trades = getP2PTrades();
  const idx = trades.findIndex(t => t.id === tradeId);
  if (idx === -1) return;
  trades[idx].rating = rating;
  saveTrades(trades);
}

export function cancelTrade(tradeId: string): P2PTrade | null {
  return updateTradeStatus(tradeId, "cancelled");
}
