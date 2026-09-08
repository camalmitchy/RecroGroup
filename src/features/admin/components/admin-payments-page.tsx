"use client";

import { useMemo, useState, useTransition } from "react";
import { Check, Download, Filter, X } from "lucide-react";
import { toast } from "sonner";

import type { PaymentActionResult } from "@/server/actions/payments";
import { markPaymentFailed, markPaymentPaid } from "@/server/actions/payments";
import type { PaymentPanelStats } from "@/server/queries/payments";
import type { ActionResult } from "@/server/result";

import { AdminShell, Card, DataTable, PageHeader, StatusBadge } from "./admin-shell";

export type AdminPaymentRow = {
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
  payerName: string | null;
  bookingReference: string | null;
  createdAtLabel: string;
  paidAtLabel: string | null;
};

type AdminPaymentsPageProps = {
  payments: AdminPaymentRow[];
  stats: PaymentPanelStats;
  isAdmin: boolean;
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

const CSV_COLUMNS = [
  "Reference",
  "Method",
  "Provider",
  "Purpose",
  "Currency",
  "Amount",
  "Settled amount",
  "Status",
  "M-Pesa receipt",
  "Provider ref",
  "Phone",
  "Payer",
  "Booking",
  "Created",
  "Paid",
  "Failure reason",
];

function csvCell(value: string | number | null): string {
  const text = value === null ? "" : String(value);
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function toCsv(rows: AdminPaymentRow[]): string {
  const lines = [
    CSV_COLUMNS.join(","),
    ...rows.map((row) =>
      [
        row.reference,
        row.method,
        row.provider,
        row.purpose,
        row.currency,
        row.amountKes,
        row.settledAmountKes,
        row.status,
        row.mpesaReceipt,
        row.providerRef,
        row.phone,
        row.payerName,
        row.bookingReference,
        row.createdAtLabel,
        row.paidAtLabel,
        row.failureReason,
      ]
        .map(csvCell)
        .join(","),
    ),
  ];

  return lines.join("\r\n");
}

function humanize(value: string) {
  return value.toLowerCase().replace(/_/g, " ");
}

function statusTone(status: string) {
  if (status === "PAID") return "success" as const;
  if (status === "FAILED" || status === "REFUNDED") return "danger" as const;
  if (status === "CANCELLED") return "muted" as const;
  return "warning" as const;
}

export function AdminPaymentsPage({
  payments,
  stats,
  isAdmin,
}: AdminPaymentsPageProps) {
  const [methodFilter, setMethodFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const rows = useMemo(
    () =>
      payments.filter(
        (payment) =>
          (methodFilter === "all" || payment.method === methodFilter) &&
          (statusFilter === "all" || payment.status === statusFilter),
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

  const handleExport = () => {
    const blob = new Blob([`﻿${toCsv(rows)}`], {
      type: "text/csv;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `payments-${new Date().toISOString().slice(0, 10)}.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const summary = [
    { label: "Collected", value: `KES ${stats.totalPaidKes.toLocaleString()}` },
    { label: "Pending", value: stats.pendingCount },
    { label: "Failed", value: stats.failedCount },
    { label: "Bank to verify", value: stats.bankToVerify },
  ];

  return (
    <AdminShell isAdmin={isAdmin}>
      <div className="p-6 lg:p-8">
        <PageHeader
          title="Payments"
          description="M-Pesa, bank transfer and card payment tracking."
        />

        <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {summary.map((tile) => (
            <Card key={tile.label} className="p-4">
              <p className="text-2xl font-semibold tracking-tight">
                {tile.value}
              </p>
              <p className="mt-0.5 text-xs text-gray-600">{tile.label}</p>
            </Card>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-gray-500" />
            <select
              value={methodFilter}
              onChange={(event) => setMethodFilter(event.target.value)}
              aria-label="Filter by method"
              className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm capitalize focus:border-primary-deep focus:ring-1 focus:ring-primary-deep focus:outline-none"
            >
              <option value="all">All Methods</option>
              {METHODS.map((method) => (
                <option key={method} value={method}>
                  {humanize(method)}
                </option>
              ))}
            </select>
          </div>

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            aria-label="Filter by status"
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm capitalize focus:border-primary-deep focus:ring-1 focus:ring-primary-deep focus:outline-none"
          >
            <option value="all">All Statuses</option>
            {STATUSES.map((status) => (
              <option key={status} value={status}>
                {humanize(status)}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={handleExport}
            disabled={rows.length === 0}
            className="ml-auto flex items-center gap-2 rounded-lg bg-primary-deep px-4 py-2 text-sm font-semibold text-white hover:bg-primary-deep/90 disabled:opacity-50"
          >
            <Download size={16} />
            Export CSV
          </button>
        </div>

        <Card className="mt-6">
          {rows.length === 0 ? (
            <div className="p-10 text-center text-sm text-gray-600">
              {payments.length === 0
                ? "No payments recorded yet."
                : "No payments match the selected filters."}
            </div>
          ) : (
            <DataTable
              columns={[
                "Reference",
                "Method",
                "Purpose",
                "Amount",
                "Status",
                "Receipt",
                "Booking",
                "Created",
                "Paid",
                "Actions",
              ]}
              rows={rows.map((row) => {
                const busy = isPending && pendingId === row.id;
                const settledDiffers =
                  row.settledAmountKes !== null &&
                  row.settledAmountKes !== row.amountKes;

                return [
                  <span key="ref" className="font-mono text-xs">
                    {row.reference}
                  </span>,
                  <div key="method">
                    <div className="capitalize">{humanize(row.method)}</div>
                    <div className="text-xs text-gray-500 capitalize">
                      {humanize(row.provider)}
                    </div>
                  </div>,
                  <span key="purpose" className="capitalize">
                    {humanize(row.purpose)}
                  </span>,
                  <div key="amount">
                    <div className="font-medium">
                      {row.currency} {row.amountKes.toLocaleString()}
                    </div>
                    {settledDiffers && (
                      <div className="text-xs text-gray-500">
                        settled {row.settledAmountKes?.toLocaleString()}
                      </div>
                    )}
                  </div>,
                  <div key="status">
                    <StatusBadge tone={statusTone(row.status)}>
                      {humanize(row.status)}
                    </StatusBadge>
                    {row.failureReason && (
                      <div
                        className="mt-1 max-w-[160px] truncate text-xs text-red-600"
                        title={row.failureReason}
                      >
                        {row.failureReason}
                      </div>
                    )}
                  </div>,
                  <span key="receipt" className="font-mono text-xs">
                    {row.mpesaReceipt ?? row.providerRef ?? "—"}
                  </span>,
                  <span key="booking" className="font-mono text-xs">
                    {row.bookingReference ?? "—"}
                  </span>,
                  <span key="created" className="text-xs text-gray-600">
                    {row.createdAtLabel}
                  </span>,
                  <span key="paid" className="text-xs text-gray-600">
                    {row.paidAtLabel ?? "—"}
                  </span>,
                  <div key="actions" className="flex gap-2">
                    {row.status !== "PAID" && (
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() =>
                          run(
                            row.id,
                            () => markPaymentPaid(row.id),
                            "Marked paid",
                          )
                        }
                        className="rounded-md bg-green-100 p-2 text-green-700 hover:bg-green-200 disabled:opacity-50"
                        title={row.method === "BANK" ? "Verify" : "Mark paid"}
                      >
                        <Check size={16} />
                      </button>
                    )}
                    {row.status !== "PAID" && row.status !== "FAILED" && (
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() =>
                          run(
                            row.id,
                            () =>
                              markPaymentFailed(row.id, "Rejected by staff"),
                            "Payment rejected",
                          )
                        }
                        className="rounded-md bg-red-100 p-2 text-red-700 hover:bg-red-200 disabled:opacity-50"
                        title="Reject"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>,
                ];
              })}
            />
          )}
        </Card>

        <div className="mt-4 text-sm text-gray-600">
          Showing {rows.length} of {payments.length} payment(s)
        </div>
      </div>
    </AdminShell>
  );
}
