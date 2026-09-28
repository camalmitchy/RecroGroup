"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";
import { ClearProductionDataButton } from "@/features/admin/components/clear-production-data-button";
import { PortalPageHeader } from "@/features/portal/components/portal-page-header";
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

function humanize(value: string) {
  return value.toLowerCase().replace(/_/g, " ");
}

export function BookingsPanel({
  bookings,
  canClear = false,
}: {
  bookings: BookingRow[];
  canClear?: boolean;
}) {
  return (
    <div className="space-y-5">
      <PortalPageHeader
        title="Bookings"
        description="Only bookings with a successful M-Pesa payment are kept here."
        actions={canClear ? <ClearProductionDataButton /> : null}
      />

      <Card>
        <CardContent className="p-0">
          {bookings.length === 0 ? (
            <Empty className="py-12">
              <EmptyHeader>
                <EmptyTitle>No paid bookings yet</EmptyTitle>
                <EmptyDescription>
                  A booking appears here after the M-Pesa payment succeeds.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            <ul className="divide-y divide-border">
              {bookings.map((row) => (
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
