import fs from "fs";
import path from "path";
import type { Plugin } from "vite";
import type { IncomingMessage, ServerResponse } from "http";
import { getGlossaryTermHtml, getGlossaryIndexHtml, GLOSSARY_TERMS } from "./glossary.js";
import { getGuideHtml, getGuidesIndexHtml, GUIDES } from "./guides.js";

export const SITE_URL = "https://goldbuller.com";
const OG_IMAGE = `${SITE_URL}/opengraph.jpg`;

// ---------------------------------------------------------------------------
// Per-route meta map
// ---------------------------------------------------------------------------
interface PageMeta {
  title: string;
  description: string;
  schema?: string; // raw JSON-LD string
}

const ORG_SCHEMA = JSON.stringify({
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      "name": "GoldBuller LLC",
      "url": SITE_URL,
      "logo": `${SITE_URL}/favicon.svg`,
      "contactPoint": {
        "@type": "ContactPoint",
        "email": "support@goldbuller.com",
        "telephone": "+18004656669",
        "contactType": "customer service",
      },
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      "url": SITE_URL,
      "name": "GoldBuller LLC",
      "publisher": { "@id": `${SITE_URL}/#organization` },
      "potentialAction": {
        "@type": "SearchAction",
        "target": `${SITE_URL}/search?q={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    },
  ],
});

const PAGE_METAS: Record<string, PageMeta> = {
  "/": {
    title: "Buy Gold & Silver Bullion Online | GoldBuller LLC",
    description:
      "Shop 107 gold, silver, platinum & palladium bullion products. Competitive spot prices, fully insured shipping, and KYC-compliant Bitcoin OTC desk. GoldBuller LLC — trusted since 2018.",
    schema: ORG_SCHEMA,
  },
  "/gold": {
    title: "Buy Gold Coins & Bars | 50 Products | GoldBuller LLC",
    description:
      "Browse 50 gold bullion products — American Eagles, PAMP Suisse bars, fractional gold, kilo bars & more. Competitive spot pricing updated daily. Free insured shipping on orders $99+.",
  },
  "/silver": {
    title: "Buy Silver Coins & Bars | 35 Products | GoldBuller LLC",
    description:
      "Shop 35 silver bullion products including Silver Eagles, Maple Leafs, silver rounds & 100 oz bars. Competitive spot pricing. Free insured shipping on orders $99+. GoldBuller LLC.",
  },
  "/platinum": {
    title: "Buy Platinum Bullion Coins & Bars | GoldBuller LLC",
    description:
      "Shop platinum bullion — American Eagle Platinum coins and platinum bars from the world's leading mints. Competitive spot pricing, fully insured shipping. GoldBuller LLC.",
  },
  "/palladium": {
    title: "Buy Palladium Bullion Coins & Bars | GoldBuller LLC",
    description:
      "Shop palladium bullion products including American Eagle Palladium coins and palladium bars. Fully insured discreet shipping nationwide. GoldBuller LLC.",
  },
  "/copper": {
    title: "Buy Copper Bullion Rounds & Bars | GoldBuller LLC",
    description:
      "Shop copper bullion rounds, bars, and coins at GoldBuller LLC. Affordable entry-level precious metals investing. Free insured shipping on orders $99+.",
  },
  "/ira": {
    title: "Gold & Silver IRA | Precious Metals IRA | GoldBuller LLC",
    description:
      "Protect your retirement with IRA-eligible gold and silver bullion. GoldBuller LLC guides you through setting up a self-directed precious metals IRA with IRS-approved custodians.",
  },
  "/sell-to-us": {
    title: "Sell Your Gold & Silver | GoldBuller LLC Buyback Prices",
    description:
      "Sell your precious metals to GoldBuller LLC at competitive spot prices — typically 97–99% of spot for bullion. Fast payment, insured shipping, streamlined process. Get a free quote.",
  },
  "/buyback-guarantee": {
    title: "Buyback Guarantee | Sell Precious Metals | GoldBuller LLC",
    description:
      "GoldBuller LLC buys back gold, silver, platinum & palladium at competitive spot prices. Immediate liquidation or consignment program. Fast payment, insured shipping. Free quote.",
  },
  "/faq": {
    title: "Precious Metals FAQ | Help Center | GoldBuller LLC",
    description:
      "Answers to common questions about buying gold & silver, shipping & insurance, pricing, payments, KYC verification, product types, and investing with GoldBuller LLC.",
    schema: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Is there a minimum order at GoldBuller LLC?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. GoldBuller LLC's minimum order is $99 per transaction, regardless of payment method.",
          },
        },
        {
          "@type": "Question",
          "name": "Is my precious metals shipment insured?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. All GoldBuller LLC shipments are fully insured for the complete value of the contents from the time they leave our facility until the package is signed for at your address.",
          },
        },
        {
          "@type": "Question",
          "name": "What payment methods does GoldBuller LLC accept?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "GoldBuller LLC accepts bank wire transfer, ACH/electronic check, credit/debit cards, and Bitcoin (BTC). Bank wire and check payments may qualify for a cash discount of up to 4%.",
          },
        },
        {
          "@type": "Question",
          "name": "How long does shipping take from GoldBuller LLC?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Orders are typically packaged and shipped within 14 business days of receiving good funds. Delivery takes 3–5 business days via UPS, USPS, or FedEx once shipped.",
          },
        },
        {
          "@type": "Question",
          "name": "Does GoldBuller LLC offer a buyback guarantee?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. GoldBuller LLC offers two buyback options: Immediate Liquidation (fast payout at current bid price for all bullion) and a Consignment Program (for eligible Investment Grade Coins held 60+ months).",
          },
        },
      ],
    }),
  },
  "/shipping": {
    title: "Shipping, Handling & Insurance | GoldBuller LLC",
    description:
      "GoldBuller LLC ships via UPS, USPS & FedEx. Free insured shipping on orders $99+. All packages are fully insured and discreetly packaged. Delivery in 3–5 business days.",
  },
  "/bitcoin-otc": {
    title: "Bitcoin OTC Desk | Buy Gold & Silver with BTC | GoldBuller LLC",
    description:
      "Use Bitcoin to buy physical gold and silver at GoldBuller LLC's OTC desk. Trades from 0.20 to 10 BTC. Insured wire settlement, KYC required. No exchange slippage.",
  },
  "/bitcoin-otc/how-it-works": {
    title: "How Bitcoin OTC Works | GoldBuller LLC BTC Desk",
    description:
      "Learn how GoldBuller LLC's Bitcoin OTC desk works — step-by-step process for buying gold and silver with BTC. No exchange, no slippage, fully insured settlement.",
  },
  "/charts": {
    title: "Live Gold & Silver Price Charts | GoldBuller LLC",
    description:
      "Track live gold, silver, platinum, and palladium spot prices with interactive real-time charts on GoldBuller LLC. Updated continuously during market hours.",
  },
  "/fear-greed-index": {
    title: "Precious Metals Fear & Greed Index | GoldBuller LLC",
    description:
      "Track investor sentiment in the gold and silver market with GoldBuller LLC's Fear & Greed Index. Updated daily. Use it to time your precious metals purchases.",
  },
  "/on-sale": {
    title: "Gold & Silver On Sale | Discounted Bullion | GoldBuller LLC",
    description:
      "Shop sale-priced gold and silver bullion at GoldBuller LLC. Discounted coins, bars, and rounds at competitive spot-based pricing. Free insured shipping $99+.",
  },
  "/new-arrivals": {
    title: "New Gold & Silver Arrivals | Latest Bullion | GoldBuller LLC",
    description:
      "Browse the latest additions to GoldBuller LLC's precious metals catalog — new gold coins, silver bars, and bullion products added regularly.",
  },
  "/rare-coins": {
    title: "Rare & Numismatic Coins | NGC & PCGS Graded | GoldBuller LLC",
    description:
      "Shop NGC and PCGS-graded rare and numismatic coins at GoldBuller LLC. Pre-1933 gold coins, proof sets, Morgan dollars, and investment-grade certified coins.",
  },
  "/tax": {
    title: "Precious Metals Sales Tax by State | GoldBuller LLC",
    description:
      "Understand sales tax rules for buying gold and silver in your state. GoldBuller LLC's guide covers state-by-state bullion tax exemptions and IRS reporting thresholds.",
  },
  "/contact": {
    title: "Contact GoldBuller LLC | Precious Metals Support",
    description:
      "Contact GoldBuller LLC. Email support@goldbuller.com or call 1-800-GOLD-NOW (Mon–Fri 9am–6pm ET). Dallas, TX. Bullion purchase inquiries, quote requests & support.",
  },
  "/about": {
    title: "About GoldBuller LLC | Trusted Precious Metals Dealer",
    description:
      "GoldBuller LLC is a trusted Texas-based precious metals dealer offering gold, silver, platinum, palladium & copper bullion since 2018. A+ BBB rated, NGC authorized.",
  },
  "/privacy-policy": {
    title: "Privacy Policy | GoldBuller LLC",
    description:
      "GoldBuller LLC's Privacy Policy — how we collect, use, and protect your personal information across our website, communications, in-person visits, and transactions.",
  },
  "/terms-of-service": {
    title: "Client Agreement & Terms of Service | GoldBuller LLC",
    description:
      "GoldBuller LLC's Client Agreement covering purchasing, market loss policy, KYC verification, shipping & insurance, returns, governing law (Texas), and dispute resolution.",
  },
  "/autobuy": {
    title: "Auto-Buy Precious Metals | Dollar-Cost Averaging | GoldBuller LLC",
    description:
      "Set up automatic recurring purchases of gold and silver bullion with GoldBuller LLC's Auto-Buy program. Dollar-cost averaging made simple and fully automated.",
  },
  "/silver/junk-silver": {
    title: "Junk Silver Coins | 90% Silver US Coins | GoldBuller LLC",
    description:
      "Buy junk silver — 90% silver US coins (pre-1965 dimes, quarters, half-dollars) at GoldBuller LLC. Great value for silver investors. Free shipping on orders $99+.",
  },
};

// ---------------------------------------------------------------------------
// HTML meta injector — runs on raw index.html string before Vite transforms
// ---------------------------------------------------------------------------
function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function injectPageMeta(html: string, pathname: string): string {
  const meta = PAGE_METAS[pathname];
  if (!meta) return html;

  const canonical = `${SITE_URL}${pathname === "/" ? "" : pathname}`;
  const { title, description, schema } = meta;

  const tags = [
    `  <link rel="canonical" href="${canonical}" />`,
    `  <meta property="og:title" content="${esc(title)}" />`,
    `  <meta property="og:description" content="${esc(description)}" />`,
    `  <meta property="og:url" content="${canonical}" />`,
    `  <meta property="og:type" content="website" />`,
    `  <meta property="og:site_name" content="GoldBuller LLC" />`,
    `  <meta property="og:locale" content="en_US" />`,
    `  <meta property="og:image" content="${OG_IMAGE}" />`,
    `  <meta name="twitter:card" content="summary_large_image" />`,
    `  <meta name="twitter:site" content="@goldbuller" />`,
    `  <meta name="twitter:title" content="${esc(title)}" />`,
    `  <meta name="twitter:description" content="${esc(description)}" />`,
    `  <meta name="twitter:image" content="${OG_IMAGE}" />`,
    schema ? `  <script type="application/ld+json">${schema}</script>` : "",
  ]
    .filter(Boolean)
    .join("\n");

  return html
    .replace(/<title>[^<]*<\/title>/, `<title>${esc(title)}</title>`)
    .replace(
      /<meta name="description"[^>]*>/,
      `<meta name="description" content="${esc(description)}" />`,
    )
    .replace("</head>", `${tags}\n</head>`);
}

// ---------------------------------------------------------------------------
// Sitemap
// ---------------------------------------------------------------------------
function buildSitemap(): string {
  const now = new Date().toISOString().split("T")[0];

  const staticUrls: { loc: string; priority: string; changefreq: string }[] = [
    { loc: `${SITE_URL}/`, priority: "1.0", changefreq: "daily" },
    { loc: `${SITE_URL}/gold`, priority: "0.9", changefreq: "daily" },
    { loc: `${SITE_URL}/silver`, priority: "0.9", changefreq: "daily" },
    { loc: `${SITE_URL}/platinum`, priority: "0.8", changefreq: "daily" },
    { loc: `${SITE_URL}/palladium`, priority: "0.7", changefreq: "daily" },
    { loc: `${SITE_URL}/copper`, priority: "0.7", changefreq: "daily" },
    { loc: `${SITE_URL}/charts`, priority: "0.7", changefreq: "daily" },
    { loc: `${SITE_URL}/charts/gold-silver-ratio`, priority: "0.6", changefreq: "daily" },
    { loc: `${SITE_URL}/charts/bitcoin-price`, priority: "0.6", changefreq: "daily" },
    { loc: `${SITE_URL}/fear-greed-index`, priority: "0.6", changefreq: "daily" },
    { loc: `${SITE_URL}/on-sale`, priority: "0.6", changefreq: "daily" },
    { loc: `${SITE_URL}/new-arrivals`, priority: "0.6", changefreq: "weekly" },
    { loc: `${SITE_URL}/best-sellers`, priority: "0.6", changefreq: "weekly" },
    { loc: `${SITE_URL}/rare-coins`, priority: "0.7", changefreq: "weekly" },
    { loc: `${SITE_URL}/silver/junk-silver`, priority: "0.6", changefreq: "weekly" },
    { loc: `${SITE_URL}/bitcoin-otc`, priority: "0.8", changefreq: "weekly" },
    { loc: `${SITE_URL}/bitcoin-otc/how-it-works`, priority: "0.6", changefreq: "monthly" },
    { loc: `${SITE_URL}/bitcoin-otc/otc-vs-exchange`, priority: "0.6", changefreq: "monthly" },
    { loc: `${SITE_URL}/bitcoin-otc/bitcoin-ira`, priority: "0.6", changefreq: "monthly" },
    { loc: `${SITE_URL}/bitcoin-otc/faq`, priority: "0.5", changefreq: "monthly" },
    { loc: `${SITE_URL}/ira`, priority: "0.7", changefreq: "monthly" },
    { loc: `${SITE_URL}/tax`, priority: "0.6", changefreq: "monthly" },
    { loc: `${SITE_URL}/autobuy`, priority: "0.5", changefreq: "monthly" },
    { loc: `${SITE_URL}/sell-to-us`, priority: "0.7", changefreq: "monthly" },
    { loc: `${SITE_URL}/buyback-guarantee`, priority: "0.7", changefreq: "monthly" },
    { loc: `${SITE_URL}/faq`, priority: "0.6", changefreq: "monthly" },
    { loc: `${SITE_URL}/shipping`, priority: "0.6", changefreq: "monthly" },
    { loc: `${SITE_URL}/contact`, priority: "0.5", changefreq: "monthly" },
    { loc: `${SITE_URL}/about`, priority: "0.5", changefreq: "monthly" },
    { loc: `${SITE_URL}/privacy-policy`, priority: "0.4", changefreq: "monthly" },
    { loc: `${SITE_URL}/terms-of-service`, priority: "0.4", changefreq: "monthly" },
    { loc: `${SITE_URL}/blog`, priority: "0.7", changefreq: "weekly" },
    { loc: `${SITE_URL}/learn`, priority: "0.8", changefreq: "weekly" },
    { loc: `${SITE_URL}/guides`, priority: "0.8", changefreq: "weekly" },
    { loc: `${SITE_URL}/insights`, priority: "0.8", changefreq: "weekly" },
  ];

  const glossaryUrls = GLOSSARY_TERMS.map((t) => ({
    loc: `${SITE_URL}/learn/${t.slug}`,
    priority: "0.7",
    changefreq: "monthly",
  }));

  const guideUrls = GUIDES.map((g) => ({
    loc: `${SITE_URL}/guides/${g.slug}`,
    priority: "0.7",
    changefreq: "monthly",
  }));

  const allUrls = [...staticUrls, ...glossaryUrls, ...guideUrls];

  const urlEntries = allUrls
    .map(
      (u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`,
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>`;
}

// ---------------------------------------------------------------------------
// Robots.txt
// ---------------------------------------------------------------------------
function buildRobots(): string {
  return `User-agent: *
Allow: /

# Block faceted/filter URLs to preserve crawl budget
Disallow: /gold?*
Disallow: /silver?*
Disallow: /platinum?*
Disallow: /account/
Disallow: /api/

# Block AI training scrapers
User-agent: GPTBot
Disallow: /

User-agent: Google-Extended
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`;
}

// ---------------------------------------------------------------------------
// Middleware: sitemap, robots, glossary, guides
// ---------------------------------------------------------------------------
function handleSeoRequest(
  req: IncomingMessage,
  res: ServerResponse,
  next: () => void,
): void {
  const url = (req.url ?? "").split("?")[0].replace(/\/$/, "") || "/";

  if (url === "/sitemap.xml") {
    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=3600");
    res.end(buildSitemap());
    return;
  }

  if (url === "/robots.txt") {
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=86400");
    res.end(buildRobots());
    return;
  }

  if (url === "/learn") {
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=86400");
    res.end(getGlossaryIndexHtml());
    return;
  }

  const learnMatch = url.match(/^\/learn\/([a-z0-9-]+)$/);
  if (learnMatch) {
    const html = getGlossaryTermHtml(learnMatch[1]);
    if (html) {
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      res.setHeader("Cache-Control", "public, max-age=86400");
      res.end(html);
      return;
    }
    res.statusCode = 404;
    res.end("Not found");
    return;
  }

  if (url === "/guides") {
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=86400");
    res.end(getGuidesIndexHtml());
    return;
  }

  const guideMatch = url.match(/^\/guides\/([a-z0-9-]+)$/);
  if (guideMatch) {
    const html = getGuideHtml(guideMatch[1]);
    if (html) {
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      res.setHeader("Cache-Control", "public, max-age=86400");
      res.end(html);
      return;
    }
    res.statusCode = 404;
    res.end("Not found");
    return;
  }

  next();
}

// ---------------------------------------------------------------------------
// Vite plugin
// ---------------------------------------------------------------------------
export function seoPlugin(): Plugin {
  return {
    name: "goldbuller-seo",

    configureServer(server) {
      // 1. Static SEO files (sitemap, robots, SSR pages)
      server.middlewares.use(handleSeoRequest);

      // 2. Per-route SPA meta injection
      //    Intercepts HTML page requests before Vite's SPA fallback,
      //    injects route-specific meta into index.html, then hands to Vite
      //    so it can still inject the HMR client and other transforms.
      server.middlewares.use(async (req, res, next) => {
        try {
          const rawUrl = req.url ?? "/";
          const pathname = rawUrl.split("?")[0].replace(/\/$/, "") || "/";

          // Skip: file assets, already-handled SEO routes
          if (
            pathname.includes(".") ||
            pathname.startsWith("/learn") ||
            pathname.startsWith("/guides")
          ) {
            next();
            return;
          }

          // Only inject for routes we have meta for
          if (!PAGE_METAS[pathname]) {
            next();
            return;
          }

          const indexPath = path.resolve(server.config.root, "index.html");
          let html = fs.readFileSync(indexPath, "utf-8");
          html = injectPageMeta(html, pathname);
          // Let Vite apply its own transforms (HMR client, etc.)
          html = await server.transformIndexHtml(rawUrl, html);

          res.setHeader("Content-Type", "text/html; charset=utf-8");
          res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
          res.end(html);
        } catch (err) {
          next(err);
        }
      });
    },

    configurePreviewServer(server) {
      server.middlewares.use(handleSeoRequest);
    },
  };
}
