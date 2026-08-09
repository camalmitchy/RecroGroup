# Recro Group

Web platform for **Recro Group** — behavioral health and relationship-focused care for individuals, couples, families, children, and corporate teams.

The app combines a public marketing site, customer/staff portal, and authentication backed by **Better Auth** and **PostgreSQL**.

## Tech stack

| Layer | Tools |
| --- | --- |
| Framework | [Next.js 16](https://nextjs.org) (App Router) |
| UI | [React 19](https://react.dev), [Tailwind CSS 4](https://tailwindcss.com), [shadcn/ui](https://ui.shadcn.com) |
| Forms & validation | [react-hook-form](https://react-hook-form.com), [Zod](https://zod.dev) |
| Data fetching | [TanStack Query](https://tanstack.com/query) |
| Auth | [Better Auth](https://www.better-auth.com) |
| Database | [PostgreSQL](https://www.postgresql.org) via [Prisma 7](https://www.prisma.io) + `@prisma/adapter-pg` |
| Toasts | [Sonner](https://sonner.emilkowal.ski) |

## Project structure

```
src/
├── app/
│   ├── (public)/          # Marketing pages (home, about, grief camp, etc.)
│   ├── (auth)/            # Login, sign up, forgot password
│   ├── (portal)/dashboard # Role-based staff & customer portal
│   └── api/auth/[...all]/ # Better Auth catch-all handler
├── components/ui/         # shadcn components
├── features/
│   ├── auth/              # Auth forms, schemas, TanStack Query hooks
│   ├── portal/            # Dashboard shell, permissions, session
│   └── public/            # Public page sections & data
├── lib/
│   ├── auth.ts            # Better Auth server instance
│   ├── auth-client.ts     # Better Auth React client
│   └── prisma.ts          # Prisma client (pg adapter)
└── shared/                # Site shell, providers, shared UI
prisma/
├── schema.prisma          # Better Auth + Recro domain models
└── SCHEMA_MAP.md          # Data model reference
```

## Prerequisites

- **Node.js** 20.19+ (recommended: 22.x)
- **PostgreSQL** database (local or hosted, e.g. Neon)
- npm (or pnpm / yarn / bun)

## Getting started

### 1. Install dependencies

```bash
npm install
```

### 2. Environment variables

Copy the example env file and fill in your values:

```bash
cp .env.example .env
```

| Variable | Description |
| --- | --- |
| `DATABASE_URL` | PostgreSQL connection string (required) |
| `BETTER_AUTH_SECRET` | Secret for signing sessions/tokens (min. 32 chars). Generate with `openssl rand -base64 32` |
| `BETTER_AUTH_URL` | App base URL for auth links, e.g. `http://localhost:3000` or production domain |
| `DEV_PORTAL_ROLE` | *(Optional, dev only)* Forces a fake session role when no `BETTER_AUTH_SECRET` is set in development. One of: `admin`, `receptionist`, `customer` |

### 3. Database setup

Generate the Prisma client and push the schema to your database:

```bash
npm run db:generate
npm run db:push
```

For migration-based workflows:

```bash
npm run db:migrate
```

Open Prisma Studio to inspect data:

```bash
npm run db:studio
```

### 4. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:push` | Push schema to database |
| `npm run db:migrate` | Run Prisma migrations |
| `npm run db:seed` | Seed services and grief camp price tiers |
| `npm run db:studio` | Open Prisma Studio |
| `npm test` | Run the test suite once |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Run tests with coverage |

## Tests

[Vitest](https://vitest.dev) with two projects — `node` for server and library
code, `jsdom` for components. Tests live in `src/**/__tests__/`.

Coverage is concentrated where a mistake costs money: phone normalisation,
deposit and balance resolution, Paystack's subunit conversion, webhook signature
verification, Daraja's Buy Goods shortcode/till distinction, the callback IP
allowlist, and settlement idempotency.

`server-only` throws outside a Next server context, so `vitest.config.mts`
aliases it to a stub. Tests are excluded from `tsconfig.json` and typechecked
separately via `tsconfig.test.json`.

CI (`.github/workflows/ci.yml`) runs typecheck, lint, tests, and the production
build, plus a separate job that applies migrations against a real Postgres,
seeds it, and fails if the schema has drifted from the migration history.

## Payments

Two providers sit behind one interface (`PaymentProviderAdapter` in `src/lib/payments/types.ts`):

| Method | Provider | Notes |
| --- | --- | --- |
| M-Pesa | Safaricom Daraja | STK Push. Buy Goods (Till) by default |
| Card | Paystack | KES, card channel only |
| Bank transfer | — | Manual, staff-verified from the portal |

### Money is resolved server-side

Booking and grief camp amounts are **never** taken from the client. `src/lib/payments/pricing.ts` reads `Service.priceKes` and the `CampSession` / `CampPriceTier` tables, so a tampered request cannot change what is charged. Donations are the one exception — the donor chooses the amount, which is then validated and bounded.

Run `npm run db:seed` after migrating, or bookings and camp applications will have no prices to resolve.

### Endpoints

| Route | Purpose |
| --- | --- |
| `POST /api/payments/initiate` | Start a charge; returns a reference and, for cards, a redirect URL |
| `GET /api/payments/status/[reference]` | Poll status; re-queries the provider when still pending |
| `GET /api/payments/return` | Where Paystack sends the customer back |
| `POST /api/payments/webhooks/mpesa` | Daraja STK callback |
| `POST /api/payments/webhooks/mpesa/c2b` | Daraja C2B confirmation (till paid directly) |
| `POST /api/payments/webhooks/mpesa/validation` | Daraja C2B validation |
| `POST /api/payments/webhooks/paystack` | Paystack webhook (HMAC-SHA512 verified) |

### Idempotency

Every inbound notification is written to `payment_events` with a unique `dedupeKey`, so a replayed callback hits the unique constraint and is ignored rather than double-crediting. Settlement itself runs in a transaction that refuses to re-apply an already-terminal payment. Clients pass an `idempotencyKey` on initiate so a double-click cannot create two charges.

Daraja callbacks carry **no signature**, so production should set `MPESA_ENFORCE_IP_ALLOWLIST="true"` to restrict them to Safaricom's ranges. Paystack webhooks are verified by HMAC over the raw body.

### Local development

Daraja needs a publicly reachable HTTPS callback. Expose your dev server with a tunnel and point `MPESA_CALLBACK_URL` at it:

```bash
cloudflared tunnel --url http://localhost:3000
```

See `.env.example` for the full list of payment variables.

## Authentication

Auth is handled by **Better Auth** with a single API route:

```
src/app/api/auth/[...all]/route.ts
```

All auth endpoints (`/api/auth/sign-in/email`, `/api/auth/sign-up/email`, `/api/auth/get-session`, etc.) are served through this catch-all handler — no per-action API routes are needed.

### Auth pages

| Route | Purpose |
| --- | --- |
| `/login` | Sign in |
| `/join-us` | Create account |
| `/forgot-password` | Request password reset |

Forms use **react-hook-form** + **Zod** for client-side validation (inline field errors). Server/auth errors on sign-in are shown via **Sonner toasts**. TanStack Query wraps auth mutations and session caching.

### Roles

| Role | Access |
| --- | --- |
| `customer` | Customer dashboard |
| `receptionist` | Bookings, payments, programs, inquiries |
| `admin` | Full portal (content, people, settings) |

New users default to `customer`. Unauthenticated access to `/dashboard` redirects to `/login`, and `/admin` is gated on staff in its layout.

## Server layer

```
src/server/
├── actions/      # "use server" mutations, all returning ActionResult<T>
├── queries/      # read helpers for server components (server-only)
├── validation/   # Zod schemas
└── authz.ts      # requireSession / requireStaff / requireAdmin
```

Actions never throw at the client. They return
`{ok: true, data} | {ok: false, error, fieldErrors?}`, and internal errors are
logged server-side rather than returned, so Prisma internals never reach the
browser.

Mutations are guarded: staff operations use `requireStaff`, catalog and role
changes require `requireAdmin`. A few guards exist because the alternative
corrupts data — a settled payment cannot be relinked to a different booking, a
service or therapist with bookings cannot be deleted, and an admin cannot remove
their own administrator access.

## Key routes

**Public:** `/`, `/about`, `/grief-camp`, `/insights`, `/faq`, `/contact`

**Portal:** `/dashboard`, `/dashboard/bookings`, `/dashboard/payments`, `/dashboard/programs`, `/dashboard/inquiries`, `/dashboard/content`, `/dashboard/people`, `/dashboard/settings`

## Assets

Static images and icons live in `public/assets/` (landing photos, therapy imagery, service icons).

## Further reading

- [Better Auth docs](https://www.better-auth.com/docs)
- [Prisma 7 upgrade guide](https://www.prisma.io/docs/guides/upgrade-prisma-orm/v7) (driver adapter required)
- [Next.js App Router](https://nextjs.org/docs/app)
- Domain schema notes: [`prisma/SCHEMA_MAP.md`](./prisma/SCHEMA_MAP.md)
