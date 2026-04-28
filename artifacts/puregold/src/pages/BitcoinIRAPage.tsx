import { Link } from "wouter";
import { Shield, TrendingUp, FileText, DollarSign } from "lucide-react";

const BENEFITS = [
  { icon: Shield, title: "Tax-Advantaged Growth", desc: "Bitcoin held in a Traditional IRA grows tax-deferred. Roth IRA holders enjoy tax-free growth." },
  { icon: TrendingUp, title: "Portfolio Diversification", desc: "Add uncorrelated asset exposure to your retirement portfolio beyond stocks and bonds." },
  { icon: FileText, title: "IRS Compliant", desc: "Self-directed IRAs are fully legal under IRS regulations. You must use an approved custodian." },
  { icon: DollarSign, title: "2026 Contribution Limits", desc: "Contribute up to $7,000/yr ($8,000 if 50+) to a self-directed IRA holding BTC." },
];

const CUSTODIANS = [
  { name: "Kingdom Trust", desc: "Regulated custodian, supports Bitcoin self-directed IRAs." },
  { name: "Equity Trust", desc: "Largest self-directed IRA custodian in the US." },
  { name: "Alto IRA", desc: "Modern platform built for alternative assets including crypto." },
  { name: "iTrustCapital", desc: "Crypto-native IRA platform with low fees." },
];

const FAQ = [
  { q: "Can I buy Bitcoin in my IRA?", a: "Yes. A self-directed IRA (SDIRA) can hold Bitcoin. You cannot hold BTC in a standard brokerage IRA — you need a custodian that specifically supports alternative assets." },
  { q: "What type of IRA should I use?", a: "A Traditional SDIRA gives you a tax deduction now, and you pay taxes on withdrawal. A Roth SDIRA uses after-tax money, but growth and qualified withdrawals are tax-free." },
  { q: "How does the BTC get into my IRA?", a: "You fund your SDIRA, then direct the custodian to purchase BTC through an approved OTC desk like GoldBuller. The BTC is held in a wallet controlled by the custodian on your behalf." },
  { q: "Can I take physical custody?", a: "No. IRA rules prohibit self-custody of IRA assets. The custodian must hold the Bitcoin. Early withdrawal triggers taxes and a 10% penalty." },
  { q: "What are the IRS rules?", a: "IRS Notice 2014-21 treats Bitcoin as property. It can be held in SDIRAs. You cannot use IRA Bitcoin for personal benefit before age 59½ without penalty." },
  { q: "What is the minimum purchase through your OTC desk?", a: "For IRA-directed purchases, our minimum is 0.20 BTC, the same as regular OTC purchases. Work with your custodian to initiate the purchase." },
];

export default function BitcoinIRAPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-2xl font-bold text-orange-400">₿</span>
          <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Bitcoin OTC Desk</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">
          Bitcoin IRA: How to Buy BTC for Retirement
        </h1>
        <p className="text-muted-foreground text-lg">
          Learn how to hold Bitcoin inside a tax-advantaged retirement account using a 
          self-directed IRA — and how our OTC desk can help facilitate your purchase.
        </p>
      </div>

      {/* What is Bitcoin IRA */}
      <div className="bg-card border border-border rounded-xl p-6 mb-8">
        <h2 className="text-xl font-semibold text-foreground mb-3">What Is a Bitcoin IRA?</h2>
        <p className="text-muted-foreground text-sm">
          A Bitcoin IRA is a type of self-directed Individual Retirement Account (SDIRA) that allows you to hold 
          Bitcoin alongside traditional investments. Unlike standard IRAs managed by brokerages that only allow 
          stocks, bonds, and mutual funds, an SDIRA can hold alternative assets including real estate, precious 
          metals, and cryptocurrency.
        </p>
      </div>

      {/* Benefits */}
      <div className="mb-10">
        <h2 className="text-xl font-semibold text-foreground mb-4">Benefits of a Bitcoin IRA</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {BENEFITS.map((b, i) => (
            <div key={i} className="bg-card border border-border rounded-xl p-5">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                <b.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-1.5 text-sm">{b.title}</h3>
              <p className="text-muted-foreground text-xs">{b.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* How it works */}
      <div className="bg-card border border-border rounded-xl p-6 mb-8">
        <h2 className="text-xl font-semibold text-foreground mb-4">How to Buy Bitcoin Through an IRA</h2>
        <ol className="space-y-4 text-sm text-muted-foreground">
          {[
            { title: "Choose an SDIRA custodian", desc: "Select a custodian that supports Bitcoin holdings (see our list below). Open an account and fund it." },
            { title: "Complete OTC KYC", desc: "Complete KYC verification with our desk. This is a separate process from your custodian's onboarding." },
            { title: "Initiate your IRA purchase", desc: "Contact your custodian to direct them to purchase Bitcoin through our OTC desk. They will wire funds from your IRA." },
            { title: "Wire comes from the custodian", desc: "The wire must come from your custodian's account referencing your IRA account number. Your order reference must appear in the memo." },
            { title: "BTC delivered to custody wallet", desc: "After wire clears, BTC is sent to the wallet address specified by your custodian (not a personal wallet)." },
          ].map((step, i) => (
            <li key={i} className="flex gap-4">
              <div className="shrink-0 w-7 h-7 rounded-full bg-primary/20 text-primary text-xs font-bold flex items-center justify-center">
                {i + 1}
              </div>
              <div>
                <p className="font-medium text-foreground mb-0.5">{step.title}</p>
                <p>{step.desc}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      {/* Custodians */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-foreground mb-4">Approved IRA Custodians (Examples)</h2>
        <p className="text-muted-foreground text-sm mb-4">We work with most IRA custodians. These are popular options — this is not an endorsement.</p>
        <div className="grid sm:grid-cols-2 gap-3">
          {CUSTODIANS.map((c, i) => (
            <div key={i} className="bg-card border border-border rounded-lg p-4">
              <p className="font-semibold text-foreground text-sm">{c.name}</p>
              <p className="text-xs text-muted-foreground">{c.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div className="mb-10">
        <h2 className="text-xl font-semibold text-foreground mb-4">Bitcoin IRA FAQ</h2>
        <div className="space-y-3">
          {FAQ.map((item, i) => (
            <div key={i} className="bg-card border border-border rounded-lg p-4">
              <p className="font-medium text-foreground text-sm mb-1.5">{item.q}</p>
              <p className="text-muted-foreground text-xs">{item.a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-5 mb-8 text-xs text-amber-300">
        <p className="font-semibold mb-1">Important Disclaimer</p>
        <p>This is not financial, tax, or legal advice. Self-directed IRA rules are complex. Consult a qualified tax professional or financial advisor before making retirement account investment decisions. IRS rules regarding cryptocurrency in IRAs may change.</p>
      </div>

      {/* CTA */}
      <div className="bg-gradient-to-r from-orange-950/30 to-yellow-950/20 border border-orange-400/20 rounded-xl p-8 text-center">
        <h2 className="text-2xl font-serif font-bold text-foreground mb-2">Open Your OTC Account</h2>
        <p className="text-muted-foreground mb-6 text-sm">Start the process to buy Bitcoin for your IRA. Complete KYC and coordinate with your custodian.</p>
        <Link href="/bitcoin-otc/apply" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3 rounded-lg font-bold hover:bg-primary/90 transition-colors">
          ₿ Apply for OTC Account →
        </Link>
      </div>
    </div>
  );
}
