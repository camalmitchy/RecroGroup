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
| `DATABASE_URL` | PostgreSQL connection string |
| `BETTER_AUTH_SECRET` | Secret for encryption/hashing (min. 32 chars). Generate with `openssl rand -base64 32` |
| `BETTER_AUTH_URL` | App base URL, e.g. `http://localhost:3000` |

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
| `npm run db:studio` | Open Prisma Studio |

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

New users default to `customer`. Unauthenticated access to `/dashboard` redirects to `/login`.

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
