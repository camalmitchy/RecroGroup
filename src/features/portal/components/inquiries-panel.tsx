"use client";

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
  inquiryStatusTone,
} from "@/features/portal/components/status-badge";

export type InquiryRow = {
  id: string;
  type: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  status: string;
  createdAtLabel: string;
};

export function InquiriesPanel({ inquiries }: { inquiries: InquiryRow[] }) {
  return (
    <div className="space-y-5">
      <PortalPageHeader
        title="Messages"
        description="Contact and corporate form enquiries."
      />

      <Card>
        <CardContent className="p-0">
          {inquiries.length === 0 ? (
            <Empty className="py-12">
              <EmptyHeader>
                <EmptyTitle>No enquiries yet</EmptyTitle>
                <EmptyDescription>
                  Contact and corporate form submissions arrive here.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Received</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {inquiries.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell className="font-medium">{row.name}</TableCell>
                    <TableCell>
                      <div className="text-xs">{row.email}</div>
                      <div className="text-xs text-muted-foreground">
                        {row.phone ?? "—"}
                      </div>
                    </TableCell>
                    <TableCell className="text-xs capitalize">
                      {row.type.toLowerCase()}
                    </TableCell>
                    <TableCell>{row.subject ?? "—"}</TableCell>
                    <TableCell className="max-w-xs truncate" title={row.message}>
                      {row.message}
                    </TableCell>
                    <TableCell>
                      <StatusBadge tone={inquiryStatusTone(row.status)}>
                        {row.status.toLowerCase().replace("_", " ")}
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
