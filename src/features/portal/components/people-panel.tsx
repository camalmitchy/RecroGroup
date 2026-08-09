"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";
import { Input } from "@/components/ui/input";
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

export type CustomerRow = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  accountType: string;
  joinedLabel: string;
  bookings: number;
  payments: number;
};

type PeoplePanelProps = {
  customers: CustomerRow[];
  total: number;
};

export function PeoplePanel({ customers, total }: PeoplePanelProps) {
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  const types = useMemo(
    () => [...new Set(customers.map((row) => row.accountType))].sort(),
    [customers],
  );

  const rows = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return customers.filter((customer) => {
      if (typeFilter !== "all" && customer.accountType !== typeFilter) {
        return false;
      }
      if (!needle) return true;
      return `${customer.name} ${customer.email} ${customer.phone ?? ""}`
        .toLowerCase()
        .includes(needle);
    });
  }, [customers, query, typeFilter]);

  return (
    <div className="space-y-5">
      <PortalPageHeader
        title="Customers"
        description="Client profiles, history, and engagement — no clinical notes."
      />

      <Card>
        <CardContent className="flex flex-col gap-3 p-3 sm:flex-row sm:items-center">
          <div className="relative max-w-md flex-1">
            <Search className="absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by name, email or phone…"
              aria-label="Search customers"
              className="bg-[var(--admin-bg)] pl-9"
            />
          </div>
          <NativeSelect
            value={typeFilter}
            onChange={(event) => setTypeFilter(event.target.value)}
            aria-label="Filter by account type"
            className="sm:w-44"
          >
            <NativeSelectOption value="all">All types</NativeSelectOption>
            {types.map((type) => (
              <NativeSelectOption key={type} value={type}>
                {type}
              </NativeSelectOption>
            ))}
          </NativeSelect>
          <p className="text-xs text-muted-foreground sm:ml-auto">
            Showing {rows.length} of {total}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          {rows.length === 0 ? (
            <Empty className="py-12">
              <EmptyHeader>
                <EmptyTitle>
                  {customers.length === 0
                    ? "No customers yet"
                    : "No matching customers"}
                </EmptyTitle>
                <EmptyDescription>
                  {customers.length === 0
                    ? "Client profiles appear here once someone signs up or books a session."
                    : "Try a different search term or account type."}
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Bookings</TableHead>
                  <TableHead>Payments</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell className="font-medium">{row.name}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {row.email}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {row.phone ?? "—"}
                    </TableCell>
                    <TableCell>{row.accountType}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {row.joinedLabel}
                    </TableCell>
                    <TableCell className="font-semibold">
                      {row.bookings}
                    </TableCell>
                    <TableCell className="font-semibold">
                      {row.payments}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
