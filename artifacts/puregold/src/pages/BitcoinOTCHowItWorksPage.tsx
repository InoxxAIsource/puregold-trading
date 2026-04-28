import { Link } from "wouter";

const STEPS = [
  {
    icon: "📝", step: 1, title: "Create Your Account",
    desc: `Register at GoldBuller by providing your name, email address, and a secure password. You'll receive a confirmation email to verify your address.

Once verified, you'll have access to our customer portal where you can track your orders, manage your profile, and initiate the KYC process required for Bitcoin OTC purchases.`
  },
  {
    icon: "🪪", step: 2, title: "Complete KYC Verification",
    desc: `Know Your Customer (KYC) verification is required by US federal law under the Bank Secrecy Act (BSA) and enforced by FinCEN for all Money Services Businesses.

You'll need to provide:
• Government-issued photo ID (passport, driver's license, or state ID)
• Proof of address (bank statement, utility bill, or government letter dated within 90 days)
• Selfie holding your ID document
• Personal details including source of funds and purchase purpose

Approval typically takes 1–2 business days. For demo purposes on this site, KYC auto-approves in 30 seconds.`
  },
  {
    icon: "₿", step: 3, title: "Submit Your OTC Request",
    desc: `Once KYC is approved, you can submit a Bitcoin purchase application through our secure portal.

You'll specify:
• BTC amount (0.20 to 10.00 BTC per transaction)
• Your Bitcoin wallet address (Legacy, SegWit, or Native SegWit)
• Settlement preference (standard 24-hour or priority 4-hour)
• Wire details and purpose of purchase

Your price is calculated at the time of application. However, the final price is locked when your wire payment is received.`
  },
  {
    icon: "💰", step: 4, title: "Send Your Wire Transfer",
    desc: `After submitting your application, you'll receive detailed wire instructions via email and in your account portal.

Wire transfer requirements:
• Send USD via domestic ACH/wire or international SWIFT
• Include your order reference number in the wire memo (critical)
• Wire must originate from a bank account in your verified name
• Payment must be received within 3 business days of application

Once we receive your wire, we lock your BTC price based on the current market rate plus our desk spread.`
  },
  {
    icon: "🔐", step: 5, title: "Receive Your Bitcoin",
    desc: `After your wire payment clears, our desk executes the BTC transaction to your verified wallet address.

Standard timeline: Within 24 hours of wire clearance
Priority timeline: Within 4 hours of wire clearance

You'll receive:
• Email confirmation with your transaction hash
• TX hash visible in your account portal for blockchain verification
• Downloadable PDF confirmation for your records

Reminder: Always double-check your wallet address before submitting. Bitcoin transactions are irreversible.`
  },
];

const FAQ_PREVIEW = [
  { q: "What is the minimum purchase?", a: "0.20 BTC (approximately $19,000 at current prices)." },
  { q: "Is KYC mandatory?", a: "Yes. Required by US law under the Bank Secrecy Act and FinCEN regulations for all MSB transactions." },
  { q: "Can I buy more than 10 BTC?", a: "For purchases exceeding 10 BTC, please contact our desk directly for custom pricing." },
  { q: "What wallets are supported?", a: "All self-custody Bitcoin wallets — Legacy (1...), SegWit (3...), and Native SegWit/Bech32 (bc1...) addresses." },
];

export default function BitcoinOTCHowItWorksPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-2xl font-bold text-orange-400">₿</span>
          <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Bitcoin OTC Desk</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">
          How Bitcoin OTC Works: Step-by-Step Guide
        </h1>
        <p className="text-muted-foreground text-lg">
          A complete walkthrough of how to purchase Bitcoin through our OTC desk — from account creation to delivery in your wallet.
        </p>
      </div>

      {/* Steps */}
      <div className="space-y-10 mb-16">
        {STEPS.map((step) => (
          <div key={step.step} className="flex gap-6">
            <div className="shrink-0 flex flex-col items-center">
              <div className="w-14 h-14 rounded-full bg-card border-2 border-primary/30 flex items-center justify-center text-2xl">
                {step.icon}
              </div>
              {step.step < STEPS.length && <div className="w-0.5 flex-1 bg-border mt-3" />}
            </div>
            <div className="pb-10">
              <div className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-1">Step {step.step}</div>
              <h2 className="text-xl font-semibold text-foreground mb-3">{step.title}</h2>
              <div className="text-muted-foreground text-sm whitespace-pre-line leading-relaxed">{step.desc}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Why OTC */}
      <div className="bg-card border border-border rounded-xl p-6 mb-10">
        <h2 className="text-xl font-semibold text-foreground mb-4">Why Use an OTC Desk Instead of an Exchange?</h2>
        <div className="text-muted-foreground text-sm space-y-3">
          <p><strong className="text-foreground">No Price Slippage:</strong> When buying large amounts on an exchange, your order moves the market against you. OTC desks provide a fixed quote with no slippage.</p>
          <p><strong className="text-foreground">Privacy:</strong> Your trade isn't visible on any public order book. No other market participants know you're buying.</p>
          <p><strong className="text-foreground">Personal Service:</strong> You work with a dedicated account manager who handles your transaction end-to-end.</p>
          <p><strong className="text-foreground">Regulatory Clarity:</strong> OTC desks like ours are registered MSBs with FinCEN, giving you the compliance assurance that many exchanges can't provide.</p>
        </div>
      </div>

      {/* Who is it for */}
      <div className="bg-card border border-border rounded-xl p-6 mb-10">
        <h2 className="text-xl font-semibold text-foreground mb-4">Who Is the OTC Desk For?</h2>
        <ul className="text-muted-foreground text-sm space-y-2">
          {[
            "Individual investors buying 0.20–10 BTC for their personal portfolio",
            "Business treasuries adding BTC as a reserve asset",
            "IRA investors using a self-directed retirement account to hold Bitcoin",
            "Family offices and HNWIs seeking discreet, private transactions",
            "Anyone who wants a fixed price with no exchange risk",
          ].map((item, i) => (
            <li key={i} className="flex gap-2">
              <span className="text-primary">₿</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* FAQ preview */}
      <div className="mb-10">
        <h2 className="text-xl font-semibold text-foreground mb-4">Quick FAQ</h2>
        <div className="space-y-3">
          {FAQ_PREVIEW.map(item => (
            <div key={item.q} className="bg-card border border-border rounded-lg p-4">
              <p className="font-medium text-foreground mb-1">{item.q}</p>
              <p className="text-sm text-muted-foreground">{item.a}</p>
            </div>
          ))}
        </div>
        <Link href="/bitcoin-otc/faq" className="text-primary text-sm hover:underline mt-3 inline-block">View all FAQs →</Link>
      </div>

      {/* CTA */}
      <div className="bg-gradient-to-r from-orange-950/30 to-yellow-950/20 border border-orange-400/20 rounded-xl p-8 text-center">
        <h2 className="text-2xl font-serif font-bold text-foreground mb-3">Ready to Buy Bitcoin OTC?</h2>
        <p className="text-muted-foreground mb-6 text-sm">Create your account, complete KYC, and apply to purchase 0.20–10 BTC with 24-hour wire settlement.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/bitcoin-otc/apply" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-bold hover:bg-primary/90 transition-colors text-sm">
            ₿ Apply to Buy Bitcoin →
          </Link>
          <Link href="/bitcoin-otc" className="inline-flex items-center gap-2 border border-border text-foreground px-6 py-3 rounded-lg font-semibold hover:bg-secondary/50 transition-colors text-sm">
            View Live BTC Price
          </Link>
        </div>
      </div>
    </div>
  );
}
