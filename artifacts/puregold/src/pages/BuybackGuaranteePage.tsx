import { Link } from "wouter";
import { usePrice } from "@/contexts/PriceContext";

const consignmentEligible = [
  "Gold American Eagles — Proof 70 Coin Sets & 1 oz Coins",
  "Palladium American Eagles — Mint State 70 & Proof 70 Coins",
  "Platinum American Eagles — Proof 70 Coin Sets (1997–2008) & 1 oz Coins (2009–present)",
  "Silver American Eagles — Proof 70 Coins",
  "Gold American Buffalo — Proof 70 Sets & Coins",
  "Silver Buffalo — Proof 70 Coin (2001)",
  "Gold Double Eagle Ultra High Relief — Mint State 70 (2009)",
  "Gold & Silver American Eagles — Burnished Mint State 70 Sets & Coins",
  "Gold Krugerrand — Proof 70 6-Coin Sets (2022–present)",
  "Gold Krugerrand — Proof 70 Coins, 1 oz & 2 oz (2021–present)",
  "Silver Krugerrand — Proof 70 Coins, 2 oz (2021–present)",
  "Gold Kangaroo — Proof 70 Coins (2023–present)",
];

const whyChoose = [
  {
    icon: "📊",
    title: "Competitive Pricing",
    desc: "Fair market rates based on real-time spot prices — typically 97–99% of spot for bullion.",
  },
  {
    icon: "🔒",
    title: "Trusted & Secure",
    desc: "Decades of experience and a reputation for integrity. Every transaction is transparent and fully insured.",
  },
  {
    icon: "⚡",
    title: "Simplified Process",
    desc: "Our streamlined system makes selling back your metals quick and hassle-free — online or by phone.",
  },
  {
    icon: "✅",
    title: "No Hidden Fees",
    desc: "GoldBuller LLC believes in honest, upfront pricing. You'll always know exactly what you're getting.",
  },
];

const steps = [
  {
    num: "1",
    title: "Request a Quote",
    desc: "Contact GoldBuller LLC by phone or email, or use our Sell to Us tool online. Lock in your price instantly.",
  },
  {
    num: "2",
    title: "Ship Securely",
    desc: "We provide a prepaid, fully insured $25 shipping label. Package your metals securely and drop them off at any carrier location.",
  },
  {
    num: "3",
    title: "Verification",
    desc: "Our team inspects and verifies your metals upon arrival at our facility — typically within 1–2 business days.",
  },
  {
    num: "4",
    title: "Get Paid",
    desc: "Receive payment via bank wire or check within 24–48 hours of verification. Fast, reliable, and hassle-free.",
  },
];

export default function BuybackGuaranteePage() {
  const { spotPrices } = usePrice();

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-b from-primary/10 to-transparent border-b border-border">
        <div className="container mx-auto px-4 py-20 max-w-5xl text-center">
          <p className="text-sm text-primary font-semibold uppercase tracking-widest mb-3">GoldBuller LLC</p>
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-foreground mb-6 leading-tight">
            Buyback Guarantee
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-10">
            Investing in precious metals is a long-term strategy for preserving and growing wealth. But when you're ready to sell, GoldBuller LLC is ready to buy — with competitive pricing, total transparency, and a process built around you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/sell-to-us">
              <span className="inline-block px-8 py-4 rounded-xl bg-primary text-primary-foreground font-bold text-lg hover:bg-primary/90 transition-colors cursor-pointer">
                Sell to GoldBuller LLC
              </span>
            </Link>
            <a href="tel:+18004656669" className="inline-block px-8 py-4 rounded-xl border border-border text-foreground font-semibold text-lg hover:bg-secondary/50 transition-colors">
              Call 1-800-GOLD-NOW
            </a>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 max-w-5xl space-y-20">

        {/* Why GoldBuller */}
        <section>
          <div className="text-center mb-10">
            <h2 className="text-3xl font-serif font-bold text-foreground mb-3">A Trusted Market for Your Metals</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              The precious metals market is constantly evolving, shaped by global demand, economic conditions, and investor sentiment. When you're ready to sell, finding a trustworthy buyer is essential. GoldBuller LLC is committed to making a market for your metals with fair pricing and a streamlined process — whether you purchased from us or elsewhere.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {whyChoose.map(({ icon, title, desc }) => (
              <div key={title} className="p-6 rounded-2xl border border-border bg-card hover:border-primary/30 transition-colors">
                <div className="text-3xl mb-3">{icon}</div>
                <h3 className="font-bold text-foreground mb-2">{title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Live Buyback Prices */}
        <section>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-serif font-bold text-foreground mb-3">Live Buyback Prices</h2>
            <p className="text-muted-foreground">Current offers based on real-time spot prices. Prices update continuously during market hours.</p>
          </div>
          <div className="rounded-2xl border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-secondary/50 border-b border-border">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold text-muted-foreground">Metal</th>
                  <th className="px-6 py-4 text-right font-semibold text-muted-foreground">Spot Price / oz</th>
                  <th className="px-6 py-4 text-right font-semibold text-muted-foreground">Our Offer (% of Spot)</th>
                  <th className="px-6 py-4 text-right font-semibold text-muted-foreground">Est. Payout / oz</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {spotPrices.map((price) => (
                  <tr key={price.metal} className="hover:bg-secondary/10 transition-colors">
                    <td className="px-6 py-4 font-semibold capitalize text-foreground">{price.metal}</td>
                    <td className="px-6 py-4 text-right text-muted-foreground font-mono">
                      ${price.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4 text-right text-muted-foreground">97% – 99%</td>
                    <td className="px-6 py-4 text-right font-mono font-bold text-primary">
                      ${(price.price * 0.98).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-muted-foreground mt-3 text-center">
            Actual payout depends on product type, condition, and quantity. Contact GoldBuller LLC for a personalized quote.
          </p>
        </section>

        {/* Two Options */}
        <section>
          <div className="text-center mb-10">
            <h2 className="text-3xl font-serif font-bold text-foreground mb-3">Two Ways to Sell</h2>
            <p className="text-muted-foreground">GoldBuller LLC offers two distinct programs to match your timeline and goals.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Option 1 - Immediate Liquidation */}
            <div className="rounded-2xl border border-primary/30 bg-primary/5 p-8 flex flex-col">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg shrink-0">1</div>
                <h3 className="text-2xl font-serif font-bold text-foreground">Immediate Liquidation</h3>
              </div>
              <p className="text-muted-foreground leading-relaxed mb-5">
                If you need quick access to funds, Immediate Liquidation offers a fast and efficient way to sell your metals. Ideal for bullion and Investment Grade coins alike, this option provides competitive pricing and a hassle-free experience.
              </p>

              <div className="space-y-3 mb-6 flex-1">
                {[
                  { label: "Eligible Products", value: "All bullion metals (gold, silver, platinum, palladium, copper), plus select Investment Grade & numismatic coins" },
                  { label: "Shipping Cost", value: "$25 prepaid insured shipping label provided by GoldBuller LLC" },
                  { label: "Pricing", value: "Based on current bid/spot price at the time of receipt — competitive and transparent" },
                  { label: "Payment Speed", value: "Bank wire or check within 24–48 hours of verification" },
                  { label: "Minimum Hold Requirement", value: "None — sell any time" },
                ].map(({ label, value }) => (
                  <div key={label} className="flex gap-3 text-sm">
                    <span className="text-primary mt-0.5 shrink-0">•</span>
                    <p><span className="font-semibold text-foreground">{label}: </span><span className="text-muted-foreground">{value}</span></p>
                  </div>
                ))}
              </div>

              <div className="p-4 rounded-xl bg-secondary/20 border border-border text-sm text-muted-foreground mb-6">
                <strong className="text-foreground">Note:</strong> Bullion metals are only eligible for Immediate Liquidation — they are not accepted in the Consignment Program.
              </div>

              <Link href="/sell-to-us">
                <span className="block text-center px-6 py-3 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-colors cursor-pointer">
                  Get an Immediate Quote
                </span>
              </Link>
            </div>

            {/* Option 2 - Consignment */}
            <div className="rounded-2xl border border-border bg-card p-8 flex flex-col">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-secondary text-foreground flex items-center justify-center font-bold text-lg shrink-0">2</div>
                <h3 className="text-2xl font-serif font-bold text-foreground">Consignment Program</h3>
              </div>
              <p className="text-muted-foreground leading-relaxed mb-5">
                For clients who want to maximize their return and aren't in a rush, our Consignment Program connects your eligible Investment Grade Coins with qualified buyers through GoldBuller LLC's exclusive trading floor at competitive retail prices.
              </p>

              <div className="space-y-3 mb-6 flex-1">
                {[
                  { label: "Pricing Formula", value: "GoldBuller LLC's current retail ask price, minus an 18% fee covering marketing, transactional, shipping, and insurance costs" },
                  { label: "Eligible Products", value: "Select Investment Grade Coins only (see eligible list below)" },
                  { label: "Minimum Hold", value: "Items must have been held for at least 60 months (5 years) from the original purchase date" },
                  { label: "Timeline", value: "Varies — depends on finding the right qualified buyer. Not recommended if you need immediate liquidity" },
                  { label: "Who It's For", value: "Long-term investors seeking maximum return on premium numismatic coins" },
                ].map(({ label, value }) => (
                  <div key={label} className="flex gap-3 text-sm">
                    <span className="text-primary mt-0.5 shrink-0">•</span>
                    <p><span className="font-semibold text-foreground">{label}: </span><span className="text-muted-foreground">{value}</span></p>
                  </div>
                ))}
              </div>

              <a href="mailto:support@goldbuller.com" className="block text-center px-6 py-3 rounded-xl border border-border text-foreground font-bold hover:bg-secondary/50 transition-colors">
                Inquire About Consignment
              </a>
            </div>
          </div>
        </section>

        {/* Consignment Eligible Products */}
        <section>
          <div className="mb-8">
            <h2 className="text-3xl font-serif font-bold text-foreground mb-3">Consignment-Eligible Products</h2>
            <p className="text-muted-foreground">
              The following products qualify for GoldBuller LLC's Consignment Program, subject to a minimum 60-month holding period from original purchase date:
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {consignmentEligible.map((item) => (
              <div key={item} className="flex gap-3 p-4 rounded-xl border border-border bg-card hover:border-primary/30 transition-colors">
                <span className="text-primary shrink-0 mt-0.5">✓</span>
                <p className="text-sm text-muted-foreground">{item}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            Products not listed above may still be eligible for Immediate Liquidation. Contact GoldBuller LLC for a custom evaluation.
          </p>
        </section>

        {/* How It Works */}
        <section>
          <div className="text-center mb-10">
            <h2 className="text-3xl font-serif font-bold text-foreground mb-3">How the Process Works</h2>
            <p className="text-muted-foreground">Selling to GoldBuller LLC is simple, secure, and straightforward.</p>
          </div>
          <div className="relative">
            <div className="hidden lg:block absolute top-8 left-[calc(12.5%+1rem)] right-[calc(12.5%+1rem)] h-px bg-border" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {steps.map(({ num, title, desc }) => (
                <div key={num} className="text-center relative">
                  <div className="w-16 h-16 rounded-full bg-primary/20 border-2 border-primary text-primary flex items-center justify-center mx-auto mb-4 font-bold text-2xl font-serif relative z-10">
                    {num}
                  </div>
                  <h3 className="font-bold text-foreground mb-2">{title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Commitment Statement */}
        <section className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 to-transparent p-10 text-center">
          <h2 className="text-3xl font-serif font-bold text-foreground mb-4">GoldBuller LLC's Commitment to You</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-6 leading-relaxed">
            We believe a sound investment strategy includes not just the ability to buy, but the confidence to sell. Our team of precious metals experts is dedicated to providing transparent valuations, fair market offers, and prompt transactions — so you can make informed decisions about your portfolio at every stage.
          </p>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            Whether you're seeking immediate cash, long-term value through consignment, or a flexible solution somewhere in between, GoldBuller LLC handles every transaction with professionalism, precision, and integrity.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/sell-to-us">
              <span className="inline-block px-8 py-4 rounded-xl bg-primary text-primary-foreground font-bold text-lg hover:bg-primary/90 transition-colors cursor-pointer">
                Start Selling Today
              </span>
            </Link>
            <a href="mailto:support@goldbuller.com" className="inline-block px-8 py-4 rounded-xl border border-border text-foreground font-semibold text-lg hover:bg-secondary/50 transition-colors">
              Email Our Team
            </a>
          </div>
          <p className="text-muted-foreground text-sm mt-6">
            Call us for a <strong className="text-foreground">free quote</strong>: <strong className="text-primary">1-800-GOLD-NOW</strong> — Mon–Fri, 9am–6pm ET
          </p>
        </section>

        {/* Disclaimer */}
        <section>
          <div className="p-5 rounded-xl border border-border bg-secondary/10 text-xs text-muted-foreground leading-relaxed">
            <strong className="text-foreground">Disclaimer: </strong>
            GoldBuller LLC's Buyback Guarantee reflects our commitment to providing a market for your metals; it does not guarantee a specific profit or price above your original purchase price. All payout prices are based on current market conditions at the time of transaction. GoldBuller LLC reserves the right to decline purchases of products not originally sold by us or products that do not meet our quality and authenticity standards. Consignment program eligibility, pricing, and timelines are subject to change. Past performance is not indicative of future results. Precious metals prices can decline as well as increase in value.
          </div>
        </section>

      </div>
    </div>
  );
}
