import type { Plugin } from "vite";
import type { IncomingMessage, ServerResponse } from "http";
import { getGlossaryTermHtml, getGlossaryIndexHtml, GLOSSARY_TERMS } from "./glossary.js";
import { getGuideHtml, getGuidesIndexHtml, GUIDES } from "./guides.js";

const SITE_URL = "https://goldbuller.com";

function buildSitemap(): string {
  const now = new Date().toISOString().split("T")[0];

  const staticUrls = [
    { loc: `${SITE_URL}/`, priority: "1.0", changefreq: "daily" },
    { loc: `${SITE_URL}/gold`, priority: "0.9", changefreq: "daily" },
    { loc: `${SITE_URL}/silver`, priority: "0.9", changefreq: "daily" },
    { loc: `${SITE_URL}/platinum`, priority: "0.8", changefreq: "daily" },
    { loc: `${SITE_URL}/charts`, priority: "0.7", changefreq: "daily" },
    { loc: `${SITE_URL}/blog`, priority: "0.7", changefreq: "weekly" },
    { loc: `${SITE_URL}/ira`, priority: "0.7", changefreq: "monthly" },
    { loc: `${SITE_URL}/sell-to-us`, priority: "0.6", changefreq: "monthly" },
    { loc: `${SITE_URL}/faq`, priority: "0.6", changefreq: "monthly" },
    { loc: `${SITE_URL}/contact`, priority: "0.5", changefreq: "monthly" },
    { loc: `${SITE_URL}/learn`, priority: "0.8", changefreq: "weekly" },
    { loc: `${SITE_URL}/guides`, priority: "0.8", changefreq: "weekly" },
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

function buildRobots(): string {
  return `User-agent: *
Allow: /

# Block faceted/filter URLs from crawlers to preserve crawl budget
Disallow: /gold?*
Disallow: /silver?*
Disallow: /platinum?*
Disallow: /account/
Disallow: /api/

Sitemap: ${SITE_URL}/sitemap.xml
`;
}

function handleSeoRequest(
  req: IncomingMessage,
  res: ServerResponse,
  next: () => void,
): void {
  const url = (req.url ?? "").split("?")[0].replace(/\/$/, "") || "/";

  // Sitemap
  if (url === "/sitemap.xml") {
    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=3600");
    res.end(buildSitemap());
    return;
  }

  // Robots
  if (url === "/robots.txt") {
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=86400");
    res.end(buildRobots());
    return;
  }

  // Glossary index
  if (url === "/learn") {
    const html = getGlossaryIndexHtml();
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=86400");
    res.end(html);
    return;
  }

  // Glossary term
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

  // Guides index
  if (url === "/guides") {
    const html = getGuidesIndexHtml();
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=86400");
    res.end(html);
    return;
  }

  // Guide detail
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

export function seoPlugin(): Plugin {
  return {
    name: "goldbuller-seo",
    configureServer(server) {
      server.middlewares.use(handleSeoRequest);
    },
    configurePreviewServer(server) {
      server.middlewares.use(handleSeoRequest);
    },
  };
}
