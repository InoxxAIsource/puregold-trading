import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = parseInt(process.env.PORT ?? "3000", 10);
const PUBLIC_DIR = path.join(__dirname, "dist", "public");
const INDEX_HTML = path.join(PUBLIC_DIR, "index.html");
const LLMS_TXT = path.join(PUBLIC_DIR, "llms.txt");

const LINK_HEADER = [
  `<https://goldbuller.com/.well-known/api-catalog>; rel="api-catalog"`,
  `<https://goldbuller.com/llms.txt>; rel="alternate"; type="text/plain"`,
  `<https://goldbuller.com/.well-known/agent-skills/index.json>; rel="agent-skills"`,
  `<https://goldbuller.com/.well-known/mcp/server-card.json>; rel="mcp-server-card"`,
].join(", ");

const app = express();

// RFC 8288 — Link headers on every response
app.use((_req, res, next) => {
  res.set("Link", LINK_HEADER);
  next();
});

// Markdown for Agents (Cloudflare spec) — return llms.txt when Accept: text/markdown
app.use((req, res, next) => {
  const accept = req.headers.accept ?? "";
  if (req.method === "GET" && accept.includes("text/markdown") && fs.existsSync(LLMS_TXT)) {
    res.set("Content-Type", "text/markdown; charset=utf-8");
    res.set("X-Markdown-Source", "https://goldbuller.com/llms.txt");
    res.set("X-Markdown-Tokens", "true");
    return res.sendFile(LLMS_TXT);
  }
  next();
});

// Clean URL handler — serve /path/index.html directly without 301 redirect.
// express.static would redirect /gold → /gold/ (301); this avoids that for SEO.
app.use((req, res, next) => {
  const pathname = req.path;
  if (pathname.endsWith("/") || pathname.includes(".")) return next();
  const dirIndex = path.join(PUBLIC_DIR, pathname, "index.html");
  if (fs.existsSync(dirIndex)) {
    res.set("Cache-Control", "no-cache, no-store, must-revalidate");
    return res.sendFile(dirIndex);
  }
  next();
});

// Static assets (JS/CSS/images/fonts) — disable directory redirect
app.use(
  express.static(PUBLIC_DIR, {
    redirect: false,
    setHeaders(res, filePath) {
      if (/\.[0-9a-f]{8,}\.(js|css)$/i.test(path.basename(filePath))) {
        res.set("Cache-Control", "public, max-age=31536000, immutable");
      } else if (/\.(png|jpg|jpeg|gif|webp|avif|svg|ico|woff2?|ttf|eot)$/i.test(filePath)) {
        res.set("Cache-Control", "public, max-age=86400, stale-while-revalidate=604800");
      } else {
        res.set("Cache-Control", "no-cache, no-store, must-revalidate");
      }
    },
  }),
);

// SPA fallback — all unmatched routes serve root index.html
app.use((_req, res) => {
  res.set("Cache-Control", "no-cache, no-store, must-revalidate");
  res.sendFile(INDEX_HTML);
});

app.listen(PORT, "0.0.0.0", () => {
  process.stdout.write(`GoldBuller SPA server listening on port ${PORT}\n`);
});
