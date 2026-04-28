import { useEffect } from "react";
import { Link } from "wouter";
import { STATES } from "../../seo/funnelData";

export default function LocationHubPage() {
  useEffect(() => {
    document.title = "Buy Gold & Silver by State | GoldBuller — US Precious Metals Dealer";
  }, []);

  const taxBadge = (tax: string) => {
    if (tax === "exempt") return <span className="text-xs font-semibold px-2 py-0.5 bg-green-900/40 text-green-400 border border-green-800/50 rounded-full">Tax-Free</span>;
    if (tax === "partial") return <span className="text-xs font-semibold px-2 py-0.5 bg-yellow-900/40 text-yellow-400 border border-yellow-800/50 rounded-full">Partial Exemption</span>;
    return <span className="text-xs font-semibold px-2 py-0.5 bg-red-900/40 text-red-400 border border-red-800/50 rounded-full">Sales Tax Applies</span>;
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 pb-20">
      <nav aria-label="Breadcrumb" className="mb-6 text-sm text-muted-foreground flex gap-2">
        <Link href="/" className="text-primary hover:underline">Home</Link>
        <span>›</span>
        <span>Buy by State</span>
      </nav>

      <h1 className="font-serif text-3xl sm:text-4xl font-bold text-foreground mb-3">
        Buy Gold & Silver by State
      </h1>
      <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
        GoldBuller ships to all 50 US states — fully insured, with bank wire and Bitcoin accepted. Sales tax treatment varies by state. Find your state for local delivery details and tax status.
      </p>

      <div className="bg-card border border-border rounded-xl p-5 mb-8">
        <h2 className="font-semibold text-foreground mb-3">Payment Methods — All States</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
          <div className="flex items-start gap-2">
            <span className="text-green-400 mt-0.5">✓</span>
            <span className="text-muted-foreground"><strong className="text-foreground">Bank Wire</strong> — Domestic same-day, lowest cost</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-green-400 mt-0.5">✓</span>
            <span className="text-muted-foreground"><strong className="text-foreground">Bitcoin</strong> — No surcharge, 60-min price lock</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-green-400 mt-0.5">✓</span>
            <span className="text-muted-foreground"><strong className="text-foreground">Credit Card</strong> — 3.5% surcharge, instant</span>
          </div>
        </div>
      </div>

      <h2 className="font-serif text-xl font-bold text-foreground mb-4">States With Full Sales Tax Guides</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
        {STATES.map((state) => (
          <Link
            key={state.slug}
            href={`/location/${state.slug}`}
            className="block bg-card border border-border rounded-xl p-5 hover:border-primary/50 transition-colors group"
          >
            <div className="flex items-start justify-between mb-2">
              <span className="font-serif font-bold text-lg text-foreground group-hover:text-primary transition-colors">
                {state.name} <span className="text-muted-foreground text-sm font-normal">({state.abbr})</span>
              </span>
              {taxBadge(state.salesTax)}
            </div>
            <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{state.salesTaxNote}</p>
            <div className="text-xs text-muted-foreground flex gap-4">
              <span>Delivery: {state.deliveryDays}</span>
            </div>
          </Link>
        ))}
      </div>

      <div className="bg-card border border-border rounded-xl p-5 mb-10">
        <h2 className="font-semibold text-foreground mb-3">All Other US States</h2>
        <p className="text-sm text-muted-foreground mb-4">GoldBuller ships fully insured to all 50 states. Most states exempt gold and silver bullion from sales tax. Contact us to confirm your state's current tax treatment before placing a large order.</p>
        <div className="flex flex-wrap gap-2">
          {["AL","AK","AR","CO","DE","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NC","ND","OK","OR","RI","SC","SD","TN","UT","VT","WV","WI","WY","DC"].map(abbr => (
            <span key={abbr} className="text-xs px-2 py-1 bg-background border border-border rounded text-muted-foreground">{abbr}</span>
          ))}
        </div>
      </div>

      <div className="bg-gradient-to-br from-[#1a1508] to-card border border-primary/20 rounded-xl p-8 text-center">
        <h2 className="font-serif text-2xl font-bold text-foreground mb-3">Ready to Order?</h2>
        <p className="text-muted-foreground mb-6">All US addresses. Fully insured. Bank wire and Bitcoin accepted.</p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link href="/gold" className="inline-block bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:opacity-90">Shop Gold →</Link>
          <Link href="/silver" className="inline-block border border-primary text-primary px-6 py-3 rounded-lg font-semibold hover:bg-primary/10">Shop Silver →</Link>
        </div>
      </div>
    </div>
  );
}
