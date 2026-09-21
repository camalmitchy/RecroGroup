"use client";

import { useState, useTransition, type ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { PortalPageHeader } from "@/features/portal/components/portal-page-header";
import {
  StatusBadge,
  bookingStatusTone,
  paymentStatusTone,
} from "@/features/portal/components/status-badge";
import { formatKes } from "@/features/portal/lib/format";
import { assignTherapist, setBookingStatus } from "@/server/actions/operations";
import { requestBookingBalance } from "@/server/actions/payments";
import type { ActionResult } from "@/server/result";

export type BookingPaymentRow = {
  id: string;
  reference: string;
  method: string;
  status: string;
  amountKes: number;
  mpesaReceipt: string | null;
  createdAtLabel: string;
  paidAtLabel: string | null;
};

export type BookingAppointmentRow = {
  id: string;
  scheduledAtLabel: string;
  durationMin: number;
  status: string;
};

export type BookingDetailData = {
  id: string;
  reference: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string | null;
  preferredDateLabel: string;
  preferredTime: string | null;
  sessionMode: string | null;
  notes: string | null;
  therapistId: string | null;
  serviceTitle: string | null;
  status: string;
  paymentStatus: string;
  amountKes: number | null;
  depositKes: number | null;
  amountPaidKes: number;
  createdAtLabel: string;
  payments: BookingPaymentRow[];
  appointments: BookingAppointmentRow[];
};

export type TherapistOption = {
  id: string;
  fullName: string;
};

function humanize(value: string) {
  return value.toLowerCase().replace(/_/g, " ");
}

function DetailItem({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div>
      <dt className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
        {label}
      </dt>
      <dd className="mt-1 text-sm">{children}</dd>
    </div>
  );
}

export function BookingDetail({
  booking,
  therapists,
}: {
  booking: BookingDetailData;
  therapists: TherapistOption[];
}) {
  const [isPending, startTransition] = useTransition();
  const [pendingAction, setPendingAction] = useState<string | null>(null);

  const total = booking.amountKes ?? 0;
  const outstanding = Math.max(0, total - booking.amountPaidKes);

  const run = (
    key: string,
    action: () => Promise<ActionResult<unknown>>,
    successMessage: string,
  ) => {
    setPendingAction(key);
    startTransition(async () => {
      const result = await action();
      setPendingAction(null);
      if (result.ok) toast.success(successMessage);
      else toast.error(result.error);
    });
  };

  const busy = isPending;

  return (
    <div className="space-y-5">
      <Link
        href="/dashboard/bookings"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" />
        Back to bookings
      </Link>

      <PortalPageHeader
        title={booking.clientName}
        description={`${booking.reference} · Received ${booking.createdAtLabel}`}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge tone={bookingStatusTone(booking.status)}>
              {humanize(booking.status)}
            </StatusBadge>
            <StatusBadge tone={paymentStatusTone(booking.paymentStatus)}>
              {humanize(booking.paymentStatus)}
            </StatusBadge>
          </div>
        }
      />

      <div className="flex flex-wrap gap-2">
        {booking.status === "REQUESTED" && (
          <Button
            type="button"
            disabled={busy}
            onClick={() =>
              run(
                "confirm",
                () => setBookingStatus(booking.id, "CONFIRMED"),
                "Booking confirmed",
              )
            }
          >
            {pendingAction === "confirm" ? "Confirming…" : "Confirm booking"}
          </Button>
        )}
        {booking.status === "CONFIRMED" && (
          <Button
            type="button"
            disabled={busy}
            onClick={() =>
              run(
                "complete",
                () => setBookingStatus(booking.id, "COMPLETED"),
                "Booking completed",
              )
            }
          >
            {pendingAction === "complete" ? "Saving…" : "Mark completed"}
          </Button>
        )}
        {booking.status !== "CANCELLED" && booking.status !== "COMPLETED" && (
          <Button
            type="button"
            variant="outline"
            disabled={busy}
            onClick={() =>
              run(
                "cancel",
                () => setBookingStatus(booking.id, "CANCELLED"),
                "Booking cancelled",
              )
            }
          >
            {pendingAction === "cancel" ? "Cancelling…" : "Cancel"}
          </Button>
        )}
        {booking.status === "CANCELLED" && (
          <Button
            type="button"
            variant="outline"
            disabled={busy}
            onClick={() =>
              run(
                "reopen",
                () => setBookingStatus(booking.id, "REQUESTED"),
                "Booking reopened",
              )
            }
          >
            {pendingAction === "reopen" ? "Reopening…" : "Reopen"}
          </Button>
        )}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Client</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid gap-4 sm:grid-cols-2">
              <DetailItem label="Name">{booking.clientName}</DetailItem>
              <DetailItem label="Email">
                <a
                  href={`mailto:${booking.clientEmail}`}
                  className="break-all hover:underline"
                >
                  {booking.clientEmail}
                </a>
              </DetailItem>
              <DetailItem label="Phone">
                {booking.clientPhone ? (
                  <a href={`tel:${booking.clientPhone}`} className="hover:underline">
                    {booking.clientPhone}
                  </a>
                ) : (
                  "—"
                )}
              </DetailItem>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Session</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid gap-4 sm:grid-cols-2">
              <DetailItem label="Service">
                {booking.serviceTitle ?? "—"}
              </DetailItem>
              <DetailItem label="Preferred date">
                {booking.preferredDateLabel}
              </DetailItem>
              <DetailItem label="Preferred time">
                {booking.preferredTime ?? "—"}
              </DetailItem>
              <DetailItem label="Mode">
                {booking.sessionMode ? humanize(booking.sessionMode) : "—"}
              </DetailItem>
              <div className="sm:col-span-2">
                <dt className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                  Therapist
                </dt>
                <dd className="mt-1.5">
                  <NativeSelect
                    value={booking.therapistId ?? ""}
                    disabled={busy}
                    aria-label="Assign therapist"
                    className="w-full max-w-xs"
                    onChange={(event) =>
                      run(
                        "therapist",
                        () =>
                          assignTherapist(booking.id, event.target.value || null),
                        event.target.value
                          ? "Therapist assigned"
                          : "Therapist unassigned",
                      )
                    }
                  >
                    <NativeSelectOption value="">Unassigned</NativeSelectOption>
                    {therapists.map((therapist) => (
                      <NativeSelectOption key={therapist.id} value={therapist.id}>
                        {therapist.fullName}
                      </NativeSelectOption>
                    ))}
                  </NativeSelect>
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Payment</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <dl className="grid gap-4 sm:grid-cols-3">
            <DetailItem label="Total">KES {formatKes(total)}</DetailItem>
            <DetailItem label="Paid">KES {formatKes(booking.amountPaidKes)}</DetailItem>
            <DetailItem label="Outstanding">
              {outstanding > 0 ? `KES ${formatKes(outstanding)}` : "Settled"}
            </DetailItem>
          </dl>
          {booking.depositKes != null && booking.depositKes > 0 && (
            <p className="text-xs text-muted-foreground">
              Deposit KES {formatKes(booking.depositKes)}
            </p>
          )}
          {outstanding > 0 && (
            <Button
              type="button"
              variant="outline"
              disabled={busy}
              onClick={() =>
                run(
                  "pay",
                  () =>
                    requestBookingBalance(
                      booking.id,
                      "MPESA",
                      booking.clientPhone ?? undefined,
                    ),
                  "M-Pesa payment request sent",
                )
              }
            >
              {pendingAction === "pay" ? "Sending…" : "Send M-Pesa request"}
            </Button>
          )}
        </CardContent>
      </Card>

      {booking.notes && (
        <Card>
          <CardHeader>
            <CardTitle>Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap text-sm leading-relaxed">
              {booking.notes}
            </p>
          </CardContent>
        </Card>
      )}

      {booking.payments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Payment history</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ul className="divide-y divide-border">
              {booking.payments.map((payment) => (
                <li
                  key={payment.id}
                  className="flex flex-wrap items-center justify-between gap-2 px-4 py-3"
                >
                  <div className="min-w-0">
                    <p className="font-mono text-xs">{payment.reference}</p>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      {humanize(payment.method)} · {payment.createdAtLabel}
                      {payment.mpesaReceipt ? ` · ${payment.mpesaReceipt}` : ""}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium">
                      KES {formatKes(payment.amountKes)}
                    </span>
                    <StatusBadge tone={paymentStatusTone(payment.status)}>
                      {humanize(payment.status)}
                    </StatusBadge>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {booking.appointments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Appointments</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ul className="divide-y divide-border">
              {booking.appointments.map((appointment) => (
                <li
                  key={appointment.id}
                  className="flex items-center justify-between gap-3 px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-medium">
                      {appointment.scheduledAtLabel}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {appointment.durationMin} min
                    </p>
                  </div>
                  <StatusBadge tone={bookingStatusTone(appointment.status)}>
                    {humanize(appointment.status)}
                  </StatusBadge>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
