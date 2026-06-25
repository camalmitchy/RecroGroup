# Maps Prisma models → portal sections (see `src/features/portal/lib/permissions.ts`)

| Portal section | Models | Roles |
|----------------|--------|-------|
| Overview (staff) | aggregates across Booking, Payment, Inquiry, GriefApplication | ADMIN, RECEPTIONIST |
| Overview (customer) | User, Booking, Appointment, Payment, SavedResource, GriefApplication (own) | CUSTOMER |
| Bookings | Booking, Appointment, Service, Therapist | ADMIN, RECEPTIONIST |
| Payments | Payment, Booking | ADMIN, RECEPTIONIST |
| Programs | GriefApplication | ADMIN, RECEPTIONIST |
| Content | Service, BlogPost, MediaItem, Faq, Testimonial | ADMIN |
| People | User, Therapist | ADMIN |
| Inquiries | Inquiry, NewsletterSubscriber | ADMIN, RECEPTIONIST |
| Settings | SiteSetting | ADMIN |

Public site (no login): reads published Service, BlogPost, MediaItem, Faq, Testimonial; creates Booking, Inquiry, GriefApplication, NewsletterSubscriber.
