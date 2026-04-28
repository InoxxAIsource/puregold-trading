import { ssrHtmlShell, SITE_URL, BRAND } from "./ssrShared.js";

export interface GlossaryTerm {
  slug: string;
  term: string;
  shortDef: string;
  category: string;
  related: string[];
  body: string;
}

export const GLOSSARY_TERMS: GlossaryTerm[] = [
  {
    slug: "spot-price",
    term: "Spot Price",
    shortDef: "The current market price for immediate delivery of a precious metal.",
    category: "Pricing",
    related: ["premium", "bid-ask-spread", "troy-ounce"],
    body: `<p class="ssr-intro">The <strong>spot price</strong> is the real-time market price at which a precious metal can be bought or sold for immediate delivery. It is quoted in US dollars per troy ounce and changes continuously during market hours based on global supply and demand, currency movements, and macroeconomic events.</p>
<h2>How Spot Price Is Determined</h2>
<p>Spot prices are derived primarily from futures contracts trading on the COMEX (Commodity Exchange, a division of the CME Group) and the London Bullion Market Association (LBMA). The LBMA publishes twice-daily official gold fixes — an AM and PM fix — which serve as benchmarks for physical settlement of large institutional trades.</p>
<p>While futures contracts have expiry dates, the "spot" month contract (nearest to delivery) is used as the reference price for immediate physical transactions. Electronic trading runs nearly 24 hours a day, five days a week, so spot prices fluctuate continuously outside London and New York trading hours.</p>
<h2>Spot Price vs. What You Actually Pay</h2>
<p>The spot price is not the price you pay for a gold coin or silver bar. When you purchase bullion from a dealer like GoldBuller, the final price includes a <a href="${SITE_URL}/learn/premium">dealer premium</a> added on top of spot. This premium covers minting costs, fabrication, insurance, storage, logistics, and the dealer's operating margin.</p>
<div class="ssr-table-wrap">
  <table>
    <thead><tr><th>Product Type</th><th>Typical Premium Over Spot</th></tr></thead>
    <tbody>
      <tr><td>1 oz Gold Bars (major brands)</td><td>2% – 5%</td></tr>
      <tr><td>American Gold Eagles (1 oz)</td><td>5% – 8%</td></tr>
      <tr><td>1 oz Silver Rounds</td><td>8% – 15%</td></tr>
      <tr><td>American Silver Eagles</td><td>15% – 30%</td></tr>
      <tr><td>Junk Silver (90% coins)</td><td>0% – 10%</td></tr>
    </tbody>
  </table>
</div>
<h2>What Moves the Spot Price?</h2>
<ul>
  <li><strong>US Dollar strength:</strong> Gold is priced in USD, so a stronger dollar typically pushes spot lower (and vice versa).</li>
  <li><strong>Real interest rates:</strong> When real yields rise, the opportunity cost of holding non-yielding gold rises — spot tends to fall. When real yields fall, gold becomes more attractive.</li>
  <li><strong>Inflation expectations:</strong> Gold is widely used as an inflation hedge. Rising CPI expectations tend to push spot higher.</li>
  <li><strong>Geopolitical risk:</strong> Wars, sanctions, and financial crises historically trigger "flight to safety" buying, lifting spot.</li>
  <li><strong>Central bank purchases:</strong> Emerging market central banks (China, India, Turkey, Poland) have been aggressive net buyers since 2022, providing sustained spot price support.</li>
</ul>
<h2>Tracking Live Spot Prices</h2>
<p>GoldBuller displays live spot prices for gold, silver, and platinum on our <a href="${SITE_URL}/charts">Live Charts page</a>. Prices update every 30 seconds during active trading hours. You can also view historical price charts going back decades to understand long-term trends.</p>
<div class="ssr-cta">
  <h2>Shop at Today's Spot Price</h2>
  <p>All GoldBuller products are priced transparently above the live spot price. No hidden fees, no surprise markups at checkout.</p>
  <a href="${SITE_URL}/gold" class="ssr-cta-btn">Browse Gold Bullion →</a>
</div>`,
  },
  {
    slug: "troy-ounce",
    term: "Troy Ounce",
    shortDef: "The standard unit of weight for precious metals, equal to 31.1035 grams.",
    category: "Weights & Measures",
    related: ["spot-price", "fineness", "bullion"],
    body: `<p class="ssr-intro">A <strong>troy ounce</strong> (abbreviated <em>ozt</em> or <em>t oz</em>) is the internationally accepted unit of measure for precious metals. It weighs <strong>31.1035 grams</strong> — approximately 10% heavier than the avoirdupois ounce (28.35 g) used for everyday items like food.</p>
<h2>Why Precious Metals Use Troy Ounces</h2>
<p>The troy weight system dates to medieval European trade, likely originating in Troyes, France — a major trading city where English merchants conducted business. The system was formally codified in England in the 15th century and became the global standard for precious metals pricing, a convention that persists today across COMEX, LBMA, and every major bullion exchange worldwide.</p>
<h2>Troy Weight Conversions</h2>
<div class="ssr-table-wrap">
  <table>
    <thead><tr><th>Unit</th><th>Grams</th><th>Troy Ounces</th></tr></thead>
    <tbody>
      <tr><td>1 Troy Ounce</td><td>31.1035 g</td><td>1.000 ozt</td></tr>
      <tr><td>1 Avoirdupois Ounce</td><td>28.3495 g</td><td>0.9115 ozt</td></tr>
      <tr><td>1 Kilogram</td><td>1,000 g</td><td>32.1507 ozt</td></tr>
      <tr><td>1 Troy Pound (12 ozt)</td><td>373.24 g</td><td>12.000 ozt</td></tr>
      <tr><td>1 Pennyweight (dwt)</td><td>1.5552 g</td><td>0.0500 ozt</td></tr>
      <tr><td>1 Grain</td><td>0.0648 g</td><td>0.00208 ozt</td></tr>
    </tbody>
  </table>
</div>
<h2>How Troy Ounces Affect Bullion Pricing</h2>
<p>All spot prices — gold, silver, platinum, palladium — are quoted per troy ounce. When you see "gold at $2,300 per ounce," that figure refers to a troy ounce. A 100-gram gold bar weighs 3.215 troy ounces, so at $2,300/ozt spot, its melt value would be approximately $7,395 before any premium.</p>
<p>Understanding troy weight is especially important when comparing products from different countries. Canadian Maple Leafs, Australian Kangaroos, Austrian Philharmonics, and South African Krugerrands all weigh exactly 1 troy ounce of gold despite being different coins from different mints.</p>
<h2>Common Bullion Weights</h2>
<ul>
  <li><strong>1/10 oz, 1/4 oz, 1/2 oz, 1 oz</strong> — Standard fractional and full gold coins (Eagles, Maples)</li>
  <li><strong>1 oz, 10 oz, 100 oz</strong> — Common silver bar sizes</li>
  <li><strong>1 oz, 10 oz, 1 kilo</strong> — Common gold bar sizes from major refiners (PAMP, Valcambi, Perth Mint)</li>
  <li><strong>400 oz</strong> — London Good Delivery bar (institutional standard, ~27.5 lbs)</li>
</ul>`,
  },
  {
    slug: "premium",
    term: "Premium Over Spot",
    shortDef: "The markup above the raw metal's spot price that dealers charge for finished bullion products.",
    category: "Pricing",
    related: ["spot-price", "bid-ask-spread", "bullion"],
    body: `<p class="ssr-intro">The <strong>premium over spot</strong> is the additional cost above the raw <a href="${SITE_URL}/learn/spot-price">spot price</a> that you pay when purchasing physical bullion. It compensates for minting, refining, fabrication, insurance, dealer overhead, and market making.</p>
<h2>What Drives Premium Size?</h2>
<ul>
  <li><strong>Product type:</strong> Government-minted coins (American Eagles, Canadian Maples) carry higher premiums than generic rounds or bars due to their legal tender status, security features, and collector demand.</li>
  <li><strong>Metal volume:</strong> Larger bars carry lower premiums per troy ounce. A 1 oz gold bar commands 3–5% over spot; a 1-kilo bar may be 1–2% over spot.</li>
  <li><strong>Market conditions:</strong> During supply shocks (like the 2020 COVID panic), premiums on silver eagles spiked above 50% over spot due to mint production constraints and surging retail demand.</li>
  <li><strong>Quantity purchased:</strong> Dealers typically lower premiums for larger orders. OTC desk purchases of 25+ oz gold or 1,000+ oz silver often qualify for reduced premiums at GoldBuller.</li>
</ul>
<h2>Calculating Your Total Cost</h2>
<p>If gold spot is $2,350 per troy ounce and a 1 oz American Gold Eagle carries a 6% premium, your purchase price would be: <strong>$2,350 × 1.06 = $2,491 per coin</strong>.</p>
<h2>Why Premiums Matter for Resale</h2>
<p>When you sell, most dealers buy back at or near spot — meaning the premium you paid is largely unrecoverable unless spot has risen enough to cover it. Buyers focused on maximizing melt value prefer low-premium products (bars, rounds) while collectors and those seeking liquid, universally recognized products accept higher premiums on coins.</p>
<div class="ssr-cta">
  <h2>Transparent Pricing on Every Product</h2>
  <p>Every GoldBuller listing shows the exact premium above spot so you can compare fairly. Large orders? Contact our <a href="${SITE_URL}/otc" style="color:#c9a84c;">OTC desk</a> for volume pricing.</p>
  <a href="${SITE_URL}/gold" class="ssr-cta-btn">View Current Premiums →</a>
</div>`,
  },
  {
    slug: "fineness",
    term: "Fineness",
    shortDef: "The proportion of pure metal in an alloy, expressed as parts per thousand.",
    category: "Purity & Composition",
    related: ["karat", "assay", "bullion"],
    body: `<p class="ssr-intro"><strong>Fineness</strong> is the measure of precious metal purity expressed as parts per thousand. A gold bar with fineness .9999 contains 999.9 grams of pure gold per 1,000 grams — what the industry calls "four nines" purity.</p>
<h2>Common Fineness Standards</h2>
<div class="ssr-table-wrap">
  <table>
    <thead><tr><th>Fineness</th><th>Purity</th><th>Common Products</th></tr></thead>
    <tbody>
      <tr><td>.9999 (4 nines)</td><td>99.99%</td><td>Royal Canadian Mint Maples, PAMP Suisse bars, Perth Mint bars</td></tr>
      <tr><td>.999 (3 nines)</td><td>99.9%</td><td>Most generic gold and silver rounds and bars</td></tr>
      <tr><td>.9167</td><td>91.67% (22 karat)</td><td>American Gold Eagles, South African Krugerrands</td></tr>
      <tr><td>.900</td><td>90%</td><td>Pre-1965 US silver coins (junk silver), older US gold coins</td></tr>
      <tr><td>.800</td><td>80%</td><td>Some European silver coins</td></tr>
    </tbody>
  </table>
</div>
<h2>Does Lower Fineness Mean Lower Value?</h2>
<p>Not necessarily. American Gold Eagles are .9167 fine (22 karat) but contain exactly 1 troy ounce of pure gold — the remaining 8.33% is copper and silver alloy added for durability. You still get 1 ozt of gold. The spot price calculation is based on the pure gold content, not the total coin weight.</p>
<p>Krugerrands work the same way: .9167 fine, 1 ozt pure gold total weight, but the coin itself weighs 1.0909 ozt because of the copper alloy.</p>
<h2>Four Nines vs. Five Nines</h2>
<p>Some mints produce .99999 (five nines, 99.999%) coins — the Royal Canadian Mint's 99999 Maple Leaf series is the most famous example. These carry higher premiums and are primarily collector items. For investment bullion, .9999 is the standard ceiling — the additional 0.009% purity difference has no practical investment significance.</p>`,
  },
  {
    slug: "bullion",
    term: "Bullion",
    shortDef: "Physical gold, silver, platinum, or palladium in bar or coin form, valued primarily by metal content.",
    category: "Basics",
    related: ["spot-price", "numismatic", "fineness"],
    body: `<p class="ssr-intro"><strong>Bullion</strong> refers to physical precious metals — gold, silver, platinum, or palladium — in refined form (bars, coins, or rounds) whose value is determined primarily by their metal content at the current <a href="${SITE_URL}/learn/spot-price">spot price</a>, not by rarity, age, or collector demand.</p>
<h2>Bullion vs. Numismatic Coins</h2>
<p>The key distinction in precious metals investing is between bullion and <a href="${SITE_URL}/learn/numismatic">numismatic coins</a>. Bullion is priced near spot; numismatic coins trade based on rarity, grade, historical significance, and collector demand — sometimes commanding premiums of 10× or more over their metal value.</p>
<p>For investors seeking metal exposure and liquidity, bullion is typically the correct choice. A 2024 American Gold Eagle is a bullion coin — its value tracks gold spot. A 1799 US $10 Gold Eagle in MS-65 grade is a numismatic coin — its value is driven by the rare coin market, not gold futures.</p>
<h2>Forms of Bullion</h2>
<ul>
  <li><strong>Bars:</strong> Cast or minted bars from accredited refiners (PAMP, Valcambi, Engelhard, Johnson Matthey). Lower premiums than coins. Ideal for large-scale storage.</li>
  <li><strong>Government coins:</strong> Legal tender bullion coins minted by sovereign mints — American Eagles (US Mint), Maple Leafs (Royal Canadian Mint), Krugerrands (South African Mint). Universally liquid worldwide.</li>
  <li><strong>Rounds:</strong> Privately minted, coin-shaped discs with no legal tender status. Lowest premiums of any coined form of bullion.</li>
</ul>
<h2>Why Investors Choose Physical Bullion</h2>
<p>Unlike ETFs (GLD, SLV) or mining stocks, physical bullion carries no counterparty risk. You own the metal outright — it cannot default, go bankrupt, or be diluted. It has been recognized as a store of value across every major civilization for over 5,000 years.</p>`,
  },
  {
    slug: "numismatic",
    term: "Numismatic Coins",
    shortDef: "Collectible coins valued by rarity, grade, and historical significance rather than metal content alone.",
    category: "Coin Types",
    related: ["bullion", "proof-coin", "assay"],
    body: `<p class="ssr-intro"><strong>Numismatic coins</strong> are collectible coins whose market value is driven primarily by rarity, condition (grade), historical significance, and collector demand — rather than the intrinsic metal value. A coin graded MS-65 may trade at 10–50× its melt value.</p>
<h2>Numismatic vs. Bullion: Key Differences</h2>
<div class="ssr-table-wrap">
  <table>
    <thead><tr><th></th><th>Bullion Coins</th><th>Numismatic Coins</th></tr></thead>
    <tbody>
      <tr><td>Valuation</td><td>Metal spot price + small premium</td><td>Collector/auction market price</td></tr>
      <tr><td>Liquidity</td><td>High — sell anywhere, globally</td><td>Specialized — rare coin dealers, auctions</td></tr>
      <tr><td>Research needed</td><td>Minimal — check spot</td><td>Extensive — grade, mintage, population reports</td></tr>
      <tr><td>Price transparency</td><td>Very high</td><td>Low — varies by buyer/seller knowledge</td></tr>
      <tr><td>Recommended for</td><td>Metal exposure, wealth preservation</td><td>Experienced collectors with deep knowledge</td></tr>
    </tbody>
  </table>
</div>
<h2>The Grading Scale</h2>
<p>Numismatic value is heavily dependent on coin grade, determined by Professional Coin Grading Service (PCGS) or Numismatic Guaranty Corporation (NGC) on the Sheldon scale (1–70). MS-70 (Mint State perfect) is the theoretical maximum. A coin graded MS-63 and the same date graded MS-65 can differ by thousands of dollars.</p>
<p><strong>Important warning:</strong> Some dealers market "semi-numismatic" or "rare" coins to investors as inflation hedges. These typically carry premiums far above their actual collector value. Unless you have deep numismatic expertise, stick to standard bullion coins and bars for investment purposes.</p>`,
  },
  {
    slug: "gold-silver-ratio",
    term: "Gold-Silver Ratio",
    shortDef: "The number of silver ounces needed to buy one ounce of gold, used as a relative valuation signal.",
    category: "Market Analysis",
    related: ["spot-price", "troy-ounce", "bullion"],
    body: `<p class="ssr-intro">The <strong>gold-silver ratio</strong> tells you how many troy ounces of silver it takes to buy one troy ounce of gold at current spot prices. It is one of the oldest and most closely watched metrics in precious metals markets.</p>
<h2>How to Calculate It</h2>
<p>Simply divide the gold spot price by the silver spot price. If gold trades at $2,350/ozt and silver at $28.50/ozt, the ratio is <strong>2,350 ÷ 28.50 = 82.5</strong>. That means you need 82.5 ounces of silver to buy one ounce of gold.</p>
<h2>Historical Context</h2>
<p>The ratio has ranged dramatically over history:</p>
<ul>
  <li><strong>Ancient Rome and historical bimetallism:</strong> 12:1 to 16:1 — silver was relatively scarce and valued closer to gold.</li>
  <li><strong>20th century average:</strong> Approximately 47:1.</li>
  <li><strong>March 2020 (COVID panic):</strong> Spiked to ~125:1 — an extreme outlier driven by industrial silver demand collapse and gold safe-haven buying.</li>
  <li><strong>Recent range (2022–2025):</strong> 75:1 to 95:1.</li>
</ul>
<h2>How Investors Use the Ratio</h2>
<p>A high ratio (80+) suggests silver is historically cheap relative to gold — some investors "trade the ratio" by holding silver expecting it to outperform gold when the ratio compresses. A low ratio (50 or below) suggests silver is historically expensive relative to gold.</p>
<p>The ratio is a relative valuation tool, not a standalone buy/sell signal. Silver has higher industrial demand correlation (solar panels, electronics) and can behave differently from gold during risk-off episodes.</p>
<div class="ssr-cta">
  <h2>See Live Gold &amp; Silver Prices</h2>
  <p>Track the current gold-silver ratio and both spot prices on our live charts page.</p>
  <a href="${SITE_URL}/charts" class="ssr-cta-btn">View Live Charts →</a>
</div>`,
  },
  {
    slug: "assay",
    term: "Assay Certificate",
    shortDef: "An official document verifying the weight, purity, and authenticity of a precious metal product.",
    category: "Authentication",
    related: ["fineness", "bullion", "numismatic"],
    body: `<p class="ssr-intro">An <strong>assay certificate</strong> (or assay card) is an official document issued by the mint or refinery guaranteeing a bullion product's metal content, weight, purity, and serial number. Most premium minted bars come in tamper-evident sealed assay packaging.</p>
<h2>What an Assay Typically Includes</h2>
<ul>
  <li>Product name and description (e.g., "1 Troy Ounce Gold Bar")</li>
  <li>Metal purity fineness (e.g., .9999 fine gold)</li>
  <li>Gross and fine weight</li>
  <li>Unique serial number matching the bar's laser-engraved number</li>
  <li>Refinery name, logo, and authentication signatures</li>
  <li>Security features (holograms, barcodes, QR codes for digital verification)</li>
</ul>
<h2>Assayed vs. Non-Assayed Products</h2>
<p>Not all bullion comes assay-certified. Generic rounds, secondary market bars, and junk silver coins are sold without individual assay documentation. They are still genuine precious metal but rely on the dealer's testing and reputation rather than a mint's guarantee. Premium products from PAMP Suisse, Valcambi, Perth Mint, and the Royal Canadian Mint include proprietary assay packaging.</p>
<h2>Should You Pay Extra for Assay-Packaged Bars?</h2>
<p>Assay packaging typically adds $5–$20 to the premium of a gold bar compared to a "secondary market" bar of equivalent purity. The assay card makes resale easier (especially internationally) and removes any authenticity doubts at time of sale. For large purchases, the modest extra premium is usually worth the peace of mind and improved liquidity.</p>`,
  },
  {
    slug: "junk-silver",
    term: "Junk Silver",
    shortDef: "Pre-1965 US silver coins with 90% silver content, traded in bulk by face value as a low-premium silver source.",
    category: "Coin Types",
    related: ["bullion", "spot-price", "fineness"],
    body: `<p class="ssr-intro"><strong>Junk silver</strong> refers to pre-1965 US circulated silver coins (dimes, quarters, half dollars) that contain 90% silver and 10% copper. Despite the derogatory name, they are a legitimate and popular low-premium silver investment vehicle — especially for small-denomination barter scenarios.</p>
<h2>Why "Junk"?</h2>
<p>The term "junk" simply means no numismatic or collector value — these coins are too common and too worn to interest coin collectors. They trade purely on silver content. Most junk silver bags contain heavily circulated Roosevelts, Washington quarters, and Franklin or Walking Liberty halves dated 1964 or earlier.</p>
<h2>Silver Content of Common Junk Silver Coins</h2>
<div class="ssr-table-wrap">
  <table>
    <thead><tr><th>Coin</th><th>Face Value</th><th>Silver Weight (ozt)</th><th>$1 Face = Silver ozt</th></tr></thead>
    <tbody>
      <tr><td>Roosevelt Dime (pre-1965)</td><td>$0.10</td><td>0.07234</td><td>0.7234</td></tr>
      <tr><td>Washington Quarter (pre-1965)</td><td>$0.25</td><td>0.18084</td><td>0.7234</td></tr>
      <tr><td>Franklin/Walking Liberty Half (pre-1965)</td><td>$0.50</td><td>0.36169</td><td>0.7234</td></tr>
      <tr><td>Morgan/Peace Dollar (pre-1936)</td><td>$1.00</td><td>0.77344</td><td>0.77344</td></tr>
    </tbody>
  </table>
</div>
<p>A standard "$1,000 face value" bag of 90% silver coins contains approximately 715 troy ounces of silver (accounting for weight loss from wear).</p>
<h2>Why Buy Junk Silver?</h2>
<ul>
  <li><strong>Low premiums:</strong> Often the lowest-premium form of silver, especially in quantity.</li>
  <li><strong>Small denominations:</strong> Quarters and dimes are ideal for barter scenarios where smaller units matter.</li>
  <li><strong>Instant recognition:</strong> US government-issued coins are universally familiar.</li>
</ul>`,
  },
  {
    slug: "american-gold-eagle",
    term: "American Gold Eagle",
    shortDef: "The official US gold bullion coin, minted since 1986, in 22-karat gold (.9167 fine).",
    category: "Products",
    related: ["bullion", "fineness", "legal-tender"],
    body: `<p class="ssr-intro">The <strong>American Gold Eagle</strong> is the official gold bullion coin of the United States, authorized by the Gold Bullion Coin Act of 1985 and first minted in 1986. It is the most widely recognized and traded gold bullion coin in the US market.</p>
<h2>Specifications</h2>
<div class="ssr-table-wrap">
  <table>
    <thead><tr><th>Denomination</th><th>Gold Content</th><th>Total Weight</th><th>Diameter</th></tr></thead>
    <tbody>
      <tr><td>$50 (1 oz)</td><td>1.000 ozt gold</td><td>1.0909 ozt</td><td>32.7 mm</td></tr>
      <tr><td>$25 (1/2 oz)</td><td>0.500 ozt gold</td><td>0.5455 ozt</td><td>27.0 mm</td></tr>
      <tr><td>$10 (1/4 oz)</td><td>0.250 ozt gold</td><td>0.2727 ozt</td><td>22.0 mm</td></tr>
      <tr><td>$5 (1/10 oz)</td><td>0.100 ozt gold</td><td>0.1091 ozt</td><td>16.5 mm</td></tr>
    </tbody>
  </table>
</div>
<p>All American Gold Eagles are <strong>.9167 fine (22 karat)</strong> — the alloy includes copper and silver for durability. Despite containing non-gold alloy, each coin still delivers the stated pure gold content. The 1 oz Eagle always contains exactly 1 troy ounce of gold.</p>
<h2>Why American Gold Eagles Are the #1 Choice for US Investors</h2>
<ul>
  <li><strong>IRA eligible:</strong> American Gold Eagles are among the few bullion coins approved for inclusion in Gold IRAs.</li>
  <li><strong>Legal tender:</strong> Backed by the US government with nominal face values (though melt value far exceeds face value).</li>
  <li><strong>Universal liquidity:</strong> Recognized by every US coin dealer and most international dealers — one of the most liquid bullion coins on earth.</li>
  <li><strong>Established market:</strong> 35+ years of continuous mintage creates a deep secondary market with tight bid-ask spreads.</li>
</ul>
<div class="ssr-cta">
  <h2>Buy American Gold Eagles</h2>
  <p>GoldBuller carries 1 oz, 1/2 oz, 1/4 oz, and 1/10 oz American Gold Eagles. Fast, insured shipping — all 50 states.</p>
  <a href="${SITE_URL}/gold?mint=us" class="ssr-cta-btn">Shop Gold Eagles →</a>
</div>`,
  },
  {
    slug: "gold-ira",
    term: "Gold IRA",
    shortDef: "A self-directed IRA that holds physical gold and other approved precious metals as tax-advantaged retirement assets.",
    category: "Investing",
    related: ["bullion", "american-gold-eagle", "allocated-storage"],
    body: `<p class="ssr-intro">A <strong>Gold IRA</strong> (also called a Precious Metals IRA or Self-Directed IRA) is a specialized Individual Retirement Account that holds physical gold, silver, platinum, or palladium instead of stocks, bonds, or mutual funds. It provides the same tax advantages as a traditional or Roth IRA.</p>
<h2>How a Gold IRA Works</h2>
<ol>
  <li><strong>Open a Self-Directed IRA (SDIRA)</strong> with a custodian approved by the IRS to hold alternative assets (precious metals, real estate, etc.).</li>
  <li><strong>Fund the account</strong> via a rollover from an existing 401(k), IRA, or TSP — or with new contributions up to the annual IRS limit.</li>
  <li><strong>Purchase IRS-approved bullion</strong> through an authorized dealer (like GoldBuller). The dealer ships directly to an IRS-approved depository — you cannot take personal possession.</li>
  <li><strong>Metals are stored</strong> in an approved depository (Brinks, Delaware Depository, etc.) in either segregated (your specific bars) or commingled storage.</li>
</ol>
<h2>IRS-Approved Gold Bullion for IRAs</h2>
<p>Only bullion meeting IRS fineness standards qualifies. For gold: minimum .995 fine, except American Gold Eagles (.9167 fine) which are specifically exempted by statute.</p>
<ul>
  <li>American Gold Eagles (all sizes) ✓</li>
  <li>American Gold Buffalos (.9999) ✓</li>
  <li>Canadian Gold Maple Leafs (.9999) ✓</li>
  <li>Australian Gold Kangaroos (.9999) ✓</li>
  <li>PAMP Suisse and Valcambi bars (.9999) ✓</li>
</ul>
<h2>Tax Treatment</h2>
<p>A <strong>Traditional Gold IRA</strong> uses pre-tax dollars — contributions may be deductible, and gains are taxed as ordinary income upon withdrawal after age 59½. A <strong>Roth Gold IRA</strong> uses after-tax dollars — qualified withdrawals in retirement are completely tax-free, including all precious metals appreciation.</p>`,
  },
  {
    slug: "bid-ask-spread",
    term: "Bid-Ask Spread",
    shortDef: "The difference between the price a dealer will buy (bid) and sell (ask) a bullion product.",
    category: "Pricing",
    related: ["spot-price", "premium", "bullion"],
    body: `<p class="ssr-intro">The <strong>bid-ask spread</strong> is the difference between what a dealer will pay to buy (bid) your metal and what they charge to sell (ask) it to you. It is the dealer's gross margin on a transaction and a key measure of a bullion market's liquidity.</p>
<h2>Understanding Bid and Ask</h2>
<ul>
  <li><strong>Ask (buy from dealer):</strong> Spot price + premium. The price you pay when purchasing.</li>
  <li><strong>Bid (sell to dealer):</strong> Spot price minus the dealer's buyback discount. The price you receive when selling.</li>
  <li><strong>Spread:</strong> Ask minus Bid. Your round-trip cost to buy and immediately sell back.</li>
</ul>
<h2>Typical Bid-Ask Spreads by Product</h2>
<div class="ssr-table-wrap">
  <table>
    <thead><tr><th>Product</th><th>Typical Spread</th><th>Notes</th></tr></thead>
    <tbody>
      <tr><td>1 oz Gold Bar (major brand)</td><td>3% – 6%</td><td>Tight market, widely recognized</td></tr>
      <tr><td>American Gold Eagle (1 oz)</td><td>5% – 9%</td><td>High liquidity, global demand</td></tr>
      <tr><td>American Silver Eagle (1 oz)</td><td>15% – 30%</td><td>Wider due to higher minting cost ratio</td></tr>
      <tr><td>Junk Silver ($1 face)</td><td>5% – 12%</td><td>Varies by dealer inventory needs</td></tr>
      <tr><td>1 oz Platinum Bar</td><td>8% – 14%</td><td>Thinner market, wider spread</td></tr>
    </tbody>
  </table>
</div>
<h2>Minimizing Your Transaction Cost</h2>
<p>The spread is the minimum price appreciation you need before breaking even on a resale. Strategies to minimize it: buy lower-premium products (bars vs. coins), purchase in larger quantities to access volume pricing, hold through significant spot price increases, and sell when spot has risen enough to cover the spread plus time value.</p>`,
  },
  {
    slug: "karat",
    term: "Karat",
    shortDef: "A measure of gold purity where 24 karats equals 100% pure gold.",
    category: "Purity & Composition",
    related: ["fineness", "assay", "bullion"],
    body: `<p class="ssr-intro"><strong>Karat</strong> (abbreviated <em>K</em> or <em>kt</em>) is the traditional unit for expressing gold purity. 24 karats (24K) represents 100% pure gold; lower karat values indicate gold alloyed with other metals like copper, silver, or zinc.</p>
<h2>Karat to Fineness Conversion</h2>
<div class="ssr-table-wrap">
  <table>
    <thead><tr><th>Karat</th><th>Fineness</th><th>Pure Gold %</th><th>Common Uses</th></tr></thead>
    <tbody>
      <tr><td>24K</td><td>.999 / .9999</td><td>99.9% – 99.99%</td><td>Bullion bars, Maple Leafs, Buffalo coins</td></tr>
      <tr><td>22K</td><td>.9167</td><td>91.67%</td><td>American Gold Eagles, Krugerrands</td></tr>
      <tr><td>18K</td><td>.750</td><td>75%</td><td>Fine jewelry (European standard)</td></tr>
      <tr><td>14K</td><td>.585</td><td>58.5%</td><td>Jewelry (US standard)</td></tr>
      <tr><td>10K</td><td>.417</td><td>41.7%</td><td>Entry-level jewelry (minimum US legal "gold" standard)</td></tr>
    </tbody>
  </table>
</div>
<h2>Karat vs. Fineness</h2>
<p>Karat and fineness convey the same information in different formats. The bullion market overwhelmingly uses fineness (.9999, .999, .9167). Jewelry markets use karat (18K, 14K). To convert: divide karats by 24 to get fineness (18 ÷ 24 = .750).</p>
<p>Note: "Karat" (precious metals purity) is different from "Carat" (diamond and gemstone weight, where 1 carat = 0.2 grams). The spelling distinguishes them in American English; British English uses "carat" for both.</p>`,
  },
  {
    slug: "monster-box",
    term: "Monster Box",
    shortDef: "A government mint's standard case of silver coins, typically holding 500 one-ounce coins in 25 tubes of 20.",
    category: "Products",
    related: ["american-gold-eagle", "bullion", "bid-ask-spread"],
    body: `<p class="ssr-intro">A <strong>monster box</strong> is the sealed, mint-fresh case that major government mints use to ship silver bullion coins. The most common configuration is 500 coins in 25 tubes of 20 — an iconic way to buy silver in bulk with the lowest per-coin premium available.</p>
<h2>Common Monster Box Specifications</h2>
<div class="ssr-table-wrap">
  <table>
    <thead><tr><th>Coin</th><th>Coins per Box</th><th>Tubes</th><th>Silver Content</th></tr></thead>
    <tbody>
      <tr><td>American Silver Eagle</td><td>500</td><td>25 × 20</td><td>500 ozt</td></tr>
      <tr><td>Canadian Silver Maple Leaf</td><td>500</td><td>25 × 20</td><td>500 ozt</td></tr>
      <tr><td>Australian Silver Kangaroo</td><td>250</td><td>25 × 10</td><td>250 ozt</td></tr>
      <tr><td>South African Silver Krugerrand</td><td>500</td><td>25 × 20</td><td>500 ozt</td></tr>
    </tbody>
  </table>
</div>
<h2>Why Buy a Monster Box?</h2>
<p>Monster boxes represent the lowest per-coin premium on government bullion coins. Buying 500 Silver Eagles in a sealed monster box typically costs $0.50–$1.50 less per coin than buying tubes or singles. The sealed mint packaging also confirms the coins are original mint inventory, which is especially valuable for IRA purposes and resale.</p>
<p>At current silver prices, a monster box of American Silver Eagles represents roughly $14,000–$18,000 in value, making it a significant purchase. GoldBuller's OTC desk can facilitate monster box purchases with Bitcoin payment for privacy-conscious buyers.</p>`,
  },
  {
    slug: "proof-coin",
    term: "Proof Coin",
    shortDef: "A specially struck collectible coin made with polished dies on hand-selected planchets, producing a mirror-like finish.",
    category: "Coin Types",
    related: ["numismatic", "bullion", "american-gold-eagle"],
    body: `<p class="ssr-intro">A <strong>proof coin</strong> is a specially manufactured coin struck using polished dies on carefully selected, hand-inspected planchets to produce the highest-quality finish possible. Proof coins are not regular currency — they are made for collectors and bear "PR" or "PF" designations in grading reports.</p>
<h2>How Proof Coins Are Made</h2>
<p>Proof production involves multiple steps that don't apply to regular bullion strikes:</p>
<ol>
  <li>Planchets (blanks) are individually inspected and polished to mirror quality.</li>
  <li>Dies are highly polished for the background field and sandblasted for the design elements (creating the "frosted" vs. "mirror" contrast).</li>
  <li>Each coin is struck twice or more at slow speed and high pressure.</li>
  <li>Workers handle the coins with cotton gloves; each is individually inspected and sealed.</li>
</ol>
<h2>Proof vs. Bullion vs. Uncirculated</h2>
<div class="ssr-table-wrap">
  <table>
    <thead><tr><th>Type</th><th>Finish</th><th>Struck For</th><th>Premium Level</th></tr></thead>
    <tbody>
      <tr><td>Proof</td><td>Mirror/Frosted contrast</td><td>Collectors</td><td>Highest (30–100%+ over spot)</td></tr>
      <tr><td>Burnished/Uncirculated</td><td>Satin/Matte</td><td>Collectors</td><td>High (20–40% over spot)</td></tr>
      <tr><td>Bullion</td><td>Standard strike</td><td>Investors</td><td>Low (3–20% over spot)</td></tr>
    </tbody>
  </table>
</div>
<p>Unless you are a collector who appreciates the aesthetic and understands the market, proof coins are generally not recommended for pure metal investment — you pay a large premium that you are unlikely to recover at resale unless the coin appreciates due to collector demand.</p>`,
  },
  {
    slug: "legal-tender",
    term: "Legal Tender Face Value",
    shortDef: "The nominal dollar value stamped on government-issued bullion coins, far below their actual metal value.",
    category: "Basics",
    related: ["bullion", "american-gold-eagle", "numismatic"],
    body: `<p class="ssr-intro">Government-issued bullion coins carry a <strong>legal tender face value</strong> — a nominal dollar amount stamped on the coin that gives it official monetary status. This face value is almost always a tiny fraction of the coin's actual metal value.</p>
<h2>Why Bullion Coins Have Face Values</h2>
<p>The legal tender designation serves several purposes: it means the coin is backed by the issuing government, can theoretically be used as currency, and in some jurisdictions, may receive favorable tax treatment. The US Mint issues American Gold Eagles with a $50 face value per 1 oz coin — but the coin currently trades for approximately 47× that face value based on gold spot.</p>
<h2>Common Face Values vs. Market Value</h2>
<div class="ssr-table-wrap">
  <table>
    <thead><tr><th>Coin</th><th>Legal Tender Face</th><th>Approximate Market Value</th></tr></thead>
    <tbody>
      <tr><td>American Gold Eagle (1 oz)</td><td>$50 USD</td><td>~$2,400+</td></tr>
      <tr><td>American Silver Eagle (1 oz)</td><td>$1 USD</td><td>~$28–$35</td></tr>
      <tr><td>Canadian Gold Maple Leaf (1 oz)</td><td>$50 CAD</td><td>~$2,400+ USD</td></tr>
      <tr><td>South African Krugerrand (1 oz)</td><td>No face value</td><td>~$2,400+ USD</td></tr>
      <tr><td>Austrian Gold Philharmonic (1 oz)</td><td>€100 EUR</td><td>~$2,400+ USD</td></tr>
    </tbody>
  </table>
</div>
<p>Never judge a bullion coin's value by its face value — always calculate based on its pure metal content at current spot prices.</p>`,
  },
  {
    slug: "allocated-storage",
    term: "Allocated Storage",
    shortDef: "A precious metals storage arrangement where specific, serialized bars or coins are assigned exclusively to one client.",
    category: "Storage",
    related: ["gold-ira", "bullion", "assay"],
    body: `<p class="ssr-intro">In <strong>allocated storage</strong>, specific bars or coins with individual serial numbers are assigned to you and kept physically separated from other clients' metal and the depository's own holdings. You own specific, identifiable pieces — not a share of a pooled account.</p>
<h2>Allocated vs. Unallocated Storage</h2>
<div class="ssr-table-wrap">
  <table>
    <thead><tr><th></th><th>Allocated</th><th>Unallocated</th></tr></thead>
    <tbody>
      <tr><td>Ownership</td><td>Specific, serialized pieces</td><td>Claim on a pool — unsecured creditor</td></tr>
      <tr><td>Counterparty risk</td><td>None (your metal, separately held)</td><td>Yes — if the custodian fails, you may get cents on the dollar</td></tr>
      <tr><td>Storage fee</td><td>Higher (typically 0.1–0.5%/yr)</td><td>Lower or free (metal is lent out to generate returns)</td></tr>
      <tr><td>Insurance</td><td>Full replacement value</td><td>May be partial or pooled coverage</td></tr>
      <tr><td>Audit-ability</td><td>Yes — your serial numbers are verifiable</td><td>Difficult — you can't identify "your" metal</td></tr>
    </tbody>
  </table>
</div>
<h2>Why Allocated Matters</h2>
<p>In an unallocated account, you are effectively an unsecured creditor of the custodian. If that institution becomes insolvent, your claim on the metal competes with other creditors. In a fully allocated, segregated account, your metal sits in a separate vault area — it does not appear on the custodian's balance sheet and cannot be claimed by their creditors.</p>
<p>For long-term wealth preservation, allocated storage is the appropriate choice. For Gold IRA purposes, the IRS requires approved depositories that maintain properly segregated (allocated) accounts.</p>`,
  },
  {
    slug: "otc-desk",
    term: "OTC Desk",
    shortDef: "A private trading desk for large, negotiated precious metals transactions, typically for orders above standard retail thresholds.",
    category: "Trading",
    related: ["bid-ask-spread", "premium", "spot-price"],
    body: `<p class="ssr-intro">An <strong>OTC (Over-The-Counter) desk</strong> is a private, direct trading channel for large precious metals transactions. Unlike retail orders that go through a standard e-commerce checkout, OTC transactions are negotiated individually between the buyer and a dedicated trader to secure pricing unavailable on public retail channels.</p>
<h2>When to Use an OTC Desk</h2>
<p>OTC desks make sense for transactions above typical retail thresholds — generally $25,000+ in gold or 1,000+ troy ounces in silver. At these volumes, even a 0.5% pricing improvement represents significant savings. GoldBuller's OTC desk also accepts Bitcoin for payment, enabling large, privacy-conscious purchases outside the traditional financial system.</p>
<h2>OTC vs. Retail Pricing</h2>
<p>Retail premiums are fixed and published. OTC premiums are negotiated and reflect:</p>
<ul>
  <li>Current market conditions and dealer inventory</li>
  <li>Payment method (Bitcoin vs. wire transfer vs. check)</li>
  <li>Delivery preferences (shipped vs. vaulted)</li>
  <li>Relationship history and KYC status</li>
  <li>Order size and product type</li>
</ul>
<h2>KYC Requirements for OTC</h2>
<p>All GoldBuller OTC transactions require prior KYC (Know Your Customer) verification. This is both a regulatory requirement and a practical necessity for building the trust needed for large direct transactions. KYC approval typically takes 24–48 hours. Once approved, you can transact repeatedly without re-verification.</p>
<div class="ssr-cta">
  <h2>Access GoldBuller's OTC Desk</h2>
  <p>Complete KYC verification to unlock volume pricing, Bitcoin payment, and direct dealer pricing on gold, silver, and platinum.</p>
  <a href="${SITE_URL}/kyc" class="ssr-cta-btn">Start KYC Verification →</a>
</div>`,
  },
  {
    slug: "basel-iii",
    term: "Basel III and Gold",
    shortDef: "International banking regulations that reclassified physical gold as a Tier 1 zero-risk-weight asset in 2021.",
    category: "Market Analysis",
    related: ["spot-price", "bullion", "otc-desk"],
    body: `<p class="ssr-intro"><strong>Basel III</strong> is the third iteration of the Basel Accords — international banking regulations developed by the Bank for International Settlements (BIS). For precious metals markets, the most consequential change was the <strong>reclassification of physical gold as a Tier 1 zero-risk-weight asset</strong>, effective June 28, 2021 for most major banking jurisdictions.</p>
<h2>What Changed and Why It Matters</h2>
<p>Before Basel III, physical gold held by banks was treated as a Tier 3 asset — considered higher risk and requiring capital set-asides. After the reclassification, physical gold is now on par with cash and government bonds for bank capital purposes. This means banks can now hold physical gold with no capital penalty — potentially increasing institutional demand for physical metal.</p>
<h2>The NSFR Rule and Paper Gold</h2>
<p>Basel III also introduced the Net Stable Funding Ratio (NSFR), which imposes a Required Stable Funding charge on unallocated gold positions (paper gold, futures, unallocated gold accounts). This makes "paper gold" more expensive for banks to hold, theoretically shifting institutional preference toward physical gold.</p>
<h2>What Basel III Means for Investors</h2>
<p>Analysts who follow Basel III closely argue it creates structural demand for physical gold over paper gold instruments — potentially tightening the relationship between COMEX futures prices and physical metal prices over time. Critics note that implementation varies by country and the practical effects on spot prices have been gradual rather than immediate.</p>
<p>Regardless of Basel III's direct price impact, its reclassification of physical gold as a Tier 1 asset is a significant institutional legitimization of gold as a reserve asset — consistent with the broader trend of central banks accumulating physical gold at record rates.</p>`,
  },
];

export function getGlossaryTermHtml(slug: string): string | null {
  const term = GLOSSARY_TERMS.find((t) => t.slug === slug);
  if (!term) return null;

  const related = GLOSSARY_TERMS.filter((t) => term.related.includes(t.slug));
  const relatedHtml =
    related.length > 0
      ? `<div class="ssr-related">
    <h2>Related Terms</h2>
    <div class="ssr-card-grid">
      ${related
        .map(
          (r) => `<div class="ssr-card-sm">
        <a href="${SITE_URL}/learn/${r.slug}">${r.term}</a>
        <p>${r.shortDef}</p>
      </div>`,
        )
        .join("")}
    </div>
  </div>`
      : "";

  const schemaJson = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "DefinedTerm",
    name: term.term,
    description: term.shortDef,
    url: `${SITE_URL}/learn/${term.slug}`,
    inDefinedTermSet: {
      "@type": "DefinedTermSet",
      name: "GoldBuller Precious Metals Glossary",
      url: `${SITE_URL}/learn`,
    },
  });

  const body = `
    <span class="ssr-tag">${term.category}</span>
    <h1>${term.term}</h1>
    <p class="ssr-intro">${term.shortDef}</p>
    ${term.body}
    ${relatedHtml}
    <div class="ssr-cta" style="margin-top:3rem;">
      <h2>Ready to Start Buying Precious Metals?</h2>
      <p>GoldBuller offers gold, silver, and platinum bullion with transparent pricing and fast, insured shipping. Bitcoin accepted.</p>
      <a href="${SITE_URL}/gold" class="ssr-cta-btn">Shop Gold Bullion →</a>
    </div>`;

  return ssrHtmlShell({
    title: `${term.term} — Precious Metals Definition | ${BRAND} Glossary`,
    description: `${term.shortDef} Learn about ${term.term} and other precious metals terms in the GoldBuller glossary.`,
    canonical: `${SITE_URL}/learn/${term.slug}`,
    schemaJson,
    breadcrumbs: [
      { name: "Glossary", url: `${SITE_URL}/learn` },
      { name: term.term, url: `${SITE_URL}/learn/${term.slug}` },
    ],
    body,
  });
}

export function getGlossaryIndexHtml(): string {
  const byCategory: Record<string, GlossaryTerm[]> = {};
  for (const t of GLOSSARY_TERMS) {
    if (!byCategory[t.category]) byCategory[t.category] = [];
    byCategory[t.category].push(t);
  }

  const schemaJson = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "DefinedTermSet",
    name: "GoldBuller Precious Metals Glossary",
    description:
      "Comprehensive glossary of precious metals terms including spot price, troy ounce, fineness, Gold IRA, and more.",
    url: `${SITE_URL}/learn`,
  });

  const body = `
    <h1>Precious Metals Glossary</h1>
    <p class="ssr-intro">Every term you need to buy, sell, and store gold, silver, and platinum with confidence — defined clearly, without the jargon.</p>
    ${Object.entries(byCategory)
      .map(
        ([cat, terms]) => `
      <h2>${cat}</h2>
      <div class="ssr-card-grid">
        ${terms
          .map(
            (t) => `<div class="ssr-card-sm">
          <a href="${SITE_URL}/learn/${t.slug}">${t.term}</a>
          <p>${t.shortDef}</p>
        </div>`,
          )
          .join("")}
      </div>`,
      )
      .join("")}
    <div class="ssr-cta">
      <h2>Put Your Knowledge to Work</h2>
      <p>Browse GoldBuller's full selection of gold, silver, and platinum bullion — priced transparently above spot.</p>
      <a href="${SITE_URL}/gold" class="ssr-cta-btn">Shop Bullion →</a>
    </div>`;

  return ssrHtmlShell({
    title: `Precious Metals Glossary — Gold, Silver & Platinum Terms | ${BRAND}`,
    description:
      "Complete glossary of precious metals investing terms. Learn about spot price, troy ounce, fineness, Gold IRA, bid-ask spread, and 15+ more terms — clearly defined.",
    canonical: `${SITE_URL}/learn`,
    schemaJson,
    body,
  });
}
