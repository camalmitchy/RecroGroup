# Recro Group handover

This is the map of the live site at [recrogroup.org](https://recrogroup.org). Read this first. The code comments on the files listed at the end mark the same flows inside the repository.

`DEPLOYMENT.md` is an older DigitalOcean draft. Production runs on Vercel. Do not follow that file for the live site.

## What the site does

Recro Group is a therapy and grief-camp practice in Kenya. The site has three areas:

- The public site: services, booking, grief camp, contact, and program forms.
- The staff portal at `/dashboard`: bookings, payments, messages, and programs.
- A second staff area at `/admin` with the same data and a few Director-only pages.

Money is in Kenyan shillings. Card checkout through Paystack is wired but not the live method. Customers pay by M-Pesa Buy Goods till **747736**.

## How a change reaches the live site

1. Code lives in the GitHub repository `camalmitchy/RecroGroup`.
2. Vercel project `recro-group` (team `camal`) builds `main` and serves `recrogroup.org`.
3. The production database is Vercel Postgres. The local `.env` database is a different database. A role or booking changed locally does not appear on the live site.
4. The build command is `prisma generate && next build`. It does **not** run `prisma migrate deploy`. New columns that production needs are added at runtime by `src/lib/payments/ensure-schema.ts` when a payment or booking path runs. Keep that in mind before relying on a migration alone.

## Accounts to hand over

Transfer ownership. Do not email `.env`, API keys, or the database URL.

| What | Where it lives | Notes |
| --- | --- | --- |
| Source code | GitHub `camalmitchy/RecroGroup` | Invite the new owner, then transfer the repo. |
| Hosting and database | Vercel team `camal`, project `recro-group` | Includes Vercel Postgres. |
| File storage | Vercel Blob store `recro-group-blob` | Grief-camp flyer. Served by `GET /api/grief-camp-flyer`. |
| Domain | GoDaddy, `recrogroup.org` | DNS points at Vercel. |
| Public mailbox | `info@recrogroup.org` | Also the main Director login. |
| Transactional email | Resend, domain `recrogroup.org` verified | From address `Recro Group <no-reply@recrogroup.org>`. |
| Google sign-in | Google Cloud OAuth client | Redirect URI `https://recrogroup.org/api/auth/callback/google`. |
| M-Pesa | Safaricom Daraja app | Till `747736`. Callbacks hit `/api/payments/webhooks/mpesa`. |
| Form spreadsheet | Google Sheet, filled by `GOOGLE_SHEETS_WEBHOOK_URL` | Tabs: Grief camp, Corporate speaking, Team building, Consortium. Therapist applications stay in the database only. |

After transfer, rotate `BETTER_AUTH_SECRET` only if the previous holder should be signed out of every session. Rotating it logs everyone out. Generate a new value with `openssl rand -base64 32` and set it in Vercel, then redeploy.

Variable names are listed in `.env.example`. Copy values from the current owner's Vercel project settings. Never commit `.env`.

## People and roles

The database stores `admin`, `receptionist`, or `customer`. The screens show different words:

| Stored role | Label on screen | What they can open |
| --- | --- | --- |
| `admin` | Director | Everything, including customers, settings, and deleting a booking. |
| `receptionist` | Admin | Bookings, payments, programs, messages. Not the customer list or settings. |
| `customer` | Customer | Their own account. Staff pages redirect them home. |

If `BOOTSTRAP_ADMIN_EMAILS` is empty, signing in as `info@recrogroup.org` becomes Director. If `BOOTSTRAP_RECEPTIONIST_EMAILS` is empty, `carolinehawi91@gmail.com` becomes Admin (receptionist). This runs on every session from `src/lib/staff-bootstrap.ts`, because the production database does not copy local role edits by itself.

`minanicalm@gmail.com` was the previous Director. The next time that account signs in, it is set back to customer once. A later manual grant is left in place.

Removing a staff role in Settings sets that user to customer and remembers the email in the `revoked_staff_emails` site setting so the next sign-in does not grant the role back.

## Request flow

```
Browser page  →  server action or /api route  →  Prisma  →  Postgres
                      ↓
                 Resend email, Google Sheet, or Daraja
```

- Pages under `src/app` choose the URL and load data.
- Screens live in `src/features`.
- Mutations that the browser calls directly are in `src/server/actions` (`"use server"`).
- HTTP endpoints (M-Pesa, auth, payment status) are in `src/app/api`.
- `src/server/authz.ts` is the gate: `requireSession`, `requireStaff` (Director or Admin), `requireAdmin` (Director only).

## Public pages

| URL | What it is |
| --- | --- |
| `/` | Home |
| `/booking` | Book a therapy session and pay the commitment fee |
| `/grief-camp` and `/grief-camp/apply` | Camp information and the camper application |
| `/grief-camp/therapist-application` | Therapist application |
| `/grief-camp/team-building` | Team-building application |
| `/services/consortium/apply` | Consortium application |
| `/services/corporate/inquiry` | Corporate speaking inquiry |
| `/contact` | Contact form |
| `/sponsor-child` | Donation |
| `/payments/[reference]` | Payment result. Amount and receipt stay hidden unless the link has the payment token or the viewer is staff. |

## Staff pages

`/dashboard` is the portal staff use day to day. `/admin` is the same work with a different shell. Both require a staff session.

Program forms are split out of the general inbox by the subject line (`src/server/queries/inquiries.ts`):

| List | How a row is recognised |
| --- | --- |
| `/dashboard/inquiries` and `/admin/messages` | Contact and leftover inquiries. Program subjects are excluded. |
| Therapist applications | Subject contains "therapist application" or "facilitator application". |
| Team building | Subject contains "team builder" or "team-building". |
| Consortium | Subject contains "consortium". |
| Corporate speaking | Corporate inquiries that are not team-building or therapist applications. |

Grief-camp camper applications are **not** inquiries. They are rows in `grief_applications`.

Messages can be deleted by staff. Notifications in the bell are not stored rows: they are recent paid-booking and newsletter events from the last 7 days (`src/server/queries/notifications.ts`).

## Booking and the permanent slot

A paid booking holds a weekday and start time in Africa/Nairobi. That hold is exclusive among bookings that are paid by M-Pesa and are not `CANCELLED` or `COMPLETED`.

- **Free time** sets the booking to `COMPLETED`. The slot opens for someone else. The booking stays in the list.
- **Delete booking** is Director-only. It removes the booking and its payments, then reconciles slots.
- Clear-old tools delete bookings older than a week, older than a month, or all bookings. Grief-camp and donation payments stay unless they were attached to a deleted booking.

The rule lives in `src/server/booking-slots.ts`. The buttons call `src/server/actions/operations.ts`.

## Payments

1. The page calls `POST /api/payments/initiate` with the M-Pesa number the person typed.
2. `startCheckout` in `src/lib/payments/checkout.ts` reads the price from the database. The browser cannot set the amount.
3. A pending `payments` row is created. Its `providerMeta.accessToken` is the secret for the status page.
4. Daraja sends an STK push. The phone approves it.
5. Safaricom calls `/api/payments/webhooks/mpesa`. Settlement marks the payment `PAID`, updates the booking balance, and sends the receipt email.
6. The browser polls `GET /api/payments/status/[reference]?token=...`. Without the token, the response is only `reference` and `status`.

The stored phone on a booking, camp application, or donation is used for a new STK push only when the signed-in user owns that record or is staff. Public forms send the number the person typed.

Booking confirmation email is sent after the payment is `PAID`, not when the form is submitted.

Bank-transfer recording (`recordBankTransfer`) is staff-only and has no button in the UI.

## Forms and email

Public program forms call `submitInquiry` (`src/server/actions/inquiry.ts`). That saves an `inquiries` row, emails staff, and appends a Google Sheet row when a tab matches.

The grief-camp camper form calls `submitGriefApplication`. That saves `grief_applications`, emails staff, and appends the Grief camp sheet. The parent confirmation function exists and is not called from submit.

Form emails always include `info@recrogroup.org`, plus anyone in `MAIL_STAFF_ADDRESS`. If that variable is empty, staff mail goes to `info@recrogroup.org`. A mail failure is logged and does not fail the form.

Email and password sign-up does not prove the person owns the inbox. It checks the format, a password of at least 8 characters with a letter and a number, and that the email is new, then signs them in. Google sign-in relies on Google having already confirmed the address. Password reset does email a link.

## Local setup

```bash
npm install
cp .env.example .env
npm run db:push
npm run db:seed
npm run dev
```

`npm run db:seed` loads services and grief-camp price tiers. Without those rows, checkout has no price.

`npm test` runs Vitest. CI also runs `tsc`, ESLint, and the production build.

In development, if `BETTER_AUTH_SECRET` is missing, the portal can pretend to be an admin. Production on Vercel has the secret set, so that bypass is not available there.

## Where the comments are

These files carry a short note at the top describing their place in the flow:

- `src/lib/auth.ts` — sign-in, Google, session role
- `src/lib/staff-bootstrap.ts` — who becomes Director or Admin
- `src/server/authz.ts` — staff and Director checks
- `src/features/portal/lib/roles.ts` — stored role versus the label on screen
- `src/features/portal/lib/permissions.ts` — portal menu
- `src/lib/payments/checkout.ts` — charge
- `src/lib/payments/access-token.ts` — who may see a payment
- `src/server/booking-slots.ts` — permanent weekday and time
- `src/server/actions/operations.ts` — staff actions on bookings and messages
- `src/server/actions/inquiry.ts` — program and contact forms
- `src/server/actions/grief-camp.ts` — camper applications
- `src/server/queries/inquiries.ts` — which list a form appears on
- `src/server/queries/notifications.ts` — the bell
- `src/lib/mail/index.ts` — Resend
- `src/lib/google-sheets.ts` — spreadsheet copies
- `prisma/schema.prisma` — tables
- `prisma/SCHEMA_MAP.md` — table-by-table notes
