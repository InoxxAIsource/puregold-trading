import { Router } from "express";

const router = Router();

const BASE_URL = "https://goldbuller.com";

const LINK_HEADERS = [
  `<${BASE_URL}/.well-known/api-catalog>; rel="api-catalog"`,
  `<${BASE_URL}/llms.txt>; rel="alternate"; type="text/plain"`,
  `<${BASE_URL}/.well-known/agent-skills/index.json>; rel="agent-skills"`,
  `<${BASE_URL}/.well-known/mcp/server-card.json>; rel="mcp-server-card"`,
].join(", ");

router.use((req, res, next) => {
  res.set("Link", LINK_HEADERS);
  next();
});

// RFC 9727 — API Catalog (application/linkset+json)
router.get("/.well-known/api-catalog", (req, res) => {
  res.set("Content-Type", "application/linkset+json");
  res.json({
    linkset: [
      {
        anchor: `${BASE_URL}/api`,
        "service-desc": [
          {
            href: `${BASE_URL}/api/openapi.json`,
            type: "application/openapi+json",
          },
        ],
        "service-doc": [{ href: `${BASE_URL}/faq` }],
        status: [{ href: `${BASE_URL}/api/healthz` }],
      },
    ],
  });
});

// RFC 8414 — OAuth Authorization Server Metadata
// GoldBuller does not use OAuth; document this explicitly for agents
router.get("/.well-known/oauth-authorization-server", (req, res) => {
  res.json({
    issuer: BASE_URL,
    grant_types_supported: [],
    response_types_supported: [],
    note: "GoldBuller does not use OAuth. Public API endpoints require no token. Order and KYC actions use session cookies.",
  });
});

// RFC 9728 — OAuth Protected Resource Metadata
router.get("/.well-known/oauth-protected-resource", (req, res) => {
  res.json({
    resource: `${BASE_URL}/api`,
    authorization_servers: [],
    scopes_supported: [],
    note: "All read endpoints are public. Authenticated write actions (orders, KYC) use HttpOnly session cookies — no bearer token required.",
  });
});

// SEP-1649 — MCP Server Card
router.get("/.well-known/mcp/server-card.json", (req, res) => {
  res.json({
    $schema:
      "https://modelcontextprotocol.io/schema/server-card/v1.json",
    serverInfo: {
      name: "GoldBuller API",
      version: "1.0.0",
      description:
        "Precious metals bullion e-commerce API. Live spot prices, full product catalog, and market data for gold, silver, platinum, palladium, and copper.",
    },
    transport: {
      type: "http",
      endpoint: `${BASE_URL}/api`,
    },
    capabilities: {
      tools: true,
      resources: true,
      prompts: false,
    },
    tools: [
      {
        name: "get_spot_prices",
        description: "Get live spot prices for all metals",
        endpoint: `${BASE_URL}/api/prices/spot`,
        method: "GET",
      },
      {
        name: "list_products",
        description: "Browse the bullion product catalog (filter by metal, type, on_sale)",
        endpoint: `${BASE_URL}/api/products`,
        method: "GET",
      },
      {
        name: "get_product",
        description: "Get details for a specific bullion product by slug",
        endpoint: `${BASE_URL}/api/products/:slug`,
        method: "GET",
      },
      {
        name: "get_price_history",
        description: "Get price history for a metal (1d, 1w, 1m, 3m, 1y)",
        endpoint: `${BASE_URL}/api/prices/history/:metal`,
        method: "GET",
      },
    ],
    contact: {
      email: "support@goldbuller.com",
      url: BASE_URL,
    },
  });
});

// Agent Skills Discovery (agentskills.io RFC v0.2.0)
router.get("/.well-known/agent-skills/index.json", (req, res) => {
  res.json({
    $schema: "https://agentskills.io/schema/v0.2.0/index.json",
    skills: [
      {
        name: "get-spot-prices",
        type: "api",
        description:
          "Get real-time spot prices for gold, silver, platinum, palladium, and copper from GoldBuller",
        url: `${BASE_URL}/api/prices/spot`,
      },
      {
        name: "list-products",
        type: "api",
        description:
          "Browse GoldBuller's bullion catalog — coins, bars, rounds — filterable by metal and type",
        url: `${BASE_URL}/api/products`,
      },
      {
        name: "get-price-history",
        type: "api",
        description:
          "Retrieve historical spot prices for any metal over 1d/1w/1m/3m/1y timeframes",
        url: `${BASE_URL}/api/prices/history/:metal`,
      },
      {
        name: "read-site-overview",
        type: "document",
        description:
          "Structured plain-text overview of GoldBuller for AI retrieval systems",
        url: `${BASE_URL}/llms.txt`,
      },
      {
        name: "get-api-catalog",
        type: "document",
        description: "Machine-readable API catalog (RFC 9727 / linkset+json)",
        url: `${BASE_URL}/.well-known/api-catalog`,
      },
    ],
  });
});

// Markdown negotiation — redirect to llms.txt for agents requesting text/markdown
router.get("/.well-known/markdown", (req, res) => {
  res.redirect(307, "/llms.txt");
});

export default router;
