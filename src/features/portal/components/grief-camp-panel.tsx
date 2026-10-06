"use client";

import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  formData: unknown;
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

function labelize(key: string) {
  const spaced = key
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[_-]/g, " ");
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

function formatLeaf(value: unknown): string {
  if (value == null || value === "") return "";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (typeof value === "string" || typeof value === "number") return String(value);
  if (Array.isArray(value)) {
    return value
      .map((item) => formatLeaf(item))
      .filter(Boolean)
      .join(", ");
  }
  if (typeof value === "object") {
    const record = value as Record<string, unknown>;
    if ("before" in record || "current" in record) {
      return `Before ${formatLeaf(record.before) || "—"} · Now ${formatLeaf(record.current) || "—"}`;
    }
    return Object.entries(record)
      .map(([key, child]) => {
        const text = formatLeaf(child);
        return text ? `${labelize(key)}: ${text}` : "";
      })
      .filter(Boolean)
      .join("\n");
  }
  return "";
}

function formSections(formData: unknown) {
  if (!formData || typeof formData !== "object" || Array.isArray(formData)) {
    return [];
  }
  return Object.entries(formData as Record<string, unknown>)
    .map(([key, value]) => {
      if (value && typeof value === "object" && !Array.isArray(value)) {
        const fields = Object.entries(value as Record<string, unknown>)
          .map(([field, child]) => ({ label: labelize(field), value: formatLeaf(child) }))
          .filter((field) => field.value);
        return { heading: labelize(key), fields };
      }
      const text = formatLeaf(value);
      return text ? { heading: labelize(key), fields: [{ label: "Details", value: text }] } : null;
    })
    .filter((section): section is { heading: string; fields: { label: string; value: string }[] } =>
      Boolean(section && section.fields.length > 0),
    );
}

export function GriefCampPanel({ applications }: GriefCampPanelProps) {
  const [statusFilter, setStatusFilter] = useState("all");
  const [openId, setOpenId] = useState<string | null>(null);

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
                  <TableHead className="text-right">
                    <span className="sr-only">Open</span>
                  </TableHead>
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
                    <TableCell className="text-right">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setOpenId(row.id)}
                      >
                        Open
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <GriefApplicationDetail
        application={rows.find((row) => row.id === openId) ?? null}
        onOpenChange={(next) => {
          if (!next) setOpenId(null);
        }}
      />
    </div>
  );
}

function GriefApplicationDetail({
  application,
  onOpenChange,
}: {
  application: GriefApplicationRow | null;
  onOpenChange: (open: boolean) => void;
}) {
  const sections = application ? formSections(application.formData) : [];

  return (
    <Dialog open={application !== null} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[min(90vh,840px)] flex-col gap-0 overflow-hidden p-0 sm:max-w-2xl">
        {application ? (
          <>
            <DialogHeader className="border-b border-border px-6 py-5 pr-12">
              <DialogTitle className="text-xl">{application.childName}</DialogTitle>
              <DialogDescription>
                {application.reference} · {application.parentName} · {application.createdAtLabel}
              </DialogDescription>
            </DialogHeader>
            <div className="flex-1 space-y-5 overflow-y-auto px-6 py-5">
              <section className="grid gap-3 rounded-2xl bg-muted/50 p-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs text-muted-foreground">Parent</p>
                  <p className="font-medium">{application.parentName}</p>
                  <p className="text-sm text-muted-foreground">{application.parentEmail}</p>
                  <p className="text-sm text-muted-foreground">
                    {application.parentPhone ?? "No phone"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Camp</p>
                  <p className="font-medium">{application.campSessionName ?? "—"}</p>
                  <p className="text-sm text-muted-foreground">
                    {application.tier ?? "No tier"}
                    {application.amountKes === null
                      ? ""
                      : ` · KES ${application.amountKes.toLocaleString()}`}
                  </p>
                </div>
              </section>
              {sections.map((section) => (
                <section key={section.heading} className="space-y-3">
                  <h3 className="text-sm font-semibold">{section.heading}</h3>
                  <dl className="divide-y divide-border rounded-2xl border border-border">
                    {section.fields.map((field) => (
                      <div
                        key={`${section.heading}-${field.label}`}
                        className="grid gap-1 px-4 py-3 sm:grid-cols-[180px_1fr] sm:gap-4"
                      >
                        <dt className="text-xs font-medium text-muted-foreground">
                          {field.label}
                        </dt>
                        <dd className="whitespace-pre-wrap text-sm">{field.value}</dd>
                      </div>
                    ))}
                  </dl>
                </section>
              ))}
            </div>
            <div className="flex justify-end border-t border-border px-6 py-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Close
              </Button>
            </div>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
