"use client";

import { useState } from "react";
import { AdminShell, Card, PageHeader, DataTable, StatusBadge } from "./admin-shell";

export function AdminBookingsPage() {
    // TODO: Replace with real data from Prisma
    const [bookings] = useState([
        {
            id: "1",
            reference: "RQ-XGPRP",
            client_name: "Jane Doe",
            client_email: "jane@example.com",
            preferred_date: "2026-07-15",
            therapist_id: null,
            status: "requested",
            payment_status: "pending",
        },
        {
            id: "2",
            reference: "RQ-TQ1VZ",
            client_name: "John Smith",
            client_email: "john@example.com",
            preferred_date: "2026-07-16",
            therapist_id: "1",
            status: "confirmed",
            payment_status: "paid",
        },
    ]);

    const [therapists] = useState([
        { id: "1", full_name: "Dr. Sarah Johnson" },
        { id: "2", full_name: "Dr. Michael Chen" },
        { id: "3", full_name: "Dr. Amina Hassan" },
    ]);

    const handleUpdate = (id: string, patch: Record<string, any>, msg = "Updated") => {
        // TODO: Implement update logic with Prisma
        console.log("Update booking", id, patch);
        alert(msg);
    };

    const statusTone = (s: string) =>
        s === "confirmed" ? "info" : s === "completed" ? "success" : s === "cancelled" ? "danger" : "warning";

    return (
        <AdminShell isAdmin={true}>
            <div className="p-6 lg:p-8">
                <PageHeader
                    title="Bookings"
                    description="Incoming booking requests and lifecycle actions."
                />

                <Card className="mt-6">
                    {bookings.length === 0 ? (
                        <div className="p-10 text-center text-gray-600 text-sm">
                            No bookings yet.
                        </div>
                    ) : (
                        <DataTable
                            columns={["Ref", "Client", "Date", "Therapist", "Status", "Payment", "Actions"]}
                            rows={bookings.map((r) => [
                                <span key="r" className="font-mono text-xs">
                                    {r.reference}
                                </span>,
                                <div key="c">
                                    <div className="font-medium text-sm">{r.client_name}</div>
                                    <div className="text-xs text-gray-600">{r.client_email}</div>
                                </div>,
                                r.preferred_date ?? "—",
                                <select
                                    key="t"
                                    value={r.therapist_id ?? ""}
                                    onChange={(e) =>
                                        handleUpdate(
                                            r.id,
                                            { therapist_id: e.target.value || null },
                                            "Therapist assigned"
                                        )
                                    }
                                    className="text-sm bg-white border border-gray-200 rounded-md px-2 py-1"
                                >
                                    <option value="">— assign —</option>
                                    {therapists.map((t) => (
                                        <option key={t.id} value={t.id}>
                                            {t.full_name}
                                        </option>
                                    ))}
                                </select>,
                                <StatusBadge key="s" tone={statusTone(r.status) as any}>
                                    {r.status}
                                </StatusBadge>,
                                <StatusBadge
                                    key="p"
                                    tone={
                                        r.payment_status === "paid"
                                            ? "success"
                                            : r.payment_status === "failed"
                                                ? "danger"
                                                : "warning"
                                    }
                                >
                                    {r.payment_status}
                                </StatusBadge>,
                                <div key="a" className="flex gap-2 text-xs font-semibold">
                                    {r.status === "requested" && (
                                        <button
                                            onClick={() => handleUpdate(r.id, { status: "confirmed" }, "Confirmed")}
                                            className="text-primary-deep hover:underline"
                                        >
                                            Confirm
                                        </button>
                                    )}
                                    {r.status !== "completed" && r.status !== "cancelled" && (
                                        <button
                                            onClick={() =>
                                                handleUpdate(r.id, { status: "completed" }, "Marked completed")
                                            }
                                            className="text-primary-deep hover:underline"
                                        >
                                            Complete
                                        </button>
                                    )}
                                    {r.status !== "cancelled" && (
                                        <button
                                            onClick={() => handleUpdate(r.id, { status: "cancelled" }, "Cancelled")}
                                            className="text-red-600 hover:underline"
                                        >
                                            Cancel
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
