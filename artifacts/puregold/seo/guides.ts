import { ssrHtmlShell, SITE_URL, BRAND } from "./ssrShared.js";

export interface Guide {
  slug: string;
  title: string;
  metaDescription: string;
  readTime: string;
  tags: string[];
  body: string;
}

export const GUIDES: Guide[] = [
  {
    slug: "how-to-buy-gold-bullion",
    title: "How to Buy Gold Bullion: A Complete Beginner's Guide",
    metaDescription:
      "Step-by-step guide to buying gold bullion — coins vs bars, how premiums work, where to buy safely, and how to store your gold after purchase.",
    readTime: "8 min read",
    tags: ["Gold", "Beginners", "Buying Guide"],
    body: `<p class="ssr-intro">Buying gold bullion for the first time can feel overwhelming — dozens of product types, confusing premiums, and concerns about authenticity. This guide cuts through the noise and gives you a clear, step-by-step process for making your first gold purchase confidently.</p>
<h2>Step 1: Understand What You're Actually Buying</h2>
<p>Gold bullion comes in two main forms: <strong>coins</strong> and <strong>bars</strong>. Both are priced based on their gold content at the current <a href="${SITE_URL}/learn/spot-price">spot price</a> plus a dealer premium. Neither is inherently "better" — they serve different goals.</p>
<ul>
  <li><strong>Government coins</strong> (American Gold Eagle, Canadian Maple Leaf, South African Krugerrand): Highest liquidity, widest recognition, higher premiums. Ideal for investors who want to resell easily anywhere.</li>
  <li><strong>Gold bars</strong> (PAMP, Valcambi, Engelhard, Perth Mint): Lower premiums per ounce, easier to stack and store efficiently, slightly less liquid than coins in casual resale scenarios. Ideal for those prioritizing metal weight per dollar spent.</li>
</ul>
<h2>Step 2: Choose Your Ounce Size</h2>
<p>Larger products have lower premiums per troy ounce. However, smaller denominations offer more flexibility if you ever need to sell a portion of your holdings.</p>
<div class="ssr-table-wrap">
  <table>
    <thead><tr><th>Product</th><th>Approx. Premium</th><th>Best For</th></tr></thead>
    <tbody>
      <tr><td>1 oz Gold Eagle / Maple</td><td>5–8% over spot</td><td>Most investors — balance of liquidity and premium</td></tr>
      <tr><td>1 oz Gold Bar (PAMP, Valcambi)</td><td>3–5% over spot</td><td>Cost-conscious investors focused on ounces</td></tr>
      <tr><td>10 oz Gold Bar</td><td>2–3% over spot</td><td>Larger purchases prioritizing minimal premium</td></tr>
      <tr><td>1 kilo Gold Bar (32.15 ozt)</td><td>1–2% over spot</td><td>Institutional or large private buyers via OTC</td></tr>
    </tbody>
  </table>
</div>
<h2>Step 3: Verify the Dealer</h2>
<p>Only buy from established dealers with verifiable track records. Key indicators of a trustworthy dealer:</p>
<ul>
  <li>A+ BBB rating with no unresolved complaints</li>
  <li>Member of the Industry Council for Tangible Assets (ICTA) or Professional Numismatists Guild (PNG)</li>
  <li>Transparent buyback prices published on-site</li>
  <li>Clear return and authenticity guarantee policy</li>
  <li>Verifiable physical address and phone number</li>
</ul>
<h2>Step 4: Understand What You'll Pay</h2>
<p>Your total cost = Spot price + Premium + Shipping + Insurance. Don't compare dealer prices without including all these components. Some dealers advertise low premiums but charge excessive shipping.</p>
<h2>Step 5: Choose Your Payment Method</h2>
<p>Most dealers offer check, bank wire, and credit card. Credit card payments typically add 3–4% to the price. Bank wire and check are usually the lowest-cost options. GoldBuller also accepts <strong>Bitcoin</strong> — ideal for privacy-conscious buyers who don't want precious metals purchases on a credit card statement.</p>
<h2>Step 6: Plan Your Storage Before You Buy</h2>
<p>This step is often overlooked. Before your first purchase, decide where your gold will live:</p>
<ul>
  <li><strong>Home safe:</strong> Immediate access, no storage fees, insurance required. Use a gun-safe-style unit bolted to the floor or wall.</li>
  <li><strong>Bank safe deposit box:</strong> Low cost, but limited access hours, contents may not be insured, and could be frozen in a banking crisis.</li>
  <li><strong>Third-party depository:</strong> Fully insured, segregated storage from companies like Brinks, Loomis, or Delaware Depository. Best for large holdings.</li>
</ul>
<div class="ssr-cta">
  <h2>Start Your Gold Stack Today</h2>
  <p>GoldBuller offers American Gold Eagles, Canadian Maples, PAMP bars, and more — all with transparent spot-based pricing and fast, insured shipping.</p>
  <a href="${SITE_URL}/gold" class="ssr-cta-btn">Shop Gold Bullion →</a>
</div>`,
  },
  {
    slug: "how-to-buy-silver-bullion",
    title: "How to Buy Silver Bullion: The Practical Investor's Guide",
    metaDescription:
      "Everything you need to know about buying silver bullion — coins vs bars vs junk silver, where premiums are lowest, and how to store silver safely.",
    readTime: "7 min read",
    tags: ["Silver", "Beginners", "Buying Guide"],
    body: `<p class="ssr-intro">Silver is the most accessible precious metal for first-time investors — even at lower dollar amounts, you can own meaningful physical silver. But the silver market has some unique quirks (like wide premium swings and storage weight challenges) that are worth understanding before you buy.</p>
<h2>Silver vs. Gold: Key Differences for Buyers</h2>
<ul>
  <li><strong>Higher premiums as a % of spot:</strong> Silver's lower price per ounce means minting, handling, and shipping costs are proportionally larger. Expect 10–30% over spot on silver coins vs. 3–8% on gold coins.</li>
  <li><strong>Weight per dollar:</strong> $5,000 in silver at $30/ozt is 166+ troy ounces — over 11 lbs. Storage planning matters more than with gold.</li>
  <li><strong>Higher volatility:</strong> Silver has both monetary and industrial demand (solar panels, EV batteries, electronics). This means it can outperform gold in bull markets and underperform in recessions.</li>
</ul>
<h2>Your Silver Options, Ranked by Premium</h2>
<div class="ssr-table-wrap">
  <table>
    <thead><tr><th>Product</th><th>Typical Premium</th><th>Best For</th></tr></thead>
    <tbody>
      <tr><td>Generic silver rounds (1 oz)</td><td>8–15%</td><td>Maximum silver for minimum premium</td></tr>
      <tr><td>10 oz silver bars</td><td>6–10%</td><td>Efficient storage, low premium</td></tr>
      <tr><td>100 oz silver bars</td><td>4–7%</td><td>Largest private buyers, lowest cost</td></tr>
      <tr><td>Junk silver (90% coins)</td><td>5–12%</td><td>Small denomination barter flexibility</td></tr>
      <tr><td>American Silver Eagles</td><td>18–30%</td><td>IRA eligibility, maximum liquidity</td></tr>
      <tr><td>Canadian Maple Leafs</td><td>15–25%</td><td>Internationally recognized, .9999 fine</td></tr>
    </tbody>
  </table>
</div>
<h2>The Case for Junk Silver</h2>
<p><a href="${SITE_URL}/learn/junk-silver">Junk silver</a> — pre-1965 US dimes, quarters, and half dollars with 90% silver content — is one of the most practical silver investments. Low premiums, small denomination units, and US government origin make them attractive for barter scenarios and stackers on a budget.</p>
<h2>Storing Silver at Home</h2>
<p>Silver tarnishes but does not corrode. Store coins in their original tubes or in airtight flips. Avoid touching the coin faces — oils from your hands accelerate toning. For 100+ oz, consider a quality gun safe rather than a fireproof document safe (document safes typically can't handle the weight).</p>
<div class="ssr-cta">
  <h2>Buy Silver at Competitive Premiums</h2>
  <p>Eagles, Maples, rounds, bars, and junk silver — GoldBuller carries the full range with Bitcoin payment accepted.</p>
  <a href="${SITE_URL}/silver" class="ssr-cta-btn">Shop Silver Bullion →</a>
</div>`,
  },
  {
    slug: "how-to-store-precious-metals",
    title: "How to Store Precious Metals Safely: Home, Bank & Vault Options",
    metaDescription:
      "Complete guide to storing gold and silver safely — home safe selection, bank safe deposit box pros and cons, third-party vault storage, and insurance considerations.",
    readTime: "6 min read",
    tags: ["Storage", "Security", "Gold", "Silver"],
    body: `<p class="ssr-intro">The single biggest mistake new precious metals buyers make is purchasing gold or silver without a clear storage plan. Your bullion is only as secure as where you keep it. Here's an honest assessment of every realistic storage option.</p>
<h2>Option 1: Home Safe</h2>
<p><strong>Best for:</strong> Immediate access, amounts under $50,000, privacy-focused buyers.</p>
<h3>What to Look For in a Bullion Safe</h3>
<ul>
  <li><strong>UL Burglary rating TL-15 or TL-30:</strong> Tested against tool attacks for 15 or 30 minutes. Don't buy an unrated or RSC-only (Residential Security Container) safe for significant holdings.</li>
  <li><strong>Weight 500+ lbs:</strong> Heavier safes are dramatically harder to remove. Alternatively, bolt a lighter safe to a concrete floor or wall stud.</li>
  <li><strong>Fire rating:</strong> A bonus, but prioritize burglary rating. Most fire safes offer minimal burglary resistance.</li>
</ul>
<h3>Operational Security (OpSec) for Home Storage</h3>
<ul>
  <li>Tell as few people as possible about your holdings — including family members who talk casually about finances.</li>
  <li>Don't post precious metals purchases on social media or brag in online forums with identifiable information.</li>
  <li>Consider a decoy safe with a small amount of cash and low-value items.</li>
</ul>
<h2>Option 2: Bank Safe Deposit Box</h2>
<p><strong>Best for:</strong> Secondary storage of documents and small amounts, not primary bullion storage.</p>
<p><strong>Critical limitations:</strong> Safe deposit box contents are NOT FDIC insured. If the bank is robbed or suffers a disaster, the bank is not liable for your contents. Access is limited to banking hours. In a declared banking emergency, boxes can potentially be frozen. For meaningful precious metals holdings, a bank safe deposit box should be used only as a complement to other storage, not as primary storage.</p>
<h2>Option 3: Third-Party Depository</h2>
<p><strong>Best for:</strong> Large holdings ($50,000+), IRA-held metals, maximum security with full insurance.</p>
<p>Professional depositories like <strong>Brinks Global Services</strong>, <strong>Loomis International</strong>, <strong>Delaware Depository</strong>, and <strong>International Depository Services (IDS)</strong> offer:</p>
<ul>
  <li>Fully insured (typically Lloyd's of London) for full replacement value</li>
  <li>Segregated (allocated) storage — your specific bars are tracked by serial number</li>
  <li>Regular independent audits</li>
  <li>Annual fees typically 0.1–0.5% of metal value</li>
</ul>
<h2>Insurance for Home-Stored Precious Metals</h2>
<p>Standard homeowner's insurance severely limits precious metals coverage — typically $1,000–$2,500 maximum regardless of your actual holdings. You must purchase a specialized precious metals rider or a standalone scheduled personal property policy. Expect to pay 0.5–1% of insured value annually.</p>
<div class="ssr-cta">
  <h2>Questions About Large Purchases?</h2>
  <p>Our OTC desk can advise on optimal purchasing and storage strategies for significant holdings. Bitcoin accepted for all transactions.</p>
  <a href="${SITE_URL}/kyc" class="ssr-cta-btn">Contact OTC Desk →</a>
</div>`,
  },
  {
    slug: "gold-vs-silver-which-to-buy",
    title: "Gold vs. Silver: Which Precious Metal Should You Buy?",
    metaDescription:
      "Gold vs silver comparison for investors — premium costs, storage, volatility, industrial demand, and which metal makes sense for your goals.",
    readTime: "6 min read",
    tags: ["Gold", "Silver", "Strategy", "Comparison"],
    body: `<p class="ssr-intro">The gold vs. silver question is the most common one new precious metals buyers ask. The honest answer: they serve different purposes and the best choice depends on your budget, goals, and storage capacity.</p>
<h2>The Core Case for Gold</h2>
<ul>
  <li><strong>Store of value over millennia:</strong> Gold has preserved purchasing power across every major civilization, currency collapse, and geopolitical crisis in recorded history.</li>
  <li><strong>Compact wealth storage:</strong> At $2,300/ozt, $100,000 in gold weighs about 43.5 troy ounces — just over 3 lbs. The same $100,000 in silver at $29/ozt would be 3,448 oz — nearly 237 lbs.</li>
  <li><strong>Lower premiums:</strong> Gold premiums as a percentage of spot are significantly lower than silver's.</li>
  <li><strong>Better volatility profile:</strong> Gold's price moves are smaller relative to silver's, which can swing 30–50% in a single year.</li>
</ul>
<h2>The Core Case for Silver</h2>
<ul>
  <li><strong>Lower entry point:</strong> You can start for under $35 per coin vs. $2,400+ for a gold coin — accessible for nearly any budget.</li>
  <li><strong>Industrial demand tailwind:</strong> Silver is essential for solar panels, EV batteries, 5G infrastructure, and medical devices. Industrial demand adds a fundamental floor and growth driver beyond monetary demand.</li>
  <li><strong>Higher potential upside:</strong> The <a href="${SITE_URL}/learn/gold-silver-ratio">gold-silver ratio</a> at 80+ suggests silver is historically cheap relative to gold. When precious metals bull markets accelerate, silver historically outperforms gold in percentage terms.</li>
  <li><strong>Barter utility:</strong> Smaller denomination silver (especially junk silver dimes and quarters) is more practical for small transactions than gold if barter scenarios ever materialize.</li>
</ul>
<h2>What the Numbers Say: Splitting Your Budget</h2>
<div class="ssr-table-wrap">
  <table>
    <thead><tr><th>Budget</th><th>Conservative Approach</th><th>Aggressive Approach</th></tr></thead>
    <tbody>
      <tr><td>$1,000</td><td>All silver — 1 tube of Silver Eagles or 3–4 rolls of junk silver</td><td>All silver — maximize ounce count at lowest premium</td></tr>
      <tr><td>$5,000</td><td>2 oz gold + 80 oz silver (roughly 70/30 gold/silver)</td><td>All silver — 150+ oz at strong discounts to spot</td></tr>
      <tr><td>$25,000+</td><td>10+ oz gold (1 Eagle per $2,500 increments) + silver</td><td>Mix gold and silver; consider OTC desk for volume pricing</td></tr>
    </tbody>
  </table>
</div>
<h2>GoldBuller's Recommendation</h2>
<p>For most investors: start with gold for wealth preservation and add silver for upside exposure. A 70% gold / 30% silver allocation by value is a reasonable starting point. Adjust based on your storage capacity (silver is bulky) and risk tolerance (silver is more volatile).</p>
<div class="ssr-cta">
  <h2>Browse Both Metals</h2>
  <p>Compare gold and silver products side by side. All prices update in real time based on live spot prices.</p>
  <a href="${SITE_URL}/gold" class="ssr-cta-btn">Shop Gold →</a>
  <a href="${SITE_URL}/silver" class="ssr-cta-btn" style="margin-left:1rem;">Shop Silver →</a>
</div>`,
  },
  {
    slug: "precious-metals-ira-guide",
    title: "Precious Metals IRA Guide: How to Add Gold to Your Retirement Account",
    metaDescription:
      "Complete guide to Gold IRAs — how they work, IRS-approved metals, custodian selection, rollover process, contribution limits, and distribution rules.",
    readTime: "9 min read",
    tags: ["Gold IRA", "Retirement", "Tax Strategy"],
    body: `<p class="ssr-intro">A <a href="${SITE_URL}/learn/gold-ira">Gold IRA</a> lets you hold physical precious metals inside a tax-advantaged retirement account. Done correctly, it combines the wealth-preserving properties of gold with the same tax benefits as a traditional IRA or Roth IRA.</p>
<h2>Step 1: Understand the Three-Party Structure</h2>
<p>A Gold IRA requires three separate parties — a structure that surprises many first-time buyers:</p>
<ol>
  <li><strong>SDIRA Custodian:</strong> The IRS-regulated financial institution that holds the account and maintains all required paperwork. Examples: Equity Trust, STRATA Trust, GoldStar Trust.</li>
  <li><strong>Precious Metals Dealer:</strong> The company that sources and sells you the actual bullion (like GoldBuller). You choose the products; the custodian processes payment.</li>
  <li><strong>Approved Depository:</strong> The IRS-mandated vault where your metals are physically stored. You cannot store IRA metals at home or in a personal safe.</li>
</ol>
<h2>Step 2: Choose Your IRA Type</h2>
<ul>
  <li><strong>Traditional Gold IRA:</strong> Pre-tax contributions. Tax-deferred growth. Distributions in retirement taxed as ordinary income. 2025 contribution limit: $7,000 ($8,000 if 50+).</li>
  <li><strong>Roth Gold IRA:</strong> After-tax contributions. Tax-free growth and qualified distributions. Income limits apply for direct contributions.</li>
  <li><strong>SEP Gold IRA:</strong> For self-employed individuals. 2025 limit: up to 25% of compensation or $70,000, whichever is less.</li>
</ul>
<h2>Step 3: Fund via Rollover or Transfer</h2>
<p>Most Gold IRA funding comes from rolling over or transferring existing retirement accounts — no new contribution limits apply:</p>
<ul>
  <li><strong>Direct transfer (custodian-to-custodian):</strong> Safest option. No tax withholding, no 60-day deadline. Unlimited per year.</li>
  <li><strong>60-day indirect rollover:</strong> Your current custodian sends you a check. You must deposit it into the new SDIRA within 60 days or face taxes + 10% penalty. Limited to once per 12 months per IRA.</li>
</ul>
<h2>IRS-Approved Gold Products (Partial List)</h2>
<ul>
  <li>American Gold Eagle (all sizes) — .9167 fine, specifically exempted by statute</li>
  <li>American Gold Buffalo — .9999 fine</li>
  <li>Canadian Gold Maple Leaf — .9999 fine</li>
  <li>Australian Gold Kangaroo — .9999 fine</li>
  <li>PAMP Suisse Gold Bars — .9999 fine</li>
  <li>Valcambi Gold Bars — .9999 fine</li>
</ul>
<p><strong>Not eligible:</strong> South African Krugerrands (only .9167 fine, not specifically exempted), most collectible coins, jewelry, ETFs within an IRA.</p>
<h2>Required Minimum Distributions (RMDs)</h2>
<p>Traditional Gold IRAs follow the same RMD rules as traditional IRAs: you must begin taking distributions by April 1 of the year following the year you turn 73 (as of the 2024 SECURE 2.0 rules). Distributions can be taken in-kind (physical metal delivered to you) or by selling the metal and taking cash.</p>`,
  },
  {
    slug: "buying-gold-coins-vs-bars",
    title: "Gold Coins vs. Gold Bars: Which Is the Better Investment?",
    metaDescription:
      "Gold coins vs gold bars — a detailed comparison of premiums, liquidity, storage, IRA eligibility, and resale value to help you decide which is right for you.",
    readTime: "5 min read",
    tags: ["Gold", "Strategy", "Comparison"],
    body: `<p class="ssr-intro">Coins or bars — it's the most common tactical question in gold investing. Both are legitimate bullion investments, but they have meaningful differences in premium costs, liquidity, IRA eligibility, and resale convenience that should drive your choice.</p>
<h2>Cost Comparison: Premium Over Spot</h2>
<div class="ssr-table-wrap">
  <table>
    <thead><tr><th>Product</th><th>Size</th><th>Typical Premium</th></tr></thead>
    <tbody>
      <tr><td>American Gold Eagle</td><td>1 oz</td><td>5–8% over spot</td></tr>
      <tr><td>Canadian Gold Maple Leaf</td><td>1 oz</td><td>5–7% over spot</td></tr>
      <tr><td>PAMP Suisse Bar (assayed)</td><td>1 oz</td><td>3–5% over spot</td></tr>
      <tr><td>Generic Gold Bar</td><td>1 oz</td><td>2–4% over spot</td></tr>
      <tr><td>PAMP Suisse Bar</td><td>10 oz</td><td>2–3% over spot</td></tr>
      <tr><td>Gold Bar</td><td>1 kilo</td><td>1–2% over spot</td></tr>
    </tbody>
  </table>
</div>
<h2>Liquidity: Coins Win</h2>
<p>American Gold Eagles and Canadian Maple Leafs are recognized instantly by every coin shop, pawn shop, and bullion dealer worldwide. They are also easily sold on eBay, r/Pmsforsale, and in peer-to-peer transactions. Bars — especially larger ones (10 oz, kilo) — are less liquid in informal markets because buyers may want assay verification and face cash limits.</p>
<h2>IRA Eligibility</h2>
<p>Most major government bullion coins (Eagles, Maples, Kangaroos, Philharmonics) are IRA eligible. Most bars are also IRA eligible if they meet the .995 minimum fineness and are from an accredited refiner. The most common bars used in IRAs are PAMP Suisse, Valcambi, and Engelhard.</p>
<h2>Storage and Insurance</h2>
<p>Bars stack more efficiently — a 10 oz bar takes up less space than 10 individual 1 oz coins in tubes. For home storage or depository storage, bars are more space-efficient per ounce. Coins require plastic tubes or flips that add minor bulk.</p>
<h2>The Verdict</h2>
<ul>
  <li><strong>Choose coins if:</strong> You prioritize maximum liquidity, recognize ability, IRA flexibility, or plan to resell individual ounces informally.</li>
  <li><strong>Choose bars if:</strong> You prioritize lowest premium per ounce and plan to hold long-term without needing to sell individual ounces quickly.</li>
  <li><strong>Best strategy:</strong> Many serious investors hold both — government coins for flexibility and bars for efficient capital deployment.</li>
</ul>`,
  },
  {
    slug: "bitcoin-vs-gold-investment",
    title: "Bitcoin vs. Gold: Two Stores of Value Compared",
    metaDescription:
      "Bitcoin vs gold — a clear-eyed comparison of scarcity, volatility, custody, liquidity, regulatory risk, and how they fit in the same portfolio.",
    readTime: "7 min read",
    tags: ["Bitcoin", "Gold", "Strategy", "Comparison"],
    body: `<p class="ssr-intro">Gold has stored value for 5,000 years. Bitcoin has existed since 2009. Both are often positioned as "inflation hedges" and "stores of value" — but they have fundamentally different risk profiles, use cases, and custody requirements. Here's an honest comparison.</p>
<h2>The Similarities That Matter</h2>
<ul>
  <li><strong>Fixed/predictable supply:</strong> Gold production grows ~1–2% per year (limited by geology). Bitcoin has a hard cap of 21 million coins with predictable halving events reducing new issuance every ~4 years.</li>
  <li><strong>No counterparty:</strong> Physical gold and self-custodied Bitcoin require no issuer, bank, or institution to maintain their value. Both can be seized if not stored properly — but neither can be inflated away by a central bank.</li>
  <li><strong>Global liquidity:</strong> Both trade 24/7 worldwide and can be exchanged for local currency in most countries.</li>
</ul>
<h2>The Critical Differences</h2>
<div class="ssr-table-wrap">
  <table>
    <thead><tr><th></th><th>Gold</th><th>Bitcoin</th></tr></thead>
    <tbody>
      <tr><td>Track record</td><td>5,000+ years</td><td>15 years</td></tr>
      <tr><td>Annual volatility (recent)</td><td>15–20%</td><td>50–100%+</td></tr>
      <tr><td>Institutional adoption</td><td>Deep (central banks, ETFs, jewelry)</td><td>Growing (ETFs, corporate treasuries, sovereign funds)</td></tr>
      <tr><td>Custody complexity</td><td>Simple (physical possession)</td><td>Moderate (seed phrase security is critical)</td></tr>
      <tr><td>Regulatory risk</td><td>Low (only heavy-handed governments restrict gold)</td><td>Higher (regulatory framework still evolving globally)</td></tr>
      <tr><td>Seizure resistance</td><td>Physical gold can be hidden; must be physically located</td><td>Bitcoin can be held in head (seed phrase); harder to confiscate</td></tr>
    </tbody>
  </table>
</div>
<h2>Complementary, Not Competing</h2>
<p>Many sophisticated investors hold both. Gold provides stability, millennia of track record, and physical substance. Bitcoin provides asymmetric upside potential, digital portability, and a maturing role in institutional portfolios. A portfolio holding 5–10% in gold and 1–5% in Bitcoin covers both bases without excessive risk from either.</p>
<h2>GoldBuller Accepts Bitcoin</h2>
<p>We accept Bitcoin as payment for all precious metals purchases — because we believe both assets have legitimate roles in a diversified hard asset portfolio. Bitcoin buyers who want physical metal exposure can buy gold and silver directly with BTC, often without the paper trail of a bank wire.</p>
<div class="ssr-cta">
  <h2>Buy Gold with Bitcoin</h2>
  <p>Use your Bitcoin to acquire physical gold and silver. KYC verification required for Bitcoin OTC purchases.</p>
  <a href="${SITE_URL}/kyc" class="ssr-cta-btn">Start KYC Verification →</a>
</div>`,
  },
  {
    slug: "sell-gold-bullion-guide",
    title: "How to Sell Gold Bullion: Getting the Best Price When You Sell",
    metaDescription:
      "How to sell gold bullion — dealer buybacks vs. private sales vs. auction, how to avoid getting lowballed, and what affects the price you receive.",
    readTime: "5 min read",
    tags: ["Selling", "Gold", "Silver", "Strategy"],
    body: `<p class="ssr-intro">Selling precious metals is straightforward — but getting the best price requires understanding your options and knowing what to avoid. Most sellers leave 5–15% on the table by defaulting to the first offer they receive.</p>
<h2>Option 1: Sell Back to a Dealer (Quickest)</h2>
<p>Most bullion dealers buy back what they sell. Typical buyback prices are <strong>spot or slightly below spot</strong> for standard bullion products. The gap between what they buy and sell at (the <a href="${SITE_URL}/learn/bid-ask-spread">bid-ask spread</a>) is the dealer's margin.</p>
<p><strong>What affects dealer buyback price:</strong></p>
<ul>
  <li>Product type — American Eagles and Maple Leafs get closer-to-spot buybacks than obscure foreign coins</li>
  <li>Condition — heavily damaged coins may be bought at melt value rather than numismatic-adjacent bullion prices</li>
  <li>Quantity — larger lots get better per-ounce pricing</li>
  <li>Current spot direction — dealers may tighten their bid when spot is falling rapidly</li>
</ul>
<h2>Option 2: Peer-to-Peer Sale (Best Price, More Effort)</h2>
<p>Selling directly to another buyer typically gets you 1–3% above what a dealer would pay. Legitimate venues:</p>
<ul>
  <li>r/Pmsforsale (Reddit) — active community with reputation tracking via r/Pmsforsale flair</li>
  <li>eBay — gold and silver coins sell at or above spot but fees (13%+ for most sellers) eat significantly into proceeds</li>
  <li>Local coin shows — you can walk away with cash, but requires travel and negotiation</li>
</ul>
<h2>Option 3: Auction Houses (Best for Numismatic Items)</h2>
<p>Heritage Auctions, Stack's Bowers, and PCGS TrueView are appropriate for rare, graded coins — not standard bullion. The auction premium to buyers (20%+) can push realized prices above retail, but fees to sellers (10–15%) reduce your net.</p>
<h2>Mistakes to Avoid</h2>
<ul>
  <li><strong>Pawn shops:</strong> Typically pay 50–70% of melt value. Avoid.</li>
  <li><strong>Cash-for-gold jewelry stores:</strong> Structured to pay as little as possible to unknowledgeable sellers.</li>
  <li><strong>"Gold party" events:</strong> The MLM equivalent of precious metals buying — predatory pricing models.</li>
  <li><strong>Not knowing current spot:</strong> Check live spot before any sale negotiation. You can view current prices on our <a href="${SITE_URL}/charts">live charts page</a>.</li>
</ul>`,
  },
  {
    slug: "precious-metals-portfolio-allocation",
    title: "How Much of Your Portfolio Should Be in Precious Metals?",
    metaDescription:
      "Evidence-based guide to precious metals portfolio allocation — what percentage in gold and silver makes sense, how to think about risk, and how to rebalance.",
    readTime: "6 min read",
    tags: ["Strategy", "Portfolio", "Gold", "Silver"],
    body: `<p class="ssr-intro">There is no single "correct" allocation to precious metals — the right percentage depends on your existing portfolio, risk tolerance, time horizon, and what role you want metals to play. Here's an evidence-based framework for thinking about it.</p>
<h2>What Gold Actually Does in a Portfolio</h2>
<p>Gold's primary portfolio function is <strong>asymmetric crisis protection</strong>. It tends to perform well precisely when other assets perform badly — equity crashes, bank failures, currency devaluations, and geopolitical shocks. Its long-run real return in stable periods is near zero (it maintains purchasing power, it doesn't grow it). This makes it a poor choice for growth-oriented portfolios, but an excellent choice as a crisis hedge.</p>
<h2>Allocation Frameworks Used by Major Investors</h2>
<div class="ssr-table-wrap">
  <table>
    <thead><tr><th>Investor / Framework</th><th>Gold Allocation</th><th>Rationale</th></tr></thead>
    <tbody>
      <tr><td>Ray Dalio / Bridgewater (All Weather)</td><td>~7.5%</td><td>Risk parity; gold balances inflationary risk in the portfolio</td></tr>
      <tr><td>Permanent Portfolio (Harry Browne)</td><td>25%</td><td>Equal weight across 4 assets: stocks, gold, bonds, cash</td></tr>
      <tr><td>Global central bank reserves</td><td>~15% average</td><td>Reserve asset diversification away from USD</td></tr>
      <tr><td>Conservative individual investor</td><td>5–10%</td><td>Crisis hedge without excessive drag in bull markets</td></tr>
      <tr><td>Gold-focused investor</td><td>20–40%</td><td>Active inflation/crisis positioning; higher volatility accepted</td></tr>
    </tbody>
  </table>
</div>
<h2>The 5–15% Starting Point</h2>
<p>Most financial advisors who include precious metals at all recommend 5–15% of a total investment portfolio. The research suggests this range captures most of gold's crisis-hedging benefit with minimal drag during normal equity bull markets. Below 5%, the position is too small to matter during a crisis. Above 15%, you're making an active macro bet, not just hedging.</p>
<h2>Gold vs. Silver Allocation Within Precious Metals</h2>
<p>Within a precious metals allocation, a common starting split is <strong>70% gold / 30% silver by value</strong>. Gold provides stability and wealth preservation; silver provides higher upside potential when precious metals bull markets accelerate. Adjust based on your storage capacity (silver is much bulkier) and risk tolerance.</p>
<h2>Rebalancing</h2>
<p>Rebalance annually or when precious metals deviate more than 5 percentage points from your target. Avoid emotional rebalancing (panic selling during gold spikes). Rebalancing on a calendar schedule removes timing decisions from the equation.</p>`,
  },
  {
    slug: "junk-silver-beginners-guide",
    title: "Junk Silver: The Beginner's Guide to 90% US Silver Coins",
    metaDescription:
      "Complete guide to buying junk silver — what it is, which coins contain silver, how to calculate silver content, current premiums, and why starters love it.",
    readTime: "6 min read",
    tags: ["Silver", "Junk Silver", "Beginners"],
    body: `<p class="ssr-intro">"<a href="${SITE_URL}/learn/junk-silver">Junk silver</a>" sounds unappealing, but it's one of the smartest entry points into precious metals for new investors. Pre-1965 US dimes, quarters, and half dollars contain 90% silver — and they can often be purchased at some of the lowest premiums in the silver market.</p>
<h2>Which Coins Are Junk Silver?</h2>
<ul>
  <li><strong>Roosevelt Dimes (1946–1964):</strong> 90% silver, 0.07234 troy oz each. $1 face = 0.7234 ozt silver.</li>
  <li><strong>Washington Quarters (1932–1964):</strong> 90% silver, 0.18084 troy oz each. $1 face = 0.7234 ozt silver.</li>
  <li><strong>Franklin Half Dollars (1948–1963) &amp; Walking Liberty Halves (1916–1947):</strong> 90% silver, 0.36169 troy oz each.</li>
  <li><strong>Kennedy Half Dollars 1965–1970:</strong> 40% silver (not 90%) — a different category dealers call "40% silver" or "war nickels era." Different calculation applies.</li>
  <li><strong>Morgan and Peace Dollars (pre-1936):</strong> 90% silver, 0.77344 troy oz. Higher premiums due to numismatic interest — closer to semi-numismatic than pure junk silver.</li>
</ul>
<h2>The $1 Face Calculation</h2>
<p>The standard way to trade junk silver is by <strong>face value</strong>. Every $1 in face value of 90% silver coins contains approximately <strong>0.715–0.723 troy ounces of silver</strong> (accounting for wear from circulation). Dealers commonly use 0.715 ozt as a conservative estimate.</p>
<p>At $29/ozt silver spot: $1 face value of junk silver contains approximately $20.74 worth of silver at melt. If a dealer is selling $100 face value bags for $2,150, that's about 3.6% over melt — very competitive for silver.</p>
<h2>Why Start With Junk Silver?</h2>
<ul>
  <li><strong>Low cost per unit:</strong> You can start for less than $100 with a few rolls of dimes or quarters.</li>
  <li><strong>Government-issued, widely recognized:</strong> These are genuine US coins — universally identifiable and extremely difficult to counterfeit convincingly.</li>
  <li><strong>Low premiums:</strong> Often the most competitive way to buy silver by ounce.</li>
  <li><strong>Small denominations:</strong> 10¢ and 25¢ face value units are practical for potential barter scenarios where ounce bars would be too large.</li>
</ul>
<h2>How Junk Silver is Sold</h2>
<p>Junk silver is typically sold in:</p>
<ul>
  <li><strong>$1 face "rolls":</strong> A tube of 10 quarters or 50 dimes with $5 face</li>
  <li><strong>$100 face bags:</strong> Mixed 90% silver coins in a bag — approximately 71.5 ozt silver</li>
  <li><strong>$500 face bags</strong></li>
  <li><strong>$1,000 face "monster bags"</strong> — approximately 715 ozt silver, the institutional unit</li>
</ul>
<div class="ssr-cta">
  <h2>Shop Junk Silver at GoldBuller</h2>
  <p>We carry rolls and bags of 90% US silver coins at competitive premiums. Bitcoin accepted. Insured shipping on all orders.</p>
  <a href="${SITE_URL}/silver/junk-silver" class="ssr-cta-btn">Shop Junk Silver →</a>
</div>`,
  },
];

export function getGuideHtml(slug: string): string | null {
  const guide = GUIDES.find((g) => g.slug === slug);
  if (!guide) return null;

  const related = GUIDES.filter((g) => g.slug !== slug).slice(0, 3);

  const relatedHtml =
    related.length > 0
      ? `<div class="ssr-related">
    <h2>More Buying Guides</h2>
    <div class="ssr-card-grid">
      ${related
        .map(
          (r) => `<div class="ssr-card-sm">
        <a href="${SITE_URL}/guides/${r.slug}">${r.title}</a>
        <p style="color:#9ca3af;font-size:0.8rem;">${r.readTime}</p>
      </div>`,
        )
        .join("")}
    </div>
  </div>`
      : "";

  const schemaJson = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.title,
    description: guide.metaDescription,
    url: `${SITE_URL}/guides/${guide.slug}`,
    publisher: {
      "@type": "Organization",
      name: BRAND,
      url: SITE_URL,
    },
    author: {
      "@type": "Organization",
      name: BRAND,
    },
    keywords: guide.tags.join(", "),
  });

  const tagsHtml = guide.tags.map((t) => `<span class="ssr-tag">${t}</span>`).join("");

  const body = `
    ${tagsHtml}
    <h1>${guide.title}</h1>
    <p style="color:#6b7280;font-size:0.875rem;margin-bottom:2rem;">${guide.readTime} &bull; GoldBuller Research</p>
    ${guide.body}
    ${relatedHtml}`;

  return ssrHtmlShell({
    title: `${guide.title} | ${BRAND}`,
    description: guide.metaDescription,
    canonical: `${SITE_URL}/guides/${guide.slug}`,
    schemaJson,
    breadcrumbs: [
      { name: "Guides", url: `${SITE_URL}/guides` },
      { name: guide.title, url: `${SITE_URL}/guides/${guide.slug}` },
    ],
    body,
  });
}

export function getGuidesIndexHtml(): string {
  const schemaJson = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "GoldBuller Precious Metals Buying Guides",
    description:
      "Comprehensive guides for buying, storing, and investing in gold, silver, and platinum bullion.",
    url: `${SITE_URL}/guides`,
  });

  const body = `
    <h1>Precious Metals Buying Guides</h1>
    <p class="ssr-intro">Practical, research-backed guides on every aspect of buying, storing, and investing in gold and silver — written for real buyers, not just search engines.</p>
    <div class="ssr-card-grid">
      ${GUIDES.map(
        (g) => `<div class="ssr-card-sm">
        <a href="${SITE_URL}/guides/${g.slug}">${g.title}</a>
        <p style="margin-top:0.25rem;">${g.tags.map((t) => `<span class="ssr-tag" style="font-size:0.7rem;">${t}</span>`).join("")}</p>
        <p style="color:#9ca3af;font-size:0.8rem;margin-top:0.5rem;">${g.readTime}</p>
      </div>`,
      ).join("")}
    </div>
    <div class="ssr-cta">
      <h2>Ready to Buy?</h2>
      <p>Browse GoldBuller's full inventory of gold and silver bullion with transparent, spot-based pricing.</p>
      <a href="${SITE_URL}/gold" class="ssr-cta-btn">Shop Gold Bullion →</a>
    </div>`;

  return ssrHtmlShell({
    title: `Precious Metals Buying Guides — Gold, Silver &amp; IRA | ${BRAND}`,
    description:
      "10 expert guides on buying gold and silver bullion — coins vs bars, storage, Gold IRA, junk silver, portfolio allocation, and more. Research-backed, practical advice.",
    canonical: `${SITE_URL}/guides`,
    schemaJson,
    body,
  });
}
