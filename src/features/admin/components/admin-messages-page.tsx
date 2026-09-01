"use client";

import { useMemo, useState, useTransition } from "react";
import { toast } from "sonner";

import type { InquiryStatus, InquiryType } from "@prisma/client";
import { setInquiryStatus } from "@/server/actions/operations";

import { AdminShell, Card, DataTable, PageHeader, StatusBadge } from "./admin-shell";

export type AdminInquiryRow = {
  id: string;
  type: InquiryType;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  status: InquiryStatus;
  createdAtLabel: string;
};

type AdminMessagesPageProps = {
  inquiries: AdminInquiryRow[];
  total: number;
  newCount: number;
  isAdmin: boolean;
};

const TABS: { key: "all" | InquiryType; label: string }[] = [
  { key: "all", label: "All" },
  { key: "CONTACT", label: "Contact" },
  { key: "CORPORATE", label: "Corporate" },
];

const STATUSES: InquiryStatus[] = ["NEW", "IN_PROGRESS", "RESOLVED", "CLOSED"];

function humanize(value: string) {
  return value.toLowerCase().replace(/_/g, " ");
}

function statusTone(status: InquiryStatus) {
  if (status === "RESOLVED") return "success" as const;
  if (status === "NEW") return "warning" as const;
  if (status === "CLOSED") return "muted" as const;
  return "info" as const;
}

export function AdminMessagesPage({
  inquiries,
  total,
  newCount,
  isAdmin,
}: AdminMessagesPageProps) {
  const [tab, setTab] = useState<"all" | InquiryType>("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const rows = useMemo(
    () =>
      inquiries.filter(
        (inquiry) =>
          (tab === "all" || inquiry.type === tab) &&
          (statusFilter === "all" || inquiry.status === statusFilter),
      ),
    [inquiries, tab, statusFilter],
  );

  const counts = useMemo(
    () => ({
      all: inquiries.length,
      CONTACT: inquiries.filter((inquiry) => inquiry.type === "CONTACT").length,
      CORPORATE: inquiries.filter((inquiry) => inquiry.type === "CORPORATE")
        .length,
    }),
    [inquiries],
  );

  const updateStatus = (id: string, status: InquiryStatus) => {
    setPendingId(id);
    startTransition(async () => {
      const result = await setInquiryStatus(id, status);
      setPendingId(null);
      if (result.ok) {
        toast.success(`Marked ${humanize(status)}`);
      } else {
        toast.error(result.error);
      }
    });
  };

  return (
    <AdminShell isAdmin={isAdmin}>
      <div className="space-y-5 p-6 lg:p-8">
        <PageHeader
          title="Messages"
          description={
            newCount > 0
              ? `${newCount} unread inquir${newCount === 1 ? "y" : "ies"} awaiting a reply.`
              : "Contact form and corporate inquiries."
          }
        />

        <div className="flex flex-wrap items-center gap-4">
          <div className="flex gap-1 border-b border-gray-200">
            {TABS.map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => setTab(item.key)}
                className={`-mb-px border-b-2 px-4 py-2 text-sm font-medium ${
                  tab === item.key
                    ? "border-primary-deep text-primary-deep"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                {item.label} ({counts[item.key]})
              </button>
            ))}
          </div>

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            aria-label="Filter by status"
            className="ml-auto rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm capitalize focus:border-primary-deep focus:ring-1 focus:ring-primary-deep focus:outline-none"
          >
            <option value="all">All Statuses</option>
            {STATUSES.map((status) => (
              <option key={status} value={status}>
                {humanize(status)}
              </option>
            ))}
          </select>
        </div>

        <Card>
          {rows.length === 0 ? (
            <div className="p-10 text-center text-sm text-gray-600">
              {inquiries.length === 0
                ? "No inquiries yet."
                : "No inquiries match the selected filters."}
            </div>
          ) : (
            <DataTable
              columns={[
                "Name",
                "Contact",
                "Type",
                "Subject",
                "Message",
                "Status",
                "Received",
                "Actions",
              ]}
              rows={rows.map((row) => {
                const busy = isPending && pendingId === row.id;

                return [
                  <span key="name" className="font-medium">
                    {row.name}
                  </span>,
                  <div key="contact">
                    <div className="text-xs">{row.email}</div>
                    <div className="text-xs text-gray-600">
                      {row.phone ?? "—"}
                    </div>
                  </div>,
                  <span key="type" className="text-xs capitalize">
                    {humanize(row.type)}
                  </span>,
                  row.subject ?? "—",
                  <span
                    key="message"
                    className="block max-w-xs text-xs text-gray-600"
                    title={row.message}
                  >
                    <span className="line-clamp-2">{row.message}</span>
                  </span>,
                  <StatusBadge key="status" tone={statusTone(row.status)}>
                    {humanize(row.status)}
                  </StatusBadge>,
                  <span key="received" className="text-xs text-gray-600">
                    {row.createdAtLabel}
                  </span>,
                  <div key="actions" className="flex gap-3 text-xs font-semibold">
                    {row.status !== "IN_PROGRESS" && row.status !== "CLOSED" && (
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => updateStatus(row.id, "IN_PROGRESS")}
                        className="text-primary-deep hover:underline disabled:opacity-50"
                      >
                        In progress
                      </button>
                    )}
                    {row.status !== "RESOLVED" && (
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => updateStatus(row.id, "RESOLVED")}
                        className="text-primary-deep hover:underline disabled:opacity-50"
                      >
                        Resolve
                      </button>
                    )}
                    {row.status !== "CLOSED" && (
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => updateStatus(row.id, "CLOSED")}
                        className="text-gray-600 hover:underline disabled:opacity-50"
                      >
                        Close
                      </button>
                    )}
                  </div>,
                ];
              })}
            />
          )}
        </Card>

        <div className="text-sm text-gray-600">
          Showing {rows.length} of {total} inquir{total === 1 ? "y" : "ies"}
        </div>
      </div>
    </AdminShell>
  );
}
