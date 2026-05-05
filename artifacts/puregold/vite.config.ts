import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
import type { IncomingMessage, ServerResponse } from "http";
import { seoPlugin } from "./seo/seoPlugin.js";

const rawPort = process.env.PORT;

if (!rawPort) {
  throw new Error(
    "PORT environment variable is required but was not provided.",
  );
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

const basePath = process.env.BASE_PATH;

if (!basePath) {
  throw new Error(
    "BASE_PATH environment variable is required but was not provided.",
  );
}

// Vite plugin: sets Cache-Control per response type (NOT globally).
// • Hashed JS/CSS chunks  → immutable (1 year)
// • Public images/fonts   → 1 day
// • HTML / SPA routes     → no-cache (must revalidate every visit)
function assetCachePlugin(): Plugin {
  function setHeaders(req: IncomingMessage, res: ServerResponse, next: () => void) {
    const url = req.url ?? "";
    const pathname = url.split("?")[0];

    if (pathname.endsWith(".html") || pathname === "/" || !pathname.includes(".")) {
      // HTML and SPA routes — never cache
      res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    } else if (/\.(png|jpg|jpeg|gif|webp|avif|svg|ico|woff2?|ttf|eot)(\?.*)?$/.test(pathname)) {
      // Static images and fonts — safe to cache for 1 day
      res.setHeader("Cache-Control", "public, max-age=86400, stale-while-revalidate=604800");
    } else {
      // JS, CSS, and everything else — no-cache so HMR and React instances stay consistent
      res.setHeader("Cache-Control", "no-cache");
    }

    next();
  }

  return {
    name: "asset-cache-control",
    configureServer(server) {
      server.middlewares.use(setHeaders);
    },
    configurePreviewServer(server) {
      server.middlewares.use(setHeaders);
    },
  };
}

// Vite plugin: adds RFC 8288 Link headers for agent discovery on every dev response
function agentDiscoveryPlugin(): Plugin {
  const LINK_HEADERS = [
    `<https://goldbuller.com/.well-known/api-catalog>; rel="api-catalog"`,
    `<https://goldbuller.com/llms.txt>; rel="alternate"; type="text/plain"`,
    `<https://goldbuller.com/.well-known/agent-skills/index.json>; rel="agent-skills"`,
    `<https://goldbuller.com/.well-known/mcp/server-card.json>; rel="mcp-server-card"`,
  ].join(", ");

  function addLinkHeaders(_req: IncomingMessage, res: ServerResponse, next: () => void) {
    res.setHeader("Link", LINK_HEADERS);
    next();
  }

  return {
    name: "agent-discovery",
    configureServer(server) {
      server.middlewares.use(addLinkHeaders);
    },
    configurePreviewServer(server) {
      server.middlewares.use(addLinkHeaders);
    },
  };
}

export default defineConfig({
  base: basePath,
  plugins: [
    react(),
    tailwindcss(),
    runtimeErrorOverlay(),
    assetCachePlugin(),
    agentDiscoveryPlugin(),
    seoPlugin(),
    ...(process.env.NODE_ENV !== "production" &&
    process.env.REPL_ID !== undefined
      ? [
          await import("@replit/vite-plugin-cartographer").then((m) =>
            m.cartographer({
              root: path.resolve(import.meta.dirname, ".."),
            }),
          ),
          await import("@replit/vite-plugin-dev-banner").then((m) =>
            m.devBanner(),
          ),
        ]
      : []),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "src"),
      "@assets": path.resolve(import.meta.dirname, "..", "..", "attached_assets"),
    },
    dedupe: ["react", "react-dom"],
  },
  root: path.resolve(import.meta.dirname),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules/react") || id.includes("node_modules/react-dom")) {
            return "react-vendor";
          }
          if (id.includes("node_modules/@tanstack")) {
            return "tanstack-vendor";
          }
          if (id.includes("node_modules/recharts") || id.includes("node_modules/d3")) {
            return "charts-vendor";
          }
          if (id.includes("node_modules/lucide-react")) {
            return "icons-vendor";
          }
          if (id.includes("node_modules/@radix-ui")) {
            return "radix-vendor";
          }
        },
      },
    },
  },
  server: {
    port,
    strictPort: true,
    host: "0.0.0.0",
    allowedHosts: true,
    // HMR WebSocket cannot connect through Replit's path-based proxy.
    // The failed connection triggers the runtime-error-modal plugin which
    // loads a second React instance and causes an "Invalid hook call" crash.
    // Disabling HMR eliminates the crash with no user-visible downside
    // (the proxy blocks the WebSocket regardless).
    hmr: false,
    fs: {
      strict: true,
    },
  },
  preview: {
    port,
    host: "0.0.0.0",
    allowedHosts: true,
  },
});
