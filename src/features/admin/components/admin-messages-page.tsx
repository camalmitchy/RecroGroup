"use client";

import { useState } from "react";
import { AdminShell, Card, PageHeader, DataTable, StatusBadge } from "./admin-shell";

export function AdminMessagesPage() {
    const [tab, setTab] = useState<"inquiries" | "newsletter">("inquiries");

    // TODO: Replace with real data from Prisma
    const inquiries = [
        {
            id: "1",
            name: "Grace Wanjiru",
            email: "grace@example.com",
            phone: "+254 700 123 456",
            subject: "Couples therapy inquiry",
            message: "Hi, I would like to book a couples therapy session for next week...",
            status: "new",
            created_at: "2026-07-10T09:00:00Z",
        },
        {
            id: "2",
            name: "Peter Omondi",
            email: "peter@example.com",
            phone: null,
            subject: "Corporate workshop",
            message: "We are interested in organizing a mental health workshop for our team of 50...",
            status: "in_progress",
            created_at: "2026-07-09T14:30:00Z",
        },
    ];

    const subscribers = [
        {
            id: "1",
            email: "subscriber1@example.com",
            name: "Jane Doe",
            created_at: "2026-07-05T10:00:00Z",
        },
        {
            id: "2",
            email: "subscriber2@example.com",
            name: null,
            created_at: "2026-07-03T16:20:00Z",
        },
    ];

    const handleSetStatus = (id: string, status: string) => {
        // TODO: Implement update logic with Prisma
        console.log("Update inquiry status", id, status);
        alert("Updated");
    };

    return (
        <AdminShell isAdmin={true}>
            <div className="p-6 space-y-5">
                <PageHeader
                    title="Messages"
                    description="Contact form inquiries and newsletter subscribers."
                />

                {/* Tabs */}
                <div className="flex gap-1 border-b border-gray-200">
                    {[
                        ["inquiries", `Inquiries (${inquiries.length})`],
                        ["newsletter", `Newsletter (${subscribers.length})`],
                    ].map(([k, l]) => (
                        <button
                            key={k}
                            onClick={() => setTab(k as any)}
                            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${tab === k
                                    ? "border-primary text-primary-deep"
                                    : "border-transparent text-gray-600 hover:text-gray-900"
                                }`}
                        >
                            {l}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <Card>
                    {tab === "inquiries" ? (
                        inquiries.length === 0 ? (
                            <div className="p-10 text-center text-gray-600 text-sm">
                                No inquiries yet.
                            </div>
                        ) : (
                            <DataTable
                                columns={["Name", "Contact", "Subject", "Message", "Status", "Received", "Actions"]}
                                rows={inquiries.map((r) => [
                                    <span key="n" className="font-medium">
                                        {r.name}
                                    </span>,
                                    <div key="c">
                                        <div className="text-xs">{r.email}</div>
                                        <div className="text-xs text-gray-600">{r.phone ?? ""}</div>
                                    </div>,
                                    r.subject ?? "—",
                                    <span
                                        key="m"
                                        className="text-xs text-gray-600 line-clamp-2 max-w-xs block"
                                    >
                                        {r.message}
                                    </span>,
                                    <StatusBadge
                                        key="s"
                                        tone={
                                            r.status === "resolved"
                                                ? "success"
                                                : r.status === "new"
                                                    ? "warning"
                                                    : "info"
                                        }
                                    >
                                        {r.status}
                                    </StatusBadge>,
                                    new Date(r.created_at).toLocaleDateString(),
                                    <div key="a" className="flex gap-2 text-xs font-semibold">
                                        {r.status !== "in_progress" && (
                                            <button
                                                onClick={() => handleSetStatus(r.id, "in_progress")}
                                                className="text-primary-deep hover:underline"
                                            >
                                                In progress
                                            </button>
                                        )}
                                        {r.status !== "resolved" && (
                                            <button
                                                onClick={() => handleSetStatus(r.id, "resolved")}
                                                className="text-primary-deep hover:underline"
                                            >
                                                Resolve
                                            </button>
                                        )}
                                    </div>,
                                ])}
                            />
                        )
                    ) : subscribers.length === 0 ? (
                        <div className="p-10 text-center text-gray-600 text-sm">
                            No subscribers yet.
                        </div>
                    ) : (
                        <DataTable
                            columns={["Email", "Name", "Subscribed"]}
                            rows={subscribers.map((r) => [
                                <span key="e" className="font-medium">
                                    {r.email}
                                </span>,
                                r.name ?? "—",
                                new Date(r.created_at).toLocaleDateString(),
                            ])}
                        />
                    )}
                </Card>
            </div>
        </AdminShell>
    );
}
