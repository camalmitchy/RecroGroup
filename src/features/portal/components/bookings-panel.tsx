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

export type BookingRow = {
  id: string;
  clientName: string;
  serviceTitle: string | null;
  preferredDateLabel: string;
  status: string;
  paymentStatus: string;
};

type StatusFilter = "all" | "REQUESTED" | "CONFIRMED" | "COMPLETED" | "CANCELLED";

function humanize(value: string) {
  return value.toLowerCase().replace(/_/g, " ");
}

export function BookingsPanel({ bookings }: { bookings: BookingRow[] }) {
  const [filter, setFilter] = useState<StatusFilter>("all");

  const visible = useMemo(
    () => (filter === "all" ? bookings : bookings.filter((row) => row.status === filter)),
    [bookings, filter],
  );

  const count = (status: Exclude<StatusFilter, "all">) =>
    bookings.filter((row) => row.status === status).length;

  return (
    <div className="space-y-5">
      <PortalPageHeader
        title="Bookings"
        description="Open a booking to see contact details, payment, and actions."
      />

      <PortalTabBar
        className="overflow-x-auto"
        tabs={[
          { key: "all", label: `All (${bookings.length})` },
          { key: "REQUESTED", label: `Requested (${count("REQUESTED")})` },
          { key: "CONFIRMED", label: `Confirmed (${count("CONFIRMED")})` },
          { key: "COMPLETED", label: `Completed (${count("COMPLETED")})` },
          { key: "CANCELLED", label: `Cancelled (${count("CANCELLED")})` },
        ]}
        active={filter}
        onChange={setFilter}
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
                    : "Try another status tab."}
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
                      <p className="mt-0.5 truncate text-sm text-muted-foreground">
                        {row.serviceTitle ?? "Session"} · {row.preferredDateLabel}
                      </p>
                    </div>
                    <div className="hidden shrink-0 items-center gap-2 sm:flex">
                      <StatusBadge tone={bookingStatusTone(row.status)}>
                        {humanize(row.status)}
                      </StatusBadge>
                      <StatusBadge tone={paymentStatusTone(row.paymentStatus)}>
                        {humanize(row.paymentStatus)}
                      </StatusBadge>
                    </div>
                    <StatusBadge
                      className="sm:hidden"
                      tone={bookingStatusTone(row.status)}
                    >
                      {humanize(row.status)}
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
