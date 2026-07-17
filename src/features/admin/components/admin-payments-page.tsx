"use client";

import { useState } from "react";
import { Check, X, Download, Filter } from "lucide-react";
import { AdminShell, Card, PageHeader, DataTable, StatusBadge } from "./admin-shell";

export function AdminPaymentsPage() {
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
        {
            id: "3",
            method: "mpesa",
            amount_kes: 8000,
            reference: "RCT11111",
            booking_id: "2",
            status: "paid",
            created_at: "2026-07-08T09:15:00Z",
        },
    ]);

    const [bookings] = useState([
        { id: "1", reference: "RQ-XGPRP" },
        { id: "2", reference: "RQ-TQ1VZ" },
    ]);

    const [selectedMethod, setSelectedMethod] = useState<string>("all");
    const [selectedStatus, setSelectedStatus] = useState<string>("all");

    const handleUpdate = (id: string, patch: Record<string, any>, msg: string) => {
        // TODO: Implement update logic with Prisma
        console.log("Update payment", id, patch);
        alert(msg);
    };

    const handleExport = () => {
        const csv = [
            ["Method", "Amount (KES)", "Reference", "Booking", "Status", "Created"],
            ...filteredPayments.map((p) => [
                p.method,
                p.amount_kes,
                p.reference || "",
                bookings.find((b) => b.id === p.booking_id)?.reference || "Unlinked",
                p.status,
                new Date(p.created_at).toLocaleDateString(),
            ]),
        ]
            .map((row) => row.join(","))
            .join("\n");

        const blob = new Blob([csv], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `payments-${new Date().toISOString().split("T")[0]}.csv`;
        a.click();
    };

    const filteredPayments = payments.filter((payment) => {
        if (selectedMethod !== "all" && payment.method !== selectedMethod) {
            return false;
        }
        if (selectedStatus !== "all" && payment.status !== selectedStatus) {
            return false;
        }
        return true;
    });

    return (
        <AdminShell isAdmin={true}>
            <div className="p-6 lg:p-8">
                <PageHeader
                    title="Payments"
                    description="M-Pesa, bank transfer and card payment tracking."
                />

                {/* Filters and Export */}
                <div className="mt-6 flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-2">
                        <Filter size={18} className="text-gray-500" />
                        <select
                            value={selectedMethod}
                            onChange={(e) => setSelectedMethod(e.target.value)}
                            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-primary-deep focus:outline-none focus:ring-1 focus:ring-primary-deep"
                        >
                            <option value="all">All Methods</option>
                            <option value="mpesa">M-Pesa</option>
                            <option value="bank">Bank Transfer</option>
                            <option value="card">Card</option>
                        </select>
                    </div>

                    <select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-primary-deep focus:outline-none focus:ring-1 focus:ring-primary-deep"
                    >
                        <option value="all">All Statuses</option>
                        <option value="pending">Pending</option>
                        <option value="paid">Paid</option>
                        <option value="failed">Failed</option>
                    </select>

                    <button
                        onClick={handleExport}
                        className="ml-auto flex items-center gap-2 rounded-lg bg-primary-deep px-4 py-2 text-sm font-semibold text-white hover:bg-primary-deep/90"
                    >
                        <Download size={16} />
                        Export CSV
                    </button>
                </div>

                <Card className="mt-6">
                    {filteredPayments.length === 0 ? (
                        <div className="p-10 text-center text-sm text-gray-600">
                            No payments found matching the filters.
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
                            rows={filteredPayments.map((r) => [
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
                                    className="rounded-md border border-gray-200 bg-white px-2 py-1 text-sm"
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
                                <div key="a" className="flex gap-2">
                                    {r.status === "pending" && (
                                        <>
                                            <button
                                                onClick={() => handleUpdate(r.id, { status: "paid" }, "Marked paid")}
                                                className="rounded-md bg-green-100 p-2 text-green-700 hover:bg-green-200"
                                                title="Mark Paid"
                                            >
                                                <Check size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleUpdate(r.id, { status: "failed" }, "Rejected")}
                                                className="rounded-md bg-red-100 p-2 text-red-700 hover:bg-red-200"
                                                title="Reject"
                                            >
                                                <X size={16} />
                                            </button>
                                        </>
                                    )}
                                </div>,
                            ])}
                        />
                    )}
                </Card>

                <div className="mt-4 text-sm text-gray-600">
                    Showing {filteredPayments.length} of {payments.length} payment(s)
                </div>
            </div>
        </AdminShell>
    );
}
