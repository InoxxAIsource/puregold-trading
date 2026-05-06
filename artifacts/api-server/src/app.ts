import express, { type Express } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import pinoHttp from "pino-http";
import router from "./routes";
import wellknownRouter from "./routes/wellknown";
import { logger } from "./lib/logger";

const app: Express = express();

// www → non-www permanent redirect — must be first, before logging/CORS
app.use((req, res, next) => {
  if (req.hostname && req.hostname.startsWith("www.")) {
    res.redirect(301, `https://goldbuller.com${req.url}`);
    return;
  }
  next();
});

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);
app.use(cors({ credentials: true, origin: true }));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cookieParser());

// RFC 8288 Link headers — agent discovery on every response
const AGENT_LINK_HEADERS = [
  `<https://goldbuller.com/.well-known/api-catalog>; rel="api-catalog"`,
  `<https://goldbuller.com/llms.txt>; rel="alternate"; type="text/plain"`,
  `<https://goldbuller.com/.well-known/agent-skills/index.json>; rel="agent-skills"`,
  `<https://goldbuller.com/.well-known/mcp/server-card.json>; rel="mcp-server-card"`,
].join(", ");

app.use((req, res, next) => {
  res.set("Link", AGENT_LINK_HEADERS);
  next();
});

// Markdown negotiation (text/markdown → redirect to llms.txt for HTML pages)
app.use((req, res, next) => {
  const accept = req.headers.accept ?? "";
  const isWellKnown = req.path.startsWith("/.well-known");
  if (accept.includes("text/markdown") && !isWellKnown && req.method === "GET") {
    res.set("Content-Type", "text/markdown; charset=utf-8");
    res.set("X-Markdown-Source", "https://goldbuller.com/llms.txt");
    res.redirect(307, "/llms.txt");
    return;
  }
  next();
});

// Well-known routes (agent discovery, RFC 9727, RFC 8414, RFC 9728, MCP)
app.use(wellknownRouter);

// Cache-control for read-heavy public API endpoints
app.use("/api/products", (req, res, next) => {
  if (req.method === "GET") {
    res.set("Cache-Control", "public, max-age=60, stale-while-revalidate=300");
  }
  next();
});
app.use("/api/prices", (req, res, next) => {
  if (req.method === "GET") {
    res.set("Cache-Control", "public, max-age=30, stale-while-revalidate=120");
  }
  next();
});
app.use("/api/blog", (req, res, next) => {
  if (req.method === "GET") {
    res.set("Cache-Control", "public, max-age=300, stale-while-revalidate=600");
  }
  next();
});

app.use("/api", router);

export default app;
