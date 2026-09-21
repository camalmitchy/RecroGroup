import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  StatusBadge,
  bookingStatusTone,
  paymentStatusTone,
} from "@/features/portal/components/status-badge";
import { ProfileEditor } from "@/features/profile/components/profile-editor";
import { formatDate } from "@/features/portal/lib/format";
import { isStaff, parseAppRole, ROLE_LABELS } from "@/features/portal/lib/roles";
import { getCustomerProfile } from "@/server/queries/profile";

type Profile = NonNullable<Awaited<ReturnType<typeof getCustomerProfile>>>;

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-1 border-b border-border/70 py-4 last:border-b-0 sm:grid-cols-[10rem_1fr] sm:items-baseline">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="text-sm font-medium text-foreground">{value}</dd>
    </div>
  );
}

export function ProfilePage({ user, bookings }: Profile) {
  const role = parseAppRole(user.role);
  const notifications = [
    user.commsEmail ? "Email" : null,
    user.commsSms ? "SMS" : null,
  ]
    .filter(Boolean)
    .join(" and ");

  return (
    <section className="container-page py-12 lg:py-16">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
        Account
      </p>
      <h1 className="mt-3 font-serif text-4xl text-primary-deep md:text-5xl">
        Your profile
      </h1>
      <p className="mt-3 max-w-xl text-muted-foreground">
        Update your name, contact number, and photo. These details stay on your
        Recro account.
      </p>

      <Card className="mt-10">
        <CardHeader className="border-b">
          <CardTitle>Your details</CardTitle>
          <CardDescription>
            Phone numbers are used for booking updates and M-Pesa prompts.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <ProfileEditor
            user={{
              name: user.name,
              email: user.email,
              image: user.image,
              phone: user.phone,
            }}
          />
          <dl className="mt-8 border-t border-border/70">
            {isStaff(role) ? (
              <Detail label="Workspace role" value={ROLE_LABELS[role]} />
            ) : null}
            <Detail label="Member since" value={formatDate(user.createdAt)} />
            <Detail
              label="Notifications"
              value={notifications || "None"}
            />
          </dl>
        </CardContent>
      </Card>

      <Card className="mt-8">
        <CardHeader className="border-b">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <CardTitle>Bookings</CardTitle>
              <CardDescription>
                Recent sessions requested with this account.
              </CardDescription>
            </div>
            <Button asChild size="sm" className="rounded-full">
              <Link href="/booking">Book a session</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {bookings.length === 0 ? (
            <p className="px-4 py-8 text-sm text-muted-foreground">
              You have not booked a session yet.
            </p>
          ) : (
            <ul className="divide-y divide-border">
              {bookings.map((booking) => (
                <li
                  key={booking.id}
                  className="flex flex-col gap-2 px-4 py-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">
                      {booking.service?.title ?? "Therapy session"}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {booking.reference}
                      {booking.therapist?.fullName
                        ? ` · ${booking.therapist.fullName}`
                        : ""}
                      {booking.preferredDate
                        ? ` · ${formatDate(booking.preferredDate)}`
                        : ""}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    <StatusBadge tone={bookingStatusTone(booking.status)}>
                      {booking.status.replaceAll("_", " ").toLowerCase()}
                    </StatusBadge>
                    <StatusBadge tone={paymentStatusTone(booking.paymentStatus)}>
                      {booking.paymentStatus.replaceAll("_", " ").toLowerCase()}
                    </StatusBadge>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
