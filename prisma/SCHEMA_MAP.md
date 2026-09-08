# Data model map (Better Auth + Recro domain)

## Auth (Better Auth)

| Table | Purpose |
|-------|---------|
| `user` | Identity, profile, app role (`admin` \| `customer` \| `receptionist`) |
| `session` | Active sessions (+ `impersonatedBy` from admin plugin) |
| `account` | OAuth providers + `credential` password hash |
| `verification` | Email verification & password reset tokens |

### `user` fields

| Field | Source |
|-------|--------|
| `name`, `email`, `emailVerified`, `image` | Better Auth core |
| `role`, `banned`, `banReason`, `banExpires` | Admin plugin |
| `phone`, `accountType`, `commsEmail`, `commsSms` | Recro `additionalFields` |

## App roles

| Role | Portal access |
|------|----------------|
| `customer` | `/dashboard` tabbed self-service |
| `receptionist` | Operations: bookings, payments, programs, inquiries |
| `admin` | Full portal including content, people, settings |

Set roles via Better Auth admin plugin (`setRole`) or on signup default `customer`.

## Domain tables

Business models: `therapists`, `services`, `blog_posts`, `media_items`, `faqs`, `testimonials`, `bookings`, `appointments`, `payments`, `payment_events`, `donations`, `camp_sessions`, `camp_price_tiers`, `grief_applications`, `inquiries`, `newsletter_subscribers`, `saved_resources`, `site_settings`.

## Payments

| Table | Purpose |
|-------|---------|
| `payments` | One row per charge attempt. `reference` is ours and unique; `providerRef` is Daraja's CheckoutRequestID or Paystack's reference |
| `payment_events` | Append-only log of inbound provider callbacks. `dedupeKey` is unique, which is what makes webhooks replay-safe |
| `donations` | Sponsor-a-child donations, not tied to a booking |

A payment points at exactly one target: `bookingId`, `griefApplicationId`, or `donationId`.

`Booking.amountPaidKes` is a running total of settled payments, so a booking can
take a deposit now and the balance later. `Booking.depositKes` is the commitment
fee; the balance is `amountKes - amountPaidKes`.

Statuses: `PENDING` → `PROCESSING` → `PAID` | `FAILED` | `CANCELLED`, plus `REFUNDED`.
Settlement refuses to re-apply an already-terminal payment.

## Grief camp pricing

`camp_sessions` holds one row per camp edition; `camp_price_tiers` holds
date-banded prices per `CampAttendeeType` (`CAMPER` | `PARENT`). The applicable
tier is the one whose `[effectiveFrom, effectiveTo)` window contains "now",
resolved server-side at payment time. `GriefApplication.amountKes` snapshots the
resolved price so later tier edits never change what an applicant owes.

Seed both with `npm run db:seed`.

All `userId` foreign keys reference `user.id` (Better Auth user table).
