import { useState, useEffect } from "react";
import { Link, useLocation, useSearch } from "wouter";
import { AlertTriangle, RefreshCw, Copy, Check } from "lucide-react";
import { useBTCPrice, getSpread, calcTotal } from "@/lib/btcPrice";
import { useKYC, KYC_STATUS } from "@/lib/kycContext";
import { useAuth } from "@/contexts/AuthContext";
import { generateOrderId, saveOTCOrder, type OTCOrder } from "@/lib/otcOrders";

const PURPOSES = ["Investment", "Portfolio Diversification", "Business Treasury", "IRA Contribution", "Personal Savings", "Gift", "Other"];

function detectWallet(addr: string): string {
  if (addr.startsWith("bc1q") || addr.startsWith("bc1p")) return "Detected: Native SegWit (Bech32) — ✅ Recommended";
  if (addr.startsWith("3")) return "Detected: P2SH (SegWit compatible) — ✅ Supported";
  if (addr.startsWith("1")) return "Detected: Legacy P2PKH — ✅ Supported";
  if (addr.length > 0) return "⚠️ Unrecognized address format — please verify";
  return "";
}

function validateBTCAddress(addr: string): boolean {
  return addr.length >= 26 && addr.length <= 62 && (addr.startsWith("1") || addr.startsWith("3") || addr.startsWith("bc1"));
}

function KYCGate() {
  const { kycStatus } = useKYC();
  const label = kycStatus === KYC_STATUS.PENDING_REVIEW ? "KYC Under Review (1–2 business days)" :
                kycStatus === KYC_STATUS.IN_PROGRESS ? "KYC In Progress" : "Not Started";
  return (
    <div className="container mx-auto px-4 py-12 max-w-lg">
      <div className="bg-card border border-border rounded-xl p-8 text-center">
        <div className="text-5xl mb-4">🔐</div>
        <h2 className="text-xl font-bold text-foreground mb-2">KYC Verification Required</h2>
        <p className="text-muted-foreground mb-4 text-sm">
          To purchase Bitcoin OTC, you must complete our Know Your Customer (KYC) verification.
          This is required by US federal law.
        </p>
        <div className="bg-secondary/30 rounded-lg px-4 py-2 mb-6 text-sm">
          <span className="text-muted-foreground">Status: </span>
          <span className="text-foreground font-semibold">{label}</span>
        </div>
        <div className="flex gap-3">
          <Link href="/account/kyc" className="flex-1 bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors text-sm">
            Complete KYC Now →
          </Link>
          <Link href="/account/kyc" className="flex-1 border border-border text-foreground py-3 rounded-lg font-semibold hover:bg-secondary/50 transition-colors text-sm">
            Check Status
          </Link>
        </div>
      </div>
    </div>
  );
}

function ConfirmationModal({ order, onClose }: { order: OTCOrder; onClose: () => void }) {
  const [copied, setCopied] = useState(false);
  const [, setLocation] = useLocation();

  const copy = () => {
    navigator.clipboard.writeText(order.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-2xl max-w-lg w-full p-8">
        <div className="text-center mb-6">
          <div className="text-5xl mb-3">✅</div>
          <h2 className="text-2xl font-bold text-foreground">OTC Application Submitted</h2>
        </div>

        <div className="bg-secondary/30 rounded-xl p-5 space-y-2 text-sm mb-6">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Order Reference:</span>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-primary">{order.id}</span>
              <button onClick={copy} className="text-muted-foreground hover:text-primary transition-colors">
                {copied ? <Check className="h-3.5 w-3.5 text-green-400" /> : <Copy className="h-3.5 w-3.5" />}
              </button>
            </div>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">BTC Amount:</span>
            <span className="font-mono font-semibold text-foreground">{order.btcAmount.toFixed(2)} BTC</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Indicative Total:</span>
            <span className="font-mono font-semibold text-foreground">
              ${order.usdTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Delivery Wallet:</span>
            <span className="font-mono text-foreground">...{order.walletAddress.slice(-6)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Submitted:</span>
            <span className="text-foreground">{new Date(order.submittedAt).toLocaleString()}</span>
          </div>
        </div>

        <div className="bg-secondary/20 rounded-lg p-4 text-sm text-muted-foreground mb-6 space-y-1.5">
          <p className="font-semibold text-foreground mb-2">Next Steps:</p>
          <p>1. Check your email for wire instructions</p>
          <p>2. Send wire within 3 business days</p>
          <p>3. Include reference <strong className="text-foreground">{order.id}</strong> in wire memo</p>
          <p>4. BTC delivered within 24hrs of wire clearance</p>
          <p className="mt-2 text-xs">Questions? <strong>otc@puregoldtrading.com</strong> | 1-800-GOLD-NOW</p>
        </div>

        <div className="flex gap-3">
          <button onClick={() => { onClose(); setLocation("/account/otc-orders"); }}
            className="flex-1 bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors text-sm">
            View My OTC Orders
          </button>
          <button onClick={() => window.print()}
            className="flex-1 border border-border text-foreground py-3 rounded-lg font-semibold hover:bg-secondary/50 transition-colors text-sm">
            Print Instructions
          </button>
        </div>
      </div>
    </div>
  );
}

export default function BitcoinOTCApplyPage() {
  const { user } = useAuth();
  const { kycStatus } = useKYC();
  const [, setLocation] = useLocation();
  const search = useSearch();
  const params = new URLSearchParams(search);

  const { price, isLoading, lastUpdated } = useBTCPrice();

  const [btcAmount, setBtcAmount] = useState(() => {
    const v = parseFloat(params.get("btc") || "1");
    return isNaN(v) ? 1.0 : Math.min(10, Math.max(0.2, v));
  });
  const [settlement, setSettlement] = useState("USD (Bank Wire)");
  const [wallet, setWallet] = useState("");
  const [timeline, setTimeline] = useState<"standard" | "priority">("standard");
  const [bankName, setBankName] = useState("");
  const [bankAcct, setBankAcct] = useState("");
  const [bankCountry, setBankCountry] = useState("United States");
  const [purpose, setPurpose] = useState("");
  const [notes, setNotes] = useState("");
  const [checks, setChecks] = useState<boolean[]>([false,false,false,false,false,false]);
  const [submittedOrder, setSubmittedOrder] = useState<OTCOrder | null>(null);

  useEffect(() => {
    if (!user) setLocation("/account/login?redirect=/bitcoin-otc/apply");
  }, [user, setLocation]);

  if (!user) return null;
  if (kycStatus !== KYC_STATUS.APPROVED) return <KYCGate />;

  const spread = getSpread(btcAmount);
  const total = calcTotal(btcAmount, price);
  const priorityFee = timeline === "priority" ? total * 0.0025 : 0;
  const finalTotal = total + priorityFee;
  const walletHint = detectWallet(wallet);
  const walletValid = wallet.length === 0 || validateBTCAddress(wallet);

  const allChecked = checks.every(Boolean);
  const canSubmit = btcAmount >= 0.2 && btcAmount <= 10 && validateBTCAddress(wallet) &&
    bankName && bankAcct && bankCountry && purpose && allChecked;

  const LEGAL = [
    "I confirm this purchase is for my own account and not on behalf of any third party",
    "I understand Bitcoin prices fluctuate and the final price will be locked at the time my wire is received",
    "I confirm the wallet address I provided is correct and I accept sole responsibility for delivery accuracy",
    "I understand transactions over $10,000 USD are reported to the IRS and FinCEN as required by US law",
    "I have read and agree to the OTC Desk Terms of Service",
    "I confirm I am not a resident of a sanctioned country (OFAC list)",
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const order: OTCOrder = {
      id: generateOrderId(),
      btcAmount,
      usdTotal: finalTotal,
      spotPrice: price,
      spread,
      walletAddress: wallet,
      settlementType: settlement,
      settlementTimeline: timeline,
      bankName,
      bankAccountLast4: bankAcct,
      bankCountry,
      purpose,
      notes,
      status: "wire_awaited",
      submittedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    saveOTCOrder(order);
    setSubmittedOrder(order);
  };

  const fmt = (n: number) => n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <>
      {submittedOrder && <ConfirmationModal order={submittedOrder} onClose={() => setSubmittedOrder(null)} />}

      <div className="container mx-auto px-4 py-10 max-w-2xl">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl font-bold text-orange-400">₿</span>
            <h1 className="text-2xl font-serif font-bold text-foreground">Bitcoin OTC Purchase Application</h1>
          </div>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span className="bg-green-500/10 text-green-400 border border-green-500/20 px-2.5 py-0.5 rounded-full text-xs font-semibold">KYC Verified ✓</span>
            <span>{user.email}</span>
          </div>
        </div>

        {/* Risk warning */}
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg px-4 py-3 flex items-start gap-2 mb-8 text-sm text-amber-300">
          <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
          <span>Bitcoin involves significant financial risk. Only invest what you can afford to lose. This is not financial advice.</span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Section 1: Purchase Details */}
          <section className="bg-card border border-border rounded-xl p-6 space-y-6">
            <h2 className="font-semibold text-foreground border-b border-border pb-3">Purchase Details</h2>

            {/* Live price */}
            <div className="flex items-center justify-between text-sm bg-secondary/20 rounded-lg px-4 py-2.5">
              <span className="text-muted-foreground">Current BTC Spot:</span>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-foreground">${fmt(price)}</span>
                <span className="text-muted-foreground">| Spread: +{(spread*100).toFixed(2)}%</span>
                <RefreshCw className={`h-3 w-3 text-muted-foreground ${isLoading ? "animate-spin" : ""}`} />
                <span className="text-xs text-muted-foreground">{lastUpdated.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
              </div>
            </div>

            {/* BTC Amount */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">How much Bitcoin do you want to buy? *</label>
              <div className="relative">
                <input
                  type="number" min={0.2} max={10} step={0.01}
                  value={btcAmount}
                  onChange={e => setBtcAmount(Math.min(10, Math.max(0.2, parseFloat(e.target.value) || 0.2)))}
                  className="w-full bg-background border border-border rounded-lg px-4 py-3 text-lg font-mono font-bold text-foreground focus:outline-none focus:border-primary pr-16"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 font-semibold text-muted-foreground">BTC</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Minimum: 0.20 BTC | Maximum: 10.00 BTC per transaction</p>
              {(btcAmount < 0.2 || btcAmount > 10) && (
                <p className="text-xs text-destructive mt-1">Amount must be between 0.20 and 10.00 BTC</p>
              )}
            </div>

            {/* USD Total */}
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-5">
              <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Estimated Total Cost (USD)</div>
              <div className="text-3xl font-bold font-mono text-primary">${fmt(finalTotal)}</div>
              <div className="text-xs text-muted-foreground mt-1">
                {btcAmount.toFixed(2)} BTC × ${fmt(price)} × (1 + {(spread*100).toFixed(2)}%)
                {timeline === "priority" && ` + Priority fee ($${fmt(priorityFee)})`}
              </div>
              <div className="mt-3 text-xs inline-flex items-center gap-1.5 bg-primary/10 text-primary px-2 py-1 rounded-md font-semibold">
                Tier: {btcAmount < 1 ? "0.20–0.99" : btcAmount < 3 ? "1.00–2.99" : btcAmount < 5 ? "3.00–4.99" : btcAmount < 8 ? "5.00–7.99" : "8.00–10.00"} BTC → Spread: +{(spread*100).toFixed(2)}%
              </div>
            </div>

            {/* Settlement currency */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Settlement Currency *</label>
              <div className="space-y-2">
                {[
                  { val: "USD (Bank Wire)", label: "USD (Bank Wire)", hint: "Most common — no additional fee" },
                  { val: "USDC (Stablecoin)", label: "USDC (Stablecoin wire)", hint: "+0.25% fee" },
                  { val: "USDT (Tether)", label: "USDT (Tether)", hint: "+0.25% fee" },
                ].map(opt => (
                  <label key={opt.val} className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors text-sm ${
                    settlement === opt.val ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"
                  }`}>
                    <input type="radio" name="settlement" value={opt.val} checked={settlement === opt.val}
                      onChange={e => setSettlement(e.target.value)} className="accent-primary" />
                    <span className="text-foreground font-medium">{opt.label}</span>
                    <span className="text-muted-foreground text-xs ml-auto">{opt.hint}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Wallet */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Your Bitcoin Wallet Address *</label>
              <input
                value={wallet} onChange={e => setWallet(e.target.value)}
                placeholder="bc1q... or 3... or 1..."
                className={`w-full bg-background border rounded-lg px-4 py-3 font-mono text-sm text-foreground focus:outline-none transition-colors ${
                  wallet && !walletValid ? "border-destructive focus:border-destructive" : "border-border focus:border-primary"
                }`}
              />
              {wallet && <p className={`text-xs mt-1.5 font-medium ${walletValid ? "text-green-400" : "text-destructive"}`}>{walletHint}</p>}
              <p className="text-xs text-muted-foreground mt-1">This is where we will send your BTC after settlement. Double-check this address carefully. Transactions cannot be reversed.</p>
              <div className="mt-2 bg-amber-500/10 border border-amber-500/20 rounded-md px-3 py-2 text-xs text-amber-300 flex items-start gap-1.5">
                <AlertTriangle className="h-3 w-3 mt-0.5 shrink-0" />
                We are not responsible for BTC sent to incorrect addresses. Verify your wallet address carefully.
              </div>
            </div>

            {/* Settlement timeline */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Preferred Settlement Timeline *</label>
              <div className="space-y-2">
                <label className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors text-sm ${timeline === "standard" ? "border-primary bg-primary/5" : "border-border"}`}>
                  <input type="radio" name="timeline" value="standard" checked={timeline === "standard"} onChange={() => setTimeline("standard")} className="accent-primary" />
                  <span className="text-foreground font-medium">Standard</span>
                  <span className="text-muted-foreground text-xs ml-auto">Within 24 hours of wire clearance — no fee</span>
                </label>
                <label className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors text-sm ${timeline === "priority" ? "border-primary bg-primary/5" : "border-border"}`}>
                  <input type="radio" name="timeline" value="priority" checked={timeline === "priority"} onChange={() => setTimeline("priority")} className="accent-primary" />
                  <span className="text-foreground font-medium">Priority</span>
                  <span className="text-muted-foreground text-xs ml-auto">Within 4 hours of wire clearance — +0.25%</span>
                </label>
              </div>
            </div>
          </section>

          {/* Section 2: Wire Details */}
          <section className="bg-card border border-border rounded-xl p-6 space-y-5">
            <h2 className="font-semibold text-foreground border-b border-border pb-3">Wire Transfer Details</h2>
            <p className="text-sm text-muted-foreground">After submission, you'll receive personalized wire instructions. Here's what to expect:</p>

            <div className="bg-secondary/20 rounded-xl p-5 text-sm font-mono space-y-2 text-muted-foreground">
              <p className="font-semibold text-foreground mb-2 not-italic">Wire Instructions (sent after submission)</p>
              <div className="space-y-1.5">
                {[
                  ["Bank Name", "JPMorgan Chase Bank, N.A."],
                  ["Account Name", "PureGold Trading LLC"],
                  ["ABA Routing", "021000021"],
                  ["Account Number", "847293018475"],
                  ["Reference/Memo", "[YOUR ORDER # — auto-assigned]"],
                  ["Amount", `$${fmt(finalTotal)} USD`],
                ].map(([k, v]) => (
                  <div key={k} className="flex gap-2 text-xs sm:text-sm">
                    <span className="w-36 shrink-0 text-muted-foreground">{k}:</span>
                    <span className="text-foreground">{v}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-border/40 pt-3 mt-2 text-xs space-y-1">
                <p>⚠️ Wire must be received within 3 business days</p>
                <p>⚠️ Reference number MUST appear in wire memo field</p>
                <p>⚠️ Wire must come from account in your verified name</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Your Bank Name *</label>
              <input value={bankName} onChange={e => setBankName(e.target.value)}
                className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Bank Account Number (last 4 digits) *</label>
              <input value={bankAcct} onChange={e => setBankAcct(e.target.value)} maxLength={4}
                className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary" />
              <p className="text-xs text-muted-foreground mt-1">Funds must originate from a bank account in your legal name as verified in KYC.</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Wire Originating Bank Country *</label>
              <select value={bankCountry} onChange={e => setBankCountry(e.target.value)}
                className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary">
                {["United States","Canada","United Kingdom","Australia","Germany","France","Switzerland","Singapore","Other"].map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </section>

          {/* Section 3: Additional */}
          <section className="bg-card border border-border rounded-xl p-6 space-y-4">
            <h2 className="font-semibold text-foreground border-b border-border pb-3">Additional Information</h2>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Purpose of this purchase *</label>
              <select value={purpose} onChange={e => setPurpose(e.target.value)}
                className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary">
                <option value="">Select...</option>
                {PURPOSES.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Additional notes (optional)</label>
              <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3}
                placeholder="Any special instructions or questions..."
                className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary resize-none" />
            </div>
          </section>

          {/* Section 4: Legal */}
          <section className="bg-card border border-border rounded-xl p-6 space-y-4">
            <h2 className="font-semibold text-foreground border-b border-border pb-3">Legal Agreements</h2>
            <div className="space-y-3">
              {LEGAL.map((text, i) => (
                <label key={i} className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" checked={checks[i]}
                    onChange={() => setChecks(c => c.map((v,j) => j === i ? !v : v))}
                    className="mt-0.5 accent-primary shrink-0" />
                  <span className="text-sm text-muted-foreground">{text} *</span>
                </label>
              ))}
            </div>
          </section>

          <button type="submit" disabled={!canSubmit}
            className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-bold text-base disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
            <span className="text-xl">₿</span> Submit OTC Application — ${fmt(finalTotal)} USD
          </button>
        </form>

        {/* Compliance footer */}
        <div className="mt-10 text-xs text-muted-foreground space-y-1.5 border-t border-border pt-6">
          <p>Bitcoin OTC services provided by PureGold Trading LLC, a registered Money Services Business (MSB) with FinCEN. Registration #: 31000XXXXXXX.</p>
          <p>We do not service residents of sanctioned countries including Cuba, Iran, North Korea, Syria, and the Crimea region.</p>
        </div>
      </div>
    </>
  );
}
