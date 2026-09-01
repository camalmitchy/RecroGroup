"use client";

import { useMemo, useState, useTransition } from "react";
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
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
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
  paymentStatusTone,
} from "@/features/portal/components/status-badge";
import type { PaymentActionResult } from "@/server/actions/payments";
import { markPaymentFailed, markPaymentPaid } from "@/server/actions/payments";
import type { PaymentPanelStats } from "@/server/queries/payments";
import type { ActionResult } from "@/server/result";

export type PaymentRow = {
  id: string;
  reference: string;
  method: string;
  provider: string;
  purpose: string;
  currency: string;
  amountKes: number;
  settledAmountKes: number | null;
  status: string;
  mpesaReceipt: string | null;
  providerRef: string | null;
  failureReason: string | null;
  phone: string | null;
  bookingReference: string | null;
  createdAtLabel: string;
  paidAtLabel: string | null;
};

type PaymentsPanelProps = {
  payments: PaymentRow[];
  stats: PaymentPanelStats;
};

const METHODS = ["MPESA", "BANK", "CARD"] as const;
const STATUSES = [
  "PENDING",
  "PROCESSING",
  "PAID",
  "FAILED",
  "CANCELLED",
  "REFUNDED",
] as const;

function humanize(value: string) {
  return value.toLowerCase().replace(/_/g, " ");
}

export function PaymentsPanel({ payments, stats }: PaymentsPanelProps) {
  const [methodFilter, setMethodFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const rows = useMemo(
    () =>
      payments.filter(
        (row) =>
          (methodFilter === "all" || row.method === methodFilter) &&
          (statusFilter === "all" || row.status === statusFilter),
      ),
    [payments, methodFilter, statusFilter],
  );

  const run = (
    id: string,
    action: () => Promise<ActionResult<PaymentActionResult>>,
    successMessage: string,
  ) => {
    setPendingId(id);
    startTransition(async () => {
      const result = await action();
      setPendingId(null);
      if (result.ok) {
        toast.success(successMessage);
      } else {
        toast.error(result.error);
      }
    });
  };

  const summary = [
    { label: "Collected", value: `KES ${stats.totalPaidKes.toLocaleString()}` },
    { label: "Pending", value: stats.pendingCount },
    { label: "Failed", value: stats.failedCount },
    { label: "Bank to verify", value: stats.bankToVerify },
  ];

  return (
    <div className="space-y-5">
      <PortalPageHeader
        title="Payments"
        description="M-Pesa, bank transfer and card payment tracking."
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {summary.map((tile) => (
          <Card key={tile.label}>
            <CardContent className="p-4">
              <p className="text-2xl font-semibold tracking-tight">
                {tile.value}
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {tile.label}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent className="flex flex-col gap-3 p-3 sm:flex-row sm:items-center">
          <NativeSelect
            value={methodFilter}
            onChange={(event) => setMethodFilter(event.target.value)}
            aria-label="Filter by method"
            className="sm:w-44"
          >
            <NativeSelectOption value="all">All methods</NativeSelectOption>
            {METHODS.map((method) => (
              <NativeSelectOption key={method} value={method}>
                {humanize(method)}
              </NativeSelectOption>
            ))}
          </NativeSelect>
          <NativeSelect
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            aria-label="Filter by status"
            className="sm:w-44"
          >
            <NativeSelectOption value="all">All statuses</NativeSelectOption>
            {STATUSES.map((status) => (
              <NativeSelectOption key={status} value={status}>
                {humanize(status)}
              </NativeSelectOption>
            ))}
          </NativeSelect>
          <p className="text-xs text-muted-foreground sm:ml-auto">
            Showing {rows.length} of {payments.length}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          {rows.length === 0 ? (
            <Empty className="py-12">
              <EmptyHeader>
                <EmptyTitle>
                  {payments.length === 0
                    ? "No payments yet"
                    : "No matching payments"}
                </EmptyTitle>
                <EmptyDescription>
                  {payments.length === 0
                    ? "Payments appear here once a client checks out or a transfer is recorded."
                    : "Try a different method or status filter."}
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Reference</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Purpose</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Receipt</TableHead>
                  <TableHead>Booking</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Paid</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((row) => {
                  const busy = isPending && pendingId === row.id;
                  const settledDiffers =
                    row.settledAmountKes !== null &&
                    row.settledAmountKes !== row.amountKes;

                  return (
                    <TableRow key={row.id}>
                      <TableCell className="font-mono text-xs">
                        {row.reference}
                      </TableCell>
                      <TableCell>
                        <div className="capitalize">{humanize(row.method)}</div>
                        <div className="text-xs text-muted-foreground capitalize">
                          {humanize(row.provider)}
                        </div>
                      </TableCell>
                      <TableCell className="capitalize">
                        {humanize(row.purpose)}
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">
                          {row.currency} {row.amountKes.toLocaleString()}
                        </div>
                        {settledDiffers && (
                          <div className="text-xs text-muted-foreground">
                            settled {row.settledAmountKes?.toLocaleString()}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <StatusBadge tone={paymentStatusTone(row.status)}>
                          {humanize(row.status)}
                        </StatusBadge>
                        {row.failureReason && (
                          <div
                            className="mt-1 max-w-[160px] truncate text-xs text-destructive"
                            title={row.failureReason}
                          >
                            {row.failureReason}
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        {row.mpesaReceipt ?? row.providerRef ?? "—"}
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        {row.bookingReference ?? "—"}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {row.createdAtLabel}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {row.paidAtLabel ?? "—"}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {row.status !== "PAID" && (
                            <Button
                              type="button"
                              variant="link"
                              className="h-auto p-0"
                              disabled={busy}
                              onClick={() =>
                                run(
                                  row.id,
                                  () => markPaymentPaid(row.id),
                                  "Marked paid",
                                )
                              }
                            >
                              {row.method === "BANK" ? "Verify" : "Mark paid"}
                            </Button>
                          )}
                          {row.status !== "FAILED" && row.status !== "PAID" && (
                            <Button
                              type="button"
                              variant="link"
                              className="h-auto p-0 text-destructive"
                              disabled={busy}
                              onClick={() =>
                                run(
                                  row.id,
                                  () =>
                                    markPaymentFailed(
                                      row.id,
                                      "Rejected by staff",
                                    ),
                                  "Payment rejected",
                                )
                              }
                            >
                              Reject
                            </Button>
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
