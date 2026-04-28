import { useEffect } from "react";
import { Link, useParams } from "wouter";
import { STATES } from "../../seo/funnelData";

export default function StateLocationPage() {
  const params = useParams<{ state: string }>();
  const state = STATES.find((s) => s.slug === params.state);

  useEffect(() => {
    if (state) {
      document.title = `Buy Gold & Silver in ${state.name} with Bank Wire | GoldBuller`;
    }
  }, [state]);

  if (!state) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <h1 className="text-2xl font-bold text-foreground mb-4">State Page Not Found</h1>
        <Link href="/location" className="text-primary hover:underline">← All States</Link>
      </div>
    );
  }

  const taxColor = state.salesTax === "exempt" ? "text-green-400" : state.salesTax === "partial" ? "text-yellow-400" : "text-red-400";
  const taxBg = state.salesTax === "exempt" ? "bg-green-900/20 border-green-800/30" : state.salesTax === "partial" ? "bg-yellow-900/20 border-yellow-800/30" : "bg-red-900/20 border-red-800/30";

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 pb-20">
      <nav aria-label="Breadcrumb" className="mb-6 text-sm text-muted-foreground flex flex-wrap gap-2">
        <Link href="/" className="text-primary hover:underline">Home</Link>
        <span>›</span>
        <Link href="/location" className="text-primary hover:underline">Buy by State</Link>
        <span>›</span>
        <span>{state.name}</span>
      </nav>

      <h1 className="font-serif text-3xl sm:text-4xl font-bold text-foreground mb-4 leading-tight">
        Buy Gold & Silver in {state.name} with Bank Wire or Bitcoin
      </h1>
      <p className="text-muted-foreground text-lg mb-8 leading-relaxed">{state.localAngle}</p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className={`border rounded-xl p-4 ${taxBg}`}>
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Sales Tax on Bullion</div>
          <div className={`text-lg font-bold ${taxColor}`}>
            {state.salesTax === "exempt" ? "Tax-Free ✓" : state.salesTax === "partial" ? "Partial Exemption" : "Sales Tax Applies"}
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Est. Delivery</div>
          <div className="text-lg font-bold text-foreground">{state.deliveryDays}</div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">State Population</div>
          <div className="text-lg font-bold text-foreground">{state.population}</div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-5 mb-6">
        <h2 className="font-semibold text-foreground mb-2">
          {state.name} Precious Metals Sales Tax
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed">{state.salesTaxNote}</p>
      </div>

      <div className="bg-card border border-border rounded-xl p-5 mb-6">
        <h2 className="font-semibold text-foreground mb-3">How to Buy Gold in {state.name}</h2>
        <div className="space-y-3">
          {[
            { step: "1. Complete KYC Verification", desc: `Create your GoldBuller account and verify your identity. Required for all bank wire orders. ${state.name} residents are eligible for same-day KYC approval.` },
            { step: "2. Choose Your Products", desc: `Most popular products among ${state.name} buyers: ${state.popularProducts.join(", ")}.` },
            { step: "3. Pay by Bank Wire or Bitcoin", desc: `Send a domestic bank wire (same-day clearance) or pay with Bitcoin (60-minute price lock). ${state.stateTip}` },
            { step: "4. Receive Insured Delivery", desc: `Your order ships to ${state.majorCities[0]}, ${state.majorCities[1]}, and all ${state.name} addresses fully insured. Typical delivery: ${state.deliveryDays}.` },
          ].map((item, i) => (
            <div key={i} className="flex gap-3">
              <span className="text-primary font-bold text-sm mt-0.5 shrink-0">→</span>
              <div>
                <span className="font-semibold text-foreground text-sm">{item.step}: </span>
                <span className="text-muted-foreground text-sm">{item.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-5 mb-6">
        <h2 className="font-semibold text-foreground mb-3">Major {state.name} Cities Served</h2>
        <div className="flex flex-wrap gap-2">
          {state.majorCities.map((city) => (
            <span key={city} className="text-sm px-3 py-1 bg-background border border-border rounded-lg text-muted-foreground">
              {city}
            </span>
          ))}
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-5 mb-8">
        <h2 className="font-semibold text-foreground mb-3">Popular Products in {state.name}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {state.popularProducts.map((product) => (
            <div key={product} className="flex items-center gap-2 text-sm">
              <span className="text-primary">✓</span>
              <span className="text-muted-foreground">{product}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-5 mb-8">
        <h2 className="font-semibold text-foreground mb-3">Payment Methods for {state.name} Buyers</h2>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between py-2 border-b border-border">
            <span className="text-foreground font-medium">Bank Wire (Domestic)</span>
            <span className="text-muted-foreground">Same-day clearance · $15–35 fee</span>
          </div>
          <div className="flex justify-between py-2 border-b border-border">
            <span className="text-foreground font-medium">Bitcoin (BTC)</span>
            <span className="text-muted-foreground">60-min price lock · No surcharge</span>
          </div>
          <div className="flex justify-between py-2 border-b border-border">
            <span className="text-foreground font-medium">Credit Card</span>
            <span className="text-muted-foreground">Instant · 3.5% surcharge</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-foreground font-medium">Personal Check / Money Order</span>
            <span className="text-muted-foreground">No fee · 5–7 day clearance</span>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-[#1a1508] to-card border border-primary/20 rounded-xl p-8 text-center">
        <h2 className="font-serif text-2xl font-bold text-foreground mb-3">
          Buy Gold in {state.name} Today
        </h2>
        <p className="text-muted-foreground mb-6">
          Fully insured shipping to {state.majorCities[0]} and all {state.name} addresses.
          {state.salesTax === "exempt" ? " No sales tax on bullion." : ""}
          {" "}Bank wire and Bitcoin accepted.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link href="/gold" className="inline-block bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:opacity-90">Shop Gold →</Link>
          <Link href="/silver" className="inline-block border border-primary text-primary px-6 py-3 rounded-lg font-semibold hover:bg-primary/10">Shop Silver →</Link>
        </div>
      </div>

      <div className="mt-10">
        <h2 className="font-semibold text-foreground mb-4">Other States</h2>
        <div className="flex flex-wrap gap-2">
          {STATES.filter((s) => s.slug !== state.slug).map((s) => (
            <Link key={s.slug} href={`/location/${s.slug}`} className="text-sm text-primary hover:underline px-2 py-1 bg-card border border-border rounded">
              {s.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
