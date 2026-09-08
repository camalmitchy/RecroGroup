import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { formatDate } from "@/features/portal/lib/format";
import { parseAppRole, ROLE_LABELS } from "@/features/portal/lib/roles";
import { toDisplayPhone } from "@/lib/payments/utils";
import { getCustomerProfile } from "@/server/queries/profile";
import { userHandle, userInitials } from "@/shared/lib/user-initials";

type Profile = NonNullable<Awaited<ReturnType<typeof getCustomerProfile>>>;

const ACCOUNT_TYPE_LABELS: Record<Profile["user"]["accountType"], string> = {
  CUSTOMER: "Customer",
  GUARDIAN: "Guardian",
  CORPORATE: "Corporate",
};

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-1 border-b border-border/70 py-4 last:border-b-0 sm:grid-cols-[10rem_1fr] sm:items-baseline">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="text-sm font-medium text-foreground">{value}</dd>
    </div>
  );
}

export function ProfilePage({ user, bookings }: Profile) {
  const handle = userHandle(user.email);
  const initials = userInitials(user.name, user.email);
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
        Your Recro account details and recent bookings.
      </p>

      <Card className="mt-10">
        <CardHeader className="border-b">
          <div className="flex items-center gap-4">
            <Avatar className="size-16 ring-1 ring-border">
              {user.image ? (
                <AvatarImage src={user.image} alt={user.name} />
              ) : null}
              <AvatarFallback className="bg-primary text-base font-semibold text-primary-foreground">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <CardTitle className="truncate text-xl">{user.name}</CardTitle>
              <CardDescription className="truncate">{handle}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <dl>
            <Detail label="Email" value={user.email} />
            <Detail
              label="Phone"
              value={user.phone ? toDisplayPhone(user.phone) : "Not added"}
            />
            <Detail label="Account" value={ACCOUNT_TYPE_LABELS[user.accountType]} />
            <Detail label="Role" value={ROLE_LABELS[role]} />
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
