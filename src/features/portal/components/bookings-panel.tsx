"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import { PortalPageHeader } from "@/features/portal/components/portal-page-header";
import {
  StatusBadge,
  bookingStatusTone,
  paymentStatusTone,
} from "@/features/portal/components/status-badge";
import { requestBookingBalance } from "@/server/actions/payments";

export type BookingRow = {
  id: string;
  reference: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string | null;
  preferredDateLabel: string;
  therapistId: string | null;
  therapistName: string | null;
  serviceTitle: string | null;
  status: string;
  paymentStatus: string;
  amountKes: number | null;
  depositKes: number | null;
  amountPaidKes: number;
};

type BookingsPanelProps = {
  bookings: BookingRow[];
};

export function BookingsPanel({ bookings }: BookingsPanelProps) {
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const sendRequest = (row: BookingRow, method: "MPESA" | "BANK") => {
    setPendingId(row.id);
    startTransition(async () => {
      const result = await requestBookingBalance(
        row.id,
        method,
        row.clientPhone ?? undefined,
      );
      setPendingId(null);
      if (result.ok) {
        toast.success(`Payment request sent to ${row.clientName}`);
      } else {
        toast.error(result.error);
      }
    });
  };

  return (
    <div>
      <PortalPageHeader
        title="Bookings"
        description="Incoming booking requests and lifecycle actions."
      />
      <Card>
        <CardContent className="p-0">
          {bookings.length === 0 ? (
            <Empty className="py-12">
              <EmptyHeader>
                <EmptyTitle>No bookings yet</EmptyTitle>
                <EmptyDescription>
                  Requests submitted from the public booking form land here.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ref</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Therapist</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Balance</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings.map((row) => {
                  const total = row.amountKes ?? 0;
                  const outstanding = Math.max(0, total - row.amountPaidKes);
                  const busy = isPending && pendingId === row.id;

                  return (
                    <TableRow key={row.id}>
                      <TableCell className="font-mono text-xs">
                        {row.reference}
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{row.clientName}</div>
                        <div className="text-xs text-muted-foreground">
                          {row.clientEmail}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">
                        {row.preferredDateLabel}
                      </TableCell>
                      <TableCell className="text-sm">
                        {row.therapistName ?? (
                          <span className="text-muted-foreground">
                            Unassigned
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <StatusBadge tone={bookingStatusTone(row.status)}>
                          {row.status.toLowerCase()}
                        </StatusBadge>
                      </TableCell>
                      <TableCell>
                        <StatusBadge tone={paymentStatusTone(row.paymentStatus)}>
                          {row.paymentStatus.toLowerCase()}
                        </StatusBadge>
                      </TableCell>
                      <TableCell>
                        {outstanding > 0 ? (
                          <div>
                            <div className="font-medium">
                              KES {outstanding.toLocaleString()}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {row.amountPaidKes.toLocaleString()} of{" "}
                              {total.toLocaleString()} paid
                            </div>
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground">
                            Settled
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {outstanding > 0 && (
                            <>
                              <Button
                                type="button"
                                variant="link"
                                className="h-auto p-0"
                                disabled={busy}
                                onClick={() => sendRequest(row, "MPESA")}
                              >
                                Send payment request
                              </Button>
                              <Button
                                type="button"
                                variant="link"
                                className="h-auto p-0 text-muted-foreground"
                                disabled={busy}
                                onClick={() => sendRequest(row, "BANK")}
                              >
                                Bank
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
