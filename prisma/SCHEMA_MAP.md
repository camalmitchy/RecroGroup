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

Unchanged business models: `therapists`, `services`, `blog_posts`, `media_items`, `faqs`, `testimonials`, `bookings`, `appointments`, `payments`, `grief_applications`, `inquiries`, `newsletter_subscribers`, `saved_resources`, `site_settings`.

All `userId` foreign keys reference `user.id` (Better Auth user table).
