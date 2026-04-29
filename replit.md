# GoldBuller — Precious Metals E-Commerce Platform

## Overview

Production-ready precious metals bullion e-commerce site (goldbuller.com). Full-stack with 40 products, 50+ pages, live spot prices, real order management with bank wire settlement, KYC approval workflow, Bitcoin OTC desk, transactional emails via Resend, and a password-protected admin panel.

---

## Architecture

pnpm monorepo with TypeScript throughout.

### Artifacts
- **`artifacts/puregold`** — React + Vite frontend (preview path `/`, port from `$PORT`)
- **`artifacts/api-server`** — Express 5 + Drizzle ORM API (port from `$PORT`, default 8080)

### Libraries
- **`lib/db`** — Drizzle ORM schema + PostgreSQL client (`DATABASE_URL` env)
- **`lib/api-spec`** — OpenAPI 3.1 spec (`openapi.yaml`) — source of truth for codegen
- **`lib/api-zod`** — Orval-generated Zod schemas from OpenAPI spec
- **`lib/api-client-react`** — Orval-generated TanStack Query hooks from OpenAPI spec

### Scripts
- **`scripts`** — DB seed scripts
- `pnpm --filter @workspace/scripts run seed` — Seeds 40 products + 5 blog posts

---

## Stack

- **Frontend**: React 18, Vite 7, Wouter routing, TanStack Query, Framer Motion, Chart.js / react-chartjs-2
- **Styling**: Tailwind CSS 4, dark luxury theme (obsidian #0A0A0A, gold #C9A84C)
- **Fonts**: Playfair Display (`font-serif`) for headings, Inter for body, JetBrains Mono for prices
- **Backend**: Express 5, Pino logger, cookie-parser, CORS with credentials
- **Database**: PostgreSQL + Drizzle ORM
- **Email**: Resend API (`RESEND_API_KEY` env), from `support@goldbuller.com`
- **API**: OpenAPI 3.1 → Orval codegen → typed React hooks

---

## Design Tokens

- `--primary`: `hsl(43 57% 55%)` = `#C9A84C` gold
- `--background`: `hsl(0 0% 4%)` = `#0A0A0A` obsidian
- `--card`: `hsl(0 0% 7%)` = `#111111` charcoal
- Default dark mode (set via `document.documentElement.classList.add('dark')` in `main.tsx`)
- Headings use `font-serif` (Playfair Display) — **never** `font-playfair`

---

## Environment Variables / Secrets

| Secret | Purpose |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `SESSION_SECRET` | Express session signing |
| `RESEND_API_KEY` | Transactional email (Resend) |
| `ADMIN_PASSWORD` | Admin panel password |

---

## Auth System

Pure localStorage-based (no server sessions for user accounts):
- `pg_users` — array of `{ firstName, lastName, email, password }` objects
- `pg_auth` — current session `{ email, name }` object
- `AuthContext` (`src/contexts/AuthContext.tsx`) — provides `user`, `login()`, `logout()`, `saveUser()`, `emailTaken()`

---

## Admin Panel

- Route: `/admin`
- Password-protected via `localStorage("adminPw")` compared against `ADMIN_PASSWORD` env var (fetched from `/api/admin/auth`)
- **Two tabs**: "KYC Applications" and "Orders"
- Admin email: `chainlayer650@gmail.com` (env: `KYC_ADMIN_EMAIL`)
- KYC tab: list of applicants, approve/decline controls, email notifications via Resend
- Orders tab: stats grid, expandable order rows, bank wire setup form for `pending_wire_instructions` orders, cancel/decline/complete controls

---

## Order System

### Order Statuses (flow)
```
pending_wire_instructions → wire_pending → wire_received → completed
                                                         → cancelled
                                                         → declined
```

### Order DB Schema (`lib/db/src/schema/orders.ts`)
Extended fields beyond basics:
- `userEmail` — customer email (used for lookup)
- `bankName`, `bankAddress`, `accountName`, `accountNumber`, `routingNumber`, `swiftCode` — set per-order by admin
- `wireDeadline` — ISO timestamp; 4-hour window set when admin sends wire instructions
- `insurance` — insurance amount in cents
- `shippingAddress` — JSON `{ firstName, lastName, email, phone?, address, city, state, zip }`
- `items` — JSON array `[{ name, price, quantity }]`

### Order API Routes (`artifacts/api-server/src/routes/orders.ts`)

| Route | Description |
|---|---|
| `POST /api/orders` | Create order (returns 409 if pending order exists for email) |
| `GET /api/orders?email=` | List orders for a user |
| `GET /api/orders/pending-check?email=` | Returns `{ hasPending: bool }` |
| `POST /api/orders/set-wire` | Admin: set bank wire details + send wire email to customer |
| `PATCH /api/orders/:id/status` | Admin: update order status (cancel/decline/complete/wire_received) |
| `POST /api/orders/receipt` | Customer: upload wire receipt (base64), emails admin |

### Pending Order Gate
- `CheckoutPage` checks `/api/orders/pending-check` on mount; blocks checkout with a full-screen block screen if a pending order exists
- `POST /api/orders` returns HTTP 409 if a pending order already exists for that email

---

## Email Infrastructure (Resend)

All emails sent from `support@goldbuller.com` via Resend API:

| Trigger | Recipient | Template |
|---|---|---|
| KYC submitted | Admin (`KYC_ADMIN_EMAIL`) | KYC application details |
| KYC approved | Customer | Approval confirmation |
| KYC declined | Customer | Decline notification |
| Order placed | Admin | New order summary |
| Wire instructions sent (admin sets bank) | Customer | Full wire instructions + deadline |
| Receipt uploaded | Admin | Receipt notification with base64 image |

---

## KYC System

- **KYC state**: stored in `localStorage` key `kyc_status`
- **KYC context**: `src/lib/kycContext.tsx` — `KYCProvider` wraps entire app
- **Shared components**: `src/components/kyc/` (`KYCStatusBadge`, `FileUpload`)
- **4-step KYC wizard** at `/account/kyc`: personal info → address → ID upload → selfie
- KYC approval unlocks Bitcoin OTC purchasing (not sign-up)

---

## Bitcoin OTC Desk

Bitcoin OTC is discoverable via:
- The cart / checkout flow (KYC gate prompts after adding to cart)
- Account dashboard (KYC unlock card)
- "Bitcoin OTC" nav menu item

**Not** on the registration form (checkbox removed).

### OTC Data
- **OTC orders**: stored in `localStorage` key `otc_orders` as JSON array
- **BTC price hook**: `src/lib/btcPrice.ts` — `useBTCPrice()` + `calculateSpread()`
- **OTC order utilities**: `src/lib/otcOrders.ts` — CRUD helpers for localStorage orders
- **Shared components**: `src/components/btc/` (`LiveBTCPrice`, `BTCCalculator`, `TierTable`)

### OTC Spread Tiers
| Tier | Range | Spread |
|---|---|---|
| Bronze | 0.20–0.49 BTC | 1.5% over spot |
| Silver | 0.50–1.99 BTC | 1.2% over spot |
| Gold | 2.00–4.99 BTC | 0.9% over spot |
| Platinum | 5.00–10.00 BTC | 0.6% over spot |

---

## Account Dashboard Stats (real, per-user)

All 4 dashboard metric cards are computed from the user's actual API orders:
- **Total Spent** — sum of `total` across completed orders
- **Orders Placed** — total order count for this user
- **Orders Completed** — count of orders with `status = completed`
- **Active OTC Orders** — computed from localStorage OTC orders

---

## Price Data

- **Metals**: Primary `api.metals.live/v1/spot` (live), fallback hardcoded. Refreshes every 60s via `PriceContext`.
- **Bitcoin**: Primary `api.coinbase.com/v2/prices/BTC-USD/spot`, fallback Binance, fallback $94,250. Refreshes every 30s.

---

## Cart

In-memory Map keyed by Express session cookie (`SESSION_SECRET` env var). Also mirrored to `localStorage` via `CartContext` for immediate UI updates.

---

## Database Schema (`lib/db/src/schema/`)

| Table | Description |
|---|---|
| `products` | 40 precious metals products (coins, bars, rounds) |
| `orders` | Customer orders with items JSON, wire fields, status |
| `blog_posts` | 5 market insight articles |

**DB push command**: `pnpm --filter @workspace/db run push-force`

---

## SEO / Static Pages

Pre-built at deploy time via:
```bash
node seo/generateStaticPages.mjs && node seo/generateFunnelPages.mjs
```
(configured as `prebuild` in `artifacts/puregold/package.json`)

---

## Full API Route Reference

| Route | Description |
|---|---|
| `GET /api/healthz` | Health check |
| `GET /api/products` | List products with filters → `{products:[], total:N}` |
| `GET /api/products/:slug` | Product detail |
| `GET /api/products/featured` | Featured products (plain array) |
| `GET /api/products/best-sellers` | Best sellers (plain array) |
| `GET /api/products/on-sale` | Sale products (plain array) |
| `GET /api/products/new-arrivals` | New arrivals (plain array) |
| `GET /api/prices/spot` | Spot prices (live + fallback) |
| `GET /api/prices/history/:metal` | Price history with timeframe |
| `GET /api/cart` | Get session cart |
| `POST /api/cart/items` | Add to cart |
| `PATCH /api/cart/items/:id` | Update cart item qty |
| `DELETE /api/cart/items/:id` | Remove cart item |
| `POST /api/orders` | Create order (409 if pending exists) |
| `GET /api/orders?email=` | List orders for user email |
| `GET /api/orders/pending-check?email=` | Check for pending order |
| `POST /api/orders/set-wire` | Admin: set bank wire + email customer |
| `PATCH /api/orders/:id/status` | Admin: update order status |
| `POST /api/orders/receipt` | Customer: upload wire receipt |
| `POST /api/kyc/submit` | Submit KYC application (emails admin) |
| `POST /api/kyc/approve` | Admin: approve KYC (emails customer) |
| `POST /api/kyc/decline` | Admin: decline KYC (emails customer) |
| `GET /api/blog/posts` | Blog posts (plain array) |
| `GET /api/blog/posts/:slug` | Individual post |
| `GET /api/stats/summary` | Site stats |
| `POST /api/admin/auth` | Validate admin password |

---

## Full Page Reference (50+)

### Shop
- `/` — Homepage: hero slider, live prices, product grids, testimonials, blog preview
- `/gold`, `/silver`, `/platinum`, `/palladium`, `/copper` — Category pages
- `/product/:slug` — Product detail: price lock, volume pricing, payment tabs, reviews
- `/on-sale`, `/new-arrivals`, `/best-sellers`, `/featured` — Listing pages
- `/silver/junk-silver` — Junk silver calculator
- `/cart` — Shopping cart with payment method switcher
- `/checkout` — Multi-step checkout with pending-order gate
- `/order-confirmation` — Post-order confirmation

### Account
- `/account/login` — Sign in
- `/account/register` — Create account (name, email, password — no BTC checkbox)
- `/account/dashboard` — Portfolio stats (real data) + KYC card + wire deadline cards + recent orders
- `/account/orders` — Full order list with wire instructions, receipt upload, status banners
- `/account/watchlist` — Saved products
- `/account/price-alerts` — Price alert management
- `/account/kyc` — 4-step KYC wizard
- `/account/otc-orders` — Bitcoin OTC order list
- `/account/otc-orders/:id` — OTC order detail

### Bitcoin OTC
- `/bitcoin-otc` — Landing with live BTC price + calculator
- `/bitcoin-otc/apply` — Purchase application (KYC-gated)
- `/bitcoin-otc/how-it-works` — 5-step guide
- `/bitcoin-otc/otc-vs-exchange` — Comparison table
- `/bitcoin-otc/bitcoin-ira` — Bitcoin IRA info
- `/bitcoin-otc/faq` — Accordion FAQ

### Charts & Data
- `/charts` — Charts hub
- `/charts/:metal` — Gold/silver/platinum/palladium/bitcoin price charts
- `/charts/gold-silver-ratio` — Live ratio display
- `/fear-greed-index` — Fear & Greed gauge
- `/tax` — State-by-state precious metals tax guide (all 50 states + DC)

### Services
- `/ira` — Gold IRA page with IRA-eligible products
- `/sell-to-us` — Buyback prices + quote form
- `/autobuy` — Recurring purchase setup
- `/investing-guide` — Education hub

### Blog
- `/blog` — Market Insights blog
- `/blog/:slug` — Individual posts

### Info
- `/about`, `/faq`, `/contact`, `/about/shipping`
- `/privacy-policy`, `/terms-of-service`
- `/rare-coins`, `/guides`

### Admin
- `/admin` — Password-protected admin panel (KYC Applications + Orders tabs)

---

## Codegen (when OpenAPI spec changes)

```bash
pnpm --filter @workspace/api-spec run codegen
```

## API Response Format Notes

- `GET /api/blog/posts` → plain array (not `{posts:[]}`) — frontend uses `Array.isArray()` guard
- `GET /api/products/featured`, `/best-sellers`, etc. → plain arrays
- `GET /api/products` → `{products: [], total: N}` paginated object
