"use client";

import { useMemo, useState } from "react";
import { Download, Search } from "lucide-react";

import type { AccountType } from "@prisma/client";
import { downloadCsv, toCsv } from "@/features/admin/lib/csv";

import { AdminShell, Card, DataTable, PageHeader } from "./admin-shell";

export type AdminCustomerRow = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  accountType: AccountType;
  bookingCount: number;
  paymentCount: number;
  joinedAtLabel: string;
};

type AdminCustomersPageProps = {
  customers: AdminCustomerRow[];
  total: number;
  isAdmin: boolean;
};

const ACCOUNT_TYPES: AccountType[] = ["CUSTOMER", "GUARDIAN", "CORPORATE"];

const CSV_COLUMNS = [
  "Name",
  "Email",
  "Phone",
  "Account type",
  "Bookings",
  "Payments",
  "Joined",
];

function humanize(value: string) {
  return value.toLowerCase().replace(/_/g, " ");
}

export function AdminCustomersPage({
  customers,
  total,
  isAdmin,
}: AdminCustomersPageProps) {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  const rows = useMemo(() => {
    const needle = search.trim().toLowerCase();

    return customers.filter((customer) => {
      if (typeFilter !== "all" && customer.accountType !== typeFilter) {
        return false;
      }
      if (!needle) return true;
      return (
        customer.name.toLowerCase().includes(needle) ||
        customer.email.toLowerCase().includes(needle) ||
        (customer.phone ?? "").toLowerCase().includes(needle)
      );
    });
  }, [customers, search, typeFilter]);

  const handleExport = () => {
    const csv = toCsv(
      CSV_COLUMNS,
      rows.map((row) => [
        row.name,
        row.email,
        row.phone,
        row.accountType,
        row.bookingCount,
        row.paymentCount,
        row.joinedAtLabel,
      ]),
    );

    downloadCsv(`customers-${new Date().toISOString().slice(0, 10)}.csv`, csv);
  };

  return (
    <AdminShell isAdmin={isAdmin}>
      <div className="space-y-5 p-6 lg:p-8">
        <PageHeader
          title="Customers"
          description="Client profiles, history, and engagement — no clinical notes."
          actions={
            <button
              type="button"
              onClick={handleExport}
              disabled={rows.length === 0}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-gray-200 px-3 text-sm font-semibold hover:bg-gray-50 disabled:opacity-50"
            >
              <Download size={14} /> Export
            </button>
          }
        />

        <Card className="flex items-center gap-3 p-3">
          <div className="relative max-w-md flex-1">
            <Search
              size={14}
              className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400"
            />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by name, email or phone…"
              aria-label="Search customers"
              className="h-9 w-full rounded-lg border border-gray-200 bg-gray-50 pr-3 pl-9 text-sm focus:ring-2 focus:ring-primary-deep/30 focus:outline-none"
            />
          </div>
          <select
            value={typeFilter}
            onChange={(event) => setTypeFilter(event.target.value)}
            aria-label="Filter by account type"
            className="h-9 rounded-lg border border-gray-200 bg-white px-3 text-sm capitalize"
          >
            <option value="all">All types</option>
            {ACCOUNT_TYPES.map((type) => (
              <option key={type} value={type}>
                {humanize(type)}
              </option>
            ))}
          </select>
        </Card>

        <Card>
          {rows.length === 0 ? (
            <div className="p-10 text-center text-sm text-gray-600">
              {customers.length === 0
                ? "No customer accounts yet."
                : "No customers match your search."}
            </div>
          ) : (
            <DataTable
              columns={[
                "Name",
                "Email",
                "Phone",
                "Type",
                "Bookings",
                "Payments",
                "Joined",
              ]}
              rows={rows.map((row) => [
                <span key="name" className="font-medium">
                  {row.name}
                </span>,
                <span key="email" className="text-gray-600">
                  {row.email}
                </span>,
                <span key="phone" className="text-gray-600">
                  {row.phone ?? "—"}
                </span>,
                <span key="type" className="capitalize">
                  {humanize(row.accountType)}
                </span>,
                <span key="bookings" className="font-semibold">
                  {row.bookingCount}
                </span>,
                <span key="payments" className="font-semibold">
                  {row.paymentCount}
                </span>,
                <span key="joined" className="text-xs text-gray-600">
                  {row.joinedAtLabel}
                </span>,
              ])}
            />
          )}
        </Card>

        <div className="text-sm text-gray-600">
          Showing {rows.length} of {total} customer(s)
        </div>
      </div>
    </AdminShell>
  );
}
