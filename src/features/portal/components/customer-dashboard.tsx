import Link from "next/link";
import { CalendarDays, CreditCard, HeartHandshake } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  StatusBadge,
  bookingStatusTone,
  paymentStatusTone,
} from "@/features/portal/components/status-badge";

export type CustomerBookingRow = {
  id: string;
  reference: string;
  serviceTitle: string | null;
  preferredDateLabel: string;
  status: string;
  paymentStatus: string;
  amountKes: number | null;
  amountPaidKes: number;
};

export type CustomerPaymentRow = {
  id: string;
  reference: string;
  method: string;
  purpose: string;
  amountKes: number;
  status: string;
  createdAtLabel: string;
};

type CustomerDashboardProps = {
  name: string | null;
  bookings: CustomerBookingRow[];
  payments: CustomerPaymentRow[];
  griefApplicationCount: number;
};

export function CustomerDashboard({
  name,
  bookings,
  payments,
  griefApplicationCount,
}: CustomerDashboardProps) {
  const activeBooking =
    bookings.find(
      (booking) =>
        booking.status === "CONFIRMED" || booking.status === "REQUESTED",
    ) ?? null;

  const outstanding = bookings.reduce(
    (total, booking) =>
      total + Math.max(0, (booking.amountKes ?? 0) - booking.amountPaidKes),
    0,
  );

  return (
    <div className="space-y-6">
      <div>
        <Badge variant="secondary" className="mb-3 rounded-full">
          Customer portal
        </Badge>
        <h1 className="text-2xl font-semibold tracking-tight">
          {name ? `Welcome back, ${name}` : "My dashboard"}
        </h1>
        <p className="mt-1 text-muted-foreground">
          Bookings, payments and programs in one place.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Active booking</CardDescription>
            <CardTitle className="text-lg">
              {activeBooking
                ? (activeBooking.serviceTitle ?? activeBooking.reference)
                : "None"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {activeBooking ? (
              <StatusBadge tone={bookingStatusTone(activeBooking.status)}>
                {activeBooking.status.toLowerCase()}
              </StatusBadge>
            ) : (
              <Button
                asChild
                size="sm"
                variant="outline"
                className="rounded-full"
              >
                <Link href="/booking">Book a session</Link>
              </Button>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Outstanding balance</CardDescription>
            <CardTitle className="text-lg">
              KES {outstanding.toLocaleString()}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <StatusBadge tone={outstanding > 0 ? "warning" : "success"}>
              {outstanding > 0 ? "Payment due" : "Up to date"}
            </StatusBadge>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Grief camp</CardDescription>
            <CardTitle className="text-lg">
              {griefApplicationCount > 0
                ? `${griefApplicationCount} application${griefApplicationCount > 1 ? "s" : ""}`
                : "Not applied"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button asChild size="sm" variant="outline" className="rounded-full">
              <Link href="/grief-camp">
                {griefApplicationCount > 0 ? "View camp" : "Learn more"}
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="size-5 text-primary" />
            My bookings
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {bookings.length === 0 ? (
            <Empty className="py-10">
              <EmptyHeader>
                <EmptyTitle>No bookings yet</EmptyTitle>
                <EmptyDescription>
                  <Link href="/booking">Book your first session</Link> to get
                  started.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ref</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Balance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings.map((booking) => {
                  const balance = Math.max(
                    0,
                    (booking.amountKes ?? 0) - booking.amountPaidKes,
                  );
                  return (
                    <TableRow key={booking.id}>
                      <TableCell className="font-mono text-xs">
                        {booking.reference}
                      </TableCell>
                      <TableCell>{booking.serviceTitle ?? "—"}</TableCell>
                      <TableCell className="text-sm">
                        {booking.preferredDateLabel}
                      </TableCell>
                      <TableCell>
                        <StatusBadge tone={bookingStatusTone(booking.status)}>
                          {booking.status.toLowerCase()}
                        </StatusBadge>
                      </TableCell>
                      <TableCell>
                        <StatusBadge
                          tone={paymentStatusTone(booking.paymentStatus)}
                        >
                          {booking.paymentStatus.toLowerCase()}
                        </StatusBadge>
                      </TableCell>
                      <TableCell>
                        {balance > 0
                          ? `KES ${balance.toLocaleString()}`
                          : "Settled"}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="size-5 text-primary" />
            Payment history
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {payments.length === 0 ? (
            <Empty className="py-10">
              <EmptyHeader>
                <EmptyTitle>No payments yet</EmptyTitle>
                <EmptyDescription>
                  Receipts appear here once you complete a payment.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ref</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Purpose</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell className="font-mono text-xs">
                      {payment.reference}
                    </TableCell>
                    <TableCell className="capitalize">
                      {payment.method.toLowerCase()}
                    </TableCell>
                    <TableCell className="capitalize">
                      {payment.purpose.toLowerCase().replace(/_/g, " ")}
                    </TableCell>
                    <TableCell>
                      KES {payment.amountKes.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <StatusBadge tone={paymentStatusTone(payment.status)}>
                        {payment.status.toLowerCase()}
                      </StatusBadge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {payment.createdAtLabel}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HeartHandshake className="size-5 text-primary" />
            Need support?
          </CardTitle>
          <CardDescription>
            Reach out and our team will get back to you.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild size="sm" className="rounded-full">
            <Link href="/contact">Contact us</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
