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
  griefStatusTone,
} from "@/features/portal/components/status-badge";
import {
  INITIAL_GRIEF_APPLICATIONS,
  type MockGriefApplication,
} from "@/features/portal/data/mock-portal-data";

export function GriefCampPanel() {
  const [rows, setRows] = useState<MockGriefApplication[]>(
    INITIAL_GRIEF_APPLICATIONS,
  );

  const setStatus = (
    id: string,
    status: MockGriefApplication["status"],
    message: string,
  ) => {
    setRows((current) =>
      current.map((row) => (row.id === id ? { ...row, status } : row)),
    );
    toast.success(message);
  };

  const remove = (id: string) => {
    setRows((current) => current.filter((row) => row.id !== id));
    toast.success("Application removed");
  };

  return (
    <div>
      <PortalPageHeader
        title="Grief Camp Applications"
        description="Parent/guardian applications for the children's grief camp."
      />
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Child</TableHead>
                <TableHead>Age</TableHead>
                <TableHead>Parent</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Tier</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Applied</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="font-medium">{row.childName}</TableCell>
                  <TableCell>{row.childAge ?? "—"}</TableCell>
                  <TableCell>{row.parentName}</TableCell>
                  <TableCell>
                    <div className="text-xs">{row.parentEmail}</div>
                    <div className="text-xs text-muted-foreground">
                      {row.parentPhone}
                    </div>
                  </TableCell>
                  <TableCell>{row.tier ?? "—"}</TableCell>
                  <TableCell>
                    <StatusBadge tone={griefStatusTone(row.status)}>
                      {row.status.toLowerCase()}
                    </StatusBadge>
                  </TableCell>
                  <TableCell>{row.createdAt}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {row.status !== "ACCEPTED" && (
                        <Button
                          type="button"
                          variant="link"
                          className="h-auto p-0"
                          onClick={() =>
                            setStatus(row.id, "ACCEPTED", "Application accepted")
                          }
                        >
                          Accept
                        </Button>
                      )}
                      {row.status !== "REJECTED" && (
                        <Button
                          type="button"
                          variant="link"
                          className="h-auto p-0 text-destructive"
                          onClick={() =>
                            setStatus(row.id, "REJECTED", "Application rejected")
                          }
                        >
                          Reject
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
