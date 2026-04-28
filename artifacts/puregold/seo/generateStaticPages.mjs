/**
 * Pre-renders all SEO pages to public/ as static HTML files.
 * Runs as a prebuild step — Vite copies public/ to dist/public/ automatically.
 * Use:  node seo/generateStaticPages.mjs
 */

import { createRequire } from "module";
import { writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, "..", "public");

// ─── shared CSS & layout ────────────────────────────────────────────────────

const SITE_URL = "https://goldbuller.com";
const BRAND = "GoldBuller";

function esc(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}

function sharedCss() {
  return `
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{font-size:16px;-webkit-text-size-adjust:100%}
body{background:#0c0c0e;color:#e5e7eb;font-family:'Inter',system-ui,sans-serif;line-height:1.7;min-height:100vh}
a{color:#c9a84c;text-decoration:none}
a:hover{text-decoration:underline;color:#e2c97e}
img{max-width:100%;height:auto}
.ssr-header{background:#0c0c0e;border-bottom:1px solid #1f1f23;position:sticky;top:0;z-index:50}
.ssr-header-inner{max-width:1200px;margin:0 auto;padding:0 1.5rem;height:64px;display:flex;align-items:center;gap:2rem}
.ssr-logo{font-family:'Playfair Display',serif;font-size:1.5rem;font-weight:700;color:#c9a84c;letter-spacing:-0.02em}
.ssr-logo-dot{color:#e2c97e}
.ssr-nav{display:flex;gap:1.5rem;margin-left:auto}
.ssr-nav-link{font-size:0.9rem;color:#9ca3af;font-weight:500;transition:color 0.15s}
.ssr-nav-link:hover{color:#c9a84c;text-decoration:none}
.ssr-btn{background:#c9a84c;color:#0c0c0e;padding:0.5rem 1.25rem;border-radius:6px;font-size:0.875rem;font-weight:600;white-space:nowrap}
.ssr-btn:hover{background:#e2c97e;text-decoration:none;color:#0c0c0e}
@media(max-width:768px){.ssr-nav{display:none}.ssr-btn{display:none}}
.ssr-main{max-width:900px;margin:0 auto;padding:3rem 1.5rem 5rem}
h1{font-family:'Playfair Display',serif;font-size:clamp(1.75rem,4vw,2.75rem);font-weight:700;color:#f9f9f7;line-height:1.2;margin-bottom:1rem}
h2{font-family:'Playfair Display',serif;font-size:clamp(1.25rem,3vw,1.75rem);font-weight:700;color:#f0ede4;margin:2.5rem 0 1rem}
h3{font-size:1.125rem;font-weight:600;color:#e5e7eb;margin:2rem 0 0.75rem}
p{margin-bottom:1.25rem;color:#d1d5db}
ul,ol{margin:0 0 1.25rem 1.5rem;color:#d1d5db}
li{margin-bottom:0.5rem}
strong{color:#f0ede4;font-weight:600}
blockquote{border-left:3px solid #c9a84c;padding:1rem 1.5rem;margin:1.5rem 0;background:#13131a;border-radius:0 8px 8px 0;font-style:italic;color:#9ca3af}
.ssr-card{background:#13131a;border:1px solid #1f1f23;border-radius:12px;padding:1.5rem;margin-bottom:1.5rem}
.ssr-card-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:1rem;margin:1.5rem 0}
.ssr-card-sm{background:#13131a;border:1px solid #1f1f23;border-radius:8px;padding:1rem}
.ssr-card-sm a{display:block;font-weight:600;color:#c9a84c;margin-bottom:0.25rem}
.ssr-card-sm p{font-size:0.875rem;color:#9ca3af;margin:0}
.ssr-tag{display:inline-block;background:#1f1f23;color:#c9a84c;border:1px solid #2a2a30;border-radius:20px;padding:0.25rem 0.75rem;font-size:0.8rem;font-weight:600;margin:0 0.25rem 0.5rem 0}
.ssr-highlight{background:#13131a;border:1px solid #c9a84c33;border-radius:12px;padding:1.5rem;margin:2rem 0}
.ssr-cta{background:linear-gradient(135deg,#1a1508,#13131a);border:1px solid #c9a84c33;border-radius:12px;padding:2rem;text-align:center;margin:3rem 0}
.ssr-cta h2{margin:0 0 0.75rem;font-size:1.5rem}
.ssr-cta p{margin-bottom:1.5rem;color:#9ca3af}
.ssr-cta-btn{display:inline-block;background:#c9a84c;color:#0c0c0e;padding:0.75rem 2rem;border-radius:8px;font-weight:700;font-size:1rem}
.ssr-cta-btn:hover{background:#e2c97e;text-decoration:none;color:#0c0c0e}
.ssr-table-wrap{overflow-x:auto;margin:1.5rem 0}
table{width:100%;border-collapse:collapse}
th{background:#1f1f23;color:#c9a84c;font-size:0.8rem;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;padding:0.75rem 1rem;text-align:left}
td{padding:0.75rem 1rem;border-bottom:1px solid #1f1f23;color:#d1d5db;font-size:0.9rem}
tr:last-child td{border-bottom:none}
.ssr-related{margin-top:3rem}
.ssr-intro{font-size:1.125rem;color:#9ca3af;margin-bottom:2rem;line-height:1.8}
.ssr-footer{background:#0a0a0c;border-top:1px solid #1f1f23;padding:4rem 1.5rem 2rem}
.ssr-footer-inner{max-width:1200px;margin:0 auto}
.ssr-footer-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:2rem;margin-bottom:3rem}
.ssr-footer-logo{font-family:'Playfair Display',serif;font-size:1.5rem;font-weight:700;color:#c9a84c;margin-bottom:0.75rem}
.ssr-footer-tagline{font-size:0.85rem;color:#6b7280;margin-bottom:0.5rem}
.ssr-footer-contact{font-size:0.85rem;color:#6b7280}
.ssr-footer-heading{font-size:0.875rem;font-weight:700;color:#f9f9f7;margin-bottom:1rem;text-transform:uppercase;letter-spacing:0.05em}
.ssr-footer-list{list-style:none;padding:0;margin:0}
.ssr-footer-list li{margin-bottom:0.5rem}
.ssr-footer-list a{font-size:0.875rem;color:#6b7280;transition:color 0.15s}
.ssr-footer-list a:hover{color:#c9a84c;text-decoration:none}
.ssr-footer-bottom{border-top:1px solid #1f1f23;padding-top:1.5rem;display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:1rem}
.ssr-footer-badges{display:flex;gap:0.5rem}
.ssr-badge{font-size:0.7rem;font-weight:700;padding:0.25rem 0.6rem;background:#0c0c0e;border:1px solid #1f1f23;border-radius:4px;color:#9ca3af}
.ssr-footer-copy{font-size:0.8rem;color:#6b7280}
.ssr-footer-payments{font-size:0.8rem;color:#6b7280;font-weight:600}
`;
}

function header() {
  return `<header class="ssr-header">
  <div class="ssr-header-inner">
    <a href="/" class="ssr-logo" aria-label="GoldBuller home">GoldBuller<span class="ssr-logo-dot">.</span></a>
    <nav class="ssr-nav" aria-label="Main navigation">
      <a href="/gold" class="ssr-nav-link">Gold</a>
      <a href="/silver" class="ssr-nav-link">Silver</a>
      <a href="/platinum" class="ssr-nav-link">Platinum</a>
      <a href="/charts" class="ssr-nav-link">Live Charts</a>
      <a href="/guides" class="ssr-nav-link">Guides</a>
      <a href="/learn" class="ssr-nav-link">Learn</a>
      <a href="/blog" class="ssr-nav-link">Blog</a>
    </nav>
    <a href="/account/dashboard" class="ssr-btn">My Account</a>
  </div>
</header>`;
}

function footer() {
  const year = new Date().getFullYear();
  return `<footer class="ssr-footer">
  <div class="ssr-footer-inner">
    <div class="ssr-footer-grid">
      <div>
        <div class="ssr-footer-logo">GoldBuller<span class="ssr-logo-dot">.</span></div>
        <p class="ssr-footer-tagline">Premium precious metals dealer since 2018. Fully insured, discreet shipping on all orders.</p>
        <p class="ssr-footer-contact">1-800-GOLD-NOW &bull; Dallas, TX</p>
      </div>
      <div>
        <h3 class="ssr-footer-heading">Gold Products</h3>
        <ul class="ssr-footer-list">
          <li><a href="/gold">All Gold</a></li>
          <li><a href="/gold?category=coins">Gold Coins</a></li>
          <li><a href="/gold?category=bars">Gold Bars</a></li>
          <li><a href="/gold?mint=us">American Eagles</a></li>
        </ul>
      </div>
      <div>
        <h3 class="ssr-footer-heading">Silver Products</h3>
        <ul class="ssr-footer-list">
          <li><a href="/silver">All Silver</a></li>
          <li><a href="/silver?category=coins">Silver Coins</a></li>
          <li><a href="/silver?category=bars">Silver Bars</a></li>
          <li><a href="/silver/junk-silver">Junk Silver</a></li>
        </ul>
      </div>
      <div>
        <h3 class="ssr-footer-heading">Learn &amp; Guides</h3>
        <ul class="ssr-footer-list">
          <li><a href="/learn">Glossary</a></li>
          <li><a href="/guides">Buying Guides</a></li>
          <li><a href="/blog">Market News</a></li>
          <li><a href="/guides/how-to-buy-gold-bullion">How to Buy Gold</a></li>
          <li><a href="/guides/gold-vs-silver-which-to-buy">Gold vs Silver</a></li>
        </ul>
      </div>
      <div>
        <h3 class="ssr-footer-heading">Buy by Wire</h3>
        <ul class="ssr-footer-list">
          <li><a href="/buy/gold-with-bank-wire">Buy Gold with Wire</a></li>
          <li><a href="/buy/silver-with-bank-wire">Buy Silver with Wire</a></li>
          <li><a href="/buy/american-gold-eagle-bank-wire">Buy Gold Eagles</a></li>
          <li><a href="/buy/100-oz-silver-bar-bank-wire">100 oz Silver Bars</a></li>
          <li><a href="/buy/pamp-gold-bar-wire-transfer">PAMP Gold Bars</a></li>
          <li><a href="/buy/wire-transfer-to-buy-bitcoin-usa">Wire to Buy Bitcoin</a></li>
        </ul>
      </div>
      <div>
        <h3 class="ssr-footer-heading">Shipping</h3>
        <ul class="ssr-footer-list">
          <li><a href="/buy/physical-gold-doorstep-delivery">Gold to Your Door</a></li>
          <li><a href="/buy/express-gold-delivery-usa">Express Delivery</a></li>
          <li><a href="/buy/insured-precious-metals-shipping">Insured Shipping</a></li>
          <li><a href="/account/dashboard">My Account</a></li>
          <li><a href="/account/orders">Track Order</a></li>
          <li><a href="/faq">FAQ</a></li>
        </ul>
      </div>
    </div>
    <div class="ssr-footer-bottom">
      <div class="ssr-footer-badges">
        <span class="ssr-badge">A+ BBB Rated</span>
        <span class="ssr-badge">SSL Secured</span>
      </div>
      <p class="ssr-footer-copy">&copy; 2018&ndash;${year} GoldBuller LLC. All rights reserved.</p>
      <p class="ssr-footer-payments">VISA | MC | AMEX | DISCOVER | BTC</p>
    </div>
  </div>
</footer>`;
}

function shell({ title, description, canonical, schemaJson, breadcrumbs, body }) {
  const bc = breadcrumbs ?? [];
  const bcSchema = bc.length ? `
  <script type="application/ld+json">
  {"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[
    {"@type":"ListItem","position":1,"name":"Home","item":"${SITE_URL}/"},
    ${bc.map((b, i) => `{"@type":"ListItem","position":${i + 2},"name":"${esc(b.name)}","item":"${esc(b.url)}"}`).join(",")}
  ]}</script>` : "";

  const bcHtml = bc.length ? `<nav aria-label="Breadcrumb" style="margin-bottom:1.5rem;">
    <ol style="display:flex;flex-wrap:wrap;gap:0.5rem;list-style:none;padding:0;margin:0;font-size:0.875rem;color:#9ca3af;">
      <li><a href="/" style="color:#c9a84c;text-decoration:none;">Home</a></li>
      ${bc.map((b, i, arr) => `<li style="display:flex;gap:0.5rem;align-items:center;"><span aria-hidden="true">›</span>${
        i === arr.length - 1
          ? `<span style="color:#9ca3af;">${esc(b.name)}</span>`
          : `<a href="${esc(b.url)}" style="color:#c9a84c;text-decoration:none;">${esc(b.name)}</a>`
      }</li>`).join("")}
    </ol>
  </nav>` : "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}" />
  <link rel="canonical" href="${esc(canonical)}" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="${esc(title)}" />
  <meta property="og:description" content="${esc(description)}" />
  <meta property="og:url" content="${esc(canonical)}" />
  <meta property="og:site_name" content="${BRAND}" />
  <meta property="og:image" content="${SITE_URL}/opengraph.jpg" />
  <meta name="twitter:card" content="summary_large_image" />
  <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />
  ${schemaJson ? `<script type="application/ld+json">${schemaJson}</script>` : ""}
  ${bcSchema}
  <style>${sharedCss()}</style>
</head>
<body>
  ${header()}
  <main class="ssr-main">
    ${bcHtml}
    ${body}
  </main>
  ${footer()}
</body>
</html>`;
}

// ─── Glossary data ───────────────────────────────────────────────────────────

const TERMS = [
  {
    slug: "spot-price", term: "Spot Price", shortDef: "The current market price for immediate delivery of a precious metal.", category: "Pricing",
    related: ["premium", "bid-ask-spread", "troy-ounce"],
    body: `<p class="ssr-intro">The <strong>spot price</strong> is the real-time market price at which a precious metal can be bought or sold for immediate delivery. It is quoted in US dollars per troy ounce and changes continuously during market hours based on global supply and demand, currency movements, and macroeconomic events.</p>
<h2>How Spot Price Is Determined</h2>
<p>Spot prices are derived primarily from futures contracts trading on the COMEX (Commodity Exchange, a division of the CME Group) and the London Bullion Market Association (LBMA). The LBMA publishes twice-daily official gold fixes — an AM and PM fix — which serve as benchmarks for physical settlement of large institutional trades.</p>
<h2>Spot Price vs. What You Actually Pay</h2>
<p>The spot price is not the price you pay for a gold coin or silver bar. When you purchase bullion from a dealer like GoldBuller, the final price includes a <a href="${SITE_URL}/learn/premium">dealer premium</a> added on top of spot. This premium covers minting costs, fabrication, insurance, storage, logistics, and the dealer's operating margin.</p>
<div class="ssr-table-wrap"><table><thead><tr><th>Product Type</th><th>Typical Premium Over Spot</th></tr></thead><tbody>
<tr><td>1 oz Gold Bars (major brands)</td><td>2% – 5%</td></tr>
<tr><td>American Gold Eagles (1 oz)</td><td>5% – 8%</td></tr>
<tr><td>1 oz Silver Rounds</td><td>8% – 15%</td></tr>
<tr><td>American Silver Eagles</td><td>15% – 30%</td></tr>
<tr><td>Junk Silver (90% coins)</td><td>0% – 10%</td></tr>
</tbody></table></div>
<h2>What Moves the Spot Price?</h2>
<ul>
  <li><strong>US Dollar strength:</strong> Gold is priced in USD, so a stronger dollar typically pushes spot lower.</li>
  <li><strong>Real interest rates:</strong> When real yields rise, the opportunity cost of holding non-yielding gold rises.</li>
  <li><strong>Inflation expectations:</strong> Gold is widely used as an inflation hedge. Rising CPI expectations push spot higher.</li>
  <li><strong>Geopolitical risk:</strong> Wars, sanctions, and financial crises historically trigger "flight to safety" buying.</li>
  <li><strong>Central bank purchases:</strong> Emerging market central banks have been aggressive net buyers since 2022.</li>
</ul>
<div class="ssr-cta"><h2>Shop at Today's Spot Price</h2><p>All GoldBuller products are priced transparently above the live spot price. No hidden fees.</p><a href="${SITE_URL}/gold" class="ssr-cta-btn">Browse Gold Bullion →</a></div>`
  },
  {
    slug: "troy-ounce", term: "Troy Ounce", shortDef: "The standard unit of weight for precious metals, equal to 31.1035 grams.", category: "Weights & Measures",
    related: ["spot-price", "fineness", "bullion"],
    body: `<p class="ssr-intro">A <strong>troy ounce</strong> (ozt) is the internationally accepted unit of measure for precious metals. It weighs <strong>31.1035 grams</strong> — approximately 10% heavier than the avoirdupois ounce (28.35 g) used for everyday items.</p>
<h2>Troy Weight Conversions</h2>
<div class="ssr-table-wrap"><table><thead><tr><th>Unit</th><th>Grams</th><th>Troy Ounces</th></tr></thead><tbody>
<tr><td>1 Troy Ounce</td><td>31.1035 g</td><td>1.000 ozt</td></tr>
<tr><td>1 Avoirdupois Ounce</td><td>28.3495 g</td><td>0.9115 ozt</td></tr>
<tr><td>1 Kilogram</td><td>1,000 g</td><td>32.1507 ozt</td></tr>
<tr><td>1 Troy Pound (12 ozt)</td><td>373.24 g</td><td>12.000 ozt</td></tr>
<tr><td>1 Pennyweight (dwt)</td><td>1.5552 g</td><td>0.0500 ozt</td></tr>
</tbody></table></div>
<h2>Common Bullion Weights</h2>
<ul>
  <li><strong>1/10 oz, 1/4 oz, 1/2 oz, 1 oz</strong> — Standard fractional and full gold coins (Eagles, Maples)</li>
  <li><strong>1 oz, 10 oz, 100 oz</strong> — Common silver bar sizes</li>
  <li><strong>1 oz, 10 oz, 1 kilo</strong> — Common gold bar sizes from major refiners</li>
  <li><strong>400 oz</strong> — London Good Delivery bar (institutional standard)</li>
</ul>`
  },
  { slug: "premium", term: "Premium Over Spot", shortDef: "The markup above the raw metal's spot price that dealers charge for finished bullion products.", category: "Pricing", related: ["spot-price", "bid-ask-spread", "bullion"], body: `<p class="ssr-intro">The <strong>premium over spot</strong> is the additional cost above the raw <a href="${SITE_URL}/learn/spot-price">spot price</a> that you pay when purchasing physical bullion. It compensates for minting, refining, fabrication, insurance, dealer overhead, and market making.</p><h2>What Drives Premium Size?</h2><ul><li><strong>Product type:</strong> Government-minted coins carry higher premiums than generic rounds or bars.</li><li><strong>Metal volume:</strong> Larger bars carry lower premiums per troy ounce.</li><li><strong>Market conditions:</strong> During supply shocks premiums can spike dramatically.</li><li><strong>Quantity purchased:</strong> Dealers lower premiums for larger orders. OTC purchases of 25+ oz gold typically qualify.</li></ul><h2>Calculating Your Total Cost</h2><p>If gold spot is $2,350/ozt and a 1 oz Gold Eagle carries a 6% premium: <strong>$2,350 × 1.06 = $2,491 per coin</strong>.</p><div class="ssr-cta"><h2>Transparent Pricing on Every Product</h2><p>Every GoldBuller listing shows the exact premium above spot. Large orders? Contact our <a href="${SITE_URL}/kyc" style="color:#c9a84c;">OTC desk</a> for volume pricing.</p><a href="${SITE_URL}/gold" class="ssr-cta-btn">View Current Premiums →</a></div>` },
  { slug: "fineness", term: "Fineness", shortDef: "The proportion of pure metal in an alloy, expressed as parts per thousand.", category: "Purity & Composition", related: ["karat", "assay", "bullion"], body: `<p class="ssr-intro"><strong>Fineness</strong> is the measure of precious metal purity expressed as parts per thousand. A gold bar with fineness .9999 contains 999.9 grams of pure gold per 1,000 grams.</p><h2>Common Fineness Standards</h2><div class="ssr-table-wrap"><table><thead><tr><th>Fineness</th><th>Purity</th><th>Common Products</th></tr></thead><tbody><tr><td>.9999</td><td>99.99%</td><td>Royal Canadian Mint Maples, PAMP Suisse bars</td></tr><tr><td>.999</td><td>99.9%</td><td>Most generic rounds and bars</td></tr><tr><td>.9167</td><td>91.67% (22K)</td><td>American Gold Eagles, Krugerrands</td></tr><tr><td>.900</td><td>90%</td><td>Pre-1965 US silver coins (junk silver)</td></tr></tbody></table></div>` },
  { slug: "bullion", term: "Bullion", shortDef: "Physical gold, silver, platinum, or palladium in bar or coin form, valued primarily by metal content.", category: "Basics", related: ["spot-price", "numismatic", "fineness"], body: `<p class="ssr-intro"><strong>Bullion</strong> refers to physical precious metals in refined form (bars, coins, or rounds) whose value is determined primarily by their metal content at the current <a href="${SITE_URL}/learn/spot-price">spot price</a>, not by rarity or collector demand.</p><h2>Forms of Bullion</h2><ul><li><strong>Bars:</strong> Cast or minted bars from accredited refiners. Lower premiums than coins. Ideal for large-scale storage.</li><li><strong>Government coins:</strong> Legal tender bullion coins — American Eagles, Maple Leafs, Krugerrands. Universally liquid worldwide.</li><li><strong>Rounds:</strong> Privately minted coin-shaped discs with no legal tender status. Lowest premiums of any coined form.</li></ul><h2>Why Investors Choose Physical Bullion</h2><p>Unlike ETFs or mining stocks, physical bullion carries no counterparty risk. You own the metal outright — it cannot default, go bankrupt, or be diluted.</p>` },
  { slug: "numismatic", term: "Numismatic Coins", shortDef: "Collectible coins valued by rarity, grade, and historical significance rather than metal content alone.", category: "Coin Types", related: ["bullion", "proof-coin", "assay"], body: `<p class="ssr-intro"><strong>Numismatic coins</strong> are collectible coins whose market value is driven primarily by rarity, condition, historical significance, and collector demand — rather than intrinsic metal value.</p><h2>Numismatic vs. Bullion</h2><div class="ssr-table-wrap"><table><thead><tr><th></th><th>Bullion Coins</th><th>Numismatic Coins</th></tr></thead><tbody><tr><td>Valuation</td><td>Metal spot + small premium</td><td>Collector/auction market</td></tr><tr><td>Liquidity</td><td>High — sell anywhere globally</td><td>Specialized dealers, auctions</td></tr><tr><td>Recommended for</td><td>Metal exposure, wealth preservation</td><td>Experienced collectors only</td></tr></tbody></table></div><p><strong>Warning:</strong> Some dealers market "semi-numismatic" coins to investors. Unless you have deep numismatic expertise, stick to standard bullion for investment purposes.</p>` },
  { slug: "gold-silver-ratio", term: "Gold-Silver Ratio", shortDef: "The number of silver ounces needed to buy one ounce of gold, used as a relative valuation signal.", category: "Market Analysis", related: ["spot-price", "troy-ounce", "bullion"], body: `<p class="ssr-intro">The <strong>gold-silver ratio</strong> tells you how many troy ounces of silver it takes to buy one troy ounce of gold at current spot prices.</p><h2>How to Calculate It</h2><p>Divide the gold spot price by the silver spot price. If gold is $2,350 and silver is $28.50: <strong>2,350 ÷ 28.50 = 82.5</strong>.</p><h2>Historical Range</h2><ul><li><strong>Ancient Rome:</strong> 12:1 to 16:1</li><li><strong>20th century average:</strong> ~47:1</li><li><strong>March 2020 (COVID panic):</strong> ~125:1 — extreme outlier</li><li><strong>Recent range (2022–2025):</strong> 75:1 to 95:1</li></ul><div class="ssr-cta"><h2>See Live Gold &amp; Silver Prices</h2><p>Track the current gold-silver ratio on our live charts page.</p><a href="${SITE_URL}/charts" class="ssr-cta-btn">View Live Charts →</a></div>` },
  { slug: "assay", term: "Assay Certificate", shortDef: "An official document verifying the weight, purity, and authenticity of a precious metal product.", category: "Authentication", related: ["fineness", "bullion", "numismatic"], body: `<p class="ssr-intro">An <strong>assay certificate</strong> is an official document issued by the mint or refinery guaranteeing a bullion product's metal content, weight, purity, and serial number.</p><h2>What an Assay Typically Includes</h2><ul><li>Product name and description</li><li>Metal purity fineness</li><li>Gross and fine weight</li><li>Unique serial number matching the bar's engraved number</li><li>Refinery name, logo, and authentication signatures</li><li>Security features (holograms, QR codes)</li></ul><h2>Assayed vs. Non-Assayed Products</h2><p>Premium products from PAMP Suisse, Valcambi, Perth Mint, and the Royal Canadian Mint include proprietary assay packaging. Generic rounds and secondary market bars are sold without individual assay documentation.</p>` },
  { slug: "junk-silver", term: "Junk Silver", shortDef: "Pre-1965 US silver coins with 90% silver content, traded in bulk by face value as a low-premium silver source.", category: "Coin Types", related: ["bullion", "spot-price", "fineness"], body: `<p class="ssr-intro"><strong>Junk silver</strong> refers to pre-1965 US circulated silver coins (dimes, quarters, half dollars) that contain 90% silver. Despite the name, they are a legitimate low-premium silver investment.</p><h2>Silver Content of Common Junk Silver Coins</h2><div class="ssr-table-wrap"><table><thead><tr><th>Coin</th><th>Face Value</th><th>Silver Weight (ozt)</th></tr></thead><tbody><tr><td>Roosevelt Dime (pre-1965)</td><td>$0.10</td><td>0.07234</td></tr><tr><td>Washington Quarter (pre-1965)</td><td>$0.25</td><td>0.18084</td></tr><tr><td>Franklin Half (pre-1965)</td><td>$0.50</td><td>0.36169</td></tr><tr><td>Morgan/Peace Dollar</td><td>$1.00</td><td>0.77344</td></tr></tbody></table></div><p>A standard "$1,000 face value" bag contains approximately 715 troy ounces of silver.</p><div class="ssr-cta"><h2>Shop Junk Silver at GoldBuller</h2><p>Rolls and bags of 90% US silver coins at competitive premiums. Bitcoin accepted.</p><a href="${SITE_URL}/silver/junk-silver" class="ssr-cta-btn">Shop Junk Silver →</a></div>` },
  { slug: "american-gold-eagle", term: "American Gold Eagle", shortDef: "The official US gold bullion coin, minted since 1986, in 22-karat gold (.9167 fine).", category: "Products", related: ["bullion", "fineness", "legal-tender"], body: `<p class="ssr-intro">The <strong>American Gold Eagle</strong> is the official gold bullion coin of the United States, authorized by the Gold Bullion Coin Act of 1985 and first minted in 1986.</p><h2>Specifications</h2><div class="ssr-table-wrap"><table><thead><tr><th>Denomination</th><th>Gold Content</th><th>Total Weight</th></tr></thead><tbody><tr><td>$50 (1 oz)</td><td>1.000 ozt gold</td><td>1.0909 ozt</td></tr><tr><td>$25 (1/2 oz)</td><td>0.500 ozt gold</td><td>0.5455 ozt</td></tr><tr><td>$10 (1/4 oz)</td><td>0.250 ozt gold</td><td>0.2727 ozt</td></tr><tr><td>$5 (1/10 oz)</td><td>0.100 ozt gold</td><td>0.1091 ozt</td></tr></tbody></table></div><h2>Why American Gold Eagles Are the #1 Choice for US Investors</h2><ul><li><strong>IRA eligible</strong></li><li><strong>Legal tender</strong> — Backed by the US government</li><li><strong>Universal liquidity</strong> — Recognized by every US coin dealer</li><li><strong>35+ years of continuous mintage</strong> — Deep secondary market</li></ul><div class="ssr-cta"><h2>Buy American Gold Eagles</h2><a href="${SITE_URL}/gold?mint=us" class="ssr-cta-btn">Shop Gold Eagles →</a></div>` },
  { slug: "gold-ira", term: "Gold IRA", shortDef: "A self-directed IRA that holds physical gold and other approved precious metals as tax-advantaged retirement assets.", category: "Investing", related: ["bullion", "american-gold-eagle", "allocated-storage"], body: `<p class="ssr-intro">A <strong>Gold IRA</strong> is a specialized Individual Retirement Account that holds physical gold, silver, platinum, or palladium instead of stocks or bonds. It provides the same tax advantages as a traditional or Roth IRA.</p><h2>IRS-Approved Gold Products for IRAs</h2><ul><li>American Gold Eagles (all sizes) ✓</li><li>American Gold Buffalos (.9999) ✓</li><li>Canadian Gold Maple Leafs (.9999) ✓</li><li>Australian Gold Kangaroos (.9999) ✓</li><li>PAMP Suisse and Valcambi bars (.9999) ✓</li></ul><h2>2025 Contribution Limits</h2><ul><li>Traditional/Roth IRA: $7,000 ($8,000 if 50+)</li><li>SEP IRA: Up to 25% of compensation or $70,000</li></ul><div class="ssr-cta"><h2>Start a Gold IRA with GoldBuller</h2><a href="${SITE_URL}/ira" class="ssr-cta-btn">Learn About Gold IRAs →</a></div>` },
  { slug: "bid-ask-spread", term: "Bid-Ask Spread", shortDef: "The difference between the price a dealer will buy (bid) and sell (ask) a bullion product.", category: "Pricing", related: ["spot-price", "premium", "bullion"], body: `<p class="ssr-intro">The <strong>bid-ask spread</strong> is the difference between what a dealer will pay to buy (bid) your metal and what they charge to sell (ask) it to you.</p><h2>Typical Bid-Ask Spreads by Product</h2><div class="ssr-table-wrap"><table><thead><tr><th>Product</th><th>Typical Spread</th></tr></thead><tbody><tr><td>1 oz Gold Bar (major brand)</td><td>3% – 6%</td></tr><tr><td>American Gold Eagle (1 oz)</td><td>5% – 9%</td></tr><tr><td>American Silver Eagle (1 oz)</td><td>15% – 30%</td></tr><tr><td>Junk Silver ($1 face)</td><td>5% – 12%</td></tr></tbody></table></div>` },
  { slug: "karat", term: "Karat", shortDef: "A measure of gold purity where 24 karats equals 100% pure gold.", category: "Purity & Composition", related: ["fineness", "assay", "bullion"], body: `<p class="ssr-intro"><strong>Karat</strong> (K or kt) is the traditional unit for expressing gold purity. 24 karats (24K) represents 100% pure gold.</p><h2>Karat to Fineness Conversion</h2><div class="ssr-table-wrap"><table><thead><tr><th>Karat</th><th>Fineness</th><th>Pure Gold %</th><th>Common Uses</th></tr></thead><tbody><tr><td>24K</td><td>.999/.9999</td><td>99.9–99.99%</td><td>Bullion bars, Maple Leafs, Buffalo coins</td></tr><tr><td>22K</td><td>.9167</td><td>91.67%</td><td>American Gold Eagles, Krugerrands</td></tr><tr><td>18K</td><td>.750</td><td>75%</td><td>Fine jewelry (European standard)</td></tr><tr><td>14K</td><td>.585</td><td>58.5%</td><td>Jewelry (US standard)</td></tr></tbody></table></div>` },
  { slug: "monster-box", term: "Monster Box", shortDef: "A government mint's standard case of silver coins, typically holding 500 one-ounce coins in 25 tubes of 20.", category: "Products", related: ["american-gold-eagle", "bullion", "bid-ask-spread"], body: `<p class="ssr-intro">A <strong>monster box</strong> is the sealed, mint-fresh case that major government mints use to ship silver bullion coins — typically 500 coins in 25 tubes of 20.</p><h2>Common Monster Box Specifications</h2><div class="ssr-table-wrap"><table><thead><tr><th>Coin</th><th>Coins per Box</th><th>Silver Content</th></tr></thead><tbody><tr><td>American Silver Eagle</td><td>500</td><td>500 ozt</td></tr><tr><td>Canadian Silver Maple Leaf</td><td>500</td><td>500 ozt</td></tr><tr><td>Australian Silver Kangaroo</td><td>250</td><td>250 ozt</td></tr></tbody></table></div><h2>Why Buy a Monster Box?</h2><p>Monster boxes represent the lowest per-coin premium on government bullion coins. Buying 500 Silver Eagles in a sealed monster box typically costs $0.50–$1.50 less per coin than buying tubes or singles.</p>` },
  { slug: "proof-coin", term: "Proof Coin", shortDef: "A specially struck collectible coin made with polished dies on hand-selected planchets, producing a mirror-like finish.", category: "Coin Types", related: ["numismatic", "bullion", "american-gold-eagle"], body: `<p class="ssr-intro">A <strong>proof coin</strong> is a specially manufactured coin struck using polished dies on carefully selected planchets to produce the highest-quality finish possible.</p><h2>Proof vs. Bullion vs. Uncirculated</h2><div class="ssr-table-wrap"><table><thead><tr><th>Type</th><th>Finish</th><th>Premium Level</th></tr></thead><tbody><tr><td>Proof</td><td>Mirror/Frosted contrast</td><td>Highest (30–100%+ over spot)</td></tr><tr><td>Burnished/Uncirculated</td><td>Satin/Matte</td><td>High (20–40% over spot)</td></tr><tr><td>Bullion</td><td>Standard strike</td><td>Low (3–20% over spot)</td></tr></tbody></table></div><p>Unless you are a collector, proof coins are generally not recommended for pure metal investment — you pay a large premium unlikely to be recovered at resale.</p>` },
  { slug: "legal-tender", term: "Legal Tender Face Value", shortDef: "The nominal dollar value stamped on government-issued bullion coins, far below their actual metal value.", category: "Basics", related: ["bullion", "american-gold-eagle", "numismatic"], body: `<p class="ssr-intro">Government-issued bullion coins carry a <strong>legal tender face value</strong> — a nominal dollar amount that gives it official monetary status. This face value is almost always a tiny fraction of the coin's actual metal value.</p><h2>Common Face Values vs. Market Value</h2><div class="ssr-table-wrap"><table><thead><tr><th>Coin</th><th>Legal Tender Face</th><th>Approximate Market Value</th></tr></thead><tbody><tr><td>American Gold Eagle (1 oz)</td><td>$50 USD</td><td>~$2,400+</td></tr><tr><td>American Silver Eagle (1 oz)</td><td>$1 USD</td><td>~$28–$35</td></tr><tr><td>Canadian Gold Maple Leaf (1 oz)</td><td>$50 CAD</td><td>~$2,400+ USD</td></tr></tbody></table></div><p>Never judge a bullion coin's value by its face value — always calculate based on pure metal content at current spot prices.</p>` },
  { slug: "allocated-storage", term: "Allocated Storage", shortDef: "A precious metals storage arrangement where specific, serialized bars or coins are assigned exclusively to one client.", category: "Storage", related: ["gold-ira", "bullion", "assay"], body: `<p class="ssr-intro">In <strong>allocated storage</strong>, specific bars or coins with individual serial numbers are assigned to you and kept physically separated from other clients' metal and the depository's own holdings.</p><h2>Allocated vs. Unallocated Storage</h2><div class="ssr-table-wrap"><table><thead><tr><th></th><th>Allocated</th><th>Unallocated</th></tr></thead><tbody><tr><td>Ownership</td><td>Specific, serialized pieces</td><td>Claim on a pool</td></tr><tr><td>Counterparty risk</td><td>None</td><td>Yes — if custodian fails, you're an unsecured creditor</td></tr><tr><td>Storage fee</td><td>Higher (0.1–0.5%/yr)</td><td>Lower or free</td></tr></tbody></table></div>` },
  { slug: "otc-desk", term: "OTC Desk", shortDef: "A private trading desk for large, negotiated precious metals transactions above standard retail thresholds.", category: "Trading", related: ["bid-ask-spread", "premium", "spot-price"], body: `<p class="ssr-intro">An <strong>OTC (Over-The-Counter) desk</strong> is a private, direct trading channel for large precious metals transactions — negotiated individually to secure pricing unavailable on public retail channels.</p><h2>When to Use an OTC Desk</h2><p>OTC desks make sense for transactions above $25,000+ in gold or 1,000+ troy ounces in silver. GoldBuller's OTC desk accepts Bitcoin for payment, enabling large, privacy-conscious purchases.</p><h2>KYC Requirements for OTC</h2><p>All GoldBuller OTC transactions require prior KYC verification — typically completed within 24–48 hours.</p><div class="ssr-cta"><h2>Access GoldBuller's OTC Desk</h2><p>Complete KYC verification to unlock volume pricing and Bitcoin payment on gold, silver, and platinum.</p><a href="${SITE_URL}/kyc" class="ssr-cta-btn">Start KYC Verification →</a></div>` },
  { slug: "basel-iii", term: "Basel III and Gold", shortDef: "International banking regulations that reclassified physical gold as a Tier 1 zero-risk-weight asset in 2021.", category: "Market Analysis", related: ["spot-price", "bullion", "otc-desk"], body: `<p class="ssr-intro"><strong>Basel III</strong> is the third iteration of international banking regulations. For precious metals, the most consequential change was the <strong>reclassification of physical gold as a Tier 1 zero-risk-weight asset</strong>, effective June 28, 2021.</p><h2>What Changed</h2><p>Before Basel III, physical gold held by banks was treated as a Tier 3 asset. After the reclassification, physical gold is now on par with cash and government bonds for bank capital purposes — potentially increasing institutional demand for physical metal.</p><h2>The NSFR Rule and Paper Gold</h2><p>Basel III also introduced the Net Stable Funding Ratio, which imposes additional costs on unallocated gold positions (paper gold, futures). This theoretically shifts institutional preference toward physical gold over paper gold instruments.</p>` },
];

// ─── Guides data ─────────────────────────────────────────────────────────────

const GUIDES = [
  { slug: "how-to-buy-gold-bullion", title: "How to Buy Gold Bullion: A Complete Beginner's Guide", meta: "Step-by-step guide to buying gold bullion — coins vs bars, how premiums work, where to buy safely, and how to store your gold after purchase.", readTime: "8 min read", tags: ["Gold", "Beginners"], body: `<p class="ssr-intro">Buying gold bullion for the first time can feel overwhelming — dozens of product types, confusing premiums, and concerns about authenticity. This guide cuts through the noise with a clear, step-by-step process.</p><h2>Step 1: Understand What You're Buying</h2><ul><li><strong>Government coins</strong> (American Gold Eagle, Canadian Maple Leaf, Krugerrand): Highest liquidity, widest recognition, higher premiums. Ideal if you plan to resell easily anywhere.</li><li><strong>Gold bars</strong> (PAMP, Valcambi, Engelhard): Lower premiums per ounce, easier to store efficiently. Ideal for prioritizing metal weight per dollar spent.</li></ul><h2>Step 2: Choose Your Size</h2><div class="ssr-table-wrap"><table><thead><tr><th>Product</th><th>Approx. Premium</th><th>Best For</th></tr></thead><tbody><tr><td>1 oz Gold Eagle / Maple</td><td>5–8% over spot</td><td>Most investors — best balance of liquidity and premium</td></tr><tr><td>1 oz Gold Bar (PAMP)</td><td>3–5% over spot</td><td>Cost-conscious investors</td></tr><tr><td>10 oz Gold Bar</td><td>2–3% over spot</td><td>Larger purchases</td></tr><tr><td>1 kilo Gold Bar</td><td>1–2% over spot</td><td>Institutional buyers via OTC</td></tr></tbody></table></div><h2>Step 3: Verify the Dealer</h2><ul><li>A+ BBB rating with no unresolved complaints</li><li>Transparent buyback prices published on-site</li><li>Verifiable physical address and phone number</li></ul><h2>Step 4: Choose Your Payment Method</h2><p>Bank wire and check are lowest-cost. Credit card adds 3–4%. GoldBuller accepts <strong>Bitcoin</strong> — ideal for privacy-conscious buyers.</p><h2>Step 5: Plan Your Storage Before You Buy</h2><ul><li><strong>Home safe:</strong> Immediate access, no fees. Use a bolted TL-15 rated safe.</li><li><strong>Bank safe deposit box:</strong> Low cost but NOT FDIC insured and has limited hours.</li><li><strong>Third-party depository:</strong> Fully insured, best for large holdings.</li></ul><div class="ssr-cta"><h2>Start Your Gold Stack Today</h2><p>GoldBuller offers American Gold Eagles, Canadian Maples, PAMP bars with transparent spot-based pricing and fast, insured shipping.</p><a href="${SITE_URL}/gold" class="ssr-cta-btn">Shop Gold Bullion →</a></div>` },
  { slug: "how-to-buy-silver-bullion", title: "How to Buy Silver Bullion: The Practical Investor's Guide", meta: "Everything you need to know about buying silver bullion — coins vs bars vs junk silver, where premiums are lowest, and how to store silver safely.", readTime: "7 min read", tags: ["Silver", "Beginners"], body: `<p class="ssr-intro">Silver is the most accessible precious metal for first-time investors. But the silver market has some unique quirks — wide premium swings and storage weight challenges — worth understanding before you buy.</p><h2>Your Silver Options, Ranked by Premium</h2><div class="ssr-table-wrap"><table><thead><tr><th>Product</th><th>Typical Premium</th><th>Best For</th></tr></thead><tbody><tr><td>Generic silver rounds (1 oz)</td><td>8–15%</td><td>Maximum silver for minimum premium</td></tr><tr><td>10 oz silver bars</td><td>6–10%</td><td>Efficient storage, low premium</td></tr><tr><td>Junk silver (90% coins)</td><td>5–12%</td><td>Small denomination barter flexibility</td></tr><tr><td>American Silver Eagles</td><td>18–30%</td><td>IRA eligibility, maximum liquidity</td></tr></tbody></table></div><h2>Storage Tip</h2><p>$5,000 in silver at $30/ozt is 166+ troy ounces — over 11 lbs. Plan your storage before you buy. Airtight tubes and a heavy safe are essential for larger quantities.</p><div class="ssr-cta"><h2>Buy Silver at Competitive Premiums</h2><p>Eagles, Maples, rounds, bars, and junk silver. Bitcoin payment accepted.</p><a href="${SITE_URL}/silver" class="ssr-cta-btn">Shop Silver Bullion →</a></div>` },
  { slug: "how-to-store-precious-metals", title: "How to Store Precious Metals Safely: Home, Bank & Vault Options", meta: "Complete guide to storing gold and silver safely — home safe selection, bank safe deposit box pros and cons, third-party vault storage, and insurance.", readTime: "6 min read", tags: ["Storage", "Security"], body: `<p class="ssr-intro">The single biggest mistake new precious metals buyers make is purchasing gold or silver without a clear storage plan. Here's an honest assessment of every realistic storage option.</p><h2>Option 1: Home Safe</h2><p><strong>Best for:</strong> Immediate access, amounts under $50,000, privacy-focused buyers.</p><ul><li><strong>UL Burglary rating TL-15 or TL-30:</strong> Tested against tool attacks for 15–30 minutes.</li><li><strong>Weight 500+ lbs:</strong> Dramatically harder to remove. Alternatively, bolt a lighter safe to concrete floor.</li></ul><h2>Option 2: Bank Safe Deposit Box</h2><p><strong>Critical limitation:</strong> Contents are NOT FDIC insured. Access is limited to banking hours. Use only as a complement to other storage.</p><h2>Option 3: Third-Party Depository</h2><p>Companies like Brinks, Loomis, and Delaware Depository offer full Lloyd's of London insurance, segregated storage, and regular independent audits. Annual fees: typically 0.1–0.5% of metal value.</p><h2>Home Insurance Warning</h2><p>Standard homeowner's insurance caps precious metals coverage at $1,000–$2,500. Purchase a specialized rider — expect 0.5–1% of insured value annually.</p>` },
  { slug: "gold-vs-silver-which-to-buy", title: "Gold vs. Silver: Which Precious Metal Should You Buy?", meta: "Gold vs silver comparison for investors — premium costs, storage, volatility, industrial demand, and which metal makes sense for your goals.", readTime: "6 min read", tags: ["Gold", "Silver", "Comparison"], body: `<p class="ssr-intro">The gold vs. silver question is the most common one new precious metals buyers ask. The honest answer: they serve different purposes and the best choice depends on your budget, goals, and storage capacity.</p><h2>The Core Case for Gold</h2><ul><li><strong>Store of value over millennia</strong></li><li><strong>Compact wealth storage:</strong> $100,000 in gold at $2,300/ozt weighs ~3 lbs. The same value in silver weighs ~237 lbs.</li><li><strong>Lower premiums</strong> as a % of spot</li><li><strong>Better volatility profile</strong></li></ul><h2>The Core Case for Silver</h2><ul><li><strong>Lower entry point:</strong> Under $35 per coin vs. $2,400+ for gold</li><li><strong>Industrial demand tailwind:</strong> Solar panels, EV batteries, 5G, medical devices</li><li><strong>Higher potential upside</strong> when the gold-silver ratio compresses</li></ul><h2>GoldBuller's Recommendation</h2><p>For most investors: start with gold for wealth preservation and add silver for upside exposure. A 70% gold / 30% silver allocation by value is a reasonable starting point.</p><div class="ssr-cta"><h2>Browse Both Metals</h2><a href="${SITE_URL}/gold" class="ssr-cta-btn">Shop Gold →</a><a href="${SITE_URL}/silver" class="ssr-cta-btn" style="margin-left:1rem;">Shop Silver →</a></div>` },
  { slug: "precious-metals-ira-guide", title: "Precious Metals IRA Guide: How to Add Gold to Your Retirement Account", meta: "Complete guide to Gold IRAs — how they work, IRS-approved metals, custodian selection, rollover process, and distribution rules.", readTime: "9 min read", tags: ["Gold IRA", "Retirement"], body: `<p class="ssr-intro">A Gold IRA lets you hold physical precious metals inside a tax-advantaged retirement account, combining the wealth-preserving properties of gold with the same tax benefits as a traditional or Roth IRA.</p><h2>The Three-Party Structure</h2><ol><li><strong>SDIRA Custodian:</strong> IRS-regulated institution that holds the account (e.g., Equity Trust, STRATA Trust).</li><li><strong>Precious Metals Dealer:</strong> The company that sources your bullion (like GoldBuller).</li><li><strong>Approved Depository:</strong> The IRS-mandated vault where metals are physically stored.</li></ol><h2>IRS-Approved Gold Products</h2><ul><li>American Gold Eagles (all sizes) — .9167 fine, specifically exempted by statute ✓</li><li>American Gold Buffalos — .9999 fine ✓</li><li>Canadian Gold Maple Leafs — .9999 fine ✓</li><li>PAMP Suisse and Valcambi Bars — .9999 fine ✓</li></ul><h2>Funding via Rollover</h2><ul><li><strong>Direct transfer:</strong> Custodian-to-custodian. Safest — no tax withholding, no deadline.</li><li><strong>60-day rollover:</strong> You receive a check and must deposit within 60 days to avoid taxes + 10% penalty.</li></ul>` },
  { slug: "buying-gold-coins-vs-bars", title: "Gold Coins vs. Gold Bars: Which Is the Better Investment?", meta: "Gold coins vs gold bars — a detailed comparison of premiums, liquidity, storage, IRA eligibility, and resale value.", readTime: "5 min read", tags: ["Gold", "Comparison"], body: `<p class="ssr-intro">Coins or bars — the most common tactical question in gold investing. Both are legitimate, but they have meaningful differences in premium costs, liquidity, and IRA eligibility.</p><h2>Cost Comparison: Premium Over Spot</h2><div class="ssr-table-wrap"><table><thead><tr><th>Product</th><th>Size</th><th>Typical Premium</th></tr></thead><tbody><tr><td>American Gold Eagle</td><td>1 oz</td><td>5–8% over spot</td></tr><tr><td>PAMP Suisse Bar (assayed)</td><td>1 oz</td><td>3–5% over spot</td></tr><tr><td>PAMP Suisse Bar</td><td>10 oz</td><td>2–3% over spot</td></tr><tr><td>Gold Bar</td><td>1 kilo</td><td>1–2% over spot</td></tr></tbody></table></div><h2>The Verdict</h2><ul><li><strong>Choose coins if:</strong> You prioritize maximum liquidity and IRA flexibility.</li><li><strong>Choose bars if:</strong> You prioritize lowest premium and plan to hold long-term.</li><li><strong>Best strategy:</strong> Many serious investors hold both.</li></ul>` },
  { slug: "bitcoin-vs-gold-investment", title: "Bitcoin vs. Gold: Two Stores of Value Compared", meta: "Bitcoin vs gold — scarcity, volatility, custody, liquidity, regulatory risk, and how they fit in the same portfolio.", readTime: "7 min read", tags: ["Bitcoin", "Gold", "Comparison"], body: `<p class="ssr-intro">Gold has stored value for 5,000 years. Bitcoin has existed since 2009. Both are positioned as "stores of value" — but they have fundamentally different risk profiles and custody requirements.</p><h2>Key Differences</h2><div class="ssr-table-wrap"><table><thead><tr><th></th><th>Gold</th><th>Bitcoin</th></tr></thead><tbody><tr><td>Track record</td><td>5,000+ years</td><td>15 years</td></tr><tr><td>Annual volatility</td><td>15–20%</td><td>50–100%+</td></tr><tr><td>Custody complexity</td><td>Simple (physical possession)</td><td>Moderate (seed phrase security)</td></tr><tr><td>Regulatory risk</td><td>Low</td><td>Higher (framework still evolving)</td></tr></tbody></table></div><h2>Complementary, Not Competing</h2><p>Many sophisticated investors hold both. A portfolio with 5–10% in gold and 1–5% in Bitcoin covers both bases without excessive risk from either.</p><div class="ssr-cta"><h2>Buy Gold with Bitcoin</h2><p>Use your Bitcoin to acquire physical gold and silver. KYC verification required.</p><a href="${SITE_URL}/kyc" class="ssr-cta-btn">Start KYC Verification →</a></div>` },
  { slug: "sell-gold-bullion-guide", title: "How to Sell Gold Bullion: Getting the Best Price When You Sell", meta: "How to sell gold bullion — dealer buybacks vs private sales vs auction, how to avoid getting lowballed, and what affects the price you receive.", readTime: "5 min read", tags: ["Selling", "Gold", "Silver"], body: `<p class="ssr-intro">Selling precious metals is straightforward — but getting the best price requires understanding your options. Most sellers leave 5–15% on the table by defaulting to the first offer.</p><h2>Option 1: Sell Back to a Dealer (Quickest)</h2><p>Most bullion dealers buy back at or slightly below spot. American Eagles and Maple Leafs get closer-to-spot buybacks than obscure foreign coins.</p><h2>Option 2: Peer-to-Peer Sale (Best Price)</h2><p>Selling directly to another buyer typically gets 1–3% above dealer buyback. Legitimate venues: r/Pmsforsale (Reddit), eBay (fees apply), local coin shows.</p><h2>Mistakes to Avoid</h2><ul><li><strong>Pawn shops:</strong> Typically pay 50–70% of melt value. Avoid.</li><li><strong>Cash-for-gold stores:</strong> Structured to pay as little as possible.</li><li><strong>Not knowing current spot:</strong> Check live spot before any negotiation — view prices at <a href="${SITE_URL}/charts">our live charts</a>.</li></ul>` },
  { slug: "precious-metals-portfolio-allocation", title: "How Much of Your Portfolio Should Be in Precious Metals?", meta: "Evidence-based guide to precious metals portfolio allocation — what percentage in gold and silver makes sense, and when to rebalance.", readTime: "6 min read", tags: ["Strategy", "Portfolio"], body: `<p class="ssr-intro">There is no single "correct" allocation to precious metals. The right percentage depends on your existing portfolio, risk tolerance, time horizon, and what role you want metals to play.</p><h2>Allocation Frameworks</h2><div class="ssr-table-wrap"><table><thead><tr><th>Investor / Framework</th><th>Gold Allocation</th><th>Rationale</th></tr></thead><tbody><tr><td>Ray Dalio / All Weather</td><td>~7.5%</td><td>Risk parity; gold balances inflationary risk</td></tr><tr><td>Permanent Portfolio</td><td>25%</td><td>Equal weight: stocks, gold, bonds, cash</td></tr><tr><td>Conservative individual investor</td><td>5–10%</td><td>Crisis hedge without excessive drag</td></tr></tbody></table></div><h2>The 5–15% Starting Point</h2><p>Most advisors who include precious metals recommend 5–15% of a total investment portfolio. Below 5%, the position is too small to matter during a crisis. Above 15%, you're making an active macro bet.</p><h2>Within Precious Metals: Gold vs. Silver Split</h2><p>A common starting split is <strong>70% gold / 30% silver by value</strong>. Adjust based on storage capacity and risk tolerance.</p>` },
  { slug: "junk-silver-beginners-guide", title: "Junk Silver: The Beginner's Guide to 90% US Silver Coins", meta: "Complete guide to buying junk silver — what it is, which coins contain silver, how to calculate silver content, current premiums, and why starters love it.", readTime: "6 min read", tags: ["Silver", "Junk Silver", "Beginners"], body: `<p class="ssr-intro">"Junk silver" sounds unappealing, but it's one of the smartest entry points into precious metals. Pre-1965 US dimes, quarters, and half dollars contain 90% silver and can be purchased at some of the lowest premiums in the silver market.</p><h2>Which Coins Are Junk Silver?</h2><ul><li><strong>Roosevelt Dimes (1946–1964):</strong> 90% silver, 0.07234 troy oz each</li><li><strong>Washington Quarters (1932–1964):</strong> 90% silver, 0.18084 troy oz each</li><li><strong>Franklin/Walking Liberty Halves:</strong> 90% silver, 0.36169 troy oz each</li><li><strong>Kennedy Half Dollars 1965–1970:</strong> 40% silver (different calculation)</li></ul><h2>The $1 Face Calculation</h2><p>Every $1 in face value of 90% silver coins contains approximately <strong>0.715–0.723 troy ounces of silver</strong>. At $29/ozt spot: $1 face value = ~$20.74 melt value.</p><h2>How It's Sold</h2><ul><li>$100 face bags — ~71.5 ozt silver</li><li>$500 face bags</li><li>$1,000 face "monster bags" — ~715 ozt silver</li></ul><div class="ssr-cta"><h2>Shop Junk Silver at GoldBuller</h2><a href="${SITE_URL}/silver/junk-silver" class="ssr-cta-btn">Shop Junk Silver →</a></div>` },
];

// ─── Generators ──────────────────────────────────────────────────────────────

function writeFile(filePath, content) {
  mkdirSync(dirname(filePath), { recursive: true });
  writeFileSync(filePath, content, "utf8");
}

function buildGlossaryIndex() {
  const byCategory = {};
  for (const t of TERMS) {
    if (!byCategory[t.category]) byCategory[t.category] = [];
    byCategory[t.category].push(t);
  }
  const body = `
    <h1>Precious Metals Glossary</h1>
    <p class="ssr-intro">Every term you need to buy, sell, and store gold, silver, and platinum with confidence — defined clearly, without the jargon.</p>
    ${Object.entries(byCategory).map(([cat, terms]) => `
      <h2>${esc(cat)}</h2>
      <div class="ssr-card-grid">
        ${terms.map(t => `<div class="ssr-card-sm">
          <a href="/learn/${t.slug}">${esc(t.term)}</a>
          <p>${esc(t.shortDef)}</p>
        </div>`).join("")}
      </div>`).join("")}
    <div class="ssr-cta">
      <h2>Put Your Knowledge to Work</h2>
      <p>Browse GoldBuller's full selection of gold, silver, and platinum bullion — priced transparently above spot.</p>
      <a href="${SITE_URL}/gold" class="ssr-cta-btn">Shop Bullion →</a>
    </div>`;

  return shell({
    title: `Precious Metals Glossary — Gold, Silver & Platinum Terms | ${BRAND}`,
    description: "Complete glossary of precious metals investing terms. Learn about spot price, troy ounce, fineness, Gold IRA, bid-ask spread, and more — clearly defined.",
    canonical: `${SITE_URL}/learn`,
    schemaJson: JSON.stringify({ "@context": "https://schema.org", "@type": "DefinedTermSet", name: "GoldBuller Precious Metals Glossary", url: `${SITE_URL}/learn` }),
    breadcrumbs: null,
    body,
  });
}

function buildTermPage(term) {
  const related = TERMS.filter(t => term.related.includes(t.slug));
  const relatedHtml = related.length ? `<div class="ssr-related"><h2>Related Terms</h2><div class="ssr-card-grid">
    ${related.map(r => `<div class="ssr-card-sm"><a href="/learn/${r.slug}">${esc(r.term)}</a><p>${esc(r.shortDef)}</p></div>`).join("")}
  </div></div>` : "";

  const body = `
    <span class="ssr-tag">${esc(term.category)}</span>
    <h1>${esc(term.term)}</h1>
    ${term.body}
    ${relatedHtml}
    <div class="ssr-cta" style="margin-top:3rem;">
      <h2>Ready to Start Buying Precious Metals?</h2>
      <p>GoldBuller offers gold, silver, and platinum bullion with transparent pricing and fast, insured shipping. Bitcoin accepted.</p>
      <a href="${SITE_URL}/gold" class="ssr-cta-btn">Shop Gold Bullion →</a>
    </div>`;

  return shell({
    title: `${term.term} — Precious Metals Definition | ${BRAND} Glossary`,
    description: `${term.shortDef} Learn about ${term.term} and other precious metals terms in the GoldBuller glossary.`,
    canonical: `${SITE_URL}/learn/${term.slug}`,
    schemaJson: JSON.stringify({ "@context": "https://schema.org", "@type": "DefinedTerm", name: term.term, description: term.shortDef, url: `${SITE_URL}/learn/${term.slug}` }),
    breadcrumbs: [{ name: "Glossary", url: `${SITE_URL}/learn` }, { name: term.term, url: `${SITE_URL}/learn/${term.slug}` }],
    body,
  });
}

function buildGuidesIndex() {
  const body = `
    <h1>Precious Metals Buying Guides</h1>
    <p class="ssr-intro">Practical, research-backed guides on every aspect of buying, storing, and investing in gold and silver — written for real buyers, not just search engines.</p>
    <div class="ssr-card-grid">
      ${GUIDES.map(g => `<div class="ssr-card-sm">
        <a href="/guides/${g.slug}">${esc(g.title)}</a>
        <p style="margin-top:0.25rem;">${g.tags.map(t => `<span class="ssr-tag" style="font-size:0.7rem;">${esc(t)}</span>`).join("")}</p>
        <p style="color:#9ca3af;font-size:0.8rem;margin-top:0.5rem;">${esc(g.readTime)}</p>
      </div>`).join("")}
    </div>
    <div class="ssr-cta">
      <h2>Ready to Buy?</h2>
      <p>Browse GoldBuller's full inventory of gold and silver bullion with transparent, spot-based pricing.</p>
      <a href="${SITE_URL}/gold" class="ssr-cta-btn">Shop Gold Bullion →</a>
    </div>`;

  return shell({
    title: `Precious Metals Buying Guides — Gold, Silver & IRA | ${BRAND}`,
    description: "10 expert guides on buying gold and silver bullion — coins vs bars, storage, Gold IRA, junk silver, portfolio allocation, and more.",
    canonical: `${SITE_URL}/guides`,
    schemaJson: JSON.stringify({ "@context": "https://schema.org", "@type": "CollectionPage", name: "GoldBuller Buying Guides", url: `${SITE_URL}/guides` }),
    breadcrumbs: null,
    body,
  });
}

function buildGuidePage(guide) {
  const related = GUIDES.filter(g => g.slug !== guide.slug).slice(0, 3);
  const relatedHtml = related.length ? `<div class="ssr-related"><h2>More Buying Guides</h2><div class="ssr-card-grid">
    ${related.map(r => `<div class="ssr-card-sm"><a href="/guides/${r.slug}">${esc(r.title)}</a><p style="color:#9ca3af;font-size:0.8rem;">${esc(r.readTime)}</p></div>`).join("")}
  </div></div>` : "";

  const body = `
    ${guide.tags.map(t => `<span class="ssr-tag">${esc(t)}</span>`).join("")}
    <h1>${esc(guide.title)}</h1>
    <p style="color:#6b7280;font-size:0.875rem;margin-bottom:2rem;">${esc(guide.readTime)} &bull; GoldBuller Research</p>
    ${guide.body}
    ${relatedHtml}`;

  return shell({
    title: `${guide.title} | ${BRAND}`,
    description: guide.meta,
    canonical: `${SITE_URL}/guides/${guide.slug}`,
    schemaJson: JSON.stringify({ "@context": "https://schema.org", "@type": "Article", headline: guide.title, description: guide.meta, url: `${SITE_URL}/guides/${guide.slug}` }),
    breadcrumbs: [{ name: "Guides", url: `${SITE_URL}/guides` }, { name: guide.title, url: `${SITE_URL}/guides/${guide.slug}` }],
    body,
  });
}

// ─── Write all files ─────────────────────────────────────────────────────────

let count = 0;

// /learn/index.html
writeFile(join(publicDir, "learn", "index.html"), buildGlossaryIndex());
count++;

// /learn/[slug]/index.html
for (const term of TERMS) {
  writeFile(join(publicDir, "learn", term.slug, "index.html"), buildTermPage(term));
  count++;
}

// /guides/index.html
writeFile(join(publicDir, "guides", "index.html"), buildGuidesIndex());
count++;

// /guides/[slug]/index.html
for (const guide of GUIDES) {
  writeFile(join(publicDir, "guides", guide.slug, "index.html"), buildGuidePage(guide));
  count++;
}

console.log(`✓ Generated ${count} static SEO pages into public/`);
