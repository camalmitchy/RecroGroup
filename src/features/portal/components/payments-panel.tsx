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
  paymentStatusTone,
} from "@/features/portal/components/status-badge";
import {
  INITIAL_BOOKINGS,
  INITIAL_PAYMENTS,
  type MockPayment,
} from "@/features/portal/data/mock-portal-data";

export function PaymentsPanel() {
  const [rows, setRows] = useState<MockPayment[]>(INITIAL_PAYMENTS);
  const bookings = INITIAL_BOOKINGS;

  const update = (id: string, patch: Partial<MockPayment>, message: string) => {
    setRows((current) =>
      current.map((row) => (row.id === id ? { ...row, ...patch } : row)),
    );
    toast.success(message);
  };

  return (
    <div>
      <PortalPageHeader
        title="Payments"
        description="M-Pesa, bank transfer and card payment tracking."
      />
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Method</TableHead>
                <TableHead>Amount (KES)</TableHead>
                <TableHead>Reference</TableHead>
                <TableHead>Booking</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="capitalize">
                    {row.method.toLowerCase()}
                  </TableCell>
                  <TableCell>{row.amountKes.toLocaleString()}</TableCell>
                  <TableCell>{row.reference ?? "—"}</TableCell>
                  <TableCell>
                    <NativeSelect
                      value={row.bookingId ?? ""}
                      onChange={(e) =>
                        update(
                          row.id,
                          { bookingId: e.target.value || null },
                          "Booking linked",
                        )
                      }
                      className="min-w-[120px]"
                    >
                      <NativeSelectOption value="">— link —</NativeSelectOption>
                      {bookings.map((b) => (
                        <NativeSelectOption key={b.id} value={b.id}>
                          {b.reference}
                        </NativeSelectOption>
                      ))}
                    </NativeSelect>
                  </TableCell>
                  <TableCell>
                    <StatusBadge tone={paymentStatusTone(row.status)}>
                      {row.status.toLowerCase()}
                    </StatusBadge>
                  </TableCell>
                  <TableCell>{row.createdAt}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {row.status !== "PAID" && (
                        <Button
                          type="button"
                          variant="link"
                          className="h-auto p-0"
                          onClick={() =>
                            update(row.id, { status: "PAID" }, "Marked paid")
                          }
                        >
                          Mark paid
                        </Button>
                      )}
                      {row.method === "BANK" && row.status !== "PAID" && (
                        <Button
                          type="button"
                          variant="link"
                          className="h-auto p-0"
                          onClick={() =>
                            update(row.id, { status: "PAID" }, "Verified")
                          }
                        >
                          Verify
                        </Button>
                      )}
                      {row.status !== "FAILED" && (
                        <Button
                          type="button"
                          variant="link"
                          className="h-auto p-0 text-destructive"
                          onClick={() =>
                            update(row.id, { status: "FAILED" }, "Rejected")
                          }
                        >
                          Reject
                        </Button>
                      )}
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
