"use client";

import { useMemo, useState } from "react";
import { Download, Plus, Search } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import { MOCK_CUSTOMERS } from "@/features/portal/data/mock-portal-data";

export function PeoplePanel() {
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("All types");

  const rows = useMemo(() => {
    return MOCK_CUSTOMERS.filter((customer) => {
      const matchesType =
        typeFilter === "All types" || customer.type === typeFilter;
      const haystack =
        `${customer.name} ${customer.email} ${customer.phone}`.toLowerCase();
      const matchesQuery = haystack.includes(query.toLowerCase());
      return matchesType && matchesQuery;
    });
  }, [query, typeFilter]);

  return (
    <div className="space-y-5">
      <PortalPageHeader
        title="Customers"
        description="Client profiles, history, and engagement — no clinical notes."
        actions={
          <>
            <Button
              type="button"
              variant="outline"
              onClick={() => toast.message("Export coming soon")}
            >
              <Download className="size-4" />
              Export
            </Button>
            <Button
              type="button"
              className="bg-[var(--admin-primary)] hover:bg-[var(--admin-primary)]/90"
              onClick={() => toast.message("Add customer coming soon")}
            >
              <Plus className="size-4" />
              Add customer
            </Button>
          </>
        }
      />

      <Card>
        <CardContent className="flex flex-col gap-3 p-3 sm:flex-row sm:items-center">
          <div className="relative max-w-md flex-1">
            <Search className="absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by name, email or phone…"
              className="bg-[var(--admin-bg)] pl-9"
            />
          </div>
          <NativeSelect
            value={typeFilter}
            onChange={(event) => setTypeFilter(event.target.value)}
            className="sm:w-44"
          >
            <NativeSelectOption value="All types">All types</NativeSelectOption>
            <NativeSelectOption value="Individual">Individual</NativeSelectOption>
            <NativeSelectOption value="Couple">Couple</NativeSelectOption>
            <NativeSelectOption value="Family">Family</NativeSelectOption>
            <NativeSelectOption value="Corporate">Corporate</NativeSelectOption>
          </NativeSelect>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Last activity</TableHead>
                <TableHead>Bookings</TableHead>
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
                    {row.phone}
                  </TableCell>
                  <TableCell>{row.type}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {row.lastActivity}
                  </TableCell>
                  <TableCell className="font-semibold">{row.bookings}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
