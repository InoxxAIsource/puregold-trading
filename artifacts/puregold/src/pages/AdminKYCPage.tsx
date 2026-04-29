import { useState, useEffect, useCallback } from "react";
import { CheckCircle, XCircle, Clock, LogOut, RefreshCw, ChevronDown, ChevronUp, AlertTriangle, Package, Banknote } from "lucide-react";

interface KYCApp {
  applicationId: string;
  userEmail: string;
  status: string;
  approvalToken: string;
  submittedAt: string;
  reviewedAt: string | null;
  personalData: string | null;
  selfieSubmitted: string | null;
  bankName: string | null;
  bankAddress: string | null;
  accountName: string | null;
  accountNumber: string | null;
  routingNumber: string | null;
  swiftCode: string | null;
  wireDeadline: string | null;
}

interface AdminOrder {
  id: string;
  orderNumber: string;
  userEmail: string;
  status: string;
  items: Array<{ name: string; price: number; quantity: number }>;
  subtotal: number;
  shipping: number;
  insurance: number;
  total: number;
  shippingAddress: { firstName: string; lastName: string; address: string; city: string; state: string; zip: string; email: string; phone?: string };
  bankName: string | null;
  bankAddress: string | null;
  accountName: string | null;
  accountNumber: string | null;
  routingNumber: string | null;
  swiftCode: string | null;
  wireDeadline: string | null;
  adminNote: string | null;
  createdAt: string;
}

interface BankForm {
  bankName: string;
  accountName: string;
  accountNumber: string;
  routingNumber: string;
  swiftCode: string;
  bankAddress: string;
}

const EMPTY_BANK: BankForm = {
  bankName: "", accountName: "", accountNumber: "",
  routingNumber: "", swiftCode: "", bankAddress: "",
};

const KYC_STATUS_BADGE: Record<string, string> = {
  pending_review: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  approved: "bg-green-500/20 text-green-300 border-green-500/30",
  declined: "bg-red-500/20 text-red-300 border-red-500/30",
};
const KYC_STATUS_LABEL: Record<string, string> = {
  pending_review: "Pending Review",
  approved: "Approved",
  declined: "Declined",
};

const ORDER_STATUS_BADGE: Record<string, string> = {
  pending_wire_instructions: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  wire_pending: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  wire_received: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  completed: "bg-green-500/20 text-green-300 border-green-500/30",
  cancelled: "bg-red-500/20 text-red-300 border-red-500/30",
  declined: "bg-red-500/20 text-red-300 border-red-500/30",
};
const ORDER_STATUS_LABEL: Record<string, string> = {
  pending_wire_instructions: "Awaiting Wire Setup",
  wire_pending: "Wire Instructions Sent",
  wire_received: "Wire Receipt Received",
  completed: "Completed",
  cancelled: "Cancelled",
  declined: "Declined",
};

function parsePersonal(raw: string | null): Record<string, string> {
  try { return raw ? JSON.parse(raw) : {}; } catch { return {}; }
}

function formatDate(s: string | null): string {
  if (!s) return "—";
  return new Date(s).toLocaleString("en-US", {
    month: "short", day: "numeric", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

function timeLeft(deadline: string | null): string {
  if (!deadline) return "";
  const diff = new Date(deadline).getTime() - Date.now();
  if (diff <= 0) return "EXPIRED";
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  return `${h}h ${m}m remaining`;
}

export default function AdminKYCPage() {
  const params = new URLSearchParams(window.location.search);
  const urlAppId = params.get("id") || "";
  const urlToken = params.get("token") || "";
  const initialTab = window.location.hash === "#orders" ? "orders" : "kyc";

  const [password, setPassword] = useState(() => localStorage.getItem("adminPw") || "");
  const [loggedIn, setLoggedIn] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [activeTab, setActiveTab] = useState<"kyc" | "orders">(initialTab);

  // KYC state
  const [apps, setApps] = useState<KYCApp[]>([]);
  const [kycLoading, setKycLoading] = useState(false);
  const [expandedKYCId, setExpandedKYCId] = useState<string>(urlAppId);
  const [bankForms, setBankForms] = useState<Record<string, BankForm>>({});
  const [declineReasons, setDeclineReasons] = useState<Record<string, string>>({});
  const [kycActionMsg, setKycActionMsg] = useState<Record<string, { type: "success" | "error"; text: string }>>({});
  const [kycProcessing, setKycProcessing] = useState<Record<string, boolean>>({});

  // Orders state
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [expandedOrderId, setExpandedOrderId] = useState<string>("");
  const [orderBankForms, setOrderBankForms] = useState<Record<string, BankForm>>({});
  const [orderNotes, setOrderNotes] = useState<Record<string, string>>({});
  const [orderActionMsg, setOrderActionMsg] = useState<Record<string, { type: "success" | "error"; text: string }>>({});
  const [orderProcessing, setOrderProcessing] = useState<Record<string, boolean>>({});

  const fetchKYC = useCallback(async (pw: string) => {
    setKycLoading(true);
    try {
      const res = await fetch(`/api/admin/kyc/list?password=${encodeURIComponent(pw)}`);
      const data = await res.json();
      if (!data.success) { setLoggedIn(false); localStorage.removeItem("adminPw"); return; }
      setApps(data.applications || []);
      setLoggedIn(true);
      localStorage.setItem("adminPw", pw);
    } catch {
      // ignore
    } finally {
      setKycLoading(false);
    }
  }, []);

  const fetchOrders = useCallback(async (pw: string) => {
    setOrdersLoading(true);
    try {
      const res = await fetch(`/api/orders/admin-list?password=${encodeURIComponent(pw)}`);
      const data = await res.json();
      if (data.success) setOrders(data.orders || []);
    } catch {
      // ignore
    } finally {
      setOrdersLoading(false);
    }
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("adminPw");
    if (saved) {
      fetchKYC(saved);
      fetchOrders(saved);
    }
  }, [fetchKYC, fetchOrders]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    const res = await fetch(`/api/admin/kyc/list?password=${encodeURIComponent(password)}`);
    const data = await res.json();
    if (!data.success) {
      setLoginError("Incorrect password. Please try again.");
    } else {
      setApps(data.applications || []);
      setLoggedIn(true);
      localStorage.setItem("adminPw", password);
      fetchOrders(password);
    }
  };

  const handleRefresh = () => {
    fetchKYC(password);
    fetchOrders(password);
  };

  // KYC handlers
  const handleKYCApprove = async (app: KYCApp) => {
    const form = bankForms[app.applicationId] || EMPTY_BANK;
    if (!form.bankName || !form.accountName || !form.accountNumber || !form.routingNumber) {
      setKycActionMsg(m => ({ ...m, [app.applicationId]: { type: "error", text: "Please fill in bank name, account name, account number, and routing number." } }));
      return;
    }
    setKycProcessing(p => ({ ...p, [app.applicationId]: true }));
    try {
      const res = await fetch("/api/admin/kyc/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ applicationId: app.applicationId, token: app.approvalToken || urlToken, password, ...form }),
      });
      const data = await res.json();
      if (data.success) {
        setKycActionMsg(m => ({ ...m, [app.applicationId]: { type: "success", text: data.message } }));
        await fetchKYC(password);
      } else {
        setKycActionMsg(m => ({ ...m, [app.applicationId]: { type: "error", text: data.error } }));
      }
    } catch {
      setKycActionMsg(m => ({ ...m, [app.applicationId]: { type: "error", text: "Network error." } }));
    } finally {
      setKycProcessing(p => ({ ...p, [app.applicationId]: false }));
    }
  };

  const handleKYCDecline = async (app: KYCApp) => {
    if (!window.confirm(`Decline KYC application for ${app.userEmail}?`)) return;
    setKycProcessing(p => ({ ...p, [app.applicationId]: true }));
    try {
      const res = await fetch("/api/admin/kyc/decline", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ applicationId: app.applicationId, token: app.approvalToken || urlToken, password, declineReason: declineReasons[app.applicationId] || "" }),
      });
      const data = await res.json();
      if (data.success) {
        setKycActionMsg(m => ({ ...m, [app.applicationId]: { type: "success", text: data.message } }));
        await fetchKYC(password);
      } else {
        setKycActionMsg(m => ({ ...m, [app.applicationId]: { type: "error", text: data.error } }));
      }
    } catch {
      setKycActionMsg(m => ({ ...m, [app.applicationId]: { type: "error", text: "Network error." } }));
    } finally {
      setKycProcessing(p => ({ ...p, [app.applicationId]: false }));
    }
  };

  const updateKYCBank = (appId: string, field: keyof BankForm, value: string) => {
    setBankForms(f => ({ ...f, [appId]: { ...(f[appId] || EMPTY_BANK), [field]: value } }));
  };

  // Orders handlers
  const handleSetWire = async (order: AdminOrder) => {
    const form = orderBankForms[order.id] || EMPTY_BANK;
    if (!form.bankName || !form.accountName || !form.accountNumber || !form.routingNumber) {
      setOrderActionMsg(m => ({ ...m, [order.id]: { type: "error", text: "Bank name, account name, account number, and routing number are all required." } }));
      return;
    }
    setOrderProcessing(p => ({ ...p, [order.id]: true }));
    try {
      const res = await fetch("/api/orders/set-wire", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, orderId: order.id, ...form }),
      });
      const data = await res.json();
      if (data.success) {
        setOrderActionMsg(m => ({ ...m, [order.id]: { type: "success", text: "Wire instructions sent to customer via email." } }));
        await fetchOrders(password);
      } else {
        setOrderActionMsg(m => ({ ...m, [order.id]: { type: "error", text: data.error || "Failed." } }));
      }
    } catch {
      setOrderActionMsg(m => ({ ...m, [order.id]: { type: "error", text: "Network error." } }));
    } finally {
      setOrderProcessing(p => ({ ...p, [order.id]: false }));
    }
  };

  const handleOrderStatus = async (order: AdminOrder, status: "cancelled" | "declined" | "completed") => {
    if (!window.confirm(`Mark order ${order.orderNumber} as ${status}?`)) return;
    setOrderProcessing(p => ({ ...p, [order.id]: true }));
    try {
      const res = await fetch("/api/orders/update-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, orderId: order.id, status, adminNote: orderNotes[order.id] || "" }),
      });
      const data = await res.json();
      if (data.success) {
        setOrderActionMsg(m => ({ ...m, [order.id]: { type: "success", text: `Order marked as ${status}.` } }));
        await fetchOrders(password);
      } else {
        setOrderActionMsg(m => ({ ...m, [order.id]: { type: "error", text: data.error || "Failed." } }));
      }
    } catch {
      setOrderActionMsg(m => ({ ...m, [order.id]: { type: "error", text: "Network error." } }));
    } finally {
      setOrderProcessing(p => ({ ...p, [order.id]: false }));
    }
  };

  const updateOrderBank = (orderId: string, field: keyof BankForm, value: string) => {
    setOrderBankForms(f => ({ ...f, [orderId]: { ...(f[orderId] || EMPTY_BANK), [field]: value } }));
  };

  const pending = apps.filter(a => a.status === "pending_review");
  const approved = apps.filter(a => a.status === "approved");
  const declined = apps.filter(a => a.status === "declined");

  const activeOrders = orders.filter(o => ["pending_wire_instructions", "wire_pending", "wire_received"].includes(o.status));
  const closedOrders = orders.filter(o => ["completed", "cancelled", "declined"].includes(o.status));

  if (!loggedIn) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="text-3xl mb-3">🏅</div>
            <h1 className="text-2xl font-bold text-foreground">GoldBuller Admin</h1>
            <p className="text-muted-foreground text-sm mt-1">KYC & Orders Panel</p>
          </div>
          <form onSubmit={handleLogin} className="bg-card border border-border rounded-xl p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Admin Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="Enter admin password"
                autoFocus
              />
            </div>
            {loginError && (
              <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-3 text-sm text-destructive">{loginError}</div>
            )}
            <button type="submit" className="w-full bg-primary text-primary-foreground py-2.5 rounded-lg font-bold hover:bg-primary/90 transition-colors">
              Sign In
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xl">🏅</span>
            <div>
              <h1 className="font-bold text-foreground">GoldBuller Admin</h1>
              <p className="text-xs text-muted-foreground">KYC & Orders Panel</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              disabled={kycLoading || ordersLoading}
              className="flex items-center gap-1.5 border border-border text-sm text-foreground px-3 py-1.5 rounded-lg hover:bg-secondary/50 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${(kycLoading || ordersLoading) ? "animate-spin" : ""}`} /> Refresh
            </button>
            <button
              onClick={() => { localStorage.removeItem("adminPw"); setLoggedIn(false); setApps([]); setOrders([]); }}
              className="flex items-center gap-1.5 border border-border text-sm text-muted-foreground px-3 py-1.5 rounded-lg hover:bg-secondary/50 transition-colors"
            >
              <LogOut className="h-3.5 w-3.5" /> Logout
            </button>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 flex gap-1 -mb-px">
          <button
            onClick={() => setActiveTab("kyc")}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors ${
              activeTab === "kyc"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <CheckCircle className="h-4 w-4" />
            KYC Applications
            {pending.length > 0 && (
              <span className="ml-1 bg-amber-500 text-black text-xs font-bold px-1.5 py-0.5 rounded-full">{pending.length}</span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors ${
              activeTab === "orders"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Package className="h-4 w-4" />
            Orders
            {activeOrders.length > 0 && (
              <span className="ml-1 bg-blue-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">{activeOrders.length}</span>
            )}
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">

        {activeTab === "kyc" && (
          <>
            <div className="grid grid-cols-3 gap-4 mb-6">
              {[
                { label: "Pending Review", count: pending.length, color: "text-amber-400" },
                { label: "Approved", count: approved.length, color: "text-green-400" },
                { label: "Declined", count: declined.length, color: "text-red-400" },
              ].map(s => (
                <div key={s.label} className="bg-card border border-border rounded-xl p-4 text-center">
                  <div className={`text-3xl font-bold ${s.color}`}>{s.count}</div>
                  <div className="text-sm text-muted-foreground mt-1">{s.label}</div>
                </div>
              ))}
            </div>

            {urlAppId && pending.some(a => a.applicationId === urlAppId) && (
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg px-4 py-3 flex items-center gap-2 text-sm text-amber-300 mb-4">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                Application <strong>#{urlAppId}</strong> was opened from the email link. Review it below.
              </div>
            )}

            <div className="space-y-3">
              {apps.length === 0 && !kycLoading && (
                <div className="text-center py-12 text-muted-foreground">No KYC applications yet.</div>
              )}
              {apps.map(app => {
                const isExpanded = expandedKYCId === app.applicationId;
                const pd = parsePersonal(app.personalData);
                const bf = bankForms[app.applicationId] || EMPTY_BANK;
                const msg = kycActionMsg[app.applicationId];
                const isPending = app.status === "pending_review";
                const proc = kycProcessing[app.applicationId] || false;

                return (
                  <div key={app.applicationId} className={`bg-card border rounded-xl overflow-hidden transition-colors ${urlAppId === app.applicationId ? "border-primary/50" : "border-border"}`}>
                    <button
                      className="w-full flex items-center gap-4 p-4 hover:bg-secondary/20 transition-colors text-left"
                      onClick={() => setExpandedKYCId(isExpanded ? "" : app.applicationId)}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-foreground text-sm">{app.userEmail}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${KYC_STATUS_BADGE[app.status] || "bg-secondary text-muted-foreground border-border"}`}>
                            {KYC_STATUS_LABEL[app.status] || app.status}
                          </span>
                          {app.selfieSubmitted === "yes" && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">🤳 Selfie</span>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground mt-0.5">
                          #{app.applicationId} · Submitted {formatDate(app.submittedAt)}
                          {app.reviewedAt && ` · Reviewed ${formatDate(app.reviewedAt)}`}
                        </div>
                        {app.status === "approved" && app.wireDeadline && (
                          <div className="text-xs text-amber-400 mt-0.5 font-medium">
                            ⏱ Wire deadline: {formatDate(app.wireDeadline)} — {timeLeft(app.wireDeadline)}
                          </div>
                        )}
                      </div>
                      {isExpanded ? <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0" /> : <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />}
                    </button>

                    {isExpanded && (
                      <div className="border-t border-border p-4 space-y-6">
                        {Object.keys(pd).length > 0 && (
                          <div>
                            <h3 className="text-sm font-semibold text-primary mb-3">👤 Applicant Details</h3>
                            <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 text-sm">
                              {[
                                ["Name", `${pd.firstName || ""} ${pd.lastName || ""}`],
                                ["Date of Birth", pd.dob || "—"],
                                ["Phone", pd.phone || "—"],
                                ["Nationality", pd.nationality || "—"],
                                ["Country", pd.country || "—"],
                                ["Occupation", pd.occupation || "—"],
                                ["Source of Funds", pd.sourceOfFunds || "—"],
                                ["Purpose", pd.purpose || "—"],
                                ["Annual Volume", pd.volume || "—"],
                                ["US Citizen", pd.usCitizen || "—"],
                                ["PEP", pd.pep || "—"],
                                ["SSN Last 4", pd.ssn4 || "N/A"],
                              ].map(([k, v]) => (
                                <div key={k} className="flex justify-between">
                                  <span className="text-muted-foreground">{k}:</span>
                                  <span className="text-foreground font-medium text-right ml-2">{v}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        <div>
                          <h3 className="text-sm font-semibold text-primary mb-3">📎 Documents</h3>
                          <div className="grid grid-cols-3 gap-3 text-sm">
                            {[
                              ["ID Front", pd.identityFront === "attached" ? "✅ Sent via email" : "❌ Not provided"],
                              ["ID Back", pd.identityBack === "attached" ? "✅ Sent via email" : "Not provided"],
                              ["Address Doc", pd.addressFile === "attached" ? "✅ Sent via email" : "❌ Not provided"],
                              ["Selfie", app.selfieSubmitted === "yes" ? "✅ Sent via email" : "⚠️ Not provided"],
                              ["ID Type", pd.identityDocType || "—"],
                              ["Addr Type", pd.addressDocType || "—"],
                            ].map(([k, v]) => (
                              <div key={k} className="bg-secondary/20 rounded-lg p-2.5">
                                <div className="text-xs text-muted-foreground">{k}</div>
                                <div className="text-foreground text-xs font-medium mt-0.5">{v}</div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {app.status === "approved" && (
                          <div>
                            <h3 className="text-sm font-semibold text-primary mb-3">🏦 Bank Wire Sent</h3>
                            <div className="bg-secondary/20 rounded-lg p-3 space-y-1.5 text-sm">
                              {[
                                ["Bank Name", app.bankName],
                                ["Account Name", app.accountName],
                                ["Account Number", app.accountNumber],
                                ["Routing Number", app.routingNumber],
                                ["SWIFT", app.swiftCode],
                                ["Bank Address", app.bankAddress],
                                ["Wire Deadline", formatDate(app.wireDeadline)],
                              ].map(([k, v]) => (
                                <div key={k} className="flex justify-between">
                                  <span className="text-muted-foreground">{k}:</span>
                                  <span className="text-foreground font-medium">{v || "—"}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {isPending && (
                          <div>
                            <h3 className="text-sm font-semibold text-primary mb-3">🏦 Bank Wire Details <span className="text-muted-foreground font-normal">(fill before approving)</span></h3>
                            <div className="grid grid-cols-2 gap-3">
                              {([
                                ["bankName", "Bank Name *", "e.g. JPMorgan Chase"],
                                ["accountName", "Account Name (Beneficiary) *", "e.g. GoldBuller LLC"],
                                ["accountNumber", "Account Number *", ""],
                                ["routingNumber", "Routing Number (ABA) *", "9-digit"],
                                ["swiftCode", "SWIFT / BIC Code", "For international wires"],
                              ] as [keyof BankForm, string, string][]).map(([field, label, placeholder]) => (
                                <div key={field}>
                                  <label className="block text-xs font-medium text-foreground mb-1">{label}</label>
                                  <input
                                    value={bf[field]}
                                    onChange={e => updateKYCBank(app.applicationId, field, e.target.value)}
                                    placeholder={placeholder}
                                    className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                                  />
                                </div>
                              ))}
                              <div className="col-span-2">
                                <label className="block text-xs font-medium text-foreground mb-1">Bank Address</label>
                                <input
                                  value={bf.bankAddress}
                                  onChange={e => updateKYCBank(app.applicationId, "bankAddress", e.target.value)}
                                  placeholder="e.g. 383 Madison Ave, New York, NY 10017"
                                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                                />
                              </div>
                              <div className="col-span-2">
                                <label className="block text-xs font-medium text-foreground mb-1">Decline Reason (optional)</label>
                                <input
                                  value={declineReasons[app.applicationId] || ""}
                                  onChange={e => setDeclineReasons(r => ({ ...r, [app.applicationId]: e.target.value }))}
                                  placeholder="Reason shown to user if declined"
                                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                                />
                              </div>
                            </div>
                            <div className="mt-1.5 flex items-center gap-2 text-xs text-amber-400">
                              <Clock className="h-3.5 w-3.5" />
                              User will have exactly 4 hours from approval to complete the wire transfer.
                            </div>
                            {msg && (
                              <div className={`mt-3 rounded-lg px-3 py-2.5 text-sm flex items-center gap-2 ${msg.type === "success" ? "bg-green-500/10 border border-green-500/30 text-green-300" : "bg-destructive/10 border border-destructive/30 text-destructive"}`}>
                                {msg.type === "success" ? <CheckCircle className="h-4 w-4 shrink-0" /> : <XCircle className="h-4 w-4 shrink-0" />}
                                {msg.text}
                              </div>
                            )}
                            <div className="flex gap-3 mt-4">
                              <button onClick={() => handleKYCDecline(app)} disabled={proc} className="flex-1 flex items-center justify-center gap-2 border border-destructive/50 text-red-400 py-2.5 rounded-lg text-sm font-semibold hover:bg-destructive/10 transition-colors disabled:opacity-50">
                                <XCircle className="h-4 w-4" /> Decline
                              </button>
                              <button onClick={() => handleKYCApprove(app)} disabled={proc} className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white py-2.5 rounded-lg text-sm font-bold hover:bg-green-500 transition-colors disabled:opacity-50">
                                {proc ? <><div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Processing…</> : <><CheckCircle className="h-4 w-4" /> Approve + Send Wire</>}
                              </button>
                            </div>
                          </div>
                        )}

                        {!isPending && msg && (
                          <div className={`rounded-lg px-3 py-2.5 text-sm flex items-center gap-2 ${msg.type === "success" ? "bg-green-500/10 border border-green-500/30 text-green-300" : "bg-destructive/10 border border-destructive/30 text-destructive"}`}>
                            {msg.type === "success" ? <CheckCircle className="h-4 w-4 shrink-0" /> : <XCircle className="h-4 w-4 shrink-0" />}
                            {msg.text}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}

        {activeTab === "orders" && (
          <>
            <div className="grid grid-cols-4 gap-4 mb-6">
              {[
                { label: "Awaiting Wire Setup", count: orders.filter(o => o.status === "pending_wire_instructions").length, color: "text-amber-400" },
                { label: "Wire Sent", count: orders.filter(o => o.status === "wire_pending").length, color: "text-blue-400" },
                { label: "Receipt Received", count: orders.filter(o => o.status === "wire_received").length, color: "text-purple-400" },
                { label: "Completed", count: orders.filter(o => o.status === "completed").length, color: "text-green-400" },
              ].map(s => (
                <div key={s.label} className="bg-card border border-border rounded-xl p-4 text-center">
                  <div className={`text-3xl font-bold ${s.color}`}>{s.count}</div>
                  <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
                </div>
              ))}
            </div>

            <div className="space-y-3">
              {orders.length === 0 && !ordersLoading && (
                <div className="text-center py-12 text-muted-foreground">No orders yet.</div>
              )}

              {[...activeOrders, ...closedOrders].map(order => {
                const isExpanded = expandedOrderId === order.id;
                const bf = orderBankForms[order.id] || EMPTY_BANK;
                const msg = orderActionMsg[order.id];
                const proc = orderProcessing[order.id] || false;
                const isActionable = ["pending_wire_instructions", "wire_pending", "wire_received"].includes(order.status);

                return (
                  <div key={order.id} className="bg-card border border-border rounded-xl overflow-hidden">
                    <button
                      className="w-full flex items-center gap-4 p-4 hover:bg-secondary/20 transition-colors text-left"
                      onClick={() => setExpandedOrderId(isExpanded ? "" : order.id)}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-foreground text-sm font-mono">{order.orderNumber}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${ORDER_STATUS_BADGE[order.status] || "bg-secondary text-muted-foreground border-border"}`}>
                            {ORDER_STATUS_LABEL[order.status] || order.status}
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground mt-0.5">
                          {order.userEmail} · ${Number(order.total).toLocaleString(undefined, { minimumFractionDigits: 2 })} · {formatDate(order.createdAt)}
                        </div>
                        {order.wireDeadline && order.status === "wire_pending" && (
                          <div className="text-xs text-amber-400 mt-0.5 font-medium">
                            ⏱ Wire deadline: {formatDate(order.wireDeadline)} — {timeLeft(order.wireDeadline)}
                          </div>
                        )}
                      </div>
                      {isExpanded ? <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0" /> : <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />}
                    </button>

                    {isExpanded && (
                      <div className="border-t border-border p-4 space-y-5">
                        <div className="grid grid-cols-2 gap-5">
                          <div>
                            <h3 className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">📦 Ship To</h3>
                            <div className="text-sm space-y-0.5 text-muted-foreground">
                              <p className="text-foreground font-medium">{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
                              <p>{order.shippingAddress.address}</p>
                              <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}</p>
                              <p>{order.shippingAddress.email}</p>
                              {order.shippingAddress.phone && <p>{order.shippingAddress.phone}</p>}
                            </div>
                          </div>
                          <div>
                            <h3 className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">🛒 Items</h3>
                            <div className="space-y-1 text-sm">
                              {order.items.map((item, i) => (
                                <div key={i} className="flex justify-between text-muted-foreground">
                                  <span className="truncate">{item.name} × {item.quantity}</span>
                                  <span className="font-mono ml-2 shrink-0">${(item.price * item.quantity).toFixed(2)}</span>
                                </div>
                              ))}
                              <div className="border-t border-border pt-1.5 mt-1.5 flex justify-between font-semibold text-foreground">
                                <span>Total</span>
                                <span className="font-mono text-primary">${Number(order.total).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {order.status === "pending_wire_instructions" && (
                          <div>
                            <h3 className="text-sm font-semibold text-primary mb-3 flex items-center gap-2">
                              <Banknote className="h-4 w-4" /> Set Wire Instructions for This Order
                            </h3>
                            <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3 text-xs text-amber-300 mb-4">
                              ⚡ Fill in the bank details below and click "Send Wire Instructions" — the customer will receive an email immediately and see the instructions on their dashboard. They will have 4 hours to complete the wire.
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              {([
                                ["bankName", "Bank Name *", "e.g. JPMorgan Chase"],
                                ["accountName", "Account Name (Beneficiary) *", "e.g. GoldBuller LLC"],
                                ["accountNumber", "Account Number *", ""],
                                ["routingNumber", "Routing Number (ABA) *", "9-digit"],
                                ["swiftCode", "SWIFT / BIC Code", "For international wires"],
                              ] as [keyof BankForm, string, string][]).map(([field, label, placeholder]) => (
                                <div key={field}>
                                  <label className="block text-xs font-medium text-foreground mb-1">{label}</label>
                                  <input
                                    value={bf[field]}
                                    onChange={e => updateOrderBank(order.id, field, e.target.value)}
                                    placeholder={placeholder}
                                    className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                                  />
                                </div>
                              ))}
                              <div className="col-span-2">
                                <label className="block text-xs font-medium text-foreground mb-1">Bank Address</label>
                                <input
                                  value={bf.bankAddress}
                                  onChange={e => updateOrderBank(order.id, "bankAddress", e.target.value)}
                                  placeholder="e.g. 383 Madison Ave, New York, NY 10017"
                                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                                />
                              </div>
                            </div>
                            {msg && (
                              <div className={`mt-3 rounded-lg px-3 py-2.5 text-sm flex items-center gap-2 ${msg.type === "success" ? "bg-green-500/10 border border-green-500/30 text-green-300" : "bg-destructive/10 border border-destructive/30 text-destructive"}`}>
                                {msg.type === "success" ? <CheckCircle className="h-4 w-4 shrink-0" /> : <XCircle className="h-4 w-4 shrink-0" />}
                                {msg.text}
                              </div>
                            )}
                            <div className="flex gap-3 mt-4">
                              <button
                                onClick={() => handleOrderStatus(order, "declined")}
                                disabled={proc}
                                className="flex items-center justify-center gap-1.5 border border-destructive/50 text-red-400 px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-destructive/10 transition-colors disabled:opacity-50"
                              >
                                <XCircle className="h-4 w-4" /> Decline
                              </button>
                              <button
                                onClick={() => handleSetWire(order)}
                                disabled={proc}
                                className="flex-1 flex items-center justify-center gap-2 bg-primary text-primary-foreground py-2.5 rounded-lg text-sm font-bold hover:bg-primary/90 transition-colors disabled:opacity-50"
                              >
                                {proc ? <><div className="h-4 w-4 border-2 border-black border-t-transparent rounded-full animate-spin" /> Sending…</> : <><Banknote className="h-4 w-4" /> Send Wire Instructions to Customer</>}
                              </button>
                            </div>
                          </div>
                        )}

                        {["wire_pending", "wire_received"].includes(order.status) && (
                          <div>
                            <h3 className="text-sm font-semibold text-primary mb-3">🏦 Wire Instructions Sent</h3>
                            <div className="bg-secondary/20 rounded-lg p-3 space-y-1.5 text-sm mb-4">
                              {[
                                ["Bank Name", order.bankName],
                                ["Account Name", order.accountName],
                                ["Account Number", order.accountNumber],
                                ["Routing Number", order.routingNumber],
                                ["SWIFT", order.swiftCode],
                                ["Bank Address", order.bankAddress],
                                ["Wire Deadline", formatDate(order.wireDeadline)],
                                ["Deadline Status", timeLeft(order.wireDeadline)],
                              ].filter(([, v]) => v).map(([k, v]) => (
                                <div key={k} className="flex justify-between">
                                  <span className="text-muted-foreground">{k}:</span>
                                  <span className="text-foreground font-medium text-right ml-2">{v}</span>
                                </div>
                              ))}
                            </div>
                            {order.status === "wire_received" && (
                              <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-3 text-sm text-purple-300 mb-4">
                                💸 Customer has uploaded a wire receipt. Verify the wire and mark as completed.
                              </div>
                            )}
                            <div>
                              <label className="block text-xs font-medium text-foreground mb-1">Admin Note (optional — shown to customer on cancel/decline)</label>
                              <input
                                value={orderNotes[order.id] || ""}
                                onChange={e => setOrderNotes(n => ({ ...n, [order.id]: e.target.value }))}
                                placeholder="e.g. Wire not received within window"
                                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 mb-3"
                              />
                            </div>
                            {msg && (
                              <div className={`mb-3 rounded-lg px-3 py-2.5 text-sm flex items-center gap-2 ${msg.type === "success" ? "bg-green-500/10 border border-green-500/30 text-green-300" : "bg-destructive/10 border border-destructive/30 text-destructive"}`}>
                                {msg.type === "success" ? <CheckCircle className="h-4 w-4 shrink-0" /> : <XCircle className="h-4 w-4 shrink-0" />}
                                {msg.text}
                              </div>
                            )}
                            <div className="flex gap-3">
                              <button onClick={() => handleOrderStatus(order, "cancelled")} disabled={proc} className="flex items-center justify-center gap-1.5 border border-destructive/50 text-red-400 px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-destructive/10 transition-colors disabled:opacity-50">
                                <XCircle className="h-4 w-4" /> Cancel
                              </button>
                              <button onClick={() => handleOrderStatus(order, "completed")} disabled={proc} className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white py-2.5 rounded-lg text-sm font-bold hover:bg-green-500 transition-colors disabled:opacity-50">
                                {proc ? <><div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Processing…</> : <><CheckCircle className="h-4 w-4" /> Mark as Completed</>}
                              </button>
                            </div>
                          </div>
                        )}

                        {!isActionable && msg && (
                          <div className={`rounded-lg px-3 py-2.5 text-sm flex items-center gap-2 ${msg.type === "success" ? "bg-green-500/10 border border-green-500/30 text-green-300" : "bg-destructive/10 border border-destructive/30 text-destructive"}`}>
                            {msg.type === "success" ? <CheckCircle className="h-4 w-4 shrink-0" /> : <XCircle className="h-4 w-4 shrink-0" />}
                            {msg.text}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}