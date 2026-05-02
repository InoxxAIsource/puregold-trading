/**
 * Post-build: generate per-route index.html for every SPA route.
 * Runs AFTER `vite build` so the built index.html (with hashed asset refs) exists.
 * Creates dist/public/{route}/index.html with unique title, description, canonical,
 * OG tags, JSON-LD schema, and a pre-hydration H1 — visible to AI crawlers.
 *
 * Run: node seo/generateSpaRouteHtml.mjs
 */

import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir   = join(__dirname, "..", "dist", "public");
const SITE_URL  = "https://goldbuller.com";
const OG_IMAGE  = `${SITE_URL}/opengraph.jpg`;

function esc(s) {
  return String(s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;")
    .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

// ---------------------------------------------------------------------------
// Per-route meta + schema definitions
// ---------------------------------------------------------------------------

const ORG_SCHEMA = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      "name": "GoldBuller LLC",
      "url": SITE_URL,
      "logo": `${SITE_URL}/favicon.svg`,
      "foundingDate": "2018",
      "description": "GoldBuller LLC is a Texas-based precious metals dealer offering gold, silver, platinum, and copper bullion with competitive spot-based pricing and fully insured shipping.",
      "address": { "@type": "PostalAddress", "addressLocality": "Dallas", "addressRegion": "TX", "addressCountry": "US" },
      "contactPoint": { "@type": "ContactPoint", "email": "support@goldbuller.com", "telephone": "+18004656669", "contactType": "customer service" },
      "sameAs": ["https://www.bbb.org/goldbuller"]
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      "url": SITE_URL,
      "name": "GoldBuller LLC",
      "publisher": { "@id": `${SITE_URL}/#organization` }
    }
  ]
};

const FAQ_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    { "@type": "Question", "name": "Is there a minimum order at GoldBuller LLC?",
      "acceptedAnswer": { "@type": "Answer", "text": "Yes. GoldBuller LLC's minimum order is $99 per transaction, regardless of payment method." } },
    { "@type": "Question", "name": "Is my precious metals shipment insured?",
      "acceptedAnswer": { "@type": "Answer", "text": "Yes. All GoldBuller LLC shipments are fully insured for the complete value of the contents from the time they leave our facility until the package is signed for at your address." } },
    { "@type": "Question", "name": "What payment methods does GoldBuller LLC accept?",
      "acceptedAnswer": { "@type": "Answer", "text": "GoldBuller LLC accepts bank wire transfer, ACH/electronic check, credit/debit cards, and Bitcoin (BTC). Bank wire and check payments may qualify for a cash discount of up to 4%." } },
    { "@type": "Question", "name": "How long does shipping take from GoldBuller LLC?",
      "acceptedAnswer": { "@type": "Answer", "text": "Orders are typically packaged and shipped within 14 business days of receiving good funds. Delivery takes 3–5 business days via UPS, USPS, or FedEx once shipped." } },
    { "@type": "Question", "name": "Does GoldBuller LLC offer a buyback guarantee?",
      "acceptedAnswer": { "@type": "Answer", "text": "Yes. GoldBuller LLC offers two buyback options: Immediate Liquidation (fast payout at current bid price for all bullion) and a Consignment Program (for eligible Investment Grade Coins held 60+ months)." } },
    { "@type": "Question", "name": "What KYC verification is required?",
      "acceptedAnswer": { "@type": "Answer", "text": "Bank wire orders over $10,000 and all Bitcoin OTC trades require KYC identity verification. Standard online orders can be placed without KYC." } },
    { "@type": "Question", "name": "Does GoldBuller LLC accept Bitcoin?",
      "acceptedAnswer": { "@type": "Answer", "text": "Yes. GoldBuller LLC accepts Bitcoin (BTC) as payment for all products. The OTC desk also allows trades of 0.20–10 BTC directly for physical gold and silver, settled via wire transfer." } }
  ]
};

const BITCOIN_OTC_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "GoldBuller Bitcoin OTC Desk",
  "provider": { "@id": `${SITE_URL}/#organization` },
  "serviceType": "Precious Metals OTC Trading",
  "description": "Buy physical gold and silver with Bitcoin at GoldBuller LLC's OTC desk. Trades from 0.20–10 BTC. KYC required. No exchange slippage. Settled via bank wire.",
  "url": `${SITE_URL}/bitcoin-otc`,
  "areaServed": "United States",
  "offers": {
    "@type": "Offer",
    "name": "Bitcoin to Gold/Silver Exchange",
    "description": "Trade 0.20–10 BTC for physical gold and silver bullion with insured wire settlement.",
    "seller": { "@id": `${SITE_URL}/#organization` }
  }
};

const GOLD_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  "name": "Gold Bullion Coins and Bars — GoldBuller LLC",
  "description": "50+ gold bullion products including American Gold Eagles, Canadian Maple Leafs, PAMP Suisse bars, and kilo bars. Priced transparently above live spot price.",
  "url": `${SITE_URL}/gold`,
  "numberOfItems": 50,
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "American Gold Eagle 1 oz", "url": `${SITE_URL}/gold` },
    { "@type": "ListItem", "position": 2, "name": "Canadian Gold Maple Leaf 1 oz", "url": `${SITE_URL}/gold` },
    { "@type": "ListItem", "position": 3, "name": "PAMP Suisse Gold Bar 1 oz", "url": `${SITE_URL}/gold` },
    { "@type": "ListItem", "position": 4, "name": "Gold Bar 10 oz", "url": `${SITE_URL}/gold` },
    { "@type": "ListItem", "position": 5, "name": "Gold Kilo Bar 32.15 ozt", "url": `${SITE_URL}/gold` }
  ]
};

const SILVER_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  "name": "Silver Bullion Coins and Bars — GoldBuller LLC",
  "description": "35+ silver bullion products including American Silver Eagles, Canadian Maple Leafs, 100 oz bars, and junk silver. Competitive spot-based pricing.",
  "url": `${SITE_URL}/silver`,
  "numberOfItems": 35,
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "American Silver Eagle 1 oz", "url": `${SITE_URL}/silver` },
    { "@type": "ListItem", "position": 2, "name": "Canadian Silver Maple Leaf 1 oz", "url": `${SITE_URL}/silver` },
    { "@type": "ListItem", "position": 3, "name": "100 oz Silver Bar", "url": `${SITE_URL}/silver` },
    { "@type": "ListItem", "position": 4, "name": "90% Junk Silver Coins $1 Face", "url": `${SITE_URL}/silver/junk-silver` },
    { "@type": "ListItem", "position": 5, "name": "1 oz Silver Round (Generic)", "url": `${SITE_URL}/silver` }
  ]
};

const IRA_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "FinancialProduct",
  "name": "Gold & Silver Precious Metals IRA",
  "provider": { "@id": `${SITE_URL}/#organization` },
  "description": "Open a precious metals IRA with GoldBuller LLC. IRA-eligible gold and silver bullion, IRS-approved custodians, and expert guidance for your retirement account rollover.",
  "url": `${SITE_URL}/ira`,
  "feesAndCommissionsSpecification": "Annual custodian fees vary by custodian. GoldBuller charges standard bullion premiums above spot with no additional IRA setup fee."
};

const SELL_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "GoldBuller Precious Metals Buyback",
  "provider": { "@id": `${SITE_URL}/#organization` },
  "serviceType": "Precious Metals Buyback",
  "description": "Sell gold, silver, platinum, and palladium to GoldBuller LLC at 97–99% of spot for standard bullion. Fast payment, insured shipping. Free quote within 24 hours.",
  "url": `${SITE_URL}/sell-to-us`,
  "offers": {
    "@type": "Offer",
    "name": "Bullion Buyback",
    "description": "GoldBuller pays 97–99% of live spot price for American Eagles, Maple Leafs, PAMP bars, and most major bullion products.",
    "seller": { "@id": `${SITE_URL}/#organization` }
  }
};

const ABOUT_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  "url": `${SITE_URL}/about`,
  "name": "About GoldBuller LLC",
  "description": "GoldBuller LLC is a Texas-based precious metals dealer founded in 2018, offering gold, silver, platinum, and copper bullion with A+ BBB rating and NGC authorization.",
  "about": {
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    "name": "GoldBuller LLC",
    "foundingDate": "2018",
    "foundingLocation": { "@type": "Place", "name": "Dallas, Texas" },
    "description": "GoldBuller LLC is an A+ BBB-rated, NGC-authorized precious metals dealer based in Dallas, TX. We have served thousands of investors since 2018 with transparent, spot-based pricing, fully insured discreet shipping, and a KYC-compliant Bitcoin OTC desk.",
    "hasCredential": ["A+ Better Business Bureau Rating", "NGC Authorized Dealer", "ICTA Member"]
  }
};

const HOWTO_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "How to Buy Gold and Silver with Bitcoin at GoldBuller OTC Desk",
  "description": "Step-by-step guide to buying physical precious metals with Bitcoin through GoldBuller's OTC desk.",
  "url": `${SITE_URL}/bitcoin-otc/how-it-works`,
  "step": [
    { "@type": "HowToStep", "position": 1, "name": "Complete KYC Verification", "text": "Create a GoldBuller account and complete identity verification. Required for all BTC OTC trades." },
    { "@type": "HowToStep", "position": 2, "name": "Submit OTC Application", "text": "Specify the BTC amount (0.20–10 BTC) and your preferred precious metals (gold, silver, or mix)." },
    { "@type": "HowToStep", "position": 3, "name": "Receive Wire Instructions", "text": "GoldBuller's OTC desk sends a quote and bank wire instructions. Wire the USD equivalent of your BTC." },
    { "@type": "HowToStep", "position": 4, "name": "Confirm Bitcoin Address", "text": "After wire confirmation, provide your Bitcoin wallet address for the BTC leg of the settlement." },
    { "@type": "HowToStep", "position": 5, "name": "Receive Insured Shipment", "text": "Your gold and silver ships fully insured within 14 business days of cleared funds." }
  ]
};

const TAX_FAQ_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    { "@type": "Question", "name": "Which states have no sales tax on gold and silver bullion?",
      "acceptedAnswer": { "@type": "Answer", "text": "As of 2026, states with full precious metals sales tax exemptions include Texas, Florida, Arizona, Colorado, Georgia, Montana, Oregon, New Hampshire, and others. The exemption list changes as state legislatures act. Always verify current law before purchasing." } },
    { "@type": "Question", "name": "Is gold and silver taxable in Texas?",
      "acceptedAnswer": { "@type": "Answer", "text": "Texas fully exempts precious metals bullion — gold, silver, platinum, and palladium — from sales tax under Texas Tax Code §151.336. No minimum purchase threshold applies." } },
    { "@type": "Question", "name": "Do you pay capital gains tax when selling gold?",
      "acceptedAnswer": { "@type": "Answer", "text": "Yes. The IRS taxes gold and silver as collectibles at a maximum long-term capital gains rate of 28%, compared to 20% for stocks. Short-term gains (held under 1 year) are taxed as ordinary income." } },
    { "@type": "Question", "name": "Does GoldBuller report my purchase to the IRS?",
      "acceptedAnswer": { "@type": "Answer", "text": "GoldBuller LLC is required to file IRS Form 1099-B for certain cash transactions over $10,000 and for specific bullion buyback transactions. Standard online purchases do not trigger IRS reporting." } }
  ]
};

const AUTOBUY_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "GoldBuller Auto-Buy Dollar Cost Averaging",
  "provider": { "@id": `${SITE_URL}/#organization` },
  "serviceType": "Automated Precious Metals Purchasing",
  "description": "Set up automatic recurring purchases of gold and silver bullion with GoldBuller LLC's Auto-Buy program. Dollar-cost averaging made simple and fully automated.",
  "url": `${SITE_URL}/autobuy`
};

const CHARTS_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "Live Gold & Silver Price Charts",
  "url": `${SITE_URL}/charts`,
  "description": "Real-time gold, silver, platinum, and palladium spot price charts updated continuously during market hours. Historical data and gold-silver ratio chart included.",
  "about": [
    { "@type": "Commodity", "name": "Gold", "description": "Live gold spot price in USD per troy ounce" },
    { "@type": "Commodity", "name": "Silver", "description": "Live silver spot price in USD per troy ounce" },
    { "@type": "Commodity", "name": "Platinum", "description": "Live platinum spot price in USD per troy ounce" }
  ]
};

const JUNK_SILVER_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Junk Silver Coins — 90% US Silver",
  "description": "Pre-1965 US dimes, quarters, and half dollars containing 90% silver. Each $1 face value contains approximately 0.715 troy ounces of silver. Sold by face value at competitive premiums above silver spot.",
  "url": `${SITE_URL}/silver/junk-silver`,
  "brand": { "@type": "Brand", "name": "US Government (pre-1965)" },
  "category": "Precious Metals Bullion",
  "offers": {
    "@type": "AggregateOffer",
    "priceCurrency": "USD",
    "seller": { "@id": `${SITE_URL}/#organization` },
    "availability": "https://schema.org/InStock"
  }
};

// ---------------------------------------------------------------------------
// Pre-hydration crawlable content blocks (visible to crawlers, replaced by React)
// ---------------------------------------------------------------------------

const ROUTE_CONTENT = {
  "/faq": `
    <section style="max-width:860px;margin:0 auto;padding:2rem 1.5rem;font-family:Georgia,serif;background:#0c0c0e;color:#d1d5db;">
      <h2 style="color:#c9a84c;font-size:1.3rem;margin:1.5rem 0 0.5rem;">Is there a minimum order at GoldBuller LLC?</h2>
      <p>Yes. GoldBuller LLC's minimum order is $99 per transaction, regardless of payment method.</p>
      <h2 style="color:#c9a84c;font-size:1.3rem;margin:1.5rem 0 0.5rem;">Is my precious metals shipment insured?</h2>
      <p>Yes. All GoldBuller LLC shipments are fully insured for the complete value of the contents from the time they leave our facility until the package is signed for at your address. No deductibles apply.</p>
      <h2 style="color:#c9a84c;font-size:1.3rem;margin:1.5rem 0 0.5rem;">What payment methods does GoldBuller LLC accept?</h2>
      <p>GoldBuller LLC accepts bank wire transfer, ACH/electronic check, credit/debit cards, and Bitcoin (BTC). Bank wire and check payments may qualify for a cash discount of up to 4%.</p>
      <h2 style="color:#c9a84c;font-size:1.3rem;margin:1.5rem 0 0.5rem;">How long does shipping take from GoldBuller LLC?</h2>
      <p>Orders are typically packaged and shipped within 14 business days of receiving good funds. Delivery takes 3–5 business days via UPS, USPS, or FedEx once shipped. All orders ship fully insured and discreetly packaged.</p>
      <h2 style="color:#c9a84c;font-size:1.3rem;margin:1.5rem 0 0.5rem;">Does GoldBuller LLC offer a buyback guarantee?</h2>
      <p>Yes. GoldBuller LLC offers two buyback options: Immediate Liquidation (fast payout at current bid price for all bullion) and a Consignment Program (for eligible Investment Grade Coins held 60+ months).</p>
      <h2 style="color:#c9a84c;font-size:1.3rem;margin:1.5rem 0 0.5rem;">Does GoldBuller LLC accept Bitcoin?</h2>
      <p>Yes. GoldBuller LLC accepts Bitcoin (BTC) as payment for all products. The Bitcoin OTC desk allows trades of 0.20–10 BTC directly for physical gold and silver, settled via bank wire. KYC verification required for OTC trades.</p>
      <h2 style="color:#c9a84c;font-size:1.3rem;margin:1.5rem 0 0.5rem;">What KYC verification is required?</h2>
      <p>Bank wire orders over $10,000 and all Bitcoin OTC trades require KYC identity verification. Standard online orders can be placed without KYC. KYC approval typically takes 1–2 business days.</p>
    </section>`,

  "/gold": `
    <section style="max-width:860px;margin:0 auto;padding:2rem 1.5rem;font-family:Georgia,serif;background:#0c0c0e;color:#d1d5db;">
      <p style="font-size:1.1rem;color:#9ca3af;margin-bottom:1.5rem;">GoldBuller LLC offers 50+ gold bullion products priced transparently at competitive premiums above the live spot price. Free insured shipping on orders $99+. Bitcoin accepted.</p>
      <h2 style="color:#c9a84c;font-size:1.2rem;margin:1.5rem 0 0.5rem;">Gold Coins</h2>
      <ul style="color:#d1d5db;line-height:2;">
        <li><strong>American Gold Eagle</strong> — 1 oz, ½ oz, ¼ oz, 1/10 oz | .9167 fine | US Mint</li>
        <li><strong>American Gold Buffalo</strong> — 1 oz | .9999 fine | US Mint</li>
        <li><strong>Canadian Gold Maple Leaf</strong> — 1 oz | .9999 fine | Royal Canadian Mint</li>
        <li><strong>South African Krugerrand</strong> — 1 oz | .9167 fine</li>
        <li><strong>Austrian Gold Philharmonic</strong> — 1 oz | .9999 fine</li>
      </ul>
      <h2 style="color:#c9a84c;font-size:1.2rem;margin:1.5rem 0 0.5rem;">Gold Bars</h2>
      <ul style="color:#d1d5db;line-height:2;">
        <li><strong>PAMP Suisse Gold Bar</strong> — 1 oz, 10 oz | .9999 fine | Assay card included</li>
        <li><strong>Valcambi Gold Bar</strong> — 1 oz, 10 oz | .9999 fine</li>
        <li><strong>Perth Mint Gold Bar</strong> — 1 oz | .9999 fine</li>
        <li><strong>Gold Kilo Bar</strong> — 32.15 ozt | .9999 fine | For OTC and IRA</li>
      </ul>
      <h2 style="color:#c9a84c;font-size:1.2rem;margin:1.5rem 0 0.5rem;">Typical Premiums (as of 2026)</h2>
      <ul style="color:#d1d5db;line-height:2;">
        <li>1 oz Gold Eagle / Maple Leaf: 5–8% over spot</li>
        <li>1 oz Gold Bar (PAMP, Valcambi): 3–5% over spot</li>
        <li>10 oz Gold Bar: 2–3% over spot</li>
        <li>1 kilo Gold Bar: 1–2% over spot</li>
      </ul>
    </section>`,

  "/silver": `
    <section style="max-width:860px;margin:0 auto;padding:2rem 1.5rem;font-family:Georgia,serif;background:#0c0c0e;color:#d1d5db;">
      <p style="font-size:1.1rem;color:#9ca3af;margin-bottom:1.5rem;">GoldBuller LLC offers 35+ silver bullion products at competitive premiums above the live spot price. Free insured shipping on orders $99+. Bitcoin accepted.</p>
      <h2 style="color:#c9a84c;font-size:1.2rem;margin:1.5rem 0 0.5rem;">Silver Coins</h2>
      <ul style="color:#d1d5db;line-height:2;">
        <li><strong>American Silver Eagle</strong> — 1 oz | .999 fine | US Mint | IRA eligible</li>
        <li><strong>Canadian Silver Maple Leaf</strong> — 1 oz | .9999 fine | IRA eligible</li>
        <li><strong>Austrian Silver Philharmonic</strong> — 1 oz | .999 fine</li>
        <li><strong>Australian Silver Kangaroo</strong> — 1 oz | .9999 fine</li>
      </ul>
      <h2 style="color:#c9a84c;font-size:1.2rem;margin:1.5rem 0 0.5rem;">Silver Bars &amp; Rounds</h2>
      <ul style="color:#d1d5db;line-height:2;">
        <li><strong>1 oz Silver Round</strong> (Generic) — Lowest premium in silver</li>
        <li><strong>10 oz Silver Bar</strong> — .999 fine | Efficient stacking</li>
        <li><strong>100 oz Silver Bar</strong> (Engelhard, Johnson Matthey) — 4–7% over spot</li>
        <li><strong>Junk Silver</strong> — Pre-1965 90% US dimes, quarters, half-dollars</li>
      </ul>
      <h2 style="color:#c9a84c;font-size:1.2rem;margin:1.5rem 0 0.5rem;">Typical Premiums (as of 2026)</h2>
      <ul style="color:#d1d5db;line-height:2;">
        <li>Generic 1 oz rounds: 8–15% over spot</li>
        <li>10 oz bars: 6–10% over spot</li>
        <li>100 oz bars: 4–7% over spot</li>
        <li>American Silver Eagles: 18–30% over spot</li>
      </ul>
    </section>`,

  "/ira": `
    <section style="max-width:860px;margin:0 auto;padding:2rem 1.5rem;font-family:Georgia,serif;background:#0c0c0e;color:#d1d5db;">
      <p style="font-size:1.1rem;color:#9ca3af;margin-bottom:1.5rem;">A Gold IRA lets you hold physical precious metals — gold, silver, platinum, and palladium — inside a tax-advantaged retirement account, combining the wealth-preserving properties of bullion with the same tax benefits as a traditional or Roth IRA.</p>
      <h2 style="color:#c9a84c;font-size:1.2rem;margin:1.5rem 0 0.5rem;">IRS-Approved Gold for IRAs</h2>
      <ul style="color:#d1d5db;line-height:2;">
        <li>American Gold Eagle (all sizes) — .9167 fine, specifically exempted by statute</li>
        <li>American Gold Buffalo — .9999 fine</li>
        <li>Canadian Gold Maple Leaf — .9999 fine</li>
        <li>PAMP Suisse Gold Bars — .9999 fine</li>
        <li>Valcambi Gold Bars — .9999 fine</li>
      </ul>
      <h2 style="color:#c9a84c;font-size:1.2rem;margin:1.5rem 0 0.5rem;">IRS-Approved Silver for IRAs</h2>
      <ul style="color:#d1d5db;line-height:2;">
        <li>American Silver Eagle — .999 fine</li>
        <li>Canadian Silver Maple Leaf — .9999 fine</li>
        <li>100 oz Silver Bars (Eligible brands) — .999 fine</li>
      </ul>
      <h2 style="color:#c9a84c;font-size:1.2rem;margin:1.5rem 0 0.5rem;">How It Works</h2>
      <ol style="color:#d1d5db;line-height:2;padding-left:1.5rem;">
        <li>Open an SDIRA with an IRS-approved custodian (e.g., Equity Trust, STRATA Trust)</li>
        <li>Fund via rollover from existing 401(k) or IRA — no tax event on direct transfer</li>
        <li>GoldBuller sources IRA-eligible bullion at spot-based prices</li>
        <li>Metals are stored at an IRS-approved depository (Brinks, Delaware Depository, etc.)</li>
      </ol>
    </section>`,

  "/sell-to-us": `
    <section style="max-width:860px;margin:0 auto;padding:2rem 1.5rem;font-family:Georgia,serif;background:#0c0c0e;color:#d1d5db;">
      <p style="font-size:1.1rem;color:#9ca3af;margin-bottom:1.5rem;">GoldBuller LLC buys gold, silver, platinum, and palladium from investors nationwide at competitive spot-based prices. Fast payment, insured shipping, and transparent quotes.</p>
      <h2 style="color:#c9a84c;font-size:1.2rem;margin:1.5rem 0 0.5rem;">Buyback Prices</h2>
      <ul style="color:#d1d5db;line-height:2;">
        <li>American Gold Eagles, Maple Leafs, Buffalos: 97–99% of spot</li>
        <li>PAMP Suisse / Valcambi bars: 97–99% of spot</li>
        <li>American Silver Eagles: 95–98% of spot</li>
        <li>100 oz Silver bars: 96–98% of spot</li>
        <li>Junk silver (90% coins): 95–97% of spot</li>
      </ul>
      <h2 style="color:#c9a84c;font-size:1.2rem;margin:1.5rem 0 0.5rem;">How to Sell</h2>
      <ol style="color:#d1d5db;line-height:2;padding-left:1.5rem;">
        <li>Request a free quote — email support@goldbuller.com with your items and quantities</li>
        <li>Receive a locked quote valid for 24 hours</li>
        <li>Ship your metals insured (GoldBuller provides prepaid shipping label)</li>
        <li>Receive payment via bank wire within 2 business days of confirmed receipt</li>
      </ol>
    </section>`,

  "/bitcoin-otc": `
    <section style="max-width:860px;margin:0 auto;padding:2rem 1.5rem;font-family:Georgia,serif;background:#0c0c0e;color:#d1d5db;">
      <p style="font-size:1.1rem;color:#9ca3af;margin-bottom:1.5rem;">GoldBuller's Bitcoin OTC desk allows you to trade 0.20–10 BTC directly for physical gold and silver bullion, settled via insured bank wire. No exchange slippage. KYC required.</p>
      <h2 style="color:#c9a84c;font-size:1.2rem;margin:1.5rem 0 0.5rem;">OTC Desk Details</h2>
      <ul style="color:#d1d5db;line-height:2;">
        <li>Minimum trade: 0.20 BTC</li>
        <li>Maximum trade: 10 BTC per transaction</li>
        <li>Settlement: Bank wire for USD equivalent, physical bullion shipped insured</li>
        <li>KYC verification required for all OTC trades</li>
        <li>Price lock: Quote valid for 4-hour wire window</li>
      </ul>
      <h2 style="color:#c9a84c;font-size:1.2rem;margin:1.5rem 0 0.5rem;">Why Use an OTC Desk?</h2>
      <ul style="color:#d1d5db;line-height:2;">
        <li>No exchange slippage — fixed price at trade confirmation</li>
        <li>Privacy — no public order book entry</li>
        <li>Physical delivery — receive actual gold and silver, not paper contracts</li>
        <li>Insured — full value insurance on all shipments</li>
      </ul>
    </section>`,

  "/about": `
    <section style="max-width:860px;margin:0 auto;padding:2rem 1.5rem;font-family:Georgia,serif;background:#0c0c0e;color:#d1d5db;">
      <p style="font-size:1.1rem;color:#9ca3af;margin-bottom:1.5rem;">GoldBuller LLC is a Texas-based precious metals dealer founded in 2018, offering gold, silver, platinum, and copper bullion to retail and institutional investors nationwide.</p>
      <h2 style="color:#c9a84c;font-size:1.2rem;margin:1.5rem 0 0.5rem;">Company Credentials</h2>
      <ul style="color:#d1d5db;line-height:2;">
        <li><strong>Founded:</strong> 2018 — serving investors for 7+ years</li>
        <li><strong>BBB Rating:</strong> A+ — Better Business Bureau accredited</li>
        <li><strong>NGC Authorized Dealer:</strong> Certified for graded numismatic coins</li>
        <li><strong>Location:</strong> Dallas, Texas</li>
        <li><strong>Phone:</strong> 1-800-GOLD-NOW (Mon–Fri 9am–6pm CT)</li>
        <li><strong>Email:</strong> support@goldbuller.com</li>
      </ul>
      <h2 style="color:#c9a84c;font-size:1.2rem;margin:1.5rem 0 0.5rem;">What We Offer</h2>
      <ul style="color:#d1d5db;line-height:2;">
        <li>Gold, silver, platinum, and copper bullion — coins, bars, and rounds</li>
        <li>NGC/PCGS-graded rare and numismatic coins</li>
        <li>Gold and silver IRA services with IRS-approved custodians</li>
        <li>Bitcoin OTC desk (0.20–10 BTC trades for physical metals)</li>
        <li>Competitive buyback program at 97–99% of spot</li>
        <li>Auto-Buy dollar-cost averaging program</li>
      </ul>
    </section>`,

  "/tax": `
    <section style="max-width:860px;margin:0 auto;padding:2rem 1.5rem;font-family:Georgia,serif;background:#0c0c0e;color:#d1d5db;">
      <p style="font-size:1.1rem;color:#9ca3af;margin-bottom:1.5rem;">Precious metals sales tax rules vary by state. Many US states exempt gold and silver bullion from sales tax. Understanding your state's rules can save you 5–10% on every purchase.</p>
      <h2 style="color:#c9a84c;font-size:1.2rem;margin:1.5rem 0 0.5rem;">States with Full Precious Metals Tax Exemption (2026)</h2>
      <p>Texas, Florida, Arizona, Colorado, Georgia, Montana, Oregon, New Hampshire, North Carolina, Utah, South Carolina, Oklahoma, Missouri, Minnesota, Louisiana, Kansas, Iowa, Indiana, Idaho, Wisconsin, Wyoming, Virginia, Vermont (partial), Rhode Island, Pennsylvania, North Dakota, Nevada (coins only), New Mexico (coins only), Nebraska (some), and others. Laws change — verify before purchasing.</p>
      <h2 style="color:#c9a84c;font-size:1.2rem;margin:1.5rem 0 0.5rem;">Federal Capital Gains Tax on Gold</h2>
      <ul style="color:#d1d5db;line-height:2;">
        <li>IRS classifies gold and silver as collectibles</li>
        <li>Long-term capital gains rate: maximum 28% (vs 20% for stocks)</li>
        <li>Short-term gains (under 1 year): taxed as ordinary income</li>
        <li>IRS Form 1099-B required for certain sales above reporting thresholds</li>
      </ul>
    </section>`,
};

// ---------------------------------------------------------------------------
// Route definitions
// ---------------------------------------------------------------------------

const PAGE_METAS = {
  "/gold": {
    title: "Buy Gold Coins & Bars | 50 Products | GoldBuller LLC",
    description: "Browse gold bullion — American Eagles, PAMP Suisse bars, fractional gold & kilo bars. Competitive spot pricing updated daily. Free insured shipping $99+.",
    h1: "Buy Gold Bullion Coins & Bars",
    schema: GOLD_SCHEMA,
  },
  "/silver": {
    title: "Buy Silver Coins & Bars | 35 Products | GoldBuller LLC",
    description: "Shop silver bullion including Silver Eagles, Maple Leafs, rounds & 100 oz bars. Competitive pricing. Free insured shipping $99+. GoldBuller LLC.",
    h1: "Buy Silver Bullion Coins & Bars",
    schema: SILVER_SCHEMA,
  },
  "/platinum": {
    title: "Buy Platinum Bullion Coins & Bars | GoldBuller LLC",
    description: "Shop platinum bullion — American Eagle Platinum coins and bars from leading mints. Competitive spot pricing, fully insured shipping. GoldBuller LLC.",
    h1: "Buy Platinum Bullion Coins & Bars",
  },
  "/palladium": {
    title: "Buy Palladium Bullion Coins & Bars | GoldBuller LLC",
    description: "Shop palladium bullion products including American Eagle Palladium coins and palladium bars. Fully insured discreet shipping nationwide. GoldBuller LLC.",
    h1: "Buy Palladium Bullion Coins & Bars",
  },
  "/copper": {
    title: "Buy Copper Bullion Rounds & Bars | GoldBuller LLC",
    description: "Shop copper bullion rounds, bars, and coins at GoldBuller LLC. Affordable entry-level precious metals investing. Free insured shipping on orders $99+.",
    h1: "Buy Copper Bullion Rounds & Bars",
  },
  "/ira": {
    title: "Gold & Silver IRA | Precious Metals IRA | GoldBuller LLC",
    description: "Open a precious metals IRA with GoldBuller LLC. IRA-eligible gold and silver bullion, IRS-approved custodians, and expert guidance for your retirement.",
    h1: "Gold & Silver Precious Metals IRA",
    schema: IRA_SCHEMA,
  },
  "/sell-to-us": {
    title: "Sell Your Gold & Silver | GoldBuller LLC Buyback Prices",
    description: "Sell gold & silver to GoldBuller LLC at competitive spot prices — 97–99% of spot for bullion. Fast payment, insured shipping. Get a free quote today.",
    h1: "Sell Your Gold & Silver to GoldBuller",
    schema: SELL_SCHEMA,
  },
  "/buyback-guarantee": {
    title: "Buyback Guarantee | Sell Precious Metals | GoldBuller LLC",
    description: "GoldBuller LLC buys back gold, silver, platinum & palladium at competitive spot prices. Immediate liquidation or consignment program. Fast payment. Free quote.",
    h1: "GoldBuller Buyback Guarantee",
    schema: SELL_SCHEMA,
  },
  "/faq": {
    title: "Precious Metals FAQ | Help Center | GoldBuller LLC",
    description: "Common questions about buying gold & silver, shipping, pricing, payments, KYC verification, and investing with GoldBuller LLC.",
    h1: "Precious Metals Frequently Asked Questions",
    schema: FAQ_SCHEMA,
  },
  "/shipping": {
    title: "Shipping, Handling & Insurance | GoldBuller LLC",
    description: "GoldBuller LLC ships via UPS, USPS & FedEx. Free insured shipping on orders $99+. Fully insured and discreetly packaged. Delivery in 3–5 business days.",
    h1: "Shipping, Handling & Insurance Policy",
  },
  "/bitcoin-otc": {
    title: "Bitcoin OTC Desk | Buy Gold & Silver with BTC | GoldBuller LLC",
    description: "Buy physical gold and silver with Bitcoin at GoldBuller LLC's OTC desk. Trades from 0.20–10 BTC. KYC required. No exchange slippage.",
    h1: "Bitcoin OTC Desk — Buy Gold & Silver with BTC",
    schema: BITCOIN_OTC_SCHEMA,
  },
  "/bitcoin-otc/how-it-works": {
    title: "How Bitcoin OTC Works | GoldBuller LLC BTC Desk",
    description: "How GoldBuller LLC's Bitcoin OTC desk works — step-by-step for buying gold and silver with BTC. No exchange, no slippage, fully insured settlement.",
    h1: "How the Bitcoin OTC Desk Works",
    schema: HOWTO_SCHEMA,
  },
  "/bitcoin-otc/otc-vs-exchange": {
    title: "OTC vs Exchange: Why Use an OTC Desk for Bitcoin? | GoldBuller LLC",
    description: "OTC desk vs crypto exchange for large Bitcoin trades — comparison of slippage, privacy, settlement speed, and cost. GoldBuller OTC desk explained.",
    h1: "OTC Desk vs Exchange — Which Is Better for Large Bitcoin Trades?",
  },
  "/bitcoin-otc/bitcoin-ira": {
    title: "Bitcoin IRA & Gold IRA | Crypto Retirement Accounts | GoldBuller LLC",
    description: "Compare Bitcoin IRA vs Gold IRA for retirement diversification. GoldBuller offers precious metals IRA with IRS-approved custodians and insured storage.",
    h1: "Bitcoin IRA vs Gold IRA — Retirement Diversification",
  },
  "/bitcoin-otc/faq": {
    title: "Bitcoin OTC FAQ | Common Questions | GoldBuller LLC",
    description: "Frequently asked questions about GoldBuller's Bitcoin OTC desk — how it works, KYC requirements, trade size limits, settlement, and wire instructions.",
    h1: "Bitcoin OTC Frequently Asked Questions",
    schema: {
      "@context": "https://schema.org", "@type": "FAQPage",
      "mainEntity": [
        { "@type": "Question", "name": "What is the minimum Bitcoin trade at GoldBuller?",
          "acceptedAnswer": { "@type": "Answer", "text": "GoldBuller's Bitcoin OTC desk accepts trades from a minimum of 0.20 BTC to a maximum of 10 BTC per transaction." } },
        { "@type": "Question", "name": "Is KYC required for Bitcoin OTC trades?",
          "acceptedAnswer": { "@type": "Answer", "text": "Yes. KYC (Know Your Customer) identity verification is required for all Bitcoin OTC trades at GoldBuller LLC. KYC approval typically takes 1–2 business days." } },
        { "@type": "Question", "name": "How does the Bitcoin OTC settlement work?",
          "acceptedAnswer": { "@type": "Answer", "text": "After KYC approval, you submit your trade. GoldBuller sends wire instructions with a 4-hour window. You wire the USD equivalent of your BTC. After wire confirmation, GoldBuller ships your physical gold or silver fully insured." } }
      ]
    },
  },
  "/charts": {
    title: "Live Gold & Silver Price Charts | GoldBuller LLC",
    description: "Track live gold, silver, platinum, and palladium spot prices with interactive real-time charts on GoldBuller LLC. Updated continuously during market hours.",
    h1: "Live Gold & Silver Price Charts",
    schema: CHARTS_SCHEMA,
  },
  "/charts/gold-silver-ratio": {
    title: "Gold-Silver Ratio Chart | Live & Historical | GoldBuller LLC",
    description: "Track the live gold-silver ratio with historical charts going back decades. The ratio shows how many ounces of silver it takes to buy one ounce of gold.",
    h1: "Gold-Silver Ratio — Live Chart & Historical Data",
  },
  "/charts/bitcoin-price": {
    title: "Live Bitcoin Price Chart | USD | GoldBuller LLC",
    description: "Track the live Bitcoin price in USD with real-time chart on GoldBuller LLC. Updated continuously. Compare BTC to gold and silver performance.",
    h1: "Live Bitcoin Price Chart",
  },
  "/fear-greed-index": {
    title: "Precious Metals Fear & Greed Index | GoldBuller LLC",
    description: "Track investor sentiment in the gold and silver market with GoldBuller LLC's Fear & Greed Index. Updated daily. Use it to time your precious metals purchases.",
    h1: "Precious Metals Fear & Greed Index",
  },
  "/on-sale": {
    title: "Gold & Silver On Sale | Discounted Bullion | GoldBuller LLC",
    description: "Shop sale-priced gold and silver bullion at GoldBuller LLC. Discounted coins, bars, and rounds at competitive spot-based pricing. Free insured shipping $99+.",
    h1: "Gold & Silver Bullion On Sale",
  },
  "/new-arrivals": {
    title: "New Gold & Silver Arrivals | Latest Bullion | GoldBuller LLC",
    description: "Browse the latest additions to GoldBuller LLC's precious metals catalog — new gold coins, silver bars, and bullion products added regularly.",
    h1: "New Precious Metals Arrivals",
  },
  "/best-sellers": {
    title: "Best-Selling Gold & Silver Bullion | GoldBuller LLC",
    description: "Shop GoldBuller's best-selling gold and silver bullion — American Gold Eagles, Silver Eagles, PAMP bars, and top-rated coins at competitive premiums.",
    h1: "Best-Selling Gold & Silver Bullion",
  },
  "/featured": {
    title: "Featured Precious Metals Products | GoldBuller LLC",
    description: "Editor-selected featured gold and silver bullion products at GoldBuller LLC. Curated picks including limited editions, new releases, and exceptional value.",
    h1: "Featured Precious Metals Products",
  },
  "/rare-coins": {
    title: "Rare & Numismatic Coins | NGC & PCGS Graded | GoldBuller LLC",
    description: "Shop NGC and PCGS-graded rare and numismatic coins at GoldBuller LLC. Pre-1933 gold coins, proof sets, Morgan dollars, and investment-grade certified coins.",
    h1: "Rare & Numismatic Coins — NGC & PCGS Graded",
  },
  "/tax": {
    title: "Precious Metals Sales Tax by State | GoldBuller LLC",
    description: "Understand precious metals sales tax rules by state. GoldBuller LLC covers state-by-state bullion tax exemptions and IRS reporting thresholds.",
    h1: "Precious Metals Sales Tax by State",
    schema: TAX_FAQ_SCHEMA,
  },
  "/contact": {
    title: "Contact GoldBuller LLC | Precious Metals Support",
    description: "Contact GoldBuller LLC: support@goldbuller.com or 1-800-GOLD-NOW (Mon–Fri 9am–6pm CT), Dallas TX. Purchase inquiries, quotes & support.",
    h1: "Contact GoldBuller LLC",
  },
  "/about": {
    title: "About GoldBuller LLC | Trusted Precious Metals Dealer Since 2018",
    description: "GoldBuller LLC is a trusted Texas-based precious metals dealer offering gold, silver, platinum & copper bullion since 2018. A+ BBB rated, NGC authorized.",
    h1: "About GoldBuller LLC — Trusted Precious Metals Dealer Since 2018",
    schema: ABOUT_SCHEMA,
  },
  "/autobuy": {
    title: "Auto-Buy Precious Metals | Dollar-Cost Averaging | GoldBuller LLC",
    description: "Set up automatic recurring purchases of gold and silver bullion with GoldBuller LLC's Auto-Buy program. Dollar-cost averaging made simple and fully automated.",
    h1: "Auto-Buy Precious Metals — Dollar-Cost Averaging",
    schema: AUTOBUY_SCHEMA,
  },
  "/silver/junk-silver": {
    title: "Junk Silver Coins | 90% Silver US Coins | GoldBuller LLC",
    description: "Buy junk silver — 90% silver US coins (pre-1965 dimes, quarters, half-dollars) at GoldBuller LLC. $1 face value = ~0.715 troy oz silver. Great value for investors.",
    h1: "Junk Silver Coins — 90% US Silver",
    schema: JUNK_SILVER_SCHEMA,
  },
  "/investing-guide": {
    title: "Precious Metals Investing Guide | Gold & Silver 101 | GoldBuller LLC",
    description: "Complete guide to investing in gold and silver bullion — why investors buy precious metals, how to start, what to buy, and how to store your metals safely.",
    h1: "Precious Metals Investing Guide — Gold & Silver 101",
  },
};

// ---------------------------------------------------------------------------
// HTML injection
// ---------------------------------------------------------------------------

function buildBreadcrumbSchema(pathname) {
  const parts = pathname.split("/").filter(Boolean);
  if (parts.length === 0) return null;
  const items = [{ "@type": "ListItem", position: 1, name: "Home", item: SITE_URL + "/" }];
  let url = SITE_URL;
  parts.forEach((part, i) => {
    url += "/" + part;
    const name = part.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());
    items.push({ "@type": "ListItem", position: i + 2, name, item: url });
  });
  return { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: items };
}

function injectMeta(html, pathname, meta) {
  const canonical = `${SITE_URL}${pathname}`;
  const { title, description, h1, schema } = meta;
  const content = ROUTE_CONTENT[pathname] || "";

  const breadcrumb = buildBreadcrumbSchema(pathname);
  const allSchemas = [
    schema ? JSON.stringify(schema) : null,
    breadcrumb ? JSON.stringify(breadcrumb) : null,
  ].filter(Boolean);

  const schemaBlocks = allSchemas.map(s => `<script type="application/ld+json">${s}</script>`).join("\n");

  const metaTags = [
    `  <link rel="canonical" href="${esc(canonical)}" />`,
    `  <meta property="og:title" content="${esc(title)}" />`,
    `  <meta property="og:description" content="${esc(description)}" />`,
    `  <meta property="og:url" content="${esc(canonical)}" />`,
    `  <meta property="og:type" content="website" />`,
    `  <meta property="og:site_name" content="GoldBuller LLC" />`,
    `  <meta property="og:locale" content="en_US" />`,
    `  <meta property="og:image" content="${OG_IMAGE}" />`,
    `  <meta name="twitter:card" content="summary_large_image" />`,
    `  <meta name="twitter:site" content="@goldbuller" />`,
    `  <meta name="twitter:title" content="${esc(title)}" />`,
    `  <meta name="twitter:description" content="${esc(description)}" />`,
    `  <meta name="twitter:image" content="${OG_IMAGE}" />`,
    schemaBlocks,
  ].filter(Boolean).join("\n");

  const h1Tag = `<h1 style="background:#0c0c0e;color:#f9f9f7;margin:0;padding:2rem;font-family:Georgia,serif;font-size:2rem;">${esc(h1)}</h1>`;
  const preHydration = content
    ? `${h1Tag}\n${content}`
    : h1Tag;

  return html
    .replace(/<title>[^<]*<\/title>/, `<title>${esc(title)}</title>`)
    .replace(/<meta name="description"[^>]*>/, `<meta name="description" content="${esc(description)}" />`)
    .replace(/<link rel="canonical"[^>]*>\n?/, "")
    .replace("</head>", `${metaTags}\n</head>`)
    .replace(/<div id="root">[^<]*<\/div>/, `<div id="root">${preHydration}</div>`);
}

function write(filePath, content) {
  mkdirSync(dirname(filePath), { recursive: true });
  writeFileSync(filePath, content, "utf8");
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

let baseHtml;
try {
  baseHtml = readFileSync(join(distDir, "index.html"), "utf8");
} catch {
  console.error("✗ dist/public/index.html not found. Run vite build first.");
  process.exit(1);
}

let count = 0;
for (const [pathname, meta] of Object.entries(PAGE_METAS)) {
  const segments = pathname.split("/").filter(Boolean);
  const dir = join(distDir, ...segments);
  const outPath = join(dir, "index.html");
  const modified = injectMeta(baseHtml, pathname, meta);
  write(outPath, modified);
  count++;
  console.log(`  ✓ ${pathname}`);
}

console.log(`\n✓ Generated ${count} SPA route HTML files in dist/public/`);
