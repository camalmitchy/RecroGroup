"use client";

import { useMemo, useState } from "react";

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
  griefStatusTone,
  paymentStatusTone,
} from "@/features/portal/components/status-badge";

export type GriefApplicationRow = {
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
  status: string;
  createdAtLabel: string;
};

type GriefCampPanelProps = {
  applications: GriefApplicationRow[];
};

const STATUSES = [
  "PENDING",
  "REVIEWING",
  "ACCEPTED",
  "REJECTED",
  "WAITLISTED",
] as const;

export function GriefCampPanel({ applications }: GriefCampPanelProps) {
  const [statusFilter, setStatusFilter] = useState("all");

  const rows = useMemo(
    () =>
      applications.filter(
        (row) => statusFilter === "all" || row.status === statusFilter,
      ),
    [applications, statusFilter],
  );

  return (
    <div className="space-y-5">
      <PortalPageHeader
        title="Grief Camp Applications"
        description="Parent/guardian applications for the children's grief camp."
      />

      <Card>
        <CardContent className="flex flex-col gap-3 p-3 sm:flex-row sm:items-center">
          <NativeSelect
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            aria-label="Filter by status"
            className="sm:w-48"
          >
            <NativeSelectOption value="all">All statuses</NativeSelectOption>
            {STATUSES.map((status) => (
              <NativeSelectOption key={status} value={status}>
                {status.toLowerCase()}
              </NativeSelectOption>
            ))}
          </NativeSelect>
          <p className="text-xs text-muted-foreground sm:ml-auto">
            Showing {rows.length} of {applications.length}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          {rows.length === 0 ? (
            <Empty className="py-12">
              <EmptyHeader>
                <EmptyTitle>
                  {applications.length === 0
                    ? "No applications yet"
                    : "No matching applications"}
                </EmptyTitle>
                <EmptyDescription>
                  {applications.length === 0
                    ? "Applications submitted from the Grief Camp page will appear here."
                    : "Try a different status filter."}
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ref</TableHead>
                  <TableHead>Child</TableHead>
                  <TableHead>Age</TableHead>
                  <TableHead>Parent</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Session</TableHead>
                  <TableHead>Tier</TableHead>
                  <TableHead>Fee</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Applied</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell className="font-mono text-xs">
                      {row.reference}
                    </TableCell>
                    <TableCell className="font-medium">
                      {row.childName}
                    </TableCell>
                    <TableCell>{row.childAge ?? "—"}</TableCell>
                    <TableCell>{row.parentName}</TableCell>
                    <TableCell>
                      <div className="text-xs">{row.parentEmail}</div>
                      <div className="text-xs text-muted-foreground">
                        {row.parentPhone ?? "—"}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">
                      {row.campSessionName ?? "—"}
                    </TableCell>
                    <TableCell>{row.tier ?? "—"}</TableCell>
                    <TableCell>
                      <div>
                        {row.amountKes === null
                          ? "—"
                          : `KES ${row.amountKes.toLocaleString()}`}
                      </div>
                      <StatusBadge tone={paymentStatusTone(row.paymentStatus)}>
                        {row.paymentStatus.toLowerCase()}
                      </StatusBadge>
                    </TableCell>
                    <TableCell>
                      <StatusBadge tone={griefStatusTone(row.status)}>
                        {row.status.toLowerCase()}
                      </StatusBadge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {row.createdAtLabel}
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
