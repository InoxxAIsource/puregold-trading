import { useState, useEffect, useCallback } from "react";
import { CheckCircle, XCircle, Clock, LogOut, RefreshCw, ChevronDown, ChevronUp, AlertTriangle } from "lucide-react";

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

const STATUS_BADGE: Record<string, string> = {
  pending_review: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  approved: "bg-green-500/20 text-green-300 border-green-500/30",
  declined: "bg-red-500/20 text-red-300 border-red-500/30",
};
const STATUS_LABEL: Record<string, string> = {
  pending_review: "Pending Review",
  approved: "Approved",
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

  const [password, setPassword] = useState(() => localStorage.getItem("adminPw") || "");
  const [loggedIn, setLoggedIn] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [apps, setApps] = useState<KYCApp[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedId, setExpandedId] = useState<string>(urlAppId);
  const [bankForms, setBankForms] = useState<Record<string, BankForm>>({});
  const [declineReasons, setDeclineReasons] = useState<Record<string, string>>({});
  const [actionMsg, setActionMsg] = useState<Record<string, { type: "success" | "error"; text: string }>>({});
  const [processing, setProcessing] = useState<Record<string, boolean>>({});

  const fetchApps = useCallback(async (pw: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/kyc/list?password=${encodeURIComponent(pw)}`);
      const data = await res.json();
      if (!data.success) { setLoggedIn(false); localStorage.removeItem("adminPw"); return; }
      setApps(data.applications || []);
      setLoggedIn(true);
      localStorage.setItem("adminPw", pw);
    } catch {
      setLoginError("Could not reach server.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("adminPw");
    if (saved) fetchApps(saved);
  }, [fetchApps]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    await fetchApps(password);
    const res = await fetch(`/api/admin/kyc/list?password=${encodeURIComponent(password)}`);
    const data = await res.json();
    if (!data.success) setLoginError("Incorrect password. Please try again.");
  };

  const handleApprove = async (app: KYCApp) => {
    const form = bankForms[app.applicationId] || EMPTY_BANK;
    if (!form.bankName || !form.accountName || !form.accountNumber || !form.routingNumber) {
      setActionMsg(m => ({ ...m, [app.applicationId]: { type: "error", text: "Please fill in bank name, account name, account number, and routing number." } }));
      return;
    }
    setProcessing(p => ({ ...p, [app.applicationId]: true }));
    try {
      const res = await fetch("/api/admin/kyc/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          applicationId: app.applicationId,
          token: app.approvalToken || urlToken,
          password,
          ...form,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setActionMsg(m => ({ ...m, [app.applicationId]: { type: "success", text: data.message } }));
        await fetchApps(password);
      } else {
        setActionMsg(m => ({ ...m, [app.applicationId]: { type: "error", text: data.error } }));
      }
    } catch {
      setActionMsg(m => ({ ...m, [app.applicationId]: { type: "error", text: "Network error." } }));
    } finally {
      setProcessing(p => ({ ...p, [app.applicationId]: false }));
    }
  };

  const handleDecline = async (app: KYCApp) => {
    if (!window.confirm(`Decline KYC application for ${app.userEmail}?`)) return;
    setProcessing(p => ({ ...p, [app.applicationId]: true }));
    try {
      const res = await fetch("/api/admin/kyc/decline", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          applicationId: app.applicationId,
          token: app.approvalToken || urlToken,
          password,
          declineReason: declineReasons[app.applicationId] || "",
        }),
      });
      const data = await res.json();
      if (data.success) {
        setActionMsg(m => ({ ...m, [app.applicationId]: { type: "success", text: data.message } }));
        await fetchApps(password);
      } else {
        setActionMsg(m => ({ ...m, [app.applicationId]: { type: "error", text: data.error } }));
      }
    } catch {
      setActionMsg(m => ({ ...m, [app.applicationId]: { type: "error", text: "Network error." } }));
    } finally {
      setProcessing(p => ({ ...p, [app.applicationId]: false }));
    }
  };

  const updateBank = (appId: string, field: keyof BankForm, value: string) => {
    setBankForms(f => ({ ...f, [appId]: { ...(f[appId] || EMPTY_BANK), [field]: value } }));
  };

  const pending = apps.filter(a => a.status === "pending_review");
  const approved = apps.filter(a => a.status === "approved");
  const declined = apps.filter(a => a.status === "declined");

  if (!loggedIn) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="text-3xl mb-3">🏅</div>
            <h1 className="text-2xl font-bold text-foreground">GoldBuller Admin</h1>
            <p className="text-muted-foreground text-sm mt-1">KYC Review Panel</p>
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
              <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-3 text-sm text-destructive">
                {loginError}
              </div>
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
              <p className="text-xs text-muted-foreground">KYC Review Panel</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-sm text-muted-foreground hidden sm:block">
              {pending.length} pending · {approved.length} approved · {declined.length} declined
            </div>
            <button onClick={() => fetchApps(password)} disabled={loading}
              className="flex items-center gap-1.5 border border-border text-sm text-foreground px-3 py-1.5 rounded-lg hover:bg-secondary/50 transition-colors disabled:opacity-50">
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} /> Refresh
            </button>
            <button onClick={() => { localStorage.removeItem("adminPw"); setLoggedIn(false); setApps([]); }}
              className="flex items-center gap-1.5 border border-border text-sm text-muted-foreground px-3 py-1.5 rounded-lg hover:bg-secondary/50 transition-colors">
              <LogOut className="h-3.5 w-3.5" /> Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
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
          {apps.length === 0 && !loading && (
            <div className="text-center py-12 text-muted-foreground">No KYC applications yet.</div>
          )}
          {apps.map(app => {
            const isExpanded = expandedId === app.applicationId;
            const pd = parsePersonal(app.personalData);
            const bf = bankForms[app.applicationId] || EMPTY_BANK;
            const msg = actionMsg[app.applicationId];
            const isPending = app.status === "pending_review";
            const proc = processing[app.applicationId] || false;

            return (
              <div key={app.applicationId} className={`bg-card border rounded-xl overflow-hidden transition-colors ${
                urlAppId === app.applicationId ? "border-primary/50" : "border-border"
              }`}>
                <button
                  className="w-full flex items-center gap-4 p-4 hover:bg-secondary/20 transition-colors text-left"
                  onClick={() => setExpandedId(isExpanded ? "" : app.applicationId)}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-foreground text-sm">{app.userEmail}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${STATUS_BADGE[app.status] || "bg-secondary text-muted-foreground border-border"}`}>
                        {STATUS_LABEL[app.status] || app.status}
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
                                onChange={e => updateBank(app.applicationId, field, e.target.value)}
                                placeholder={placeholder}
                                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                              />
                            </div>
                          ))}
                          <div className="col-span-2">
                            <label className="block text-xs font-medium text-foreground mb-1">Bank Address</label>
                            <input
                              value={bf.bankAddress}
                              onChange={e => updateBank(app.applicationId, "bankAddress", e.target.value)}
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
                          <div className={`mt-3 rounded-lg px-3 py-2.5 text-sm flex items-center gap-2 ${
                            msg.type === "success"
                              ? "bg-green-500/10 border border-green-500/30 text-green-300"
                              : "bg-destructive/10 border border-destructive/30 text-destructive"
                          }`}>
                            {msg.type === "success" ? <CheckCircle className="h-4 w-4 shrink-0" /> : <XCircle className="h-4 w-4 shrink-0" />}
                            {msg.text}
                          </div>
                        )}

                        <div className="flex gap-3 mt-4">
                          <button
                            onClick={() => handleDecline(app)}
                            disabled={proc}
                            className="flex-1 flex items-center justify-center gap-2 border border-destructive/50 text-red-400 py-2.5 rounded-lg text-sm font-semibold hover:bg-destructive/10 transition-colors disabled:opacity-50"
                          >
                            <XCircle className="h-4 w-4" /> Decline Application
                          </button>
                          <button
                            onClick={() => handleApprove(app)}
                            disabled={proc}
                            className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white py-2.5 rounded-lg text-sm font-bold hover:bg-green-500 transition-colors disabled:opacity-50"
                          >
                            {proc
                              ? <><div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Processing…</>
                              : <><CheckCircle className="h-4 w-4" /> Approve + Send Wire Details</>
                            }
                          </button>
                        </div>
                      </div>
                    )}

                    {!isPending && msg && (
                      <div className={`rounded-lg px-3 py-2.5 text-sm flex items-center gap-2 ${
                        msg.type === "success"
                          ? "bg-green-500/10 border border-green-500/30 text-green-300"
                          : "bg-destructive/10 border border-destructive/30 text-destructive"
                      }`}>
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
      </div>
    </div>
  );
}
