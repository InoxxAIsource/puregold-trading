import { Link } from "wouter";
import { Shield, FileText, Zap, Flag, Phone, Lock } from "lucide-react";
import { LiveBTCPrice } from "@/components/btc/LiveBTCPrice";
import { BTCCalculator } from "@/components/btc/BTCCalculator";
import { TierTable } from "@/components/btc/TierTable";
import { useBTCPrice } from "@/lib/btcPrice";

const STEPS = [
  { icon: "📝", title: "Create Account", desc: "Register and verify your email address" },
  { icon: "🪪", title: "Complete KYC", desc: "Submit government ID and proof of address. Approval in 1-2 business days." },
  { icon: "₿", title: "Submit OTC Request", desc: "Choose your BTC amount (0.20–10 BTC) and submit your purchase application." },
  { icon: "💰", title: "Wire Your Funds", desc: "Receive personalized wire instructions. Send USD via domestic or international wire." },
  { icon: "🔐", title: "Receive Your BTC", desc: "Once wire clears, BTC is sent to your verified wallet address within 24 hours." },
];

const COMPARISON = [
  { feature: "Price Slippage", otc: "None", exchange: "High" },
  { feature: "Order Book Visibility", otc: "Private", exchange: "Public" },
  { feature: "Minimum", otc: "0.20 BTC", exchange: "Any" },
  { feature: "Settlement", otc: "24 hrs", exchange: "Instant" },
  { feature: "KYC Required", otc: "Yes", exchange: "Yes" },
  { feature: "Market Impact", otc: "Zero", exchange: "Significant" },
  { feature: "Personal Service", otc: "Dedicated", exchange: "None" },
  { feature: "Wire Settlement", otc: "✅", exchange: "Varies" },
];

const TRUST = [
  { icon: Lock, text: "AML/KYC Compliant" },
  { icon: FileText, text: "FinCEN Registered MSB" },
  { icon: Zap, text: "24hr Settlement" },
  { icon: Shield, text: "Funds held in escrow" },
  { icon: Flag, text: "US-Based Desk" },
  { icon: Phone, text: "Dedicated Account Manager" },
];

export default function BitcoinOTCPage() {
  const { price } = useBTCPrice();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden bg-black py-20 px-4">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-950/30 via-black to-yellow-950/20" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[280px] font-bold text-orange-400/5 select-none pointer-events-none leading-none">
            ₿
          </div>
        </div>
        <div className="relative container mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 bg-orange-400/10 border border-orange-400/20 rounded-full px-4 py-1.5 text-orange-400 text-xs font-semibold uppercase tracking-wider mb-6">
            <span className="text-base">₿</span> Bitcoin OTC Desk
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white mb-6 leading-tight">
            Buy Bitcoin OTC —<br />
            <span className="text-orange-400">Private, Compliant,</span><br />
            Delivered to Your Wallet
          </h1>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto mb-10">
            Purchase 0.20 to 10 BTC directly from our desk. No exchange. No order book.
            Fixed price. Bank wire settlement. KYC verified buyers only.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/bitcoin-otc/apply" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-lg font-bold text-base hover:bg-primary/90 transition-colors">
              <span className="text-xl">₿</span> Get a BTC Quote →
            </Link>
            <Link href="/bitcoin-otc/how-it-works" className="inline-flex items-center gap-2 border border-zinc-700 text-white px-8 py-4 rounded-lg font-semibold text-base hover:border-zinc-500 hover:bg-zinc-900 transition-colors">
              How OTC Works →
            </Link>
          </div>
        </div>
      </section>

      {/* Live price + calculator */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <LiveBTCPrice showCTA={true} />
          <BTCCalculator />
        </div>
      </section>

      {/* Tier pricing */}
      <section className="bg-card border-y border-border py-16 px-4">
        <div className="container mx-auto max-w-3xl">
          <h2 className="text-2xl font-serif font-bold text-foreground text-center mb-2">
            Volume-Based Spread Tiers
          </h2>
          <p className="text-muted-foreground text-center mb-8">
            Buy more BTC and pay a lower spread over market price.
          </p>
          <div className="bg-background border border-border rounded-xl overflow-hidden">
            <TierTable btcSpot={price} />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-serif font-bold text-foreground text-center mb-12">
            How It Works — 5 Steps
          </h2>
          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border hidden md:block" />
            <div className="space-y-8">
              {STEPS.map((step, i) => (
                <div key={i} className="flex gap-6 relative">
                  <div className="shrink-0 w-16 h-16 rounded-full bg-card border-2 border-primary/30 flex items-center justify-center text-2xl z-10">
                    {step.icon}
                  </div>
                  <div className="flex-1 pt-3">
                    <div className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-1">Step {i + 1}</div>
                    <h3 className="text-lg font-semibold text-foreground mb-1">{step.title}</h3>
                    <p className="text-muted-foreground text-sm">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="text-center mt-12">
            <Link href="/bitcoin-otc/apply" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-lg font-bold hover:bg-primary/90 transition-colors">
              <span>₿</span> Start Your Application →
            </Link>
          </div>
        </div>
      </section>

      {/* OTC vs Exchange */}
      <section className="bg-card border-y border-border py-16 px-4">
        <div className="container mx-auto max-w-3xl">
          <h2 className="text-2xl font-serif font-bold text-foreground text-center mb-10">
            Why OTC Over an Exchange?
          </h2>
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
                {COMPARISON.map((row, i) => (
                  <tr key={i} className="border-t border-border hover:bg-secondary/10 transition-colors">
                    <td className="py-3 px-4 text-muted-foreground">{row.feature}</td>
                    <td className="py-3 px-4 text-center font-semibold text-green-400">{row.otc}</td>
                    <td className="py-3 px-4 text-center text-muted-foreground">{row.exchange}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="text-center mt-8">
            <Link href="/bitcoin-otc/otc-vs-exchange" className="text-primary text-sm hover:underline">
              Read our full OTC vs Exchange comparison →
            </Link>
          </div>
        </div>
      </section>

      {/* Trust signals */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-5xl mx-auto">
          {TRUST.map((t, i) => (
            <div key={i} className="text-center">
              <div className="w-12 h-12 rounded-full bg-card border border-border flex items-center justify-center mx-auto mb-3">
                <t.icon className="h-5 w-5 text-primary" />
              </div>
              <p className="text-xs text-muted-foreground font-medium">{t.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Compliance footer */}
      <div className="bg-secondary/30 border-t border-border py-8 px-4">
        <div className="container mx-auto max-w-4xl text-xs text-muted-foreground space-y-2">
          <p>
            Bitcoin OTC services provided by GoldBuller LLC, a registered Money Services Business (MSB) with FinCEN.
            Registration #: 31000XXXXXXX. Bitcoin is not a legal tender and is subject to significant price volatility.
            Past performance does not guarantee future results. All transactions are subject to AML/KYC verification.
            Transactions over $10,000 are reported to the IRS as required by the Bank Secrecy Act.
          </p>
          <p>
            We do not service residents of sanctioned countries including Cuba, Iran, North Korea, Syria, and the Crimea region.
          </p>
        </div>
      </div>
    </div>
  );
}
