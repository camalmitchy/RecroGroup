"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";
import { PortalPageHeader } from "@/features/portal/components/portal-page-header";
import { PortalTabBar } from "@/features/portal/components/portal-tab-bar";
import {
  StatusBadge,
  bookingStatusTone,
  paymentStatusTone,
} from "@/features/portal/components/status-badge";
import { formatKes } from "@/features/portal/lib/format";

export type BookingRow = {
  id: string;
  reference: string;
  clientName: string;
  clientPhone: string | null;
  serviceTitle: string | null;
  preferredDateLabel: string;
  status: string;
  paymentStatus: string;
  amountKes: number | null;
  amountPaidKes: number;
  latestPaymentReference: string | null;
  latestFailureReason: string | null;
};

type PaymentFilter = "all" | "PAID" | "FAILED" | "PENDING";

function humanize(value: string) {
  return value.toLowerCase().replace(/_/g, " ");
}

function matchesPaymentFilter(row: BookingRow, filter: PaymentFilter) {
  if (filter === "all") return true;
  if (filter === "PENDING") {
    return row.paymentStatus === "PENDING" || row.paymentStatus === "PROCESSING";
  }
  return row.paymentStatus === filter;
}

export function BookingsPanel({ bookings }: { bookings: BookingRow[] }) {
  const [paymentFilter, setPaymentFilter] = useState<PaymentFilter>("all");

  const visible = useMemo(
    () => bookings.filter((row) => matchesPaymentFilter(row, paymentFilter)),
    [bookings, paymentFilter],
  );

  const paymentCount = (status: Exclude<PaymentFilter, "all">) =>
    bookings.filter((row) => matchesPaymentFilter(row, status)).length;

  return (
    <div className="space-y-5">
      <PortalPageHeader
        title="Bookings"
        description="Open a booking to see contact details, payment attempts, and actions."
      />

      <PortalTabBar
        className="overflow-x-auto"
        tabs={[
          { key: "all", label: `All (${bookings.length})` },
          { key: "PENDING", label: `Unpaid (${paymentCount("PENDING")})` },
          { key: "PAID", label: `Paid (${paymentCount("PAID")})` },
          { key: "FAILED", label: `Failed (${paymentCount("FAILED")})` },
        ]}
        active={paymentFilter}
        onChange={setPaymentFilter}
      />

      <Card>
        <CardContent className="p-0">
          {visible.length === 0 ? (
            <Empty className="py-12">
              <EmptyHeader>
                <EmptyTitle>
                  {bookings.length === 0 ? "No bookings yet" : "No bookings in this view"}
                </EmptyTitle>
                <EmptyDescription>
                  {bookings.length === 0
                    ? "Requests submitted from the public booking form land here."
                    : "Try another payment tab."}
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            <ul className="divide-y divide-border">
              {visible.map((row) => (
                <li key={row.id}>
                  <Link
                    href={`/dashboard/bookings/${row.id}`}
                    className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-muted/40"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold">{row.clientName}</p>
                      <p className="mt-0.5 font-mono text-xs text-muted-foreground">
                        {row.reference}
                        {row.latestPaymentReference
                          ? ` · ${row.latestPaymentReference}`
                          : ""}
                      </p>
                      <p className="mt-0.5 truncate text-sm text-muted-foreground">
                        {row.serviceTitle ?? "Session"} · {row.preferredDateLabel}
                        {row.clientPhone ? ` · ${row.clientPhone}` : ""}
                      </p>
                      {row.latestFailureReason && (
                        <p className="mt-1 line-clamp-2 text-xs text-destructive">
                          {row.latestFailureReason}
                        </p>
                      )}
                    </div>
                    <div className="hidden shrink-0 flex-col items-end gap-2 sm:flex">
                      <div className="flex items-center gap-2">
                        <StatusBadge tone={bookingStatusTone(row.status)}>
                          {humanize(row.status)}
                        </StatusBadge>
                        <StatusBadge tone={paymentStatusTone(row.paymentStatus)}>
                          {humanize(row.paymentStatus)}
                        </StatusBadge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        KES {formatKes(row.amountPaidKes)}
                        {row.amountKes != null ? ` / ${formatKes(row.amountKes)}` : ""}
                      </p>
                    </div>
                    <StatusBadge
                      className="sm:hidden"
                      tone={paymentStatusTone(row.paymentStatus)}
                    >
                      {humanize(row.paymentStatus)}
                    </StatusBadge>
                    <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
