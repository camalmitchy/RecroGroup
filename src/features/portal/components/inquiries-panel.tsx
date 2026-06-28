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
import { PortalTabBar } from "@/features/portal/components/portal-tab-bar";
import {
  StatusBadge,
  inquiryStatusTone,
} from "@/features/portal/components/status-badge";
import {
  INITIAL_INQUIRIES,
  INITIAL_NEWSLETTER_SUBSCRIBERS,
  type MockInquiry,
} from "@/features/portal/data/mock-portal-data";

type MessagesTab = "inquiries" | "newsletter";

export function InquiriesPanel() {
  const [tab, setTab] = useState<MessagesTab>("inquiries");
  const [inquiries, setInquiries] = useState<MockInquiry[]>(INITIAL_INQUIRIES);

  const setStatus = (
    id: string,
    status: MockInquiry["status"],
    message: string,
  ) => {
    setInquiries((current) =>
      current.map((row) => (row.id === id ? { ...row, status } : row)),
    );
    toast.success(message);
  };

  return (
    <div className="space-y-5">
      <PortalPageHeader
        title="Messages"
        description="Contact form inquiries and newsletter subscribers."
      />

      <PortalTabBar
        tabs={[
          { key: "inquiries", label: `Inquiries (${inquiries.length})` },
          {
            key: "newsletter",
            label: `Newsletter (${INITIAL_NEWSLETTER_SUBSCRIBERS.length})`,
          },
        ]}
        active={tab}
        onChange={setTab}
      />

      <Card>
        <CardContent className="p-0">
          {tab === "inquiries" ? (
            inquiries.length === 0 ? (
              <p className="p-10 text-center text-sm text-muted-foreground">
                No inquiries yet.
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Message</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Received</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inquiries.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell className="font-medium">{row.name}</TableCell>
                      <TableCell>
                        <div className="text-xs">{row.email}</div>
                      </TableCell>
                      <TableCell>{row.subject ?? "—"}</TableCell>
                      <TableCell
                        className="max-w-xs truncate"
                        title={row.message}
                      >
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
                          {row.status !== "IN_PROGRESS" && (
                            <Button
                              type="button"
                              variant="link"
                              className="h-auto p-0"
                              onClick={() =>
                                setStatus(row.id, "IN_PROGRESS", "In progress")
                              }
                            >
                              In progress
                            </Button>
                          )}
                          {row.status !== "RESOLVED" && (
                            <Button
                              type="button"
                              variant="link"
                              className="h-auto p-0"
                              onClick={() =>
                                setStatus(row.id, "RESOLVED", "Resolved")
                              }
                            >
                              Resolve
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )
          ) : INITIAL_NEWSLETTER_SUBSCRIBERS.length === 0 ? (
            <p className="p-10 text-center text-sm text-muted-foreground">
              No subscribers yet.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Subscribed</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {INITIAL_NEWSLETTER_SUBSCRIBERS.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell className="font-medium">{row.email}</TableCell>
                    <TableCell>{row.name ?? "—"}</TableCell>
                    <TableCell>{row.createdAt}</TableCell>
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
