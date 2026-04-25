import { useState } from "react";
import { Link } from "wouter";
import { ChevronDown, ChevronUp } from "lucide-react";

const FAQS = [
  {
    q: "What is the minimum amount of Bitcoin I can buy?",
    a: "The minimum OTC purchase is 0.20 BTC per transaction (approximately $19,000 at current prices). This minimum exists because OTC desk services involve fixed compliance and processing costs that make smaller amounts economically unviable for the desk model."
  },
  {
    q: "How long does Bitcoin settlement take?",
    a: "Standard settlement: BTC is delivered within 24 hours of your wire payment clearing at our bank.\n\nPriority settlement (+0.25% fee): BTC is delivered within 4 hours of wire clearance.\n\nNote: The clock starts when your wire clears at JPMorgan Chase, not when you submit your application. Domestic wires typically clear same-day; international SWIFT wires can take 1-3 business days."
  },
  {
    q: "Is KYC verification required?",
    a: "Yes, KYC is mandatory for all OTC purchases. This is required by US federal law under the Bank Secrecy Act (BSA) and enforced by FinCEN for all Money Services Businesses (MSBs). Without KYC verification, we are legally prohibited from transacting with you.\n\nKYC approval typically takes 1–2 business days. For demo purposes on this site, it auto-approves in 30 seconds."
  },
  {
    q: "What happens if the BTC price changes after I submit my application?",
    a: "Your price is NOT locked at application submission. The final price is locked when your wire payment is received at our bank. This means:\n\n• If BTC rises before your wire arrives, you'll pay the higher price\n• If BTC falls before your wire arrives, you'll pay the lower price\n\nFor Priority settlement, you can request a price lock quote that is valid for 2 hours. Contact our desk directly for this service."
  },
  {
    q: "Can I send a wire from a business account?",
    a: "Only if the business name matches the KYC entity we have on file. If you KYC'd as an individual (John Smith), the wire must come from a personal account in the name John Smith. If you need to wire from a business entity, please contact us to set up a business account with separate KYC documentation."
  },
  {
    q: "What Bitcoin wallet types are accepted?",
    a: "We support all self-custody Bitcoin wallet types:\n\n• Native SegWit (Bech32): bc1q... or bc1p... — Recommended (lowest fees)\n• P2SH SegWit: 3... — Supported\n• Legacy P2PKH: 1... — Supported\n\nWe do NOT deliver to exchange deposit addresses, ETF custodians, or other institutional wallets without prior approval from our desk."
  },
  {
    q: "Is there a maximum purchase per transaction?",
    a: "Yes, 10 BTC per single OTC transaction (approximately $943,000 at current prices). For purchases exceeding 10 BTC, please contact our desk directly at otc@puregoldtrading.com or call 1-800-GOLD-NOW. We offer custom pricing and arrangements for institutional-sized purchases."
  },
  {
    q: "What are the spread fees?",
    a: "Our fees are built into the desk spread above market price:\n\n• 0.20–0.99 BTC: +1.25% over spot\n• 1.00–2.99 BTC: +1.00% over spot\n• 3.00–4.99 BTC: +0.85% over spot\n• 5.00–7.99 BTC: +0.75% over spot\n• 8.00–10.00 BTC: +0.60% over spot\n\nFor USDC/USDT settlement add +0.25%. For Priority delivery add +0.25%."
  },
  {
    q: "What if I send my wire and the price has moved significantly?",
    a: "If BTC price moves more than 5% between your application and wire receipt, we will contact you to confirm the new price before executing. You may cancel without penalty if the price change is unacceptable."
  },
  {
    q: "Are my Bitcoin OTC purchases reported to the government?",
    a: "Yes, as required by law:\n\n• Purchases over $10,000 are subject to FinCEN Currency Transaction Report (CTR) requirements\n• Suspicious activity is reported regardless of amount\n• Annual 1099 forms are issued for applicable transactions\n\nThis is standard for all regulated MSBs. We do not report to unauthorized parties."
  },
  {
    q: "What if I make a mistake with my wallet address?",
    a: "Bitcoin transactions are irreversible. If BTC is sent to a wrong address, it cannot be recovered. Always verify your wallet address character by character before submitting. We strongly recommend sending a small test transaction first if you're unfamiliar with the wallet.\n\nWe accept ZERO liability for BTC sent to incorrect addresses provided by clients."
  },
  {
    q: "What countries are eligible for OTC service?",
    a: "We service customers in all countries NOT on the OFAC sanctions list. This includes:\n\n❌ NOT eligible: Cuba, Iran, North Korea, Syria, Crimea region, certain other sanctioned territories\n\n✅ Eligible: US, UK, EU, Canada, Australia, Japan, Singapore, and most other countries\n\nResidents of high-risk jurisdictions may require enhanced due diligence."
  },
  {
    q: "How is my personal data protected?",
    a: "All KYC documents and personal data are encrypted at rest and in transit. We use bank-grade security protocols. In production, documents are stored in a GDPR and SOC 2 compliant secure storage system. We do not sell or share your data with third parties except as required by law."
  },
  {
    q: "Can I buy Bitcoin for my IRA through your OTC desk?",
    a: "Yes! We work with most self-directed IRA (SDIRA) custodians. Your custodian will wire funds from your IRA to our desk. BTC is then delivered to the wallet address specified by your custodian. Contact us to coordinate the process with your specific custodian. See our Bitcoin IRA guide for details."
  },
  {
    q: "What if my KYC is rejected?",
    a: "If your KYC application is rejected, you'll receive an email explaining the reason. Common reasons include:\n\n• Documents not clearly readable\n• Expired identification\n• Name mismatch between documents\n• Address mismatch\n\nYou may reapply with corrected documentation. For complex cases, contact our compliance team directly."
  },
];

function FAQItem({ q, a, isOpen, onToggle }: { q: string; a: string; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className="border border-border rounded-xl overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-secondary/20 transition-colors"
      >
        <span className="font-medium text-foreground text-sm pr-4">{q}</span>
        {isOpen ? <ChevronUp className="h-4 w-4 text-primary shrink-0" /> : <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />}
      </button>
      {isOpen && (
        <div className="px-5 pb-5 pt-0 text-sm text-muted-foreground whitespace-pre-line border-t border-border">
          <div className="pt-4">{a}</div>
        </div>
      )}
    </div>
  );
}

export default function BitcoinOTCFAQPage() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-2xl font-bold text-orange-400">₿</span>
          <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Bitcoin OTC Desk</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">
          Bitcoin OTC Frequently Asked Questions
        </h1>
        <p className="text-muted-foreground text-lg">
          Everything you need to know about buying Bitcoin through our OTC desk service.
        </p>
      </div>

      <div className="space-y-3 mb-12">
        {FAQS.map((faq, i) => (
          <FAQItem
            key={i}
            q={faq.q}
            a={faq.a}
            isOpen={open === i}
            onToggle={() => setOpen(open === i ? null : i)}
          />
        ))}
      </div>

      <div className="bg-card border border-border rounded-xl p-6 text-center">
        <h2 className="text-xl font-semibold text-foreground mb-2">Still have questions?</h2>
        <p className="text-muted-foreground text-sm mb-5">
          Our OTC desk specialists are available Monday–Friday, 8am–6pm CST.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/contact" className="inline-flex items-center justify-center gap-2 border border-border text-foreground px-6 py-2.5 rounded-lg font-semibold hover:bg-secondary/50 transition-colors text-sm">
            Contact Us
          </Link>
          <Link href="/bitcoin-otc/apply" className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-lg font-bold hover:bg-primary/90 transition-colors text-sm">
            ₿ Apply to Buy Bitcoin →
          </Link>
        </div>
      </div>
    </div>
  );
}
