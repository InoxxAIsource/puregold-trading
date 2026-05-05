import { useEffect, useState, useRef } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { useKYC } from "@/lib/kycContext";
import { getOTCOrders } from "@/lib/otcOrders";
import { LogOut, Package, Heart, Bell, Bitcoin, Upload, CheckCircle, X, Clock, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { KYCStatusBadge } from "@/components/kyc/KYCStatusBadge";

interface ApiOrder {
  id: string;
  orderNumber: string;
  status: string;
  items: Array<{ name: string; price: number; quantity: number }>;
  subtotal: number;
  total: number;
  shipping: number;
  insurance: number;
  bankName: string | null;
  bankAddress: string | null;
  accountName: string | null;
  accountNumber: string | null;
  routingNumber: string | null;
  swiftCode: string | null;
  wireDeadline: string | null;
  createdAt: string;
}

const ORDER_STATUS_LABEL: Record<string, { label: string; color: string }> = {
  pending_wire_instructions: { label: "Awaiting Wire Instructions", color: "text-amber-400" },
  wire_pending: { label: "Wire Instructions Sent", color: "text-blue-400" },
  wire_received: { label: "Receipt Received — Verifying", color: "text-purple-400" },
  completed: { label: "Completed", color: "text-green-400" },
  cancelled: { label: "Cancelled", color: "text-red-400" },
  declined: { label: "Declined", color: "text-red-400" },
};

function useCountdown(deadline: string | null) {
  const [timeLeft, setTimeLeft] = useState<{ h: number; m: number; s: number; expired: boolean } | null>(null);

  useEffect(() => {
    if (!deadline) { setTimeLeft(null); return; }
    const tick = () => {
      const diff = new Date(deadline).getTime() - Date.now();
      if (diff <= 0) { setTimeLeft({ h: 0, m: 0, s: 0, expired: true }); return; }
      setTimeLeft({
        h: Math.floor(diff / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
        expired: false,
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [deadline]);

  return timeLeft;
}

function ReceiptUploadModal({
  orderId,
  userEmail,
  onClose,
  onDone,
}: {
  orderId: string;
  userEmail: string;
  onClose: () => void;
  onDone: () => void;
}) {
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
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {done ? (
          <div className="text-center py-6">
            <CheckCircle className="h-14 w-14 text-green-400 mx-auto mb-3" />
            <h4 className="text-lg font-bold text-green-400 mb-2">Receipt Submitted</h4>
            <p className="text-sm text-muted-foreground mb-4">Our team has been notified and will confirm your wire within a few hours.</p>
            <button onClick={onClose} className="bg-primary text-primary-foreground px-6 py-2.5 rounded-lg font-semibold text-sm hover:bg-primary/90 transition-colors">
              Close
            </button>
          </div>
        ) : (
          <>
            <p className="text-sm text-muted-foreground mb-4">
              Upload a screenshot or PDF of your bank wire confirmation. Our compliance team will verify it and confirm your transaction.
            </p>

            {preview ? (
              <div className="relative mb-4 rounded-xl overflow-hidden border border-border">
                {file?.type === "application/pdf" ? (
                  <div className="h-32 flex items-center justify-center bg-secondary/30 text-sm text-foreground">
                    📄 {file.name}
                  </div>
                ) : (
                  <img src={preview} alt="Receipt" className="w-full max-h-48 object-contain bg-black/30" />
                )}
                <button
                  onClick={() => { setFile(null); setPreview(null); }}
                  className="absolute top-2 right-2 bg-black/70 text-white rounded-full p-1 hover:bg-black transition-colors"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => inputRef.current?.click()}
                className="w-full border-2 border-dashed border-border hover:border-primary/50 rounded-xl py-8 flex flex-col items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4"
              >
                <Upload className="h-8 w-8" />
                <span className="text-sm font-medium">Click to upload receipt</span>
                <span className="text-xs">JPG, PNG or PDF — max 10MB</span>
              </button>
            )}

            <input
              ref={inputRef}
              type="file"
              accept="image/*,application/pdf"
              className="hidden"
              onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
            />

            {error && (
              <div className="bg-destructive/10 border border-destructive/30 rounded-lg px-3 py-2 text-sm text-destructive mb-3">{error}</div>
            )}

            <div className="flex gap-3">
              <button onClick={onClose} className="flex-1 border border-border text-foreground py-2.5 rounded-lg text-sm font-semibold hover:bg-secondary/50 transition-colors">
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={!preview || submitting}
                className="flex-1 bg-green-600 text-white py-2.5 rounded-lg text-sm font-bold hover:bg-green-500 transition-colors disabled:opacity-50"
              >
                {submitting ? "Sending…" : "Submit Receipt"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function OrderWireCard({
  order,
  userEmail,
  onStatusChange,
}: {
  order: ApiOrder;
  userEmail: string;
  onStatusChange: () => void;
}) {
  const countdown = useCountdown(order.wireDeadline);
  const [showReceipt, setShowReceipt] = useState(false);

  const hasBankDetails = order.bankName && order.accountNumber;
  const isExpired = countdown?.expired ?? false;

  if (order.status !== "wire_pending" && order.status !== "pending_wire_instructions") return null;
  if (order.status === "pending_wire_instructions") {
    return (
      <div className="rounded-xl border bg-secondary/20 border-border p-5 mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Clock className="h-5 w-5 text-amber-400" />
          <h3 className="font-bold text-base text-amber-300">Wire Instructions Pending — Order {order.orderNumber}</h3>
        </div>
        <p className="text-sm text-muted-foreground">
          Our team is preparing your personalized wire transfer instructions. You'll receive an email shortly (usually within a few hours during business hours).
        </p>
        <div className="mt-3 bg-amber-500/10 border border-amber-500/20 rounded-lg p-3 text-xs text-amber-400">
          ⚠️ Do <strong>not</strong> send any wire until you receive official instructions with bank details.
        </div>
      </div>
    );
  }

  return (
    <>
      {showReceipt && (
        <ReceiptUploadModal
          orderId={order.id}
          userEmail={userEmail}
          onClose={() => setShowReceipt(false)}
          onDone={() => { setShowReceipt(false); onStatusChange(); }}
        />
      )}

      <div className={`rounded-xl border p-5 mb-6 ${isExpired ? "bg-red-500/10 border-red-500/30" : "bg-amber-500/10 border-amber-500/30"}`}>
        <div className="flex items-center gap-2 mb-1">
          <Clock className={`h-5 w-5 ${isExpired ? "text-red-400" : "text-amber-400"}`} />
          <h3 className={`font-bold text-base ${isExpired ? "text-red-400" : "text-amber-300"}`}>
            {isExpired ? "Wire Deadline Expired" : "⚡ Wire Transfer Required — Time Sensitive"}
          </h3>
        </div>
        <p className="text-xs text-muted-foreground mb-3">Order: <span className="font-mono font-semibold text-foreground">{order.orderNumber}</span></p>

        {countdown && !isExpired && (
          <div className="flex gap-2 mb-4">
            {[
              { label: "HRS", val: countdown.h },
              { label: "MIN", val: countdown.m },
              { label: "SEC", val: countdown.s },
            ].map(({ label, val }) => (
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

        {hasBankDetails && !isExpired && (
          <div className="bg-black/30 rounded-xl p-4 mb-4">
            <p className="text-xs font-bold text-primary uppercase tracking-wider mb-3">🏦 Wire Instructions</p>
            <div className="space-y-1.5 text-sm">
              {(
                [
                  ["Bank Name", order.bankName],
                  ["Account Name", order.accountName],
                  ["Account Number", order.accountNumber],
                  ["Routing (ABA)", order.routingNumber],
                  order.swiftCode ? ["SWIFT / BIC", order.swiftCode] : null,
                  order.bankAddress ? ["Bank Address", order.bankAddress] : null,
                  ["Reference / Memo", order.orderNumber],
                  ["Amount Due", `$${Number(order.total).toLocaleString(undefined, { minimumFractionDigits: 2 })} USD`],
                ] as (string[] | null)[]
              ).filter((x): x is string[] => x !== null).map(([k, v]) => (
                <div key={k} className="flex justify-between gap-2">
                  <span className="text-muted-foreground shrink-0">{k}:</span>
                  <span className="text-foreground font-mono font-semibold text-right text-xs sm:text-sm break-all">{v}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-amber-400/80 mt-3">
              ⚠️ Always include the reference number in the wire memo field.
            </p>
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

function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const { kycStatus } = useKYC();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!user) setLocation("/account/login");
  }, [user, setLocation]);

  if (!user) return null;

  const handleLogout = () => {
    logout();
    setLocation("/");
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-64 shrink-0">
          <div className="bg-card border border-border rounded-lg overflow-hidden sticky top-24">
            <div className="p-6 border-b border-border bg-secondary/20">
              <h2 className="font-serif font-bold text-xl">{user?.name || 'Account'}</h2>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
            </div>
            <nav className="flex flex-col p-2">
              <Link href="/account/dashboard" className="px-4 py-3 text-sm font-medium hover:bg-secondary/50 rounded transition-colors text-foreground">Dashboard</Link>
              <Link href="/account/orders" className="px-4 py-3 text-sm font-medium hover:bg-secondary/50 rounded transition-colors text-foreground flex items-center justify-between">
                Orders <Package className="h-4 w-4 text-muted-foreground" />
              </Link>
              <Link href="/account/otc-orders" className="px-4 py-3 text-sm font-medium hover:bg-secondary/50 rounded transition-colors text-orange-400 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Bitcoin className="h-4 w-4" /> Bitcoin OTC Orders
                </span>
              </Link>
              <Link href="/account/watchlist" className="px-4 py-3 text-sm font-medium hover:bg-secondary/50 rounded transition-colors text-foreground flex items-center justify-between">
                Watchlist <Heart className="h-4 w-4 text-muted-foreground" />
              </Link>
              <Link href="/account/price-alerts" className="px-4 py-3 text-sm font-medium hover:bg-secondary/50 rounded transition-colors text-foreground flex items-center justify-between">
                Price Alerts <Bell className="h-4 w-4 text-muted-foreground" />
              </Link>
              <Link href="/account/kyc" className="px-4 py-3 text-sm font-medium hover:bg-secondary/50 rounded transition-colors text-foreground flex items-center justify-between">
                <span>KYC Status</span>
                <span className={`h-2 w-2 rounded-full ${
                  kycStatus === "approved" ? "bg-green-500" :
                  kycStatus === "pending_review" ? "bg-blue-400" :
                  kycStatus === "rejected" ? "bg-red-500" :
                  "bg-orange-400"
                }`} />
              </Link>
              <button onClick={handleLogout} className="px-4 py-3 text-sm font-medium hover:bg-destructive/10 text-destructive rounded transition-colors text-left flex items-center justify-between mt-4">
                Sign Out <LogOut className="h-4 w-4" />
              </button>
            </nav>
          </div>
        </aside>
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function AccountDashboardPage() {
  const { kycStatus, isApproved, refreshStatus } = useKYC();
  const { user } = useAuth();
  const otcOrders = getOTCOrders();
  const pendingOTC = otcOrders.filter(o => o.status === "wire_awaited" || o.status === "submitted" || o.status === "wire_received").length;

  const [apiOrders, setApiOrders] = useState<ApiOrder[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  const fetchOrders = async () => {
    if (!user?.email) return;
    setOrdersLoading(true);
    try {
      const res = await fetch(`/api/orders?email=${encodeURIComponent(user.email)}`);
      const data = await res.json();
      if (data.success) setApiOrders(data.orders || []);
    } catch {
      // ignore
    } finally {
      setOrdersLoading(false);
    }
  };

  useEffect(() => {
    refreshStatus();
    fetchOrders();
  }, []);

  const activeWireOrders = apiOrders.filter(o =>
    o.status === "pending_wire_instructions" || o.status === "wire_pending"
  );

  const completedOrders = apiOrders.filter(o => o.status === "completed");
  const totalSpent = completedOrders.reduce((sum, o) => sum + Number(o.total), 0);
  const ordersPlaced = apiOrders.length;
  const ordersCompleted = completedOrders.length;

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-serif font-bold text-foreground mb-8">Portfolio Dashboard</h1>

      {/* Per-order wire deadline cards */}
      {activeWireOrders.map(order => (
        <OrderWireCard
          key={order.id}
          order={order}
          userEmail={user?.email || ""}
          onStatusChange={fetchOrders}
        />
      ))}

      {/* Metrics row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-card border border-border rounded-lg p-5">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Total Spent</h3>
          <div className="text-2xl font-mono font-bold text-foreground">
            {ordersLoading ? "—" : `$${totalSpent.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          </div>
          <div className="text-xs text-muted-foreground mt-1">across completed orders</div>
        </div>
        <div className="bg-card border border-border rounded-lg p-5">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Orders Placed</h3>
          <div className="text-2xl font-mono font-bold text-primary">
            {ordersLoading ? "—" : ordersPlaced}
          </div>
          <div className="text-xs text-muted-foreground mt-1">total</div>
        </div>
        <div className="bg-card border border-border rounded-lg p-5">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Orders Completed</h3>
          <div className="text-2xl font-mono font-bold text-green-400">
            {ordersLoading ? "—" : ordersCompleted}
          </div>
          <div className="text-xs text-muted-foreground mt-1">fulfilled</div>
        </div>
        <div className="bg-card border border-border rounded-lg p-5">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Active OTC Orders</h3>
          <div className="text-2xl font-mono font-bold text-orange-400">{pendingOTC}</div>
          <div className="text-xs text-muted-foreground mt-1">pending</div>
        </div>
      </div>

      {/* KYC Status Card */}
      <div className="mb-8">
        {isApproved ? (
          <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-5 flex items-center justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
                <h3 className="font-semibold text-green-400">KYC Verified — Bitcoin OTC Unlocked</h3>
              </div>
              <p className="text-sm text-muted-foreground">You can purchase 0.20–10 BTC through our OTC desk.</p>
            </div>
            <Link href="/bitcoin-otc/apply" className="bg-primary text-primary-foreground px-5 py-2.5 rounded-lg font-semibold text-sm hover:bg-primary/90 transition-colors whitespace-nowrap">
              ₿ Apply to Buy Bitcoin →
            </Link>
          </div>
        ) : (
          <div className="bg-card border border-border rounded-xl p-5 flex items-center justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-2xl">🔐</span>
                <h3 className="font-semibold text-foreground">Unlock Bitcoin OTC</h3>
              </div>
              <p className="text-sm text-muted-foreground">Complete KYC verification to buy 0.20–10 BTC. Takes ~5 minutes. Approval in 1-2 business days.</p>
              <div className="mt-2">
                <KYCStatusBadge compact={true} />
              </div>
            </div>
            <Link href="/account/kyc" className="bg-orange-400 text-black px-5 py-2.5 rounded-lg font-bold text-sm hover:bg-orange-300 transition-colors whitespace-nowrap">
              Complete KYC Now →
            </Link>
          </div>
        )}
      </div>

      {/* Recent OTC orders preview */}
      {otcOrders.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <span className="text-orange-400">₿</span> Recent OTC Orders
            </h2>
            <Link href="/account/otc-orders" className="text-xs text-primary hover:underline">View all →</Link>
          </div>
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-secondary/20 border-b border-border">
                <tr>
                  <th className="text-left py-2.5 px-4 text-xs text-muted-foreground font-medium">Order</th>
                  <th className="text-left py-2.5 px-4 text-xs text-muted-foreground font-medium">BTC</th>
                  <th className="text-left py-2.5 px-4 text-xs text-muted-foreground font-medium">Total</th>
                  <th className="text-left py-2.5 px-4 text-xs text-muted-foreground font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {otcOrders.slice(0, 3).map(order => (
                  <tr key={order.id} className="border-b border-border/40">
                    <td className="py-2.5 px-4 font-mono text-xs text-primary">{order.id}</td>
                    <td className="py-2.5 px-4 font-mono text-xs text-foreground">{order.btcAmount.toFixed(2)} BTC</td>
                    <td className="py-2.5 px-4 font-mono text-xs text-foreground">${order.usdTotal.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                    <td className="py-2.5 px-4 text-xs text-yellow-400 capitalize">{order.status.replace("_", " ")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Recent Orders from API */}
      <h2 className="text-xl font-bold mb-4">Recent Orders</h2>
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        {ordersLoading ? (
          <div className="p-8 text-center text-muted-foreground text-sm">Loading orders…</div>
        ) : apiOrders.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            You haven't placed any orders yet.
            <div className="mt-4">
              <Button asChild><Link href="/">Start Shopping</Link></Button>
            </div>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-secondary/20 border-b border-border">
              <tr>
                <th className="text-left py-2.5 px-4 text-xs text-muted-foreground font-medium">Order #</th>
                <th className="text-left py-2.5 px-4 text-xs text-muted-foreground font-medium hidden sm:table-cell">Date</th>
                <th className="text-left py-2.5 px-4 text-xs text-muted-foreground font-medium">Total</th>
                <th className="text-left py-2.5 px-4 text-xs text-muted-foreground font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {apiOrders.map(order => {
                const statusInfo = ORDER_STATUS_LABEL[order.status] || { label: order.status, color: "text-muted-foreground" };
                const isWireAlert = order.status === "wire_pending" || order.status === "pending_wire_instructions";
                return (
                  <tr key={order.id} className={`border-b border-border/40 ${isWireAlert ? "bg-amber-500/5" : ""}`}>
                    <td className="py-3 px-4 font-mono text-xs text-primary font-semibold">{order.orderNumber}</td>
                    <td className="py-3 px-4 text-xs text-muted-foreground hidden sm:table-cell">
                      {new Date(order.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </td>
                    <td className="py-3 px-4 font-mono text-xs text-foreground font-semibold">
                      ${Number(order.total).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`text-xs font-semibold ${statusInfo.color}`}>
                        {isWireAlert && <AlertTriangle className="h-3 w-3 inline-block mr-1" />}
                        {statusInfo.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </DashboardLayout>
  );
}
