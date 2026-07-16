"use client";

import { useState } from "react";
import { AdminShell, Card, PageHeader, DataTable, StatusBadge } from "./admin-shell";

export function AdminGriefCampPage() {
    // TODO: Replace with real data from Prisma
    const [applications] = useState([
        {
            id: "1",
            child_name: "Emily K.",
            child_age: 12,
            parent_name: "Sarah Kimani",
            parent_email: "sarah@example.com",
            parent_phone: "+254 700 111 222",
            tier: "Early bird",
            status: "pending",
            created_at: "2026-07-05T10:00:00Z",
        },
        {
            id: "2",
            child_name: "David M.",
            child_age: 14,
            parent_name: "John Mwangi",
            parent_email: "john@example.com",
            parent_phone: "+254 711 333 444",
            tier: "Standard",
            status: "accepted",
            created_at: "2026-07-03T14:30:00Z",
        },
    ]);

    const handleSetStatus = (id: string, status: string) => {
        // TODO: Implement update logic with Prisma
        console.log("Update status", id, status);
        alert("Updated");
    };

    const handleRemove = (id: string) => {
        if (!confirm("Delete this application?")) return;
        // TODO: Implement delete logic with Prisma
        console.log("Delete", id);
        alert("Deleted");
    };

    return (
        <AdminShell isAdmin={true}>
            <div className="p-6 lg:p-8">
                <PageHeader
                    title="Grief Camp Applications"
                    description="Parent/guardian applications for the children's grief camp."
                />

                <Card className="mt-6">
                    {applications.length === 0 ? (
                        <div className="p-10 text-center text-gray-600 text-sm">
                            No applications yet.
                        </div>
                    ) : (
                        <DataTable
                            columns={["Child", "Age", "Parent", "Contact", "Tier", "Status", "Applied", "Actions"]}
                            rows={applications.map((r) => [
                                r.child_name,
                                r.child_age ?? "—",
                                r.parent_name,
                                <div key="c">
                                    <div className="text-xs">{r.parent_email}</div>
                                    <div className="text-xs text-gray-600">{r.parent_phone}</div>
                                </div>,
                                r.tier ?? "—",
                                <StatusBadge
                                    key="s"
                                    tone={
                                        r.status === "accepted"
                                            ? "success"
                                            : r.status === "rejected"
                                                ? "danger"
                                                : "warning"
                                    }
                                >
                                    {r.status}
                                </StatusBadge>,
                                new Date(r.created_at).toLocaleDateString(),
                                <div key="a" className="flex gap-2 text-xs font-semibold">
                                    {r.status !== "accepted" && (
                                        <button
                                            onClick={() => handleSetStatus(r.id, "accepted")}
                                            className="text-primary-deep hover:underline"
                                        >
                                            Accept
                                        </button>
                                    )}
                                    {r.status !== "rejected" && (
                                        <button
                                            onClick={() => handleSetStatus(r.id, "rejected")}
                                            className="text-red-600 hover:underline"
                                        >
                                            Reject
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleRemove(r.id)}
                                        className="text-red-600 hover:underline"
                                    >
                                        Delete
                                    </button>
                                </div>,
                            ])}
                        />
                    )}
                </Card>
            </div>
        </AdminShell>
    );
}
