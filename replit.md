# GoldBuller — Precious Metals E-Commerce Platform

## Overview

GoldBuller is a production-ready, full-stack e-commerce platform specializing in precious metals bullion. It features a comprehensive product catalog, live spot prices for metals and Bitcoin, a robust order management system with bank wire settlement, a KYC approval workflow, and a Bitcoin OTC desk. The platform supports transactional emails and includes a password-protected administrative panel for managing operations. The business vision is to provide a secure and feature-rich online destination for buying and selling precious metals, catering to both seasoned investors and new buyers, with ambitions to capture a significant share of the online bullion market.

## User Preferences

I prefer iterative development with clear communication at each stage. Ask before making major architectural changes or introducing new external dependencies. For code, I appreciate well-structured, readable TypeScript. Detailed explanations are preferred for complex logic or API integrations. Do not make changes to files under the `lib/db/src/schema/` directory without explicit approval.

## System Architecture

The project is built as a `pnpm` monorepo using TypeScript across all components.

**Core Components:**
- **Frontend (`artifacts/puregold`):** A React application leveraging Vite for fast development, Wouter for routing, TanStack Query for data fetching, Framer Motion for animations, and Chart.js for data visualization. Styling is managed with Tailwind CSS 4, adhering to a dark luxury theme (`obsidian #0A0A0A`, `gold #C9A84C`). Custom fonts include Playfair Display for headings and Inter for body text.
- **Backend (`artifacts/api-server`):** An Express 5 API server utilizing Drizzle ORM for database interactions, Pino for logging, and configured with `cookie-parser` and CORS with credentials.
- **Shared Libraries:**
    - `lib/db`: Drizzle ORM schema and PostgreSQL client configuration.
    - `lib/api-spec`: OpenAPI 3.1 specification (`openapi.yaml`) serving as the single source of truth for API definitions.
    - `lib/api-zod`: Orval-generated Zod schemas for API validation.
    - `lib/api-client-react`: Orval-generated TanStack Query hooks for React, providing type-safe API interactions.

**Key Features & Implementations:**
- **Authentication:** Pure localStorage-based for user accounts, managing user details and session information (`AuthContext`).
- **Admin Panel:** Located at `/admin`, password-protected, offering "KYC Applications" and "Orders" management with approval/decline workflows and email notifications.
- **Order System:** Features a state-driven order lifecycle (e.g., `pending_wire_instructions` → `completed`), comprehensive database schema for order details including bank wire information, and dedicated API routes for creation, status updates, and receipt uploads. Includes a pending order gate to prevent multiple simultaneous checkouts.
- **KYC System:** A 4-step wizard at `/account/kyc` for personal info, address, ID upload, and selfie, with status stored in `localStorage` and managed via `KYCContext`. Approval unlocks Bitcoin OTC purchasing.
- **Bitcoin OTC Desk:** Functionality for buying Bitcoin, incorporating live BTC prices, spread tiers, and OTC order management within `localStorage`.
- **API Design:** Follows OpenAPI 3.1 specification, with codegen used to ensure type safety between frontend and backend.
- **SEO & Agent Readiness:** Implements static page generation for improved SEO (route-specific HTML, glossary terms), `llms.txt` for AI search optimization, and various `.well-known` endpoints and Link headers for AI agent discoverability and interaction (RFC 9727, RFC 8414, RFC 9728, SEP-1649, agentskills.io v0.2.0). WebMCP (`navigator.modelContext.provideContext()`) exposes tools for agents.
- **Cart System:** In-memory `Map` keyed by session cookie, mirrored to `localStorage` for immediate UI updates.
- **Price Data:** Integrates live spot prices for metals from `api.metals.live/v1/spot` and Bitcoin prices from `api.coinbase.com/v2/prices/BTC-USD/spot`, with fallbacks.

## External Dependencies

- **Database:** PostgreSQL
- **Email Service:** Resend API (for transactional emails)
- **Payment Gateway:** Bank Wire Settlement (manual process integrated into order management)
- **Live Metal Prices API:** `api.metals.live/v1/spot`
- **Live Bitcoin Prices API:** `api.coinbase.com/v2/prices/BTC-USD/spot` (with Binance fallback)
- **Code Generation:** Orval (for OpenAPI client generation)
- **Libraries:** React, Vite, Wouter, TanStack Query, Framer Motion, Chart.js, Express, Drizzle ORM, Pino, cookie-parser, CORS, Tailwind CSS.