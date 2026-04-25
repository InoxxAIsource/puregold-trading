import { useState, useEffect } from "react";
import { Link, useLocation, useRoute } from "wouter";
import { Copy, Check, ExternalLink, Download, ChevronLeft } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { getOTCOrders, getOTCOrderById, statusLabel, type OTCOrder } from "@/lib/otcOrders";

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={copy} className="text-muted-foreground hover:text-primary transition-colors ml-1">
      {copied ? <Check className="h-3.5 w-3.5 text-green-400" /> : <Copy className="h-3.5 w-3.5" />}
    </button>
  );
}

const TIMELINE_EVENTS: Record<string, string[]> = {
  wire_awaited: ["Application submitted", "Wire instructions sent"],
  wire_received: ["Application submitted", "Wire instructions sent", "Wire payment received"],
  btc_dispatched: ["Application submitted", "Wire instructions sent", "Wire payment received", "BTC transaction broadcast"],
  settled: ["Application submitted", "Wire instructions sent", "Wire payment received", "BTC transaction broadcast", "BTC confirmed in wallet"],
  expired: ["Application submitted", "Wire instructions sent", "Order expired — wire not received in 3 business days"],
  cancelled: ["Application submitted", "Order cancelled"],
};

function OrderDetail({ orderId }: { orderId: string }) {
  const [order, setOrder] = useState<OTCOrder | null>(null);
  const [, setLocation] = useLocation();

  useEffect(() => {
    setOrder(getOTCOrderById(orderId));
  }, [orderId]);

  if (!order) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground">Order not found.</p>
        <Link href="/account/otc-orders" className="text-primary text-sm hover:underline mt-2 inline-block">← Back to orders</Link>
      </div>
    );
  }

  const { text, color } = statusLabel(order.status);
  const fmt = (n: number) => n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const events = TIMELINE_EVENTS[order.status] || TIMELINE_EVENTS.wire_awaited;

  return (
    <div className="max-w-2xl mx-auto">
      <button onClick={() => setLocation("/account/otc-orders")} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
        <ChevronLeft className="h-4 w-4" /> Back to OTC Orders
      </button>

      <div className="flex items-start justify-between flex-wrap gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-xl font-bold text-foreground font-mono">{order.id}</h2>
            <CopyButton text={order.id} />
          </div>
          <p className="text-sm text-muted-foreground">{new Date(order.submittedAt).toLocaleString()}</p>
        </div>
        <span className={`text-sm font-semibold flex items-center gap-1.5 ${color}`}>
          <span className={`h-2 w-2 rounded-full ${statusLabel(order.status).dot}`} /> {text}
        </span>
      </div>

      {/* Order summary */}
      <div className="bg-card border border-border rounded-xl p-6 space-y-3 text-sm mb-6">
        <h3 className="font-semibold text-foreground text-base border-b border-border pb-2 mb-3">Order Summary</h3>
        {[
          ["BTC Amount", `${order.btcAmount.toFixed(4)} BTC`],
          ["USD Total", `$${fmt(order.usdTotal)}`],
          ["Spot Price", `$${fmt(order.spotPrice)}`],
          ["Desk Spread", `+${(order.spread * 100).toFixed(2)}%`],
          ["Settlement", order.settlementType],
          ["Timeline", order.settlementTimeline === "priority" ? "Priority (4hr)" : "Standard (24hr)"],
          ["Purpose", order.purpose],
        ].map(([k, v]) => (
          <div key={k} className="flex justify-between">
            <span className="text-muted-foreground">{k}:</span>
            <span className="text-foreground font-medium">{v}</span>
          </div>
        ))}
        <div className="flex justify-between">
          <span className="text-muted-foreground">Wallet Address:</span>
          <span className="text-foreground font-mono text-xs flex items-center">
            {order.walletAddress.slice(0, 8)}...{order.walletAddress.slice(-6)}
            <CopyButton text={order.walletAddress} />
          </span>
        </div>
        {order.txHash && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">TX Hash:</span>
            <span className="text-primary font-mono text-xs flex items-center gap-1">
              {order.txHash.slice(0, 12)}...
              <ExternalLink className="h-3 w-3" />
            </span>
          </div>
        )}
      </div>

      {/* Wire instructions */}
      <div className="bg-card border border-border rounded-xl p-6 mb-6">
        <h3 className="font-semibold text-foreground text-base border-b border-border pb-2 mb-4">Wire Instructions</h3>
        <div className="bg-secondary/20 rounded-lg p-4 text-xs font-mono space-y-2 text-muted-foreground">
          {[
            ["Bank Name", "JPMorgan Chase Bank, N.A."],
            ["Account Name", "PureGold Trading LLC"],
            ["ABA Routing", "021000021"],
            ["Account Number", "847293018475"],
            ["Reference/Memo", order.id],
            ["Amount", `$${fmt(order.usdTotal)} USD`],
          ].map(([k, v]) => (
            <div key={k} className="flex gap-2">
              <span className="w-32 shrink-0">{k}:</span>
              <span className="text-foreground">{v}</span>
              <CopyButton text={v} />
            </div>
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-card border border-border rounded-xl p-6 mb-6">
        <h3 className="font-semibold text-foreground text-base border-b border-border pb-2 mb-4">Order Timeline</h3>
        <div className="space-y-3">
          {events.map((event, i) => (
            <div key={i} className="flex gap-3 items-start">
              <div className="shrink-0 h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center mt-0.5">
                <div className="h-2 w-2 rounded-full bg-primary" />
              </div>
              <p className="text-sm text-foreground">{event}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-3">
        <button onClick={() => window.print()} className="flex-1 border border-border text-foreground py-3 rounded-lg font-semibold hover:bg-secondary/50 transition-colors text-sm flex items-center justify-center gap-2">
          <Download className="h-4 w-4" /> Download PDF
        </button>
        <Link href="/contact" className="flex-1 bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors text-sm flex items-center justify-center gap-2">
          Need Help?
        </Link>
      </div>
    </div>
  );
}

function OrdersList() {
  const [orders, setOrders] = useState<OTCOrder[]>([]);
  const [, setLocation] = useLocation();

  useEffect(() => {
    setOrders(getOTCOrders());
  }, []);

  const fmt = (n: number) => n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-foreground">₿ Bitcoin OTC Orders</h2>
        <Link href="/bitcoin-otc/apply" className="text-sm bg-primary text-primary-foreground px-4 py-2 rounded-lg font-semibold hover:bg-primary/90 transition-colors">
          + New OTC Order
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-20 bg-card border border-border rounded-xl">
          <div className="text-5xl mb-4">₿</div>
          <h3 className="text-lg font-semibold text-foreground mb-2">No OTC orders yet</h3>
          <p className="text-muted-foreground text-sm mb-6">Submit your first Bitcoin OTC purchase application.</p>
          <Link href="/bitcoin-otc/apply" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors text-sm">
            ₿ Apply to Buy Bitcoin →
          </Link>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-secondary/30 border-b border-border">
                <tr>
                  {["Order ID","BTC Amount","USD Total","Status","Date",""].map(h => (
                    <th key={h} className="py-3 px-4 text-left text-muted-foreground font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {orders.map(order => {
                  const { text, color, dot } = statusLabel(order.status);
                  return (
                    <tr key={order.id} className="border-b border-border/40 hover:bg-secondary/10 transition-colors">
                      <td className="py-3 px-4 font-mono font-semibold text-primary">{order.id}</td>
                      <td className="py-3 px-4 font-mono text-foreground">{order.btcAmount.toFixed(4)} BTC</td>
                      <td className="py-3 px-4 font-mono text-foreground">${fmt(order.usdTotal)}</td>
                      <td className="py-3 px-4">
                        <span className={`flex items-center gap-1.5 ${color} font-semibold`}>
                          <span className={`h-2 w-2 rounded-full ${dot}`} /> {text}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">{new Date(order.submittedAt).toLocaleDateString()}</td>
                      <td className="py-3 px-4">
                        <button onClick={() => setLocation(`/account/otc-orders/${order.id}`)}
                          className="text-xs text-primary hover:underline font-medium">
                          View →
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default function OTCOrdersPage() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [matchDetail, params] = useRoute("/account/otc-orders/:id");

  useEffect(() => {
    if (!user) setLocation("/account/login?redirect=/account/otc-orders");
  }, [user, setLocation]);

  if (!user) return null;

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      {matchDetail && params?.id ? (
        <OrderDetail orderId={params.id} />
      ) : (
        <OrdersList />
      )}
    </div>
  );
}
