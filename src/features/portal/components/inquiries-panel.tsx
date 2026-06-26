"use client";

import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import {
  INITIAL_INQUIRIES,
  type MockInquiry,
} from "@/features/portal/data/mock-portal-data";

export function InquiriesPanel() {
  const [rows, setRows] = useState<MockInquiry[]>(INITIAL_INQUIRIES);

  const setStatus = (
    id: string,
    status: MockInquiry["status"],
    message: string,
  ) => {
    setRows((current) =>
      current.map((row) => (row.id === id ? { ...row, status } : row)),
    );
    toast.success(message);
  };

  const remove = (id: string) => {
    setRows((current) => current.filter((row) => row.id !== id));
    toast.success("Inquiry deleted");
  };

  return (
    <div>
      <PortalPageHeader
        title="Inquiries"
        description="Messages from the contact form."
      />
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Message</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Received</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="font-medium">{row.name}</TableCell>
                  <TableCell>{row.email}</TableCell>
                  <TableCell>{row.subject ?? "—"}</TableCell>
                  <TableCell className="max-w-xs truncate" title={row.message}>
                    {row.message}
                  </TableCell>
                  <TableCell>
                    <StatusBadge tone={inquiryStatusTone(row.status)}>
                      {row.status.toLowerCase().replace("_", " ")}
                    </StatusBadge>
                  </TableCell>
                  <TableCell>{row.createdAt}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {row.status !== "RESOLVED" && (
                        <Button
                          type="button"
                          variant="link"
                          className="h-auto p-0"
                          onClick={() =>
                            setStatus(row.id, "RESOLVED", "Marked resolved")
                          }
                        >
                          Resolve
                        </Button>
                      )}
                      <Button
                        type="button"
                        variant="link"
                        className="h-auto p-0 text-destructive"
                        onClick={() => remove(row.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
