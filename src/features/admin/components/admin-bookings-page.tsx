"use client";

import { useState } from "react";
import { Check, X, Download, Filter } from "lucide-react";
import { AdminShell, Card, PageHeader, DataTable, StatusBadge } from "./admin-shell";

export function AdminBookingsPage() {
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
        {
            id: "3",
            reference: "RQ-ABC123",
            client_name: "Mary Johnson",
            client_email: "mary@example.com",
            preferred_date: "2026-07-17",
            therapist_id: "2",
            status: "completed",
            payment_status: "paid",
        },
    ]);

    const [therapists] = useState([
        { id: "1", full_name: "Dr. Sarah Johnson" },
        { id: "2", full_name: "Dr. Michael Chen" },
        { id: "3", full_name: "Dr. Amina Hassan" },
    ]);

    const [selectedTherapist, setSelectedTherapist] = useState<string>("all");
    const [selectedStatus, setSelectedStatus] = useState<string>("all");

    const handleUpdate = (id: string, patch: Record<string, any>, msg = "Updated") => {
        // TODO: Implement update logic with Prisma
        console.log("Update booking", id, patch);
        alert(msg);
    };

    const handleExport = () => {
        // TODO: Implement CSV export
        const csv = [
            ["Reference", "Client", "Email", "Date", "Therapist", "Status", "Payment"],
            ...filteredBookings.map((b) => [
                b.reference,
                b.client_name,
                b.client_email,
                b.preferred_date,
                therapists.find((t) => t.id === b.therapist_id)?.full_name ?? "Unassigned",
                b.status,
                b.payment_status,
            ]),
        ]
            .map((row) => row.join(","))
            .join("\n");

        const blob = new Blob([csv], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `bookings-${new Date().toISOString().split("T")[0]}.csv`;
        a.click();
    };

    const filteredBookings = bookings.filter((booking) => {
        if (selectedTherapist !== "all" && booking.therapist_id !== selectedTherapist) {
            return false;
        }
        if (selectedStatus !== "all" && booking.status !== selectedStatus) {
            return false;
        }
        return true;
    });

    const statusTone = (s: string) =>
        s === "confirmed" ? "info" : s === "completed" ? "success" : s === "cancelled" ? "danger" : "warning";

    return (
        <AdminShell isAdmin={true}>
            <div className="p-6 lg:p-8">
                <PageHeader
                    title="Bookings"
                    description="Incoming booking requests and lifecycle actions."
                />

                {/* Filters and Export */}
                <div className="mt-6 flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-2">
                        <Filter size={18} className="text-gray-500" />
                        <select
                            value={selectedTherapist}
                            onChange={(e) => setSelectedTherapist(e.target.value)}
                            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-primary-deep focus:outline-none focus:ring-1 focus:ring-primary-deep"
                        >
                            <option value="all">All Therapists</option>
                            {therapists.map((t) => (
                                <option key={t.id} value={t.id}>
                                    {t.full_name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-primary-deep focus:outline-none focus:ring-1 focus:ring-primary-deep"
                    >
                        <option value="all">All Statuses</option>
                        <option value="requested">Requested</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
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
                    {filteredBookings.length === 0 ? (
                        <div className="p-10 text-center text-sm text-gray-600">
                            No bookings found matching the filters.
                        </div>
                    ) : (
                        <DataTable
                            columns={["Ref", "Client", "Date", "Therapist", "Status", "Payment", "Actions"]}
                            rows={filteredBookings.map((r) => [
                                <span key="r" className="font-mono text-xs">
                                    {r.reference}
                                </span>,
                                <div key="c">
                                    <div className="text-sm font-medium">{r.client_name}</div>
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
                                    className="rounded-md border border-gray-200 bg-white px-2 py-1 text-sm"
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
                                <div key="a" className="flex gap-2">
                                    {r.status === "requested" && (
                                        <>
                                            <button
                                                onClick={() => handleUpdate(r.id, { status: "confirmed" }, "Confirmed")}
                                                className="rounded-md bg-green-100 p-2 text-green-700 hover:bg-green-200"
                                                title="Confirm"
                                            >
                                                <Check size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleUpdate(r.id, { status: "cancelled" }, "Cancelled")}
                                                className="rounded-md bg-red-100 p-2 text-red-700 hover:bg-red-200"
                                                title="Cancel"
                                            >
                                                <X size={16} />
                                            </button>
                                        </>
                                    )}
                                    {r.status === "confirmed" && (
                                        <button
                                            onClick={() => handleUpdate(r.id, { status: "cancelled" }, "Cancelled")}
                                            className="rounded-md bg-red-100 p-2 text-red-700 hover:bg-red-200"
                                            title="Cancel"
                                        >
                                            <X size={16} />
                                        </button>
                                    )}
                                </div>,
                            ])}
                        />
                    )}
                </Card>

                <div className="mt-4 text-sm text-gray-600">
                    Showing {filteredBookings.length} of {bookings.length} booking(s)
                </div>
            </div>
        </AdminShell>
    );
}
