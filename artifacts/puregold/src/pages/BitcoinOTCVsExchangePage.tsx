import { Link } from "wouter";
import { Check, X } from "lucide-react";

const ROWS = [
  { feature: "Price Slippage", otc: "None — fixed quote", exchange: "High on large orders" },
  { feature: "Order Book Visibility", otc: "Private — off-market", exchange: "Fully public" },
  { feature: "Minimum Purchase", otc: "0.20 BTC", exchange: "No minimum" },
  { feature: "Settlement Time", otc: "24 hours (wire)", exchange: "Instant" },
  { feature: "KYC Required", otc: "Yes", exchange: "Yes" },
  { feature: "Market Impact", otc: "Zero", exchange: "Can be significant" },
  { feature: "Personal Service", otc: "Dedicated manager", exchange: "None" },
  { feature: "Wire Settlement", otc: "✅ Primary method", exchange: "Varies by platform" },
  { feature: "Compliance (FinCEN MSB)", otc: "✅ Registered MSB", exchange: "Varies" },
  { feature: "Price Lock", otc: "Locked at wire receipt", exchange: "Market price" },
  { feature: "Best for", otc: "0.20+ BTC buyers", exchange: "Frequent small trades" },
];

const PROS = {
  otc: [
    "No price impact on your purchase",
    "Fixed, negotiated price",
    "Complete privacy — no public order book",
    "Dedicated compliance support",
    "Regulated US Money Services Business",
    "Ideal for large one-time purchases",
  ],
  exchange: [
    "Instant settlement",
    "No minimum order size",
    "24/7 trading availability",
    "Best for frequent, small trades",
    "Wide variety of altcoins",
  ]
};

const CONS = {
  otc: [
    "Not suitable for frequent small trades",
    "Wire transfer required",
    "1-2 business day KYC process",
    "Business hours only for desk service",
  ],
  exchange: [
    "Price slippage on large orders",
    "Your order is visible on the public book",
    "Regulatory risk varies by platform",
    "Market impact when buying 1+ BTC",
  ]
};

export default function BitcoinOTCVsExchangePage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-2xl font-bold text-orange-400">₿</span>
          <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Bitcoin OTC Desk</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">
          Bitcoin OTC vs Exchange: Which Is Better for Large Buys?
        </h1>
        <p className="text-muted-foreground text-lg">
          If you're buying 0.20 BTC or more, the choice between an OTC desk and a crypto exchange
          has significant financial and operational implications. Here's everything you need to know.
        </p>
      </div>

      {/* Summary */}
      <div className="bg-card border border-border rounded-xl p-6 mb-10">
        <h2 className="text-lg font-semibold text-foreground mb-3">TL;DR Summary</h2>
        <p className="text-muted-foreground text-sm">
          <strong className="text-foreground">Use an OTC desk</strong> if you're buying 0.20 BTC or more and value privacy, a fixed price, and 
          US regulatory compliance. <strong className="text-foreground">Use an exchange</strong> for frequent small trades where 
          instant settlement is more important than price guarantees.
        </p>
      </div>

      {/* Comparison table */}
      <div className="mb-10">
        <h2 className="text-xl font-semibold text-foreground mb-4">Full Feature Comparison</h2>
        <div className="border border-border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-secondary/30">
              <tr>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">Feature</th>
                <th className="text-center py-3 px-4 text-orange-400 font-semibold">OTC Desk</th>
                <th className="text-center py-3 px-4 text-muted-foreground font-medium">Exchange</th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row, i) => (
                <tr key={i} className="border-t border-border hover:bg-secondary/10">
                  <td className="py-3 px-4 text-muted-foreground">{row.feature}</td>
                  <td className="py-3 px-4 text-center text-green-400 font-medium text-xs">{row.otc}</td>
                  <td className="py-3 px-4 text-center text-muted-foreground text-xs">{row.exchange}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pros/Cons */}
      <div className="grid sm:grid-cols-2 gap-6 mb-10">
        {[
          { title: "OTC Desk Pros", items: PROS.otc, color: "text-green-400", bg: "bg-green-500/5 border-green-500/20" },
          { title: "OTC Desk Cons", items: CONS.otc, color: "text-red-400", bg: "bg-red-500/5 border-red-500/20" },
          { title: "Exchange Pros", items: PROS.exchange, color: "text-green-400", bg: "bg-green-500/5 border-green-500/20" },
          { title: "Exchange Cons", items: CONS.exchange, color: "text-red-400", bg: "bg-red-500/5 border-red-500/20" },
        ].map(section => (
          <div key={section.title} className={`border rounded-xl p-4 ${section.bg}`}>
            <h3 className="font-semibold text-foreground text-sm mb-3">{section.title}</h3>
            <ul className="space-y-1.5">
              {section.items.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                  {section.color === "text-green-400"
                    ? <Check className="h-3.5 w-3.5 text-green-400 shrink-0 mt-0.5" />
                    : <X className="h-3.5 w-3.5 text-red-400 shrink-0 mt-0.5" />
                  }
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Price slippage explainer */}
      <div className="bg-card border border-border rounded-xl p-6 mb-10">
        <h2 className="text-xl font-semibold text-foreground mb-3">Understanding Price Slippage</h2>
        <p className="text-muted-foreground text-sm mb-3">
          When you place a large market order on an exchange, you consume multiple price levels in the order book. 
          Each successive BTC you buy is slightly more expensive than the last.
        </p>
        <p className="text-muted-foreground text-sm">
          <strong className="text-foreground">Example:</strong> Buying 5 BTC on Coinbase at a $94,000 market price might 
          cost you an average of $94,200–$94,500 per BTC due to slippage, whereas our OTC desk gives you a single fixed 
          quote of $94,000 + 0.75% = $94,705 per BTC — often <em>better</em> than the exchange effective price.
        </p>
      </div>

      {/* Use cases */}
      <div className="bg-card border border-border rounded-xl p-6 mb-10">
        <h2 className="text-xl font-semibold text-foreground mb-3">When Should You Choose OTC?</h2>
        <ul className="text-muted-foreground text-sm space-y-2">
          {[
            "Buying 0.20+ BTC in a single transaction",
            "You value privacy and don't want your trade public",
            "You need a fixed, guaranteed price",
            "You're funding a Bitcoin IRA",
            "You represent a business or institutional entity",
            "You prefer USD wire settlement over exchange deposits",
          ].map((item, i) => (
            <li key={i} className="flex gap-2">
              <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* CTA */}
      <div className="bg-gradient-to-r from-orange-950/30 to-yellow-950/20 border border-orange-400/20 rounded-xl p-8 text-center">
        <h2 className="text-2xl font-serif font-bold text-foreground mb-2">Buy 0.20–10 BTC Without Slippage</h2>
        <p className="text-muted-foreground mb-6 text-sm">Fixed price. Private. FinCEN registered. 24hr wire settlement.</p>
        <Link href="/bitcoin-otc" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3 rounded-lg font-bold hover:bg-primary/90 transition-colors">
          ₿ Get a BTC Quote →
        </Link>
      </div>
    </div>
  );
}
