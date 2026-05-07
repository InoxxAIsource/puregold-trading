import { useState, useEffect } from "react";
import { Link, useLocation, useRoute } from "wouter";
import { Copy, Check, ExternalLink, Download, ChevronLeft, Clock, CheckCircle, Upload, X, AlertTriangle } from "lucide-react";
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

interface ApiOrder {
  id: string;
  orderNumber: string;
  status: string;
  bankName: string | null;
  bankAddress: string | null;
  accountName: string | null;
  accountNumber: string | null;
  routingNumber: string | null;
  swiftCode: string | null;
  wireDeadline: string | null;
  total: number;
}

function useCountdown(deadline: string | null) {
  const [timeLeft, setTimeLeft] = useState<{ h: number; m: number; s: number; expired: boolean } | null>(null);
  useEffect(() => {
    if (!deadline) { setTimeLeft(null); return; }
    const tick = () => {
      const diff = new Date(deadline).getTime() - Date.now();
      if (diff <= 0) { setTimeLeft({ h: 0, m: 0, s: 0, expired: true }); return; }
      setTimeLeft({ h: Math.floor(diff / 3600000), m: Math.floor((diff % 3600000) / 60000), s: Math.floor((diff % 60000) / 1000), expired: false });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [deadline]);
  return timeLeft;
}

function ReceiptUploadModal({ orderId, userEmail, onClose, onDone }: { orderId: string; userEmail: string; onClose: () => void; onDone: () => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = (f: File) => {
    if (f.size > 10 * 1024 * 1024) { setError("File must be under 10MB."); return; }
    const reader = new FileReader();
    reader.onload = e => { setPreview(e.target?.result as string); setFile(f); };
    reader.readAsDataURL(f);
  };

  const handleSubmit = async () => {
    if (!preview) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/orders/receipt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, userEmail, receiptFile: preview }),
      });
      const data = await res.json();
      if (data.success) { setDone(true); onDone(); }
      else setError(data.error || "Failed to send. Please try again.");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
      <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-foreground">Upload Payment Receipt</h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors"><X className="h-5 w-5" /></button>
        </div>
        {done ? (
          <div className="text-center py-6">
            <CheckCircle className="h-14 w-14 text-green-400 mx-auto mb-3" />
            <h4 className="text-lg font-bold text-green-400 mb-2">Receipt Submitted</h4>
            <p className="text-sm text-muted-foreground mb-4">Our team has been notified and will confirm your wire within a few hours.</p>
            <button onClick={onClose} className="bg-primary text-primary-foreground px-6 py-2.5 rounded-lg font-semibold text-sm hover:bg-primary/90 transition-colors">Close</button>
          </div>
        ) : (
          <>
            <p className="text-sm text-muted-foreground mb-4">Upload a screenshot or PDF of your bank wire confirmation.</p>
            {preview ? (
              <div className="relative mb-4 rounded-xl overflow-hidden border border-border">
                {file?.type === "application/pdf" ? (
                  <div className="h-32 flex items-center justify-center bg-secondary/30 text-sm text-foreground">📄 {file.name}</div>
                ) : (
                  <img src={preview} alt="Receipt" className="w-full max-h-48 object-contain bg-black/30" />
                )}
                <button onClick={() => { setFile(null); setPreview(null); }} className="absolute top-2 right-2 bg-black/70 text-white rounded-full p-1 hover:bg-black transition-colors">
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              <label className="w-full border-2 border-dashed border-border hover:border-primary/50 rounded-xl py-8 flex flex-col items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4 cursor-pointer">
                <Upload className="h-8 w-8" />
                <span className="text-sm font-medium">Click to upload receipt</span>
                <span className="text-xs">JPG, PNG or PDF — max 10MB</span>
                <input type="file" accept="image/*,application/pdf" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
              </label>
            )}
            {error && <div className="bg-destructive/10 border border-destructive/30 rounded-lg px-3 py-2 text-sm text-destructive mb-3">{error}</div>}
            <div className="flex gap-3">
              <button onClick={onClose} className="flex-1 border border-border text-foreground py-2.5 rounded-lg text-sm font-semibold hover:bg-secondary/50 transition-colors">Cancel</button>
              <button onClick={handleSubmit} disabled={!preview || submitting} className="flex-1 bg-green-600 text-white py-2.5 rounded-lg text-sm font-bold hover:bg-green-500 transition-colors disabled:opacity-50">
                {submitting ? "Sending…" : "Submit Receipt"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function WireInstructionsCard({ apiOrder, userEmail, onReceiptDone }: { apiOrder: ApiOrder; userEmail: string; onReceiptDone: () => void }) {
  const countdown = useCountdown(apiOrder.wireDeadline);
  const [showReceipt, setShowReceipt] = useState(false);
  const isExpired = countdown?.expired ?? false;
  const hasBankDetails = apiOrder.bankName && apiOrder.accountNumber;

  if (apiOrder.status === "pending_wire_instructions") {
    return (
      <div className="rounded-xl border bg-amber-500/10 border-amber-500/30 p-5 mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Clock className="h-5 w-5 text-amber-400" />
          <h3 className="font-bold text-base text-amber-300">Wire Instructions Being Prepared</h3>
        </div>
        <p className="text-sm text-muted-foreground">
          Our OTC desk is reviewing your application and preparing personalised wire instructions. You'll receive an email at <strong className="text-foreground">{userEmail}</strong> as soon as they're ready (usually within a few hours during business hours).
        </p>
        <div className="mt-3 bg-amber-500/10 border border-amber-500/20 rounded-lg p-3 text-xs text-amber-400">
          ⚠️ Do <strong>not</strong> send any wire until you receive the official instructions with bank details.
        </div>
      </div>
    );
  }

  if (apiOrder.status === "wire_pending" && hasBankDetails) {
    return (
      <>
        {showReceipt && (
          <ReceiptUploadModal
            orderId={apiOrder.id}
            userEmail={userEmail}
            onClose={() => setShowReceipt(false)}
            onDone={() => { setShowReceipt(false); onReceiptDone(); }}
          />
        )}
        <div className={`rounded-xl border p-5 mb-6 ${isExpired ? "bg-red-500/10 border-red-500/30" : "bg-amber-500/10 border-amber-500/30"}`}>
          <div className="flex items-center gap-2 mb-1">
            <Clock className={`h-5 w-5 ${isExpired ? "text-red-400" : "text-amber-400"}`} />
            <h3 className={`font-bold text-base ${isExpired ? "text-red-400" : "text-amber-300"}`}>
              {isExpired ? "Wire Deadline Expired" : "⚡ Wire Transfer Required — Time Sensitive"}
            </h3>
          </div>
          <p className="text-xs text-muted-foreground mb-3">Order: <span className="font-mono font-semibold text-foreground">{apiOrder.orderNumber}</span></p>

          {countdown && !isExpired && (
            <div className="flex gap-2 mb-4">
              {[{ label: "HRS", val: countdown.h }, { label: "MIN", val: countdown.m }, { label: "SEC", val: countdown.s }].map(({ label, val }) => (
                <div key={label} className="flex-1 bg-black/40 rounded-lg py-2 text-center">
                  <div className="text-2xl font-mono font-bold text-amber-300">{String(val).padStart(2, "0")}</div>
                  <div className="text-[10px] text-amber-400/70 font-medium mt-0.5">{label}</div>
                </div>
              ))}
            </div>
          )}

          {isExpired && (
            <p className="text-sm text-red-300 mb-4">
              Your 4-hour wire window has closed. Please contact <strong>support@goldbuller.com</strong> to get a fresh quote and updated wire instructions.
            </p>
          )}

          {!isExpired && (
            <div className="bg-black/30 rounded-xl p-4 mb-4">
              <p className="text-xs font-bold text-primary uppercase tracking-wider mb-3">🏦 Wire Instructions</p>
              <div className="space-y-1.5 text-sm">
                {([
                  ["Bank Name", apiOrder.bankName],
                  ["Account Name", apiOrder.accountName],
                  ["Account Number", apiOrder.accountNumber],
                  ["Routing (ABA)", apiOrder.routingNumber],
                  apiOrder.swiftCode ? ["SWIFT / BIC", apiOrder.swiftCode] : null,
                  apiOrder.bankAddress ? ["Bank Address", apiOrder.bankAddress] : null,
                  ["Reference / Memo", apiOrder.orderNumber],
                  ["Amount Due", `$${Number(apiOrder.total).toLocaleString(undefined, { minimumFractionDigits: 2 })} USD`],
                ] as (string[] | null)[]).filter((x): x is string[] => x !== null).map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-2 items-center">
                    <span className="text-muted-foreground shrink-0">{k}:</span>
                    <span className="text-foreground font-mono font-semibold text-right text-xs break-all flex items-center gap-1">
                      {v}
                      <CopyButton text={v} />
                    </span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-amber-400/80 mt-3">⚠️ Always include the reference number in the wire memo field.</p>
            </div>
          )}

          {!isExpired && (
            <button
              onClick={() => setShowReceipt(true)}
              className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-500 text-white font-bold py-3 rounded-xl text-sm transition-colors"
            >
              <CheckCircle className="h-4 w-4" />
              I Have Paid — Upload Wire Receipt
            </button>
          )}
        </div>
      </>
    );
  }

  if (apiOrder.status === "wire_received") {
    return (
      <div className="rounded-xl border bg-purple-500/10 border-purple-500/30 p-5 mb-6">
        <div className="flex items-center gap-2 mb-2">
          <CheckCircle className="h-5 w-5 text-purple-400" />
          <h3 className="font-bold text-base text-purple-300">Wire Receipt Received — Verifying</h3>
        </div>
        <p className="text-sm text-muted-foreground">We've received your wire confirmation. Our compliance team is verifying the payment. BTC will be dispatched to your wallet once confirmed.</p>
      </div>
    );
  }

  if (apiOrder.status === "completed") {
    return (
      <div className="rounded-xl border bg-green-500/10 border-green-500/30 p-5 mb-6">
        <div className="flex items-center gap-2 mb-2">
          <CheckCircle className="h-5 w-5 text-green-400" />
          <h3 className="font-bold text-base text-green-300">Order Completed</h3>
        </div>
        <p className="text-sm text-muted-foreground">This OTC order has been fully settled. BTC has been dispatched to your specified wallet.</p>
      </div>
    );
  }

  if (apiOrder.status === "cancelled" || apiOrder.status === "declined") {
    return (
      <div className="rounded-xl border bg-red-500/10 border-red-500/30 p-5 mb-6">
        <div className="flex items-center gap-2 mb-2">
          <AlertTriangle className="h-5 w-5 text-red-400" />
          <h3 className="font-bold text-base text-red-300">Order {apiOrder.status === "cancelled" ? "Cancelled" : "Declined"}</h3>
        </div>
        <p className="text-sm text-muted-foreground">This order has been {apiOrder.status}. Contact <a href="mailto:otc@goldbuller.com" className="text-primary hover:underline">otc@goldbuller.com</a> if you need help.</p>
      </div>
    );
  }

  return null;
}

const TIMELINE_EVENTS: Record<string, string[]> = {
  submitted:      ["Application submitted", "Awaiting wire instructions"],
  wire_awaited:   ["Application submitted", "Wire instructions sent"],
  wire_received:  ["Application submitted", "Wire instructions sent", "Wire payment received"],
  btc_dispatched: ["Application submitted", "Wire instructions sent", "Wire payment received", "BTC transaction broadcast"],
  settled:        ["Application submitted", "Wire instructions sent", "Wire payment received", "BTC transaction broadcast", "BTC confirmed in wallet"],
  expired:        ["Application submitted", "Wire instructions sent", "Order expired — wire not received in time"],
  cancelled:      ["Application submitted", "Order cancelled"],
  pending_wire_instructions: ["Application submitted", "Wire instructions being prepared…"],
  wire_pending:   ["Application submitted", "Wire instructions sent — awaiting your payment"],
  completed:      ["Application submitted", "Wire instructions sent", "Wire payment received", "BTC dispatched & confirmed"],
};

function OrderDetail({ orderId }: { orderId: string }) {
  const { user } = useAuth();
  const [order, setOrder] = useState<OTCOrder | null>(null);
  const [apiOrder, setApiOrder] = useState<ApiOrder | null>(null);
  const [, setLocation] = useLocation();

  const fetchApiOrder = async () => {
    if (!user?.email) return;
    try {
      const res = await fetch(`/api/orders?email=${encodeURIComponent(user.email)}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.orders)) {
        const match = data.orders.find((o: ApiOrder) => o.orderNumber === orderId);
        if (match) setApiOrder(match);
      }
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    setOrder(getOTCOrderById(orderId));
    fetchApiOrder();
  }, [orderId, user?.email]);

  if (!order && !apiOrder) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground">Order not found.</p>
        <Link href="/account/otc-orders" className="text-primary text-sm hover:underline mt-2 inline-block">← Back to orders</Link>
      </div>
    );
  }

  const displayId = order?.id ?? apiOrder?.orderNumber ?? orderId;
  const submittedAt = order?.submittedAt ?? new Date().toISOString();
  const fmt = (n: number) => n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  // Status to show: prefer the DB status (more accurate) over localStorage
  const dbStatus = apiOrder?.status;
  const localStatus = order?.status;
  const displayStatus = dbStatus ?? localStatus ?? "submitted";

  const timelineEvents = TIMELINE_EVENTS[dbStatus ?? ""] || TIMELINE_EVENTS[localStatus ?? ""] || TIMELINE_EVENTS["submitted"];

  return (
    <div className="max-w-2xl mx-auto">
      <button onClick={() => setLocation("/account/otc-orders")} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
        <ChevronLeft className="h-4 w-4" /> Back to OTC Orders
      </button>

      <div className="flex items-start justify-between flex-wrap gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-xl font-bold text-foreground font-mono">{displayId}</h2>
            <CopyButton text={displayId} />
          </div>
          <p className="text-sm text-muted-foreground">{new Date(submittedAt).toLocaleString()}</p>
        </div>
        <span className={`text-sm font-semibold flex items-center gap-1.5 ${
          displayStatus === "completed" || displayStatus === "settled" ? "text-green-400" :
          displayStatus === "wire_pending" || displayStatus === "wire_awaited" ? "text-blue-400" :
          displayStatus === "wire_received" ? "text-purple-400" :
          displayStatus === "cancelled" || displayStatus === "declined" || displayStatus === "expired" ? "text-red-400" :
          "text-amber-400"
        }`}>
          <span className={`h-2 w-2 rounded-full ${
            displayStatus === "completed" || displayStatus === "settled" ? "bg-green-400" :
            displayStatus === "wire_pending" || displayStatus === "wire_awaited" ? "bg-blue-400" :
            displayStatus === "wire_received" ? "bg-purple-400" :
            displayStatus === "cancelled" || displayStatus === "declined" || displayStatus === "expired" ? "bg-red-400" :
            "bg-amber-400"
          }`} />
          {displayStatus === "pending_wire_instructions" ? "Preparing Wire Instructions" :
           displayStatus === "wire_pending" ? "Wire Instructions Ready" :
           displayStatus === "wire_received" ? "Receipt Received" :
           displayStatus === "completed" ? "Completed" :
           displayStatus === "cancelled" ? "Cancelled" :
           displayStatus === "declined" ? "Declined" :
           localStatus ? (statusLabel(localStatus as any)?.text ?? displayStatus) : displayStatus}
        </span>
      </div>

      {/* Wire instructions — from DB (real-time) */}
      {apiOrder && (
        <WireInstructionsCard
          apiOrder={apiOrder}
          userEmail={user?.email ?? ""}
          onReceiptDone={fetchApiOrder}
        />
      )}

      {/* Order summary */}
      {order && (
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
      )}

      {/* Timeline */}
      <div className="bg-card border border-border rounded-xl p-6 mb-6">
        <h3 className="font-semibold text-foreground text-base border-b border-border pb-2 mb-4">Order Timeline</h3>
        <div className="space-y-3">
          {timelineEvents.map((event, i) => (
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
  const { user } = useAuth();
  const [localOrders, setLocalOrders] = useState<OTCOrder[]>([]);
  const [apiOrders, setApiOrders] = useState<ApiOrder[]>([]);
  const [, setLocation] = useLocation();

  useEffect(() => {
    setLocalOrders(getOTCOrders());
    if (!user?.email) return;
    fetch(`/api/orders?email=${encodeURIComponent(user.email)}`)
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          setApiOrders((data.orders as ApiOrder[]).filter((o: ApiOrder) => o.orderNumber?.startsWith("OTC-")));
        }
      })
      .catch(() => {});
  }, [user?.email]);

  const fmt = (n: number) => n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  // Merge: prefer DB data for status, but use localStorage for BTC/USD details
  const merged = apiOrders.length > 0 ? apiOrders.map(ao => {
    const local = localOrders.find(lo => lo.id === ao.orderNumber);
    return { apiOrder: ao, local };
  }) : localOrders.map(lo => ({ apiOrder: null as ApiOrder | null, local: lo }));

  const isEmpty = merged.length === 0;

  const dbStatusLabel = (status: string) => {
    switch (status) {
      case "pending_wire_instructions": return { text: "Preparing Wire Instructions", color: "text-amber-400", dot: "bg-amber-400" };
      case "wire_pending":   return { text: "Wire Instructions Ready ⚡", color: "text-blue-400", dot: "bg-blue-400" };
      case "wire_received":  return { text: "Receipt Received", color: "text-purple-400", dot: "bg-purple-400" };
      case "completed":      return { text: "Completed", color: "text-green-400", dot: "bg-green-400" };
      case "cancelled":      return { text: "Cancelled", color: "text-zinc-400", dot: "bg-zinc-400" };
      case "declined":       return { text: "Declined", color: "text-red-400", dot: "bg-red-400" };
      default:               return { text: status, color: "text-muted-foreground", dot: "bg-zinc-400" };
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-foreground">₿ Bitcoin OTC Orders</h2>
        <Link href="/bitcoin-otc/apply" className="text-sm bg-primary text-primary-foreground px-4 py-2 rounded-lg font-semibold hover:bg-primary/90 transition-colors">
          + New OTC Order
        </Link>
      </div>

      {/* Alert banner if any order has wire instructions ready */}
      {apiOrders.some(o => o.status === "wire_pending") && (
        <div className="mb-4 bg-amber-500/10 border border-amber-500/40 rounded-xl px-4 py-3 flex items-center gap-3 text-sm text-amber-300">
          <Clock className="h-5 w-5 shrink-0 text-amber-400" />
          <span><strong>Wire instructions are ready</strong> for one or more orders. Click "View" to see the bank details and complete your payment.</span>
        </div>
      )}

      {isEmpty ? (
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
                  {["Order ID", "BTC Amount", "USD Total", "Status", "Date", ""].map(h => (
                    <th key={h} className="py-3 px-4 text-left text-muted-foreground font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {merged.map(({ apiOrder: ao, local }) => {
                  const id = ao?.orderNumber ?? local?.id ?? "";
                  const { text, color, dot } = ao
                    ? dbStatusLabel(ao.status)
                    : statusLabel((local?.status as any) ?? "submitted");
                  const btc = local?.btcAmount ?? (ao ? Number(ao.total) : 0);
                  const usd = local?.usdTotal ?? (ao ? Number(ao.total) : 0);
                  const date = local?.submittedAt ?? ao?.orderNumber ?? "";
                  const isActionable = ao?.status === "wire_pending";

                  return (
                    <tr key={id} className={`border-b border-border/40 hover:bg-secondary/10 transition-colors ${isActionable ? "bg-amber-500/5" : ""}`}>
                      <td className="py-3 px-4 font-mono font-semibold text-primary">{id}</td>
                      <td className="py-3 px-4 font-mono text-foreground">{local ? local.btcAmount.toFixed(4) : "—"} BTC</td>
                      <td className="py-3 px-4 font-mono text-foreground">${fmt(usd)}</td>
                      <td className="py-3 px-4">
                        <span className={`flex items-center gap-1.5 ${color} font-semibold`}>
                          <span className={`h-2 w-2 rounded-full ${dot}`} /> {text}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">
                        {date ? new Date(date).toLocaleDateString() : "—"}
                      </td>
                      <td className="py-3 px-4">
                        <button onClick={() => setLocation(`/account/otc-orders/${id}`)} className={`text-xs font-medium hover:underline ${isActionable ? "text-amber-400" : "text-primary"}`}>
                          {isActionable ? "⚡ View Wire →" : "View →"}
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
