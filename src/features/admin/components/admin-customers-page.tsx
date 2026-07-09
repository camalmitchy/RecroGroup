"use client";

import { AdminShell, Card, PageHeader, DataTable } from "./admin-shell";
import { Plus, Download, Search } from "lucide-react";

export function AdminCustomersPage() {
    // TODO: Replace with real data from Prisma
    const customers = [
        {
            name: "Amina K.",
            email: "amina@example.com",
            phone: "+254 700 111 222",
            type: "Individual",
            last: "Today",
            bookings: 7,
        },
        {
            name: "Wanjiku & James",
            email: "wj@example.com",
            phone: "+254 711 333 444",
            type: "Couple",
            last: "Yesterday",
            bookings: 4,
        },
        {
            name: "Brian O.",
            email: "brian@example.com",
            phone: "+254 722 555 666",
            type: "Family",
            last: "2d ago",
            bookings: 2,
        },
    ];

    return (
        <AdminShell isAdmin={true}>
            <div className="p-6 space-y-5">
                <PageHeader
                    title="Customers"
                    description="Client profiles, history, and engagement — no clinical notes."
                    actions={
                        <>
                            <button className="inline-flex items-center gap-1.5 px-3 h-9 rounded-lg border border-gray-200 text-sm font-semibold hover:bg-gray-50">
                                <Download size={14} /> Export
                            </button>
                            <button className="inline-flex items-center gap-1.5 px-3 h-9 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90">
                                <Plus size={14} /> Add customer
                            </button>
                        </>
                    }
                />

                {/* Search and filters */}
                <Card className="p-3 flex items-center gap-3">
                    <div className="relative flex-1 max-w-md">
                        <Search
                            size={14}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        />
                        <input
                            placeholder="Search by name, email or phone…"
                            className="w-full pl-9 pr-3 h-9 rounded-lg bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                        />
                    </div>
                    <select className="h-9 px-3 rounded-lg border border-gray-200 bg-white text-sm">
                        <option>All types</option>
                        <option>Individual</option>
                        <option>Couple</option>
                        <option>Family</option>
                        <option>Corporate</option>
                    </select>
                </Card>

                {/* Table */}
                <Card>
                    <DataTable
                        columns={["Name", "Email", "Phone", "Type", "Last activity", "Bookings"]}
                        rows={customers.map((r) => [
                            <span key="name" className="font-medium">
                                {r.name}
                            </span>,
                            <span key="email" className="text-gray-600">
                                {r.email}
                            </span>,
                            <span key="phone" className="text-gray-600">
                                {r.phone}
                            </span>,
                            r.type,
                            <span key="last" className="text-gray-600">
                                {r.last}
                            </span>,
                            <span key="bookings" className="font-semibold">
                                {r.bookings}
                            </span>,
                        ])}
                    />
                </Card>
            </div>
        </AdminShell>
    );
}
