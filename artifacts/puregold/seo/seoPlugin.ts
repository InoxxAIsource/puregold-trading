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
  h1: string;
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
      "Shop gold, silver, platinum & palladium bullion at GoldBuller LLC. Competitive spot prices, insured shipping, and Bitcoin OTC desk. Trusted since 2018.",
    h1: "Buy Gold & Silver Bullion Online",
    schema: ORG_SCHEMA,
  },
  "/gold": {
    title: "Buy Gold Coins & Bars | 50 Products | GoldBuller LLC",
    description:
      "Browse gold bullion — American Eagles, PAMP Suisse bars, fractional gold & kilo bars. Competitive spot pricing updated daily. Free insured shipping $99+.",
    h1: "Buy Gold Bullion Coins & Bars",
  },
  "/silver": {
    title: "Buy Silver Coins & Bars | 35 Products | GoldBuller LLC",
    description:
      "Shop silver bullion including Silver Eagles, Maple Leafs, rounds & 100 oz bars. Competitive pricing. Free insured shipping $99+. GoldBuller LLC.",
    h1: "Buy Silver Bullion Coins & Bars",
  },
  "/platinum": {
    title: "Buy Platinum Bullion Coins & Bars | GoldBuller LLC",
    description:
      "Shop platinum bullion — American Eagle Platinum coins and bars from leading mints. Competitive spot pricing, fully insured shipping. GoldBuller LLC.",
    h1: "Buy Platinum Bullion Coins & Bars",
  },
  "/palladium": {
    title: "Buy Palladium Bullion Coins & Bars | GoldBuller LLC",
    description:
      "Shop palladium bullion products including American Eagle Palladium coins and palladium bars. Fully insured discreet shipping nationwide. GoldBuller LLC.",
    h1: "Buy Palladium Bullion Coins & Bars",
  },
  "/copper": {
    title: "Buy Copper Bullion Rounds & Bars | GoldBuller LLC",
    description:
      "Shop copper bullion rounds, bars, and coins at GoldBuller LLC. Affordable entry-level precious metals investing. Free insured shipping on orders $99+.",
    h1: "Buy Copper Bullion Rounds & Bars",
  },
  "/ira": {
    title: "Gold & Silver IRA | Precious Metals IRA | GoldBuller LLC",
    description:
      "Open a precious metals IRA with GoldBuller LLC. IRA-eligible gold and silver bullion, IRS-approved custodians, and expert guidance for your retirement.",
    h1: "Gold & Silver Precious Metals IRA",
  },
  "/sell-to-us": {
    title: "Sell Your Gold & Silver | GoldBuller LLC Buyback Prices",
    description:
      "Sell gold & silver to GoldBuller LLC at competitive spot prices — 97–99% of spot for bullion. Fast payment, insured shipping. Get a free quote today.",
    h1: "Sell Your Gold & Silver to GoldBuller",
  },
  "/buyback-guarantee": {
    title: "Buyback Guarantee | Sell Precious Metals | GoldBuller LLC",
    description:
      "GoldBuller LLC buys back gold, silver, platinum & palladium at competitive spot prices. Immediate liquidation or consignment program. Fast payment. Free quote.",
    h1: "GoldBuller Buyback Guarantee",
  },
  "/faq": {
    title: "Precious Metals FAQ | Help Center | GoldBuller LLC",
    description:
      "Common questions about buying gold & silver, shipping, pricing, payments, KYC verification, and investing with GoldBuller LLC.",
    h1: "Precious Metals Frequently Asked Questions",
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
      "GoldBuller LLC ships via UPS, USPS & FedEx. Free insured shipping on orders $99+. Fully insured and discreetly packaged. Delivery in 3–5 business days.",
    h1: "Shipping, Handling & Insurance Policy",
  },
  "/bitcoin-otc": {
    title: "Bitcoin OTC Desk | Buy Gold & Silver with BTC | GoldBuller LLC",
    description:
      "Buy physical gold and silver with Bitcoin at GoldBuller LLC's OTC desk. Trades from 0.20–10 BTC. KYC required. No exchange slippage.",
    h1: "Bitcoin OTC Desk — Buy Gold & Silver with BTC",
  },
  "/bitcoin-otc/how-it-works": {
    title: "How Bitcoin OTC Works | GoldBuller LLC BTC Desk",
    description:
      "How GoldBuller LLC's Bitcoin OTC desk works — step-by-step for buying gold and silver with BTC. No exchange, no slippage, fully insured settlement.",
    h1: "How the Bitcoin OTC Desk Works",
  },
  "/charts": {
    title: "Live Gold & Silver Price Charts | GoldBuller LLC",
    description:
      "Track live gold, silver, platinum, and palladium spot prices with interactive real-time charts on GoldBuller LLC. Updated continuously during market hours.",
    h1: "Live Gold & Silver Price Charts",
  },
  "/fear-greed-index": {
    title: "Precious Metals Fear & Greed Index | GoldBuller LLC",
    description:
      "Track investor sentiment in the gold and silver market with GoldBuller LLC's Fear & Greed Index. Updated daily. Use it to time your precious metals purchases.",
    h1: "Precious Metals Fear & Greed Index",
  },
  "/on-sale": {
    title: "Gold & Silver On Sale | Discounted Bullion | GoldBuller LLC",
    description:
      "Shop sale-priced gold and silver bullion at GoldBuller LLC. Discounted coins, bars, and rounds at competitive spot-based pricing. Free insured shipping $99+.",
    h1: "Gold & Silver Bullion On Sale",
  },
  "/new-arrivals": {
    title: "New Gold & Silver Arrivals | Latest Bullion | GoldBuller LLC",
    description:
      "Browse the latest additions to GoldBuller LLC's precious metals catalog — new gold coins, silver bars, and bullion products added regularly.",
    h1: "New Precious Metals Arrivals",
  },
  "/rare-coins": {
    title: "Rare & Numismatic Coins | NGC & PCGS Graded | GoldBuller LLC",
    description:
      "Shop NGC and PCGS-graded rare and numismatic coins at GoldBuller LLC. Pre-1933 gold coins, proof sets, Morgan dollars, and investment-grade certified coins.",
    h1: "Rare & Numismatic Coins — NGC & PCGS Graded",
  },
  "/tax": {
    title: "Precious Metals Sales Tax by State | GoldBuller LLC",
    description:
      "Understand precious metals sales tax rules by state. GoldBuller LLC covers state-by-state bullion tax exemptions and IRS reporting thresholds.",
    h1: "Precious Metals Sales Tax by State",
  },
  "/contact": {
    title: "Contact GoldBuller LLC | Precious Metals Support",
    description:
      "Contact GoldBuller LLC: support@goldbuller.com or 1-800-GOLD-NOW (Mon–Fri 9am–6pm ET), Dallas TX. Purchase inquiries, quotes & support.",
    h1: "Contact GoldBuller LLC",
  },
  "/about": {
    title: "About GoldBuller LLC | Trusted Precious Metals Dealer",
    description:
      "GoldBuller LLC is a trusted Texas-based precious metals dealer offering gold, silver, platinum & copper bullion since 2018. A+ BBB rated, NGC authorized.",
    h1: "About GoldBuller LLC — Trusted Precious Metals Dealer",
  },
  "/privacy-policy": {
    title: "Privacy Policy | GoldBuller LLC",
    description:
      "GoldBuller LLC's Privacy Policy: how we collect, use, and protect your personal information across our website, communications, and transactions.",
    h1: "GoldBuller LLC Privacy Policy",
  },
  "/terms-of-service": {
    title: "Client Agreement & Terms of Service | GoldBuller LLC",
    description:
      "GoldBuller LLC Client Agreement: purchasing terms, market loss policy, KYC, shipping & insurance, returns, and Texas governing law.",
    h1: "Client Agreement & Terms of Service",
  },
  "/autobuy": {
    title: "Auto-Buy Precious Metals | Dollar-Cost Averaging | GoldBuller LLC",
    description:
      "Set up automatic recurring purchases of gold and silver bullion with GoldBuller LLC's Auto-Buy program. Dollar-cost averaging made simple and fully automated.",
    h1: "Auto-Buy Precious Metals — Dollar-Cost Averaging",
  },
  "/silver/junk-silver": {
    title: "Junk Silver Coins | 90% Silver US Coins | GoldBuller LLC",
    description:
      "Buy junk silver — 90% silver US coins (pre-1965 dimes, quarters, half-dollars) at GoldBuller LLC. Great value for investors. Free shipping $99+.",
    h1: "Junk Silver Coins — 90% US Silver",
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
  const { title, description, h1, schema } = meta;

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

  // Inject an <h1> inside #root so crawlers that don't execute JS still find
  // a heading. React replaces the contents of #root immediately on hydration,
  // so human visitors never see this element. Styled to match the dark theme
  // to prevent any brief flash before the app mounts.
  const h1Tag = `<h1 style="background:#0c0c0e;color:#f9f9f7;margin:0;padding:2rem;font-family:Georgia,serif;font-size:2rem;">${esc(h1)}</h1>`;

  return html
    .replace(/<title>[^<]*<\/title>/, `<title>${esc(title)}</title>`)
    .replace(
      /<meta name="description"[^>]*>/,
      `<meta name="description" content="${esc(description)}" />`,
    )
    .replace("</head>", `${tags}\n</head>`)
    .replace('<div id="root"></div>', `<div id="root">${h1Tag}</div>`);
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

  if (url === "/learn" || url === "/learn/") {
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=86400");
    res.end(getGlossaryIndexHtml());
    return;
  }

  const learnMatch = url.match(/^\/learn\/([a-z0-9-]+)\/?$/);
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

  if (url === "/guides" || url === "/guides/") {
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=86400");
    res.end(getGuidesIndexHtml());
    return;
  }

  const guideMatch = url.match(/^\/guides\/([a-z0-9-]+)\/?$/);
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
