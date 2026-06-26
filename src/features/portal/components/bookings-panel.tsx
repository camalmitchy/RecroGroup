"use client";

import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
  bookingStatusTone,
  paymentStatusTone,
} from "@/features/portal/components/status-badge";
import {
  INITIAL_BOOKINGS,
  MOCK_THERAPISTS,
  type MockBooking,
} from "@/features/portal/data/mock-portal-data";

export function BookingsPanel() {
  const [rows, setRows] = useState<MockBooking[]>(INITIAL_BOOKINGS);

  const update = (id: string, patch: Partial<MockBooking>, message: string) => {
    setRows((current) =>
      current.map((row) => (row.id === id ? { ...row, ...patch } : row)),
    );
    toast.success(message);
  };

  return (
    <div>
      <PortalPageHeader
        title="Bookings"
        description="Incoming booking requests and lifecycle actions."
      />
      <Card>
        <CardContent className="p-0">
          {rows.length === 0 ? (
            <p className="p-10 text-center text-sm text-muted-foreground">
              No bookings yet.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ref</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Therapist</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell className="font-mono text-xs">
                      {row.reference}
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{row.clientName}</div>
                      <div className="text-xs text-muted-foreground">
                        {row.clientEmail}
                      </div>
                    </TableCell>
                    <TableCell>{row.preferredDate ?? "—"}</TableCell>
                    <TableCell>
                      <NativeSelect
                        value={row.therapistId ?? ""}
                        onChange={(e) =>
                          update(
                            row.id,
                            { therapistId: e.target.value || null },
                            "Therapist assigned",
                          )
                        }
                        className="min-w-[160px]"
                      >
                        <NativeSelectOption value="">
                          — assign —
                        </NativeSelectOption>
                        {MOCK_THERAPISTS.map((t) => (
                          <NativeSelectOption key={t.id} value={t.id}>
                            {t.fullName}
                          </NativeSelectOption>
                        ))}
                      </NativeSelect>
                    </TableCell>
                    <TableCell>
                      <StatusBadge tone={bookingStatusTone(row.status)}>
                        {row.status.toLowerCase()}
                      </StatusBadge>
                    </TableCell>
                    <TableCell>
                      <StatusBadge tone={paymentStatusTone(row.paymentStatus)}>
                        {row.paymentStatus.toLowerCase()}
                      </StatusBadge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {row.status === "REQUESTED" && (
                          <Button
                            type="button"
                            variant="link"
                            className="h-auto p-0"
                            onClick={() =>
                              update(row.id, { status: "CONFIRMED" }, "Confirmed")
                            }
                          >
                            Confirm
                          </Button>
                        )}
                        {row.status !== "COMPLETED" &&
                          row.status !== "CANCELLED" && (
                            <Button
                              type="button"
                              variant="link"
                              className="h-auto p-0"
                              onClick={() =>
                                update(
                                  row.id,
                                  { status: "COMPLETED" },
                                  "Marked completed",
                                )
                              }
                            >
                              Complete
                            </Button>
                          )}
                        {row.status !== "CANCELLED" && (
                          <Button
                            type="button"
                            variant="link"
                            className="h-auto p-0 text-destructive"
                            onClick={() =>
                              update(row.id, { status: "CANCELLED" }, "Cancelled")
                            }
                          >
                            Cancel
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      <p className="mt-4 text-xs text-muted-foreground">
        MVP view uses sample data. Connect Prisma queries when the database is
        seeded.
      </p>
    </div>
  );
}
