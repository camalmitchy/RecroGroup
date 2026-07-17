"use client";

import { useState } from "react";
import { AdminShell, Card, PageHeader, DataTable } from "./admin-shell";
import { Plus, Download, Search } from "lucide-react";

export function AdminCustomersPage() {
    const [customers] = useState([
        {
            id: "1",
            name: "Amina K.",
            email: "amina@example.com",
            phone: "+254 700 111 222",
            type: "Individual",
            last: "Today",
            bookings: 7,
        },
        {
            id: "2",
            name: "Wanjiku & James",
            email: "wj@example.com",
            phone: "+254 711 333 444",
            type: "Couple",
            last: "Yesterday",
            bookings: 4,
        },
        {
            id: "3",
            name: "Brian O.",
            email: "brian@example.com",
            phone: "+254 722 555 666",
            type: "Family",
            last: "2d ago",
            bookings: 2,
        },
    ]);

    const [searchQuery, setSearchQuery] = useState("");
    const [selectedType, setSelectedType] = useState("all");

    const handleAddCustomer = () => {
        // TODO: Open add customer form/modal
        console.log("Add customer clicked");
        alert("Add Customer - Form coming soon");
    };

    const handleExport = () => {
        console.log("Export clicked");
        const csv = [
            ["Name", "Email", "Phone", "Type", "Last Activity", "Bookings"],
            ...filteredCustomers.map((c) => [
                c.name,
                c.email,
                c.phone,
                c.type,
                c.last,
                c.bookings,
            ]),
        ]
            .map((row) => row.join(","))
            .join("\n");

        const blob = new Blob([csv], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `customers-${new Date().toISOString().split("T")[0]}.csv`;
        a.click();
    };

    const filteredCustomers = customers.filter((customer) => {
        const matchesSearch =
            customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            customer.phone.includes(searchQuery);
        const matchesType = selectedType === "all" || customer.type === selectedType;
        return matchesSearch && matchesType;
    });

    return (
        <AdminShell isAdmin={true}>
            <div className="p-6 space-y-5">
                <PageHeader
                    title="Customers"
                    description="Client profiles, history, and engagement — no clinical notes."
                    actions={
                        <>
                            <button
                                onClick={handleExport}
                                className="inline-flex items-center gap-1.5 px-3 h-9 rounded-lg border border-gray-200 text-sm font-semibold hover:bg-gray-50"
                            >
                                <Download size={14} /> Export
                            </button>
                            <button
                                onClick={handleAddCustomer}
                                className="inline-flex items-center gap-1.5 px-3 h-9 rounded-lg bg-primary-deep text-white text-sm font-semibold hover:bg-primary-deep/90"
                            >
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
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search by name, email or phone…"
                            className="w-full pl-9 pr-3 h-9 rounded-lg bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-deep/30"
                        />
                    </div>
                    <select
                        value={selectedType}
                        onChange={(e) => setSelectedType(e.target.value)}
                        className="h-9 px-3 rounded-lg border border-gray-200 bg-white text-sm"
                    >
                        <option value="all">All types</option>
                        <option value="Individual">Individual</option>
                        <option value="Couple">Couple</option>
                        <option value="Family">Family</option>
                        <option value="Corporate">Corporate</option>
                    </select>
                </Card>

                {/* Table */}
                <Card>
                    {filteredCustomers.length === 0 ? (
                        <div className="p-10 text-center text-sm text-gray-600">
                            No customers found matching your search.
                        </div>
                    ) : (
                        <DataTable
                            columns={["Name", "Email", "Phone", "Type", "Last activity", "Bookings"]}
                            rows={filteredCustomers.map((r) => [
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
                    )}
                </Card>

                <div className="text-sm text-gray-600">
                    Showing {filteredCustomers.length} of {customers.length} customer(s)
                </div>
            </div>
        </AdminShell>
    );
}
