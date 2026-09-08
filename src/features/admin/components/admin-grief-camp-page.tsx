"use client";

import { useMemo, useState, useTransition } from "react";
import { Check, Clock, Download, Filter, X } from "lucide-react";
import { toast } from "sonner";

import type { GriefApplicationStatus } from "@prisma/client";
import { downloadCsv, toCsv } from "@/features/admin/lib/csv";
import { setGriefApplicationStatus } from "@/server/actions/operations";

import { AdminShell, Card, DataTable, PageHeader, StatusBadge } from "./admin-shell";

export type AdminGriefApplicationRow = {
  id: string;
  reference: string;
  childName: string;
  childAge: number | null;
  parentName: string;
  parentEmail: string;
  parentPhone: string | null;
  tier: string | null;
  campSessionName: string | null;
  amountKes: number | null;
  paymentStatus: string;
  status: GriefApplicationStatus;
  createdAtLabel: string;
};

type AdminGriefCampPageProps = {
  applications: AdminGriefApplicationRow[];
  total: number;
  isAdmin: boolean;
};

const STATUSES: GriefApplicationStatus[] = [
  "PENDING",
  "REVIEWING",
  "ACCEPTED",
  "REJECTED",
  "WAITLISTED",
];

const CSV_COLUMNS = [
  "Reference",
  "Child",
  "Age",
  "Parent",
  "Email",
  "Phone",
  "Camp session",
  "Tier",
  "Amount",
  "Payment",
  "Status",
  "Applied",
];

function humanize(value: string) {
  return value.toLowerCase().replace(/_/g, " ");
}

function statusTone(status: GriefApplicationStatus) {
  if (status === "ACCEPTED") return "success" as const;
  if (status === "REJECTED") return "danger" as const;
  if (status === "REVIEWING") return "info" as const;
  if (status === "WAITLISTED") return "muted" as const;
  return "warning" as const;
}

function paymentTone(status: string) {
  if (status === "PAID") return "success" as const;
  if (status === "FAILED" || status === "REFUNDED") return "danger" as const;
  if (status === "CANCELLED") return "muted" as const;
  return "warning" as const;
}

export function AdminGriefCampPage({
  applications,
  total,
  isAdmin,
}: AdminGriefCampPageProps) {
  const [statusFilter, setStatusFilter] = useState("all");
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const rows = useMemo(
    () =>
      applications.filter(
        (application) =>
          statusFilter === "all" || application.status === statusFilter,
      ),
    [applications, statusFilter],
  );

  const updateStatus = (id: string, status: GriefApplicationStatus) => {
    setPendingId(id);
    startTransition(async () => {
      const result = await setGriefApplicationStatus(id, status);
      setPendingId(null);
      if (result.ok) {
        toast.success(`Application marked ${humanize(status)}`);
      } else {
        toast.error(result.error);
      }
    });
  };

  const handleExport = () => {
    const csv = toCsv(
      CSV_COLUMNS,
      rows.map((row) => [
        row.reference,
        row.childName,
        row.childAge,
        row.parentName,
        row.parentEmail,
        row.parentPhone,
        row.campSessionName,
        row.tier,
        row.amountKes,
        row.paymentStatus,
        row.status,
        row.createdAtLabel,
      ]),
    );

    downloadCsv(
      `grief-camp-applications-${new Date().toISOString().slice(0, 10)}.csv`,
      csv,
    );
  };

  return (
    <AdminShell isAdmin={isAdmin}>
      <div className="p-6 lg:p-8">
        <PageHeader
          title="Grief Camp Applications"
          description="Parent/guardian applications for the children's grief camp."
        />

        <div className="mt-6 flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-gray-500" />
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
          </div>

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
              {applications.length === 0
                ? "No grief camp applications yet."
                : "No applications match the selected filter."}
            </div>
          ) : (
            <DataTable
              columns={[
                "Reference",
                "Child",
                "Parent",
                "Contact",
                "Session",
                "Tier",
                "Payment",
                "Status",
                "Applied",
                "Actions",
              ]}
              rows={rows.map((row) => {
                const busy = isPending && pendingId === row.id;

                return [
                  <span key="ref" className="font-mono text-xs">
                    {row.reference}
                  </span>,
                  <div key="child">
                    <div className="font-medium">{row.childName}</div>
                    <div className="text-xs text-gray-500">
                      {row.childAge === null ? "Age unknown" : `${row.childAge} yrs`}
                    </div>
                  </div>,
                  row.parentName,
                  <div key="contact">
                    <div className="text-xs">{row.parentEmail}</div>
                    <div className="text-xs text-gray-600">
                      {row.parentPhone ?? "—"}
                    </div>
                  </div>,
                  <span key="session" className="text-xs text-gray-600">
                    {row.campSessionName ?? "—"}
                  </span>,
                  <div key="tier">
                    <div>{row.tier ?? "—"}</div>
                    {row.amountKes !== null && (
                      <div className="text-xs text-gray-500">
                        KES {row.amountKes.toLocaleString()}
                      </div>
                    )}
                  </div>,
                  <StatusBadge key="pay" tone={paymentTone(row.paymentStatus)}>
                    {humanize(row.paymentStatus)}
                  </StatusBadge>,
                  <StatusBadge key="status" tone={statusTone(row.status)}>
                    {humanize(row.status)}
                  </StatusBadge>,
                  <span key="applied" className="text-xs text-gray-600">
                    {row.createdAtLabel}
                  </span>,
                  <div key="actions" className="flex gap-2">
                    {row.status === "PENDING" && (
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => updateStatus(row.id, "REVIEWING")}
                        className="rounded-md bg-blue-100 p-2 text-blue-700 hover:bg-blue-200 disabled:opacity-50"
                        title="Start review"
                      >
                        <Clock size={16} />
                      </button>
                    )}
                    {row.status !== "ACCEPTED" && (
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => updateStatus(row.id, "ACCEPTED")}
                        className="rounded-md bg-green-100 p-2 text-green-700 hover:bg-green-200 disabled:opacity-50"
                        title="Accept"
                      >
                        <Check size={16} />
                      </button>
                    )}
                    {row.status !== "REJECTED" && (
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => updateStatus(row.id, "REJECTED")}
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
          Showing {rows.length} of {total} application(s)
        </div>
      </div>
    </AdminShell>
  );
}
