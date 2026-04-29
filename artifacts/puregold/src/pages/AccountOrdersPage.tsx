import { useEffect, useState, useRef } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { Package, ChevronDown, ChevronUp, Upload, CheckCircle, X, Clock, AlertTriangle, LogOut, Heart, Bell, Bitcoin } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ApiOrder {
  id: string;
  orderNumber: string;
  status: string;
  items: Array<{ name: string; price: number; quantity: number; image?: string }>;
  subtotal: number;
  shipping: number;
  insurance: number;
  total: number;
  shippingAddress: {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    email: string;
    phone?: string;
  };
  bankName: string | null;
  bankAddress: string | null;
  accountName: string | null;
  accountNumber: string | null;
  routingNumber: string | null;
  swiftCode: string | null;
  wireDeadline: string | null;
  createdAt: string;
}

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; border: string }> = {
  pending_wire_instructions: { label: "Awaiting Wire Instructions", color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/30" },
  wire_pending:              { label: "Wire Instructions Sent",     color: "text-blue-400",   bg: "bg-blue-500/10",   border: "border-blue-500/30" },
  wire_received:             { label: "Receipt Received — Verifying", color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/30" },
  completed:                 { label: "Completed",  color: "text-green-400", bg: "bg-green-500/10",      border: "border-green-500/30" },
  cancelled:                 { label: "Cancelled",  color: "text-red-400",   bg: "bg-red-500/10",        border: "border-red-500/30" },
  declined:                  { label: "Declined",   color: "text-red-400",   bg: "bg-red-500/10",        border: "border-red-500/30" },
};

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

function ReceiptModal({ orderId, userEmail, onClose, onDone }: { orderId: string; userEmail: string; onClose: () => void; onDone: () => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (f: File) => {
    if (f.size > 10 * 1024 * 1024) { setError("File must be under 10MB."); return; }
    const reader = new FileReader();
    reader.onload = e => { setPreview(e.target?.result as string); setFile(f); };
    reader.readAsDataURL(f);
  };

  const handleSubmit = async () => {
    if (!preview) return;
    setSubmitting(true); setError(null);
    try {
      const res = await fetch("/api/orders/receipt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, userEmail, receiptFile: preview }),
      });
      const data = await res.json();
      if (data.success) { setDone(true); onDone(); }
      else setError(data.error || "Failed to send. Please try again.");
    } catch { setError("Network error. Please try again."); }
    finally { setSubmitting(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
      <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-foreground">Upload Wire Receipt</h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X className="h-5 w-5" /></button>
        </div>
        {done ? (
          <div className="text-center py-6">
            <CheckCircle className="h-14 w-14 text-green-400 mx-auto mb-3" />
            <h4 className="text-lg font-bold text-green-400 mb-2">Receipt Submitted</h4>
            <p className="text-sm text-muted-foreground mb-4">Our team will verify your wire and confirm within a few hours.</p>
            <button onClick={onClose} className="bg-primary text-primary-foreground px-6 py-2.5 rounded-lg font-semibold text-sm">Close</button>
          </div>
        ) : (
          <>
            <p className="text-sm text-muted-foreground mb-4">Upload a screenshot or PDF of your bank wire confirmation.</p>
            {preview ? (
              <div className="relative mb-4 rounded-xl overflow-hidden border border-border">
                {file?.type === "application/pdf"
                  ? <div className="h-32 flex items-center justify-center bg-secondary/30 text-sm">📄 {file.name}</div>
                  : <img src={preview} alt="Receipt" className="w-full max-h-48 object-contain bg-black/30" />
                }
                <button onClick={() => { setFile(null); setPreview(null); }} className="absolute top-2 right-2 bg-black/70 text-white rounded-full p-1">
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              <button onClick={() => inputRef.current?.click()} className="w-full border-2 border-dashed border-border hover:border-primary/50 rounded-xl py-8 flex flex-col items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4">
                <Upload className="h-8 w-8" />
                <span className="text-sm font-medium">Click to upload</span>
                <span className="text-xs">JPG, PNG or PDF — max 10MB</span>
              </button>
            )}
            <input ref={inputRef} type="file" accept="image/*,application/pdf" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
            {error && <div className="bg-destructive/10 border border-destructive/30 rounded-lg px-3 py-2 text-sm text-destructive mb-3">{error}</div>}
            <div className="flex gap-3">
              <button onClick={onClose} className="flex-1 border border-border py-2.5 rounded-lg text-sm font-semibold hover:bg-secondary/50 transition-colors">Cancel</button>
              <button onClick={handleSubmit} disabled={!preview || submitting} className="flex-1 bg-green-600 text-white py-2.5 rounded-lg text-sm font-bold hover:bg-green-500 disabled:opacity-50 transition-colors">
                {submitting ? "Sending…" : "Submit Receipt"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function WireCountdown({ deadline }: { deadline: string }) {
  const countdown = useCountdown(deadline);
  if (!countdown) return null;
  if (countdown.expired) return <span className="text-xs text-red-400 font-semibold">⏰ EXPIRED</span>;
  return (
    <span className="inline-flex items-center gap-1 text-xs font-mono text-amber-400">
      <Clock className="h-3 w-3" />
      {String(countdown.h).padStart(2, "0")}:{String(countdown.m).padStart(2, "0")}:{String(countdown.s).padStart(2, "0")} left
    </span>
  );
}

function OrderCard({ order, userEmail, onRefresh }: { order: ApiOrder; userEmail: string; onRefresh: () => void }) {
  const [expanded, setExpanded] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const cfg = STATUS_CONFIG[order.status] || { label: order.status, color: "text-muted-foreground", bg: "bg-secondary/20", border: "border-border" };
  const isWireActive = order.status === "wire_pending";
  const isPendingSetup = order.status === "pending_wire_instructions";
  const hasBankDetails = order.bankName && order.accountNumber;
  const countdown = useCountdown(isWireActive ? order.wireDeadline : null);
  const isExpired = countdown?.expired ?? false;

  return (
    <>
      {showReceipt && (
        <ReceiptModal
          orderId={order.id}
          userEmail={userEmail}
          onClose={() => setShowReceipt(false)}
          onDone={() => { setShowReceipt(false); onRefresh(); }}
        />
      )}

      <div className={`bg-card border rounded-xl overflow-hidden ${(isWireActive || isPendingSetup) ? cfg.border : "border-border"}`}>
        <button
          className="w-full flex items-center gap-3 p-4 sm:p-5 hover:bg-secondary/20 transition-colors text-left"
          onClick={() => setExpanded(e => !e)}
        >
          <div className="w-10 h-10 rounded-full bg-secondary/40 flex items-center justify-center shrink-0">
            <Package className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono font-bold text-sm text-primary">{order.orderNumber}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${cfg.color} ${cfg.bg} ${cfg.border}`}>
                {cfg.label}
              </span>
              {isWireActive && order.wireDeadline && !isExpired && (
                <WireCountdown deadline={order.wireDeadline} />
              )}
            </div>
            <div className="flex items-center gap-3 mt-0.5 text-xs text-muted-foreground">
              <span>{new Date(order.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
              <span>·</span>
              <span>{order.items.length} item{order.items.length !== 1 ? "s" : ""}</span>
              <span>·</span>
              <span className="font-semibold text-foreground">${Number(order.total).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
            </div>
          </div>
          {expanded ? <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0" /> : <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />}
        </button>

        {expanded && (
          <div className="border-t border-border p-4 sm:p-5 space-y-5">

            {/* Items */}
            <div>
              <h4 className="text-xs font-semibold text-primary uppercase tracking-wider mb-3">Items Ordered</h4>
              <div className="space-y-2">
                {order.items.map((item, i) => (
                  <div key={i} className="flex items-center justify-between gap-3 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="bg-secondary/40 text-xs font-semibold px-2 py-0.5 rounded text-muted-foreground shrink-0">{item.quantity}×</span>
                      <span className="text-foreground">{item.name}</span>
                    </div>
                    <span className="font-mono text-sm font-semibold text-foreground shrink-0">
                      ${(item.price * item.quantity).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                ))}
                <div className="border-t border-border pt-2 mt-1 space-y-1 text-xs">
                  {order.shipping > 0 && (
                    <div className="flex justify-between text-muted-foreground">
                      <span>Shipping</span><span className="font-mono">${order.shipping.toFixed(2)}</span>
                    </div>
                  )}
                  {order.insurance > 0 && (
                    <div className="flex justify-between text-muted-foreground">
                      <span>Insurance</span><span className="font-mono">${order.insurance.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-sm text-foreground pt-1">
                    <span>Total</span><span className="font-mono text-primary">${Number(order.total).toLocaleString(undefined, { minimumFractionDigits: 2 })} USD</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping address */}
            <div>
              <h4 className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">Ship To</h4>
              <div className="text-sm text-muted-foreground space-y-0.5">
                <p className="text-foreground font-medium">{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
                <p>{order.shippingAddress.address}</p>
                <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}</p>
                {order.shippingAddress.phone && <p>{order.shippingAddress.phone}</p>}
              </div>
            </div>

            {/* Wire instructions — awaiting setup */}
            {isPendingSetup && (
              <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-4 w-4 text-amber-400" />
                  <h4 className="font-semibold text-amber-300 text-sm">Wire Instructions Coming Soon</h4>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Our team is preparing your personalized bank wire instructions. You'll receive them via email shortly — typically within a few hours during business hours. Do <strong>not</strong> send any wire until you receive official instructions with bank details.
                </p>
              </div>
            )}

            {/* Wire instructions — full details */}
            {isWireActive && hasBankDetails && (
              <div className={`rounded-xl border p-4 ${isExpired ? "border-red-500/30 bg-red-500/10" : "border-amber-500/30 bg-amber-500/10"}`}>
                <div className="flex items-center gap-2 mb-3">
                  <Clock className={`h-4 w-4 ${isExpired ? "text-red-400" : "text-amber-400"}`} />
                  <h4 className={`font-semibold text-sm ${isExpired ? "text-red-400" : "text-amber-300"}`}>
                    {isExpired ? "Wire Deadline Expired" : "⚡ Complete Your Wire Transfer"}
                  </h4>
                </div>

                {!isExpired && countdown && (
                  <div className="flex gap-2 mb-4">
                    {[{ label: "HRS", val: countdown.h }, { label: "MIN", val: countdown.m }, { label: "SEC", val: countdown.s }].map(({ label, val }) => (
                      <div key={label} className="flex-1 bg-black/40 rounded-lg py-2 text-center">
                        <div className="text-xl font-mono font-bold text-amber-300">{String(val).padStart(2, "0")}</div>
                        <div className="text-[10px] text-amber-400/70 font-medium mt-0.5">{label}</div>
                      </div>
                    ))}
                  </div>
                )}

                {isExpired ? (
                  <p className="text-sm text-red-300">Your 4-hour window has closed. Contact <strong>support@goldbuller.com</strong> to get updated wire instructions.</p>
                ) : (
                  <>
                    <div className="bg-black/30 rounded-xl p-4 mb-4 space-y-2">
                      <p className="text-xs font-bold text-primary uppercase tracking-wider mb-3">🏦 Bank Wire Instructions</p>
                      {[
                        ["Bank Name", order.bankName],
                        ["Account Name", order.accountName],
                        ["Account Number", order.accountNumber],
                        ["Routing Number (ABA)", order.routingNumber],
                        order.swiftCode ? ["SWIFT / BIC", order.swiftCode] : null,
                        order.bankAddress ? ["Bank Address", order.bankAddress] : null,
                        ["Reference / Memo", order.orderNumber],
                        ["Amount Due", `$${Number(order.total).toLocaleString(undefined, { minimumFractionDigits: 2 })} USD`],
                      ].filter((x): x is string[] => x !== null).map(([k, v]) => (
                        <div key={k} className="flex justify-between gap-2 text-sm">
                          <span className="text-muted-foreground shrink-0">{k}:</span>
                          <span className="text-foreground font-mono font-semibold text-right text-xs sm:text-sm break-all">{v}</span>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-amber-400/80 mb-4">⚠️ Always include the order number as the wire memo/reference.</p>
                    <button
                      onClick={() => setShowReceipt(true)}
                      className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-500 text-white font-bold py-3 rounded-xl text-sm transition-colors"
                    >
                      <CheckCircle className="h-4 w-4" />
                      I Have Paid — Upload Wire Receipt
                    </button>
                  </>
                )}
              </div>
            )}

            {/* Receipt received */}
            {order.status === "wire_received" && (
              <div className="rounded-xl border border-purple-500/30 bg-purple-500/10 p-4">
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle className="h-4 w-4 text-purple-400" />
                  <h4 className="font-semibold text-purple-300 text-sm">Wire Receipt Received — Under Verification</h4>
                </div>
                <p className="text-sm text-muted-foreground">Our compliance team is verifying your wire. You'll be notified once confirmed, usually within a few hours.</p>
              </div>
            )}

            {/* Completed */}
            {order.status === "completed" && (
              <div className="rounded-xl border border-green-500/30 bg-green-500/10 p-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <h4 className="font-semibold text-green-400 text-sm">Order Confirmed — Processing for Shipment</h4>
                </div>
              </div>
            )}

            {/* Cancelled or declined */}
            {(order.status === "cancelled" || order.status === "declined") && (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4">
                <div className="flex items-center gap-2 mb-1">
                  <AlertTriangle className="h-4 w-4 text-red-400" />
                  <h4 className="font-semibold text-red-400 text-sm">Order {order.status === "cancelled" ? "Cancelled" : "Declined"}</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  Contact <a href="mailto:support@goldbuller.com" className="text-primary hover:underline">support@goldbuller.com</a> if you have questions.
                </p>
                <Link href="/" className="mt-3 inline-block text-sm text-primary hover:underline">Browse products →</Link>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default function AccountOrdersPage() {
  const { user, logout } = useAuth();
  const [, setLocation] = useLocation();
  const [orders, setOrders] = useState<ApiOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) { setLocation("/account/login?redirect=/account/orders"); return; }
  }, [user, setLocation]);

  const fetchOrders = async () => {
    if (!user?.email) return;
    setLoading(true); setError(null);
    try {
      const res = await fetch(`/api/orders?email=${encodeURIComponent(user.email)}`);
      const data = await res.json();
      if (data.success) setOrders(data.orders || []);
      else setError("Failed to load orders.");
    } catch {
      setError("Network error loading orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, [user?.email]);

  if (!user) return null;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-64 shrink-0">
          <div className="bg-card border border-border rounded-lg overflow-hidden sticky top-24">
            <div className="p-6 border-b border-border bg-secondary/20">
              <h2 className="font-serif font-bold text-xl">{user.name || "Account"}</h2>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
            <nav className="flex flex-col p-2">
              <Link href="/account/dashboard" className="px-4 py-3 text-sm font-medium hover:bg-secondary/50 rounded transition-colors text-foreground">Dashboard</Link>
              <Link href="/account/orders" className="px-4 py-3 text-sm font-medium rounded transition-colors bg-primary/10 text-primary flex items-center justify-between">
                Orders <Package className="h-4 w-4" />
              </Link>
              <Link href="/account/otc-orders" className="px-4 py-3 text-sm font-medium hover:bg-secondary/50 rounded transition-colors text-orange-400 flex items-center gap-1.5">
                <Bitcoin className="h-4 w-4" /> Bitcoin OTC Orders
              </Link>
              <Link href="/account/watchlist" className="px-4 py-3 text-sm font-medium hover:bg-secondary/50 rounded transition-colors text-foreground flex items-center justify-between">
                Watchlist <Heart className="h-4 w-4 text-muted-foreground" />
              </Link>
              <Link href="/account/price-alerts" className="px-4 py-3 text-sm font-medium hover:bg-secondary/50 rounded transition-colors text-foreground flex items-center justify-between">
                Price Alerts <Bell className="h-4 w-4 text-muted-foreground" />
              </Link>
              <Link href="/account/kyc" className="px-4 py-3 text-sm font-medium hover:bg-secondary/50 rounded transition-colors text-foreground flex items-center justify-between">
                <span>KYC Status</span>
                <span className="h-2 w-2 rounded-full bg-orange-400" />
              </Link>
              <button
                onClick={() => { logout(); setLocation("/"); }}
                className="px-4 py-3 text-sm font-medium hover:bg-destructive/10 text-destructive rounded transition-colors text-left flex items-center justify-between mt-4"
              >
                Sign Out <LogOut className="h-4 w-4" />
              </button>
            </nav>
          </div>
        </aside>

        <main className="flex-1">
          <div className="flex items-center gap-3 mb-8">
            <Package className="h-6 w-6 text-primary" />
            <h1 className="text-3xl font-serif font-bold text-foreground">Order History</h1>
            {!loading && orders.length > 0 && (
              <span className="text-sm text-muted-foreground ml-auto">{orders.length} order{orders.length !== 1 ? "s" : ""}</span>
            )}
          </div>

          {loading && (
            <div className="text-center py-16 text-muted-foreground">
              <Package className="h-10 w-10 mx-auto mb-4 animate-pulse text-primary/50" />
              <p className="text-sm">Loading your orders…</p>
            </div>
          )}

          {!loading && error && (
            <div className="bg-destructive/10 border border-destructive/30 rounded-xl p-5 flex items-center gap-3 text-destructive">
              <AlertTriangle className="h-5 w-5 shrink-0" />
              <div>
                <p className="font-semibold text-sm">{error}</p>
                <button onClick={fetchOrders} className="text-xs underline mt-1 hover:no-underline">Try again</button>
              </div>
            </div>
          )}

          {!loading && !error && orders.length === 0 && (
            <div className="bg-card border border-border rounded-xl p-12 text-center">
              <Package className="h-12 w-12 text-muted-foreground/40 mx-auto mb-4" />
              <h2 className="text-lg font-semibold text-foreground mb-2">No orders yet</h2>
              <p className="text-sm text-muted-foreground mb-6">Your precious metals orders will appear here once placed.</p>
              <Button asChild><Link href="/">Start Shopping →</Link></Button>
            </div>
          )}

          {!loading && !error && orders.length > 0 && (
            <div className="space-y-3">
              {orders.map(order => (
                <OrderCard key={order.id} order={order} userEmail={user.email} onRefresh={fetchOrders} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
