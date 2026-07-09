"use client";

import { useState } from "react";
import { AdminShell, Card, PageHeader, DataTable, StatusBadge } from "./admin-shell";

export function AdminPaymentsPage() {
    // TODO: Replace with real data from Prisma
    const [payments] = useState([
        {
            id: "1",
            method: "mpesa",
            amount_kes: 5000,
            reference: "RCT12345",
            booking_id: null,
            status: "pending",
            created_at: "2026-07-10T10:30:00Z",
        },
        {
            id: "2",
            method: "bank",
            amount_kes: 15000,
            reference: "TXN67890",
            booking_id: "1",
            status: "pending",
            created_at: "2026-07-09T14:20:00Z",
        },
    ]);

    const [bookings] = useState([
        { id: "1", reference: "RQ-XGPRP" },
        { id: "2", reference: "RQ-TQ1VZ" },
    ]);

    const handleUpdate = (id: string, patch: Record<string, any>, msg: string) => {
        // TODO: Implement update logic with Prisma
        console.log("Update payment", id, patch);
        alert(msg);
    };

    return (
        <AdminShell isAdmin={true}>
            <div className="p-6 lg:p-8">
                <PageHeader
                    title="Payments"
                    description="M-Pesa, bank transfer and card payment tracking."
                />

                <Card className="mt-6">
                    {payments.length === 0 ? (
                        <div className="p-10 text-center text-gray-600 text-sm">
                            No payments yet.
                        </div>
                    ) : (
                        <DataTable
                            columns={[
                                "Method",
                                "Amount (KES)",
                                "Reference",
                                "Booking",
                                "Status",
                                "Created",
                                "Actions",
                            ]}
                            rows={payments.map((r) => [
                                <span key="m" className="capitalize">
                                    {r.method}
                                </span>,
                                r.amount_kes.toLocaleString(),
                                r.reference ?? "—",
                                <select
                                    key="b"
                                    value={r.booking_id ?? ""}
                                    onChange={(e) =>
                                        handleUpdate(r.id, { booking_id: e.target.value || null }, "Linked")
                                    }
                                    className="text-sm bg-white border border-gray-200 rounded-md px-2 py-1"
                                >
                                    <option value="">— link —</option>
                                    {bookings.map((b) => (
                                        <option key={b.id} value={b.id}>
                                            {b.reference}
                                        </option>
                                    ))}
                                </select>,
                                <StatusBadge
                                    key="s"
                                    tone={
                                        r.status === "paid"
                                            ? "success"
                                            : r.status === "failed"
                                                ? "danger"
                                                : "warning"
                                    }
                                >
                                    {r.status}
                                </StatusBadge>,
                                new Date(r.created_at).toLocaleDateString(),
                                <div key="a" className="flex gap-2 text-xs font-semibold">
                                    {r.status !== "paid" && (
                                        <button
                                            onClick={() => handleUpdate(r.id, { status: "paid" }, "Marked paid")}
                                            className="text-primary-deep hover:underline"
                                        >
                                            Mark paid
                                        </button>
                                    )}
                                    {r.method === "bank" && r.status !== "paid" && (
                                        <button
                                            onClick={() => handleUpdate(r.id, { status: "paid" }, "Verified")}
                                            className="text-primary-deep hover:underline"
                                        >
                                            Verify
                                        </button>
                                    )}
                                    {r.status !== "failed" && (
                                        <button
                                            onClick={() => handleUpdate(r.id, { status: "failed" }, "Rejected")}
                                            className="text-red-600 hover:underline"
                                        >
                                            Reject
                                        </button>
                                    )}
                                </div>,
                            ])}
                        />
                    )}
                </Card>
            </div>
        </AdminShell>
    );
}
