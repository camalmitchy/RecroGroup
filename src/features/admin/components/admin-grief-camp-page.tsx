"use client";

import { useState } from "react";
import { Check, X, Trash2, Download, Filter } from "lucide-react";
import { AdminShell, Card, PageHeader, DataTable, StatusBadge } from "./admin-shell";

export function AdminGriefCampPage() {
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
        {
            id: "3",
            child_name: "Grace N.",
            child_age: 13,
            parent_name: "Mary Njeri",
            parent_email: "mary@example.com",
            parent_phone: "+254 722 555 666",
            tier: "Regular",
            status: "rejected",
            created_at: "2026-07-02T09:00:00Z",
        },
    ]);

    const [selectedStatus, setSelectedStatus] = useState<string>("all");

    const handleSetStatus = (id: string, status: string) => {
        // TODO: Implement update logic with Prisma
        console.log("Update status", id, status);
        alert(`Application ${status}`);
    };

    const handleRemove = (id: string) => {
        if (!confirm("Delete this application? This action cannot be undone.")) return;
        // TODO: Implement delete logic with Prisma
        console.log("Delete", id);
        alert("Application deleted");
    };

    const handleExport = () => {
        const csv = [
            ["Child Name", "Age", "Parent Name", "Email", "Phone", "Tier", "Status", "Applied"],
            ...filteredApplications.map((a) => [
                a.child_name,
                a.child_age || "",
                a.parent_name,
                a.parent_email,
                a.parent_phone,
                a.tier || "",
                a.status,
                new Date(a.created_at).toLocaleDateString(),
            ]),
        ]
            .map((row) => row.join(","))
            .join("\n");

        const blob = new Blob([csv], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `grief-camp-applications-${new Date().toISOString().split("T")[0]}.csv`;
        a.click();
    };

    const filteredApplications = applications.filter((app) => {
        if (selectedStatus !== "all" && app.status !== selectedStatus) {
            return false;
        }
        return true;
    });

    return (
        <AdminShell isAdmin={true}>
            <div className="p-6 lg:p-8">
                <PageHeader
                    title="Grief Camp Applications"
                    description="Parent/guardian applications for the children's grief camp."
                />

                {/* Filters and Export */}
                <div className="mt-6 flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-2">
                        <Filter size={18} className="text-gray-500" />
                        <select
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-primary-deep focus:outline-none focus:ring-1 focus:ring-primary-deep"
                        >
                            <option value="all">All Statuses</option>
                            <option value="pending">Pending</option>
                            <option value="accepted">Accepted</option>
                            <option value="rejected">Rejected</option>
                        </select>
                    </div>

                    <button
                        onClick={handleExport}
                        className="ml-auto flex items-center gap-2 rounded-lg bg-primary-deep px-4 py-2 text-sm font-semibold text-white hover:bg-primary-deep/90"
                    >
                        <Download size={16} />
                        Export CSV
                    </button>
                </div>

                <Card className="mt-6">
                    {filteredApplications.length === 0 ? (
                        <div className="p-10 text-center text-sm text-gray-600">
                            No applications found matching the filters.
                        </div>
                    ) : (
                        <DataTable
                            columns={["Child", "Age", "Parent", "Contact", "Tier", "Status", "Applied", "Actions"]}
                            rows={filteredApplications.map((r) => [
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
                                <div key="a" className="flex gap-2">
                                    {r.status === "pending" && (
                                        <>
                                            <button
                                                onClick={() => handleSetStatus(r.id, "accepted")}
                                                className="rounded-md bg-green-100 p-2 text-green-700 hover:bg-green-200"
                                                title="Accept"
                                            >
                                                <Check size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleSetStatus(r.id, "rejected")}
                                                className="rounded-md bg-red-100 p-2 text-red-700 hover:bg-red-200"
                                                title="Reject"
                                            >
                                                <X size={16} />
                                            </button>
                                        </>
                                    )}
                                    <button
                                        onClick={() => handleRemove(r.id)}
                                        className="rounded-md bg-gray-100 p-2 text-gray-700 hover:bg-gray-200"
                                        title="Delete"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>,
                            ])}
                        />
                    )}
                </Card>

                <div className="mt-4 text-sm text-gray-600">
                    Showing {filteredApplications.length} of {applications.length} application(s)
                </div>
            </div>
        </AdminShell>
    );
}
