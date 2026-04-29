import { useState } from "react";

type FAQ = { q: string; a: string | React.ReactNode };
type Section = { id: string; title: string; icon: string; faqs: FAQ[] };

const faqSections: Section[] = [
  {
    id: "shipping",
    title: "Shipping & Insurance",
    icon: "🚚",
    faqs: [
      {
        q: "What are the shipping, handling, security, and insurance charges?",
        a: "GoldBuller LLC offers free shipping on all orders of $99 or more. Due to USPS policy, it can be cost prohibitive to ship heavy packages (greater than 10 lbs) to a P.O. Box — a $110 surcharge may apply in those cases. We will always work with you to find an alternative. Due to federal regulations, GoldBuller LLC cannot ship to APO/FPO military facilities.",
      },
      {
        q: "Do you ship internationally?",
        a: "GoldBuller LLC generally ships to addresses within the United States. However, depending on the country and applicable import/export laws, we may be able to ship internationally. International clients must pay via bank wire and may be responsible for arranging their own customs clearance or local transportation. Contact us to discuss your specific location.",
      },
      {
        q: "How do you wrap and package shipments?",
        a: "All GoldBuller LLC packages are carefully and discreetly wrapped in non-descript packaging with no indication of the contents. For security, \"GoldBuller\" or any variation of our company name does not appear on the exterior. Be prepared to present a government-issued photo ID when accepting delivery.",
      },
      {
        q: "How is my order shipped?",
        a: "We offer multiple shipping options via UPS, USPS, and FedEx depending on the order type. Once your order is prepared, you'll receive a tracking number by email. Before shipping, all packages undergo a secure verification and packaging process — tracking updates may be delayed 1–2 days during this window. Delivery typically takes 3–5 business days once the package leaves our facility. Packages cannot be redirected once they have departed our facility.",
      },
      {
        q: "Can you ship to a USPS P.O. Box?",
        a: "Yes, GoldBuller LLC can ship to USPS P.O. Boxes. However, heavy packages may require an alternative shipping method or incur a $110 surcharge. Our team will contact you if this applies to your order.",
      },
      {
        q: "Is my package insured while in transit?",
        a: "Yes. All GoldBuller LLC shipments are fully insured for the complete value of the contents from the time they leave our facility until the package is signed for or recorded as delivered. See our Client Agreement & Terms of Service for full details on coverage and claims procedures.",
      },
      {
        q: "Are signatures required for delivery?",
        a: "Some packages require an adult signature upon delivery. If you would like to request a direct signature for your package, an additional shipping cost may apply. Specify this request to your account executive or contact us at support@goldbuller.com.",
      },
      {
        q: "How long will it take to receive my order?",
        a: "Your order is typically packaged and shipped within 14 business days of GoldBuller LLC receiving good funds. Market demand, weather delays, product launches, security reviews, weekends, and holidays may affect this timeline. GoldBuller LLC may ship your items in multiple packages, or consolidate multiple orders into a single shipment.",
      },
      {
        q: "Does GoldBuller LLC backorder items?",
        a: "Supply and demand imbalances occasionally occur in the precious metals industry. When GoldBuller LLC has more buyers than available inventory, we reserve the right to delay delivery up to 30 days from your expected shipping date. Your price remains locked regardless of any market movement during that period.",
      },
      {
        q: "Can GoldBuller LLC store my precious metals?",
        a: "GoldBuller LLC recommends the Texas Bullion Depository for storage. It is an agency of the State of Texas and the only publicly available precious metals depository in the U.S. with government oversight. Deposits are held in fully segregated accounts (not co-mingled with other depositors) and include 100% all-risk insurance. Contact support@goldbuller.com to learn more.",
      },
    ],
  },
  {
    id: "buying",
    title: "Buying From GoldBuller LLC",
    icon: "🏅",
    faqs: [
      {
        q: "How do I buy from GoldBuller LLC?",
        a: "Purchasing physical precious metals is easier than you might think. You can buy directly on our website, or call us and we'll walk you through the process step by step. Contact us at support@goldbuller.com or 1-800-GOLD-NOW (Mon–Fri, 9am–6pm ET).",
      },
      {
        q: "Who can buy from GoldBuller LLC?",
        a: "GoldBuller LLC's clients include individual investors, collectors, dealers, accumulators, banks, brokerage houses, and speculators. Whether you want to purchase large quantities or individual items, we can fulfill your needs. You must be at least 18 years of age and agree to our Client Agreement & Terms of Service to complete a transaction.",
      },
      {
        q: "Is there a minimum order?",
        a: "Yes. GoldBuller LLC's minimum order is $99 per transaction, regardless of payment method. You may combine any items in any quantity to reach this minimum.",
      },
      {
        q: "Should I buy gold, silver, platinum, palladium, or numismatic coins?",
        a: "As with any investment, diversification is important. GoldBuller LLC's team cannot predict future precious metals prices. For most clients, a balanced mix of multiple types of physical metals can help reduce overall risk exposure. Consult an independent registered investment advisor to determine what is right for your specific situation.",
      },
      {
        q: "How much should I invest in precious metals?",
        a: "Most investment professionals recommend allocating between 5% and 20% of your assets to precious metals and alternative assets. The decision is ultimately yours. If you are acquiring metals as part of your investment portfolio, you may want to consult an independent registered investment advisor before committing.",
      },
      {
        q: "Can I change my order after it is confirmed?",
        a: "In many cases GoldBuller LLC can work with you to alter your order; however, precious metals prices fluctuate and your change may require repricing some or all of the order. We recommend carefully reviewing your selections before placing an order to minimize change requests. See our Client Agreement & Terms of Service for full details.",
      },
      {
        q: "Do you accept trade-ins?",
        a: "Yes. GoldBuller LLC is always looking for new inventory and welcomes trade-ins of precious metals. There may be tax implications when completing a trade-in — consult your tax advisor for specific guidance.",
      },
      {
        q: "What types of products does GoldBuller LLC sell?",
        a: "GoldBuller LLC sells all types of precious metals. We specialize in Investment Grade Coins certified by NGC (Numismatic Guaranty Company) or PCGS (Professional Coin Grading Service), pre-1933 gold and silver coinage, silver and platinum sets, as well as gold, silver, platinum, palladium, and copper bullion products from government mints and respected refineries worldwide.",
      },
    ],
  },
  {
    id: "pricing",
    title: "Pricing & Price Lock",
    icon: "📊",
    faqs: [
      {
        q: "Do you add commissions or hidden fees to your quoted price?",
        a: "No. The price you are quoted is the price you pay. The only additions that may apply are sales tax (where applicable based on your state's policy) and payment processing fees (e.g., credit card surcharge). Any such additions are clearly displayed in the checkout process. The grand total shown at checkout is the final price you pay.",
      },
      {
        q: "When is my price locked in?",
        a: "For orders placed on the GoldBuller LLC website: your price is locked when payment is made. For bank wire payments, the price locks when GoldBuller LLC receives and applies the wire to your order. For credit card or ACH payments, the price locks at the time you place the order, provided your payment method clears. If your card is declined or ACH is rejected, we will contact you to verify your information.",
      },
      {
        q: "How long is my price locked in for phone orders?",
        a: "For orders placed over the phone with GoldBuller LLC, your price is locked immediately upon your verbal verification of the order. This is governed by our Client Agreement & Terms of Service.",
      },
      {
        q: "What is GoldBuller LLC's Market Loss Policy?",
        a: "GoldBuller LLC's Market Loss Policy applies to all products and is most relevant for bullion metals due to their price volatility. Once you receive an order confirmation, your price is locked and inventory is allocated — the transaction generally cannot be canceled, only offset at our current ask price. If you cancel or fail to pay within the required window, you may be responsible for any market loss GoldBuller LLC incurs. Contact us at support@goldbuller.com or 1-800-GOLD-NOW for details.",
      },
      {
        q: "Do you offer quantity discounts?",
        a: "Yes. GoldBuller LLC may extend discounts on large orders or sizable quantities of individual items. Please contact us to discuss your specific needs.",
      },
    ],
  },
  {
    id: "payments",
    title: "Payments",
    icon: "💳",
    faqs: [
      {
        q: "What payment methods does GoldBuller LLC accept?",
        a: (
          <div className="space-y-2 text-sm">
            <p>GoldBuller LLC accepts the following payment methods:</p>
            <ul className="space-y-1 pl-4">
              <li><strong className="text-foreground">Credit / Debit Cards:</strong> Accepted for orders up to approximately $20,000. A processing fee applies.</li>
              <li><strong className="text-foreground">Electronic Check (ACH):</strong> Accepted for all orders. Authorizes a one-time debit — no further debits will be made without your explicit agreement.</li>
              <li><strong className="text-foreground">Bank Wire Transfer:</strong> Available for all orders. Recommended for large transactions. Wire and check payments may qualify for a cash discount of up to 4%.</li>
              <li><strong className="text-foreground">Bitcoin (BTC) &amp; Cryptocurrency:</strong> Available via our Bitcoin OTC desk. Contact us for details.</li>
            </ul>
          </div>
        ),
      },
      {
        q: "Is there a holding period on ACH / check-by-phone orders?",
        a: "Yes. Orders paid via ACH or check-by-phone are subject to a funds verification aging period of up to six business days before shipment is authorized. Direct bank wire is always recommended when possible for the fastest settlement. Call your account executive if you wish to pay via wire.",
      },
      {
        q: "How do I wire funds to GoldBuller LLC?",
        a: "Upon placing an order, GoldBuller LLC will provide you with our bank name, ABA routing number, and account number. Once your wire is received, your account executive will confirm your product selections and verify pricing. Any unused funds may be retained on your account for future transactions or returned to you via check, at your discretion.",
      },
      {
        q: "What happens if payment isn't received in time?",
        a: "Always send payment as promptly as possible to ensure GoldBuller LLC can honor your confirmed price. If payment is not received within the required window, GoldBuller LLC reserves the right to accept a late payment (subject to repricing), refuse and cancel your order, or provide an updated quote based on the market price at the time payment is received.",
      },
    ],
  },
  {
    id: "products",
    title: "Our Products",
    icon: "🥇",
    faqs: [
      {
        q: "What are bullion metals?",
        a: "Bullion metals are gold, silver, platinum, or palladium in their raw form — as coins, rounds, or bars — valued primarily for their metal content. They are not proof coins, collectible coins, or third-party certified pieces. All sales of bullion metals are final and non-refundable. Under limited circumstances, an order may be canceled subject to fees and conditions outlined in GoldBuller LLC's Market Loss Policy. GoldBuller LLC will buy bullion at the current bid price, generally close to the COMEX spot price.",
      },
      {
        q: "What are Investment Grade Coins?",
        a: "Investment Grade Coins are gold, silver, platinum, or palladium coins authenticated, graded, and encapsulated (\"slabbed\") by a reputable third-party grading service such as NGC or PCGS. These coins can be modern or vintage. GoldBuller LLC offers a 30-Day Product Inspection Period: you may return Investment Grade Coins within 30 days of receipt for any reason (product refund only — shipping, handling, and insurance fees are non-refundable). An RMA number is required for all returns and expires 15 days after issuance. You are responsible for return shipping and insurance costs.",
      },
      {
        q: "What are Proof Coins?",
        a: "Proof Coins are gold, silver, platinum, or palladium coins made with a proof finish but not certified by a third-party grading service. They are in raw form, typically in original government packaging (OGP) including display boxes and certificates of authenticity. All sales of Proof Coins are final — no refunds. GoldBuller LLC will purchase Proof Coins at the current bid spot price for their metal content plus applicable market premium.",
      },
      {
        q: "What are Special Order Items?",
        a: "Special Order Items are coins or products specifically requested by a client and sourced by GoldBuller LLC outside of our regular inventory. These items are acquired based on individual client demand. All sales of Special Order Items are final — no refunds. If you wish to sell a previously sourced Special Order Item, GoldBuller LLC will make reasonable efforts to obtain a bid from interested buyers; however, we are not obligated to purchase the item ourselves.",
      },
      {
        q: "How are coins graded and authenticated?",
        a: "GoldBuller LLC relies on the opinions of independent coin grading services — primarily NGC (Numismatic Guaranty Corporation) and PCGS (Professional Coin Grading Service). Both are recognized industry leaders that guarantee, grade, and certify each coin's authenticity. GoldBuller LLC relies upon those guarantees when selling coins and does not independently re-verify certified coins. GoldBuller LLC does not guarantee that coins will achieve the same grade if resubmitted to any other service.",
      },
    ],
  },
  {
    id: "taxes",
    title: "Sales Tax & IRS Reporting",
    icon: "📋",
    faqs: [
      {
        q: "Do I owe sales tax on my precious metals purchase?",
        a: "Your individual tax situation may vary based on your state and the type of product purchased. Many states exempt certain bullion products from sales tax, while others do not. GoldBuller LLC is required to collect sales tax where applicable and will display any applicable tax in your checkout total. Consult a qualified tax advisor regarding your specific sales tax obligations.",
      },
      {
        q: "Does GoldBuller LLC report my purchase to the IRS?",
        a: "GoldBuller LLC is not required to report your purchase to the IRS or other federal, state, or local agencies unless your transaction meets the IRS Form 8300 reporting threshold ($10,000 or more in cash payments). Where sales tax is collected, GoldBuller LLC remits it to the appropriate taxing authority — but no information about the items purchased is reported in that process.",
      },
    ],
  },
  {
    id: "risk",
    title: "Risk Factors & Disclaimers",
    icon: "⚠️",
    faqs: [
      {
        q: "Are there risks to investing in precious metals?",
        a: "Yes. All investments involve risk — GoldBuller LLC's products are no exception. The value of bullion coins and bars is affected by many economic factors including the current market price of the underlying metal, perceived scarcity, supply and demand, and general market sentiment. Precious metals can go down as well as up in value. You should have adequate cash reserves and disposable income before considering an investment in precious metals. GoldBuller LLC does not determine the suitability of any specific person to purchase our products.",
      },
      {
        q: "What are the authenticity risks?",
        a: "Forgery and counterfeiting exist in the rare coin and bullion market. To minimize these risks, GoldBuller LLC recommends buying only coins certified by NGC or PCGS. Coins sold by GoldBuller LLC are generally graded by one of these services. GoldBuller LLC relies upon the guarantees provided by NGC and PCGS and disclaims any expressed or implied warranties beyond those guarantees.",
      },
      {
        q: "What are the grading risks?",
        a: "The value of a coin is highly dependent on its grade. Grading is a subjective process and there is a risk that a coin could be assigned a different grade upon resubmission. The guarantees provided by NGC and PCGS offer protection against misgrading, subject to their continuing solvency. GoldBuller LLC expressly disclaims responsibility for any changes in grading services' policies or guarantees.",
      },
      {
        q: "Are GoldBuller LLC account executives licensed investment advisors?",
        a: "No. GoldBuller LLC employees and account executives are not licensed as investment advisors and are not authorized to recommend the purchase or sale of any security, bond, annuity, or financial instrument. Their role is limited to assisting you with precious metals products sold by GoldBuller LLC. Always consult with a licensed independent financial advisor before making any investment decision.",
      },
      {
        q: "What is GoldBuller LLC's policy on past performance?",
        a: "Past performance of precious metals products is not indicative of future results. GoldBuller LLC does not guarantee that any client buying for investment purposes will be able to sell for a profit. The value of raw bullion is largely determined by current spot prices, which fluctuate throughout each trading day. The value of Investment Grade Coins, Proof Coins, and Special Order Items is additionally affected by perceived scarcity, quality, current demand, and market sentiment — independent of spot prices.",
      },
    ],
  },
];

function AccordionItem({ faq, isOpen, onToggle }: { faq: FAQ; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className={`rounded-xl border transition-all duration-200 ${isOpen ? "border-primary/40 bg-primary/5" : "border-border bg-card hover:border-border/80"}`}>
      <button
        className="w-full text-left px-6 py-5 flex items-start justify-between gap-4 focus:outline-none"
        onClick={onToggle}
        aria-expanded={isOpen}
      >
        <span className={`font-semibold leading-snug ${isOpen ? "text-primary" : "text-foreground"}`}>{faq.q}</span>
        <span className={`shrink-0 mt-0.5 text-lg transition-transform duration-200 ${isOpen ? "rotate-45 text-primary" : "text-muted-foreground"}`}>+</span>
      </button>
      {isOpen && (
        <div className="px-6 pb-6 text-muted-foreground leading-relaxed text-sm border-t border-border/50 pt-4">
          {faq.a}
        </div>
      )}
    </div>
  );
}

export default function FAQPage() {
  const [openKey, setOpenKey] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<string>("shipping");

  const current = faqSections.find((s) => s.id === activeSection)!;

  return (
    <div className="container mx-auto px-4 py-16 max-w-5xl">
      {/* Header */}
      <div className="mb-12 text-center">
        <p className="text-sm text-primary font-semibold uppercase tracking-widest mb-3">Help Center</p>
        <h1 className="text-5xl font-serif font-bold text-foreground mb-4">Frequently Asked Questions</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Everything you need to know about buying, shipping, pricing, payments, and investing with GoldBuller LLC.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Nav */}
        <aside className="lg:w-56 shrink-0">
          <div className="sticky top-6 space-y-1">
            {faqSections.map((section) => (
              <button
                key={section.id}
                onClick={() => { setActiveSection(section.id); setOpenKey(null); }}
                className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  activeSection === section.id
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                }`}
              >
                <span>{section.icon}</span>
                <span>{section.title}</span>
              </button>
            ))}
          </div>
        </aside>

        {/* FAQ Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-3xl">{current.icon}</span>
            <h2 className="text-2xl font-serif font-bold text-foreground">{current.title}</h2>
          </div>

          <div className="space-y-3">
            {current.faqs.map((faq, i) => {
              const key = `${activeSection}-${i}`;
              return (
                <AccordionItem
                  key={key}
                  faq={faq}
                  isOpen={openKey === key}
                  onToggle={() => setOpenKey(openKey === key ? null : key)}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="mt-16 p-8 rounded-2xl border border-primary/20 bg-primary/5 text-center">
        <h3 className="text-2xl font-serif font-bold text-foreground mb-2">Still have questions?</h3>
        <p className="text-muted-foreground mb-6">Our precious metals specialists are available Monday–Friday, 9am–6pm ET.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href="mailto:support@goldbuller.com"
            className="px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors"
          >
            Email Support
          </a>
          <a
            href="tel:+18004656669"
            className="px-6 py-3 rounded-lg border border-border text-foreground font-semibold hover:bg-secondary/50 transition-colors"
          >
            1-800-GOLD-NOW
          </a>
        </div>
      </div>
    </div>
  );
}
