import { useState } from "react";

const shippingFaqs = [
  {
    q: "What are the shipping, handling, security, and insurance charges?",
    a: "GoldBuller LLC offers free shipping on all orders of $99 or more. Due to USPS policy, it is cost prohibitive to ship heavy packages (greater than 10 lbs) to a P.O. Box — if your shipment exceeds that threshold and must go to a P.O. Box, a $110 surcharge may apply. We will always work with you to find an alternative to avoid this fee whenever possible. Please note that due to federal regulations, GoldBuller LLC cannot ship to APO/FPO military facilities.",
  },
  {
    q: "Do you ship internationally?",
    a: "GoldBuller LLC generally ships to addresses within the United States of America. However, depending on the specific country and the applicable import/export laws related to your delivery address, we may be able to accommodate international shipments. International clients must make payment via bank wire and may be responsible for arranging their own transportation or customs clearance in certain circumstances. Contact our team to discuss your specific location.",
  },
  {
    q: "How do you wrap and package your shipments?",
    a: "All GoldBuller LLC packages are carefully and discreetly wrapped in non-descript packaging with no indication of the contents inside. For security reasons, \"GoldBuller\" or any variation of our company name does not appear on the exterior of any package. You should be prepared to present a government-issued photo ID when accepting delivery.",
  },
  {
    q: "Which carriers does GoldBuller LLC use?",
    a: "We offer multiple shipping options depending on the type of order placed. Our carriers include UPS, USPS, and FedEx. Once your order is prepared for shipment, you will receive a tracking number via email. Before your package ships, it undergoes a secure verification and packaging process — tracking updates may be delayed by 1–2 days during this window. Delivery typically takes 3–5 business days once the package leaves our facility. We do not offer package pickups on weekends. Important: once a package has left our facility, GoldBuller LLC cannot redirect it.",
  },
  {
    q: "Can you ship my order to a USPS P.O. Box?",
    a: "Yes, GoldBuller LLC can ship to USPS P.O. Boxes. However, packages that exceed weight thresholds may require an alternative shipping method. A $110 surcharge may apply for heavy packages sent to P.O. Boxes. Our team will contact you if this applies to your order.",
  },
  {
    q: "Is my package insured while in transit?",
    a: "Yes. All GoldBuller LLC shipments are fully insured for the complete value of the contents from the moment they leave our facility until the package is signed for or recorded as delivered at your address. Please see the \"Shipping, Insurance, and Delivery\" section of our Client Agreement & Terms of Service for full details on coverage and claims procedures.",
  },
  {
    q: "Are signatures required for delivery?",
    a: "Some packages require an adult signature upon delivery to ensure secure receipt. If you would like to request a direct signature for your package, please note that this may incur an additional shipping cost. Contact your account executive or our customer service team at support@goldbuller.com to make this request before your order ships.",
  },
  {
    q: "How long will it take to receive my order?",
    a: "Unless otherwise requested and noted by your account executive, your order is typically packaged and shipped within 14 business days of GoldBuller LLC receiving good funds payment. While our goal is to fulfill orders within this window, market demand and unforeseen circumstances may impact timelines. Factors such as weather delays, product launches, security and compliance reviews, weekends, and holidays may result in additional handling time. At times, GoldBuller LLC may send your items in multiple packages to complete your order. Conversely, if you have placed multiple orders, we may consolidate them into a single shipment.",
  },
  {
    q: "Does GoldBuller LLC ever backorder items?",
    a: "Supply and demand imbalances occasionally occur in our industry due to various supply chain situations. These occurrences, although rare, are outside the control of GoldBuller LLC. From time to time, we have more buyers than available inventory. If this occurs, GoldBuller LLC reserves the right to delay delivery up to 30 days from your expected shipping date to fill your order. Even if your delivery is delayed, your price is locked in and will not change — regardless of any rise or fall in precious metals prices during that period.",
  },
  {
    q: "Can GoldBuller LLC store my precious metals?",
    a: "GoldBuller LLC recommends the Texas Bullion Depository for your precious metals storage needs. The Texas Bullion Depository is an agency of the State of Texas and is the only precious metals depository in the United States with government oversight that is available to the general public. All deposits can be held in a segregated storage account (your metals are never co-mingled with other depositors), and all deposits include 100% all-risk insurance. Contact our team at support@goldbuller.com to learn more about storage arrangements.",
  },
];

export default function ShippingPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      {/* Header */}
      <div className="mb-14">
        <p className="text-sm text-primary font-semibold uppercase tracking-widest mb-3">Help Center</p>
        <h1 className="text-5xl font-serif font-bold text-foreground mb-4">Shipping, Handling &amp; Insurance</h1>
        <p className="text-muted-foreground text-lg max-w-2xl">
          GoldBuller LLC is committed to delivering your precious metals safely, securely, and discreetly. Here are answers to the most common shipping questions.
        </p>
      </div>

      {/* Trust Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-14">
        {[
          { icon: "🔒", title: "Fully Insured", desc: "Every shipment is insured for 100% of its value in transit" },
          { icon: "📦", title: "Discreet Packaging", desc: "No company name or content hints on the exterior of any package" },
          { icon: "🚚", title: "Free Shipping $99+", desc: "Free insured shipping on all orders $99 and above" },
        ].map(({ icon, title, desc }) => (
          <div key={title} className="p-5 rounded-xl border border-border bg-secondary/10 text-center">
            <div className="text-3xl mb-2">{icon}</div>
            <p className="font-semibold text-foreground mb-1">{title}</p>
            <p className="text-muted-foreground text-sm">{desc}</p>
          </div>
        ))}
      </div>

      {/* FAQ Accordion */}
      <div className="space-y-3 mb-16">
        {shippingFaqs.map((faq, i) => {
          const isOpen = openIndex === i;
          return (
            <div
              key={i}
              className={`rounded-xl border transition-all duration-200 ${isOpen ? "border-primary/40 bg-primary/5" : "border-border bg-card hover:border-border/80"}`}
            >
              <button
                className="w-full text-left px-6 py-5 flex items-start justify-between gap-4 focus:outline-none"
                onClick={() => setOpenIndex(isOpen ? null : i)}
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
        })}
      </div>

      {/* Shipping Carriers */}
      <div className="mb-14 p-6 rounded-2xl border border-border bg-secondary/10">
        <h2 className="text-xl font-serif font-bold text-foreground mb-4">Our Shipping Partners</h2>
        <div className="flex flex-wrap gap-4">
          {["UPS", "USPS", "FedEx"].map((carrier) => (
            <div key={carrier} className="px-6 py-3 rounded-lg border border-border bg-card font-bold text-foreground text-lg tracking-wide">
              {carrier}
            </div>
          ))}
        </div>
        <p className="text-muted-foreground text-sm mt-4">
          The carrier assigned to your order depends on package weight, destination, and the type of product being shipped. All carriers are fully vetted and use GoldBuller LLC's secure verification and packaging process.
        </p>
      </div>

      {/* Timeline */}
      <div className="mb-14">
        <h2 className="text-2xl font-serif font-bold text-foreground mb-6">Typical Order Timeline</h2>
        <div className="relative pl-6 space-y-6 border-l border-primary/30">
          {[
            { step: "Payment Received", desc: "Good funds confirmed — wire, ACH, or credit card cleared", time: "Day 0" },
            { step: "Order Verification", desc: "GoldBuller LLC verifies your KYC and order details", time: "1–2 days" },
            { step: "Secure Packaging", desc: "Your metals are inspected, packaged, and insured", time: "3–7 days" },
            { step: "Carrier Pickup", desc: "Package is handed to UPS, USPS, or FedEx and tracking number emailed to you", time: "Up to 14 business days" },
            { step: "Delivery", desc: "Adult signature may be required upon delivery at your address", time: "+3–5 business days" },
          ].map(({ step, desc, time }) => (
            <div key={step} className="relative">
              <div className="absolute -left-[1.65rem] top-1 w-3 h-3 rounded-full bg-primary border-2 border-background" />
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1">
                <div>
                  <p className="font-semibold text-foreground">{step}</p>
                  <p className="text-muted-foreground text-sm">{desc}</p>
                </div>
                <span className="text-xs font-medium text-primary bg-primary/10 px-3 py-1 rounded-full shrink-0 self-start">{time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Contact CTA */}
      <div className="p-6 rounded-2xl border border-primary/20 bg-primary/5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex-1">
          <p className="font-semibold text-foreground mb-1">Have a shipping question?</p>
          <p className="text-muted-foreground text-sm">Our team is available Monday–Friday, 9am–6pm ET to help with tracking, delivery issues, and special requests.</p>
        </div>
        <a
          href="mailto:support@goldbuller.com"
          className="shrink-0 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors"
        >
          Contact Support
        </a>
      </div>
    </div>
  );
}
