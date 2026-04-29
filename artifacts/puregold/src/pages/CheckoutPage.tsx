import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useKYC } from "@/lib/kycContext";
import { useAuth } from "@/contexts/AuthContext";
import { useCartContext } from "@/contexts/CartContext";
import { ShieldCheck, ArrowRight, ChevronLeft, Package, CreditCard, AlertTriangle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function CheckoutPage() {
  const { isApproved, kycStatus, refreshStatus } = useKYC();
  const { user } = useAuth();
  const { items, subtotal, clearCart } = useCartContext();
  const [, setLocation] = useLocation();

  const [step, setStep] = useState<"shipping" | "review">("shipping");

  const [firstName, setFirstName] = useState(() => user?.name?.split(" ")[0] || "");
  const [lastName, setLastName] = useState(() => {
    const parts = user?.name?.split(" ");
    return parts && parts.length > 1 ? parts.slice(1).join(" ") : "";
  });
  const [email, setEmail] = useState(() => user?.email || "");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [stateVal, setStateVal] = useState("");
  const [zip, setZip] = useState("");
  const [shippingError, setShippingError] = useState("");
  const [placing, setPlacing] = useState(false);
  const [placeError, setPlaceError] = useState("");

  // Pending order gate
  const [pendingCheck, setPendingCheck] = useState<"loading" | "clear" | "blocked">("loading");
  const [pendingOrderNumber, setPendingOrderNumber] = useState<string | null>(null);

  const shipping = subtotal > 499 ? 0 : 9.95;
  const insurance = subtotal * 0.005;
  const total = subtotal + shipping + insurance;

  useEffect(() => {
    if (!user) setLocation("/account/login?redirect=/checkout");
  }, [user, setLocation]);

  useEffect(() => {
    refreshStatus();
  }, []);

  useEffect(() => {
    if (!user?.email) return;
    fetch(`/api/orders/pending-check?email=${encodeURIComponent(user.email)}`)
      .then(r => r.json())
      .then(data => {
        if (data.hasPending) {
          setPendingCheck("blocked");
          setPendingOrderNumber(data.order?.orderNumber || null);
        } else {
          setPendingCheck("clear");
        }
      })
      .catch(() => setPendingCheck("clear"));
  }, [user?.email]);

  if (!user) return null;

  if (!isApproved) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-2xl">
        <div className="bg-card border border-amber-500/30 rounded-2xl overflow-hidden">
          <div className="bg-amber-500/10 border-b border-amber-500/20 px-8 py-6">
            <div className="flex items-center gap-3 mb-1">
              <ShieldCheck className="h-6 w-6 text-amber-400" />
              <h1 className="text-xl font-bold text-foreground">Identity Verification Required</h1>
            </div>
            <p className="text-sm text-muted-foreground">
              All precious metals purchases require KYC verification per US regulatory requirements (Bank Secrecy Act / FinCEN).
            </p>
          </div>
          <div className="px-8 py-8 space-y-6">
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 text-sm text-muted-foreground space-y-1.5">
              <p className="font-semibold text-foreground text-base mb-2">⏱ Takes about 5 minutes</p>
              <p>✅ Review within 1–2 business days</p>
              <p>✅ One-time verification — shop freely after approval</p>
              <p>✅ Unlocks all metals: Gold, Silver, Platinum, Copper</p>
              <p>✅ Also unlocks Bitcoin OTC purchases</p>
            </div>
            {kycStatus === "pending_review" ? (
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-5 text-center">
                <p className="text-blue-400 font-semibold mb-1">🕐 Application Under Review</p>
                <p className="text-sm text-muted-foreground">Your KYC is being reviewed. You'll receive an email when approved — typically within 1–2 business days.</p>
              </div>
            ) : (
              <Link href="/account/kyc" className="flex items-center justify-center gap-2 w-full bg-primary text-primary-foreground py-4 rounded-xl font-bold text-lg hover:bg-primary/90 transition-colors">
                <ShieldCheck className="h-5 w-5" />
                Start Identity Verification
                <ArrowRight className="h-5 w-5" />
              </Link>
            )}
            <div className="text-center">
              <Link href="/cart" className="text-sm text-muted-foreground hover:text-primary transition-colors">← Back to Cart</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Pending order block
  if (pendingCheck === "loading") {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <Clock className="h-10 w-10 text-primary mx-auto mb-4 animate-pulse" />
        <p className="text-muted-foreground text-sm">Checking order status…</p>
      </div>
    );
  }

  if (pendingCheck === "blocked") {
    return (
      <div className="container mx-auto px-4 py-16 max-w-2xl">
        <div className="bg-card border border-amber-500/30 rounded-2xl overflow-hidden">
          <div className="bg-amber-500/10 border-b border-amber-500/20 px-8 py-6">
            <div className="flex items-center gap-3 mb-1">
              <AlertTriangle className="h-6 w-6 text-amber-400" />
              <h1 className="text-xl font-bold text-foreground">Pending Order Exists</h1>
            </div>
            <p className="text-sm text-muted-foreground">You already have an open order that must be resolved before placing a new one.</p>
          </div>
          <div className="px-8 py-8 space-y-5">
            {pendingOrderNumber && (
              <div className="bg-secondary/30 rounded-xl p-4 text-sm font-mono text-center">
                <span className="text-muted-foreground">Order: </span>
                <span className="text-foreground font-bold">{pendingOrderNumber}</span>
              </div>
            )}
            <div className="bg-secondary/20 rounded-xl p-4 text-sm text-muted-foreground space-y-2">
              <p className="font-semibold text-foreground">To place a new order you must first:</p>
              <p>• Complete payment on your pending order, <strong>or</strong></p>
              <p>• Wait for the order to be cancelled or declined by our team</p>
            </div>
            <Link
              href="/account/dashboard"
              className="flex items-center justify-center gap-2 w-full bg-primary text-primary-foreground py-4 rounded-xl font-bold text-lg hover:bg-primary/90 transition-colors"
            >
              View My Dashboard & Wire Instructions
              <ArrowRight className="h-5 w-5" />
            </Link>
            <div className="text-center">
              <Link href="/cart" className="text-sm text-muted-foreground hover:text-primary transition-colors">← Back to Cart</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0 && step !== "review") {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-serif font-bold mb-4">Your cart is empty</h1>
        <Link href="/" className="text-primary hover:underline">Continue Shopping</Link>
      </div>
    );
  }

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShippingError("");
    if (!address.trim() || !city.trim() || !stateVal.trim() || !zip.trim()) {
      setShippingError("Please fill in all address fields.");
      return;
    }
    setStep("review");
  };

  const handlePlaceOrder = async () => {
    setPlacing(true);
    setPlaceError("");
    try {
      const orderNumber = "PG-" + Math.random().toString(36).substring(2, 7).toUpperCase() + Date.now().toString(36).slice(-4).toUpperCase();
      const orderPayload = {
        userEmail: user.email,
        items: items.map(i => ({ productId: i.productId, name: i.name, price: i.price, quantity: i.quantity, image: i.image })),
        subtotal,
        shipping,
        insurance,
        total,
        orderNumber,
        shippingAddress: { firstName, lastName, email, phone, address, city, state: stateVal, zip },
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });
      const data = await res.json();

      if (!data.success) {
        if (data.error === "pending_order_exists") {
          setPendingCheck("blocked");
          setPendingOrderNumber(data.orderNumber || null);
          setPlacing(false);
          return;
        }
        setPlaceError(data.error || "Failed to place order. Please try again.");
        setPlacing(false);
        return;
      }

      // Save to localStorage for the confirmation page
      const orderForStorage = {
        id: data.order.orderNumber,
        orderNumber: data.order.orderNumber,
        dbId: data.order.id,
        items,
        subtotal,
        shipping,
        insurance,
        total,
        shippingAddress: { firstName, lastName, email, phone, address, city, state: stateVal, zip },
        paymentMethod: "Wire Transfer",
        status: "pending_wire_instructions",
        createdAt: new Date().toISOString(),
      };
      try {
        const existing = JSON.parse(localStorage.getItem("pg_orders") || "[]");
        localStorage.setItem("pg_orders", JSON.stringify([orderForStorage, ...existing]));
        localStorage.setItem("pg_last_order", JSON.stringify(orderForStorage));
      } catch {}

      clearCart?.();
      setLocation("/order-confirmation");
    } catch {
      setPlaceError("Network error. Please try again.");
      setPlacing(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <div className="flex items-center gap-3 mb-8">
        <Link href="/cart" className="text-muted-foreground hover:text-foreground transition-colors">
          <ChevronLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-3xl font-serif font-bold">Checkout</h1>
        <div className="ml-auto flex items-center gap-2 text-xs font-semibold">
          <button
            onClick={() => setStep("shipping")}
            className={`px-3 py-1 rounded-full ${step === "shipping" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
          >
            1. Shipping
          </button>
          <span className="text-muted-foreground">→</span>
          <span className={`px-3 py-1 rounded-full ${step === "review" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>
            2. Review & Pay
          </span>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          {step === "shipping" && (
            <form onSubmit={handleShippingSubmit} className="bg-card border border-border rounded-xl p-6 space-y-5">
              <h2 className="font-bold text-lg flex items-center gap-2 mb-1">
                <Package className="h-5 w-5 text-primary" /> Shipping Information
              </h2>

              {shippingError && (
                <div className="bg-destructive/10 border border-destructive/30 rounded p-3 text-sm text-destructive">{shippingError}</div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>First Name</Label>
                  <Input value={firstName} onChange={e => setFirstName(e.target.value)} required className="bg-background border-border" />
                </div>
                <div className="space-y-2">
                  <Label>Last Name</Label>
                  <Input value={lastName} onChange={e => setLastName(e.target.value)} required className="bg-background border-border" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="bg-background border-border" />
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="(555) 000-0000" className="bg-background border-border" />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Street Address</Label>
                <Input value={address} onChange={e => setAddress(e.target.value)} placeholder="123 Main St" required className="bg-background border-border" />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2 col-span-1">
                  <Label>City</Label>
                  <Input value={city} onChange={e => setCity(e.target.value)} required className="bg-background border-border" />
                </div>
                <div className="space-y-2 col-span-1">
                  <Label>State</Label>
                  <Input value={stateVal} onChange={e => setStateVal(e.target.value)} placeholder="CA" maxLength={2} required className="bg-background border-border uppercase" />
                </div>
                <div className="space-y-2 col-span-1">
                  <Label>ZIP Code</Label>
                  <Input value={zip} onChange={e => setZip(e.target.value)} placeholder="90210" required className="bg-background border-border" />
                </div>
              </div>

              <Button type="submit" className="w-full h-12 font-bold uppercase tracking-wider">
                Continue to Review <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>
          )}

          {step === "review" && (
            <div className="space-y-5">
              <div className="bg-card border border-border rounded-xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="font-bold flex items-center gap-2"><Package className="h-4 w-4 text-primary" /> Ship to</h2>
                  <button onClick={() => setStep("shipping")} className="text-xs text-primary hover:underline">Edit</button>
                </div>
                <p className="text-sm text-foreground">{firstName} {lastName}</p>
                <p className="text-sm text-muted-foreground">{address}, {city}, {stateVal} {zip}</p>
                <p className="text-sm text-muted-foreground">{email}{phone ? ` · ${phone}` : ""}</p>
              </div>

              <div className="bg-card border border-border rounded-xl p-5">
                <h2 className="font-bold flex items-center gap-2 mb-4"><CreditCard className="h-4 w-4 text-primary" /> Payment — Bank Wire Transfer</h2>
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 text-sm space-y-2">
                  <p className="font-semibold text-amber-300">🏦 How Wire Transfer Works</p>
                  <p className="text-muted-foreground leading-relaxed">
                    Once your order is placed, our team will review it and email you personalized wire transfer instructions within a few hours. You will also see them on your account dashboard.
                  </p>
                  <div className="border-t border-amber-500/20 pt-3 mt-2 text-xs space-y-1 text-muted-foreground">
                    <p>⚠️ Wire must be received within 4 hours of instructions being sent</p>
                    <p>⚠️ Wire must originate from your verified bank account</p>
                    <p>⚠️ Include the order number in the wire reference/memo field</p>
                  </div>
                </div>
              </div>

              <div className="bg-card border border-border rounded-xl p-5">
                <h2 className="font-bold mb-4">Order Items ({items.length})</h2>
                <div className="space-y-3">
                  {items.map(item => (
                    <div key={item.productId} className="flex items-center justify-between gap-3 text-sm">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-secondary/30 rounded border border-border flex items-center justify-center text-xs text-muted-foreground shrink-0">
                          {item.quantity}×
                        </div>
                        <span className="text-foreground line-clamp-1">{item.name}</span>
                      </div>
                      <span className="font-mono font-semibold text-primary shrink-0">
                        ${(item.price * item.quantity).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {placeError && (
                <div className="bg-destructive/10 border border-destructive/30 rounded-xl p-4 text-sm text-destructive flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 shrink-0" />
                  {placeError}
                </div>
              )}

              <Button
                onClick={handlePlaceOrder}
                disabled={placing}
                className="w-full h-14 text-lg font-bold uppercase tracking-wider"
              >
                {placing ? "Placing Order…" : "Place Order"}
                {!placing && <ArrowRight className="ml-2 h-5 w-5" />}
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                By placing this order you agree to our Terms of Sale. Wire instructions will be emailed to you shortly after order confirmation.
              </p>
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-card border border-border rounded-xl p-5 sticky top-24 space-y-4">
            <h2 className="font-bold text-foreground border-b border-border pb-3">Order Summary</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Items ({items.reduce((s, i) => s + i.quantity, 0)}):</span>
                <span className="font-mono">${subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Shipping:</span>
                <span className="font-mono">
                  {shipping === 0 ? <span className="text-green-500 font-bold text-xs uppercase tracking-wider">Free</span> : `$${shipping.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Insurance (0.5%):</span>
                <span className="font-mono">${insurance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="pt-3 border-t border-border flex justify-between items-center">
                <span className="font-bold text-foreground">Total:</span>
                <span className="text-xl font-mono font-bold text-primary">${total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
            </div>
            <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-3 text-xs text-green-400 space-y-1">
              <p>🔒 KYC Verified Purchase</p>
              <p>📦 Fully insured shipping</p>
              <p>✅ Authenticity guaranteed</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
