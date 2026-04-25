# PureGold Trading

## Overview

Full-stack precious metals e-commerce website modelled after JM Bullion. Production-ready with 40 products, 50+ pages, live price ticker, charts, IRA section, blog, complete checkout flow, and a **Bitcoin OTC Desk** for purchasing 0.20–10 BTC with KYC and bank wire settlement.

## Architecture

pnpm monorepo with TypeScript throughout.

### Artifacts
- **`artifacts/puregold`** — React + Vite frontend (preview path `/`, port from `$PORT`)
- **`artifacts/api-server`** — Express 5 + Drizzle ORM API (port 8080)

### Libraries
- **`lib/db`** — Drizzle ORM schema + PostgreSQL client (`DATABASE_URL` env)
- **`lib/api-spec`** — OpenAPI 3.1 spec (`openapi.yaml`) — source of truth
- **`lib/api-zod`** — Orval-generated Zod schemas from OpenAPI spec
- **`lib/api-client-react`** — Orval-generated TanStack Query hooks from OpenAPI spec
- **`scripts`** — DB seed scripts

### Scripts package
- `pnpm --filter @workspace/scripts run seed` — Seeds 40 products + 5 blog posts

## Stack

- **Frontend**: React 18, Vite 7, Wouter routing, TanStack Query, Framer Motion, Chart.js / react-chartjs-2
- **Styling**: Tailwind CSS 4, dark luxury theme (obsidian #0A0A0A, gold #C9A84C)
- **Fonts**: Playfair Display (headings), Inter (body), Barlow Condensed, JetBrains Mono (prices)
- **Backend**: Express 5, Pino logger, cookie-parser, CORS with credentials
- **Database**: PostgreSQL + Drizzle ORM
- **API**: OpenAPI 3.1 → Orval codegen → typed React hooks

## Design Tokens

- `--primary`: `hsl(43 57% 55%)` = `#C9A84C` gold
- `--background`: `hsl(0 0% 4%)` = `#0A0A0A` obsidian
- `--card`: `hsl(0 0% 7%)` = `#111111` charcoal
- Default dark mode (set via `document.documentElement.classList.add('dark')` in `main.tsx`)

## Key Pages (40+)

### Shop
- `/` — Homepage with hero slider, live prices, product grids, testimonials, blog preview
- `/gold`, `/silver`, `/platinum`, `/palladium`, `/copper` — Category landing pages
- `/product/:slug` — Product detail with price lock, volume pricing, payment tabs, reviews
- `/on-sale`, `/new-arrivals`, `/best-sellers`, `/featured` — Listing pages
- `/silver/junk-silver` — Junk silver calculator
- `/cart` — Shopping cart with payment method switcher
- `/checkout` — 4-step checkout
- `/order-confirmation` — Order confirmation

### Charts & Data
- `/charts` — Charts hub
- `/charts/:metal` — Gold/silver/platinum/palladium/bitcoin price charts (Chart.js)
- `/charts/gold-silver-ratio` — Live ratio display
- `/fear-greed-index` — Fear & Greed gauge
- `/tax` — State-by-state tax guide (all 50 states + DC)

### Services
- `/ira` — Gold IRA page with IRA-eligible products
- `/sell-to-us` — Buyback prices (live from spot), quote form
- `/autobuy` — Recurring purchase setup
- `/investing-guide` — Education hub

### Blog
- `/blog` — Market Insights blog
- `/blog/:slug` — Individual posts

### Bitcoin OTC Desk
- `/bitcoin-otc` — OTC landing with live BTC price card + calculator (Coinbase API)
- `/bitcoin-otc/apply` — Purchase application form (KYC-gated)
- `/bitcoin-otc/how-it-works` — 5-step guide with step timeline
- `/bitcoin-otc/otc-vs-exchange` — Comparison table
- `/bitcoin-otc/bitcoin-ira` — Bitcoin IRA information page
- `/bitcoin-otc/faq` — Accordion FAQ
- `/charts/bitcoin-price` — Live BTC price chart (Chart.js)

### Account
- `/account/login`, `/account/register` (with BTC OTC interest checkbox)
- `/account/dashboard` — Portfolio metrics + KYC unlock card + OTC order preview
- `/account/orders`, `/account/watchlist`, `/account/price-alerts`
- `/account/kyc` — 4-step KYC wizard (personal info, address, ID upload, selfie)
- `/account/otc-orders` — OTC order list + `/account/otc-orders/:id` detail view

### Info
- `/about`, `/faq`, `/contact`, `/about/shipping`
- `/privacy-policy`, `/terms-of-service`

## API Routes (Express)

All routes at `/api/*`, prefix applied by Nginx proxy in production.

| Route | Description |
|---|---|
| `GET /api/healthz` | Health check |
| `GET /api/products` | List products with filters |
| `GET /api/products/:slug` | Product detail |
| `GET /api/products/featured` | Featured products |
| `GET /api/products/best-sellers` | Best sellers (filter by metal) |
| `GET /api/products/on-sale` | Sale products |
| `GET /api/products/new-arrivals` | New products |
| `GET /api/prices/spot` | Spot prices (live + fallback) |
| `GET /api/prices/history/:metal` | Price history with timeframe |
| `GET /api/cart` | Get session cart |
| `POST /api/cart/items` | Add to cart |
| `PATCH /api/cart/items/:id` | Update cart item |
| `DELETE /api/cart/items/:id` | Remove from cart |
| `POST /api/orders` | Create order |
| `GET /api/orders` | List user orders |
| `GET /api/blog/posts` | Blog posts (array) |
| `GET /api/blog/posts/:slug` | Individual post |
| `GET /api/stats/summary` | Site stats |

## Price Data

- **Metals**: Primary `api.metals.live/v1/spot` (live), fallback hardcoded. Refreshes every 60s via `PriceContext`.
- **Bitcoin**: Primary `api.coinbase.com/v2/prices/BTC-USD/spot`, fallback Binance, fallback $94,250. Refreshes every 30s via `useBTCPrice` hook in `src/lib/btcPrice.ts`.

## Bitcoin OTC Desk

- **KYC state**: stored in `localStorage` key `kyc_status`; auto-approves after 30s (demo)
- **OTC orders**: stored in `localStorage` key `otc_orders` as JSON array
- **KYC context**: `src/lib/kycContext.tsx` — `KYCProvider` wraps entire app
- **BTC price hook**: `src/lib/btcPrice.ts` — `useBTCPrice()` + `calculateSpread()`
- **OTC order utilities**: `src/lib/otcOrders.ts` — CRUD helpers for localStorage orders
- **Shared components**: `src/components/btc/` (`LiveBTCPrice`, `BTCCalculator`, `TierTable`) and `src/components/kyc/` (`KYCStatusBadge`, `FileUpload`)
- **OTC tiers**: Bronze 0.20–0.49 BTC (1.5% over spot), Silver 0.50–1.99 BTC (1.2%), Gold 2.00–4.99 BTC (0.9%), Platinum 5.00–10.00 BTC (0.6%)

## Cart

In-memory Map keyed by Express session cookie (`SESSION_SECRET` env var).
Also mirrored to `localStorage` via `CartContext` for immediate UI updates.

## Database Schema

- `products` — 40 precious metals products (coins, bars, rounds)
- `orders` — Customer orders with items JSON
- `blog_posts` — 5 market insight articles

## Codegen

When OpenAPI spec changes, regenerate client:
```bash
pnpm --filter @workspace/api-zod run generate
pnpm --filter @workspace/api-client-react run generate
```

## API Response Format Notes

- `GET /api/blog/posts` → returns plain array (not `{posts:[]}`) — frontend uses `Array.isArray(data)` guard
- `GET /api/products/featured`, `/best-sellers`, etc. → plain arrays
- `GET /api/products` → `{products: [], total: N}` paginated object
