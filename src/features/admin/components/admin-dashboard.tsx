"use client";

import Link from "next/link";
import {
    CalendarDays,
    CreditCard,
    Users,
    HeartHandshake,
    MessageSquare,
    Clock,
    ArrowRight,
} from "lucide-react";
import { AdminShell, Card, PageHeader, StatusBadge } from "./admin-shell";

export function AdminDashboard() {
    // TODO: Fetch real data from your database
    const stats = {
        todayBookings: 1,
        pendingBookings: 0,
        pendingPayments: 0,
        bankToVerify: 0,
        griefApps: 0,
        newMessages: 0,
        totalCustomers: 3,
    };

    const pendingList: any[] = [
        // Example data
    ];

    const recentBookings = [
        {
            id: "1",
            client_name: "Carnal Mitchy",
            reference: "RQ-XGPRP",
            status: "pending",
        },
        {
            id: "2",
            client_name: "Carnal Mitchy",
            reference: "RQ-TQ1VZ",
            status: "pending",
        },
        {
            id: "3",
            client_name: "Carnal Mitchy",
            reference: "RQ-8HUN15",
            status: "pending",
        },
        {
            id: "4",
            client_name: "Carnal Mitchy",
            reference: "RQ-OYIRFV4",
            status: "pending",
        },
        {
            id: "5",
            client_name: "Carnal Mitchy",
            reference: "RQ-N8R4N9",
            status: "pending",
        },
        {
            id: "6",
            client_name: "Carnal Mitchy",
            reference: "RQ-ANMXTP",
            status: "pending",
        },
    ];

    const kpis = [
        {
            label: "Today's bookings",
            value: stats.todayBookings,
            to: "/admin/bookings",
            icon: CalendarDays,
            bgColor: "bg-blue-50",
            iconColor: "text-blue-600",
        },
        {
            label: "Awaiting confirmation",
            value: stats.pendingBookings,
            to: "/admin/bookings",
            icon: Clock,
            bgColor: "bg-green-50",
            iconColor: "text-green-600",
        },
        {
            label: "Pending payments",
            value: stats.pendingPayments,
            to: "/admin/payments",
            icon: CreditCard,
            bgColor: "bg-yellow-50",
            iconColor: "text-yellow-600",
        },
        {
            label: "Bank transfers to verify",
            value: stats.bankToVerify,
            to: "/admin/payments",
            icon: CreditCard,
            bgColor: "bg-purple-50",
            iconColor: "text-purple-600",
        },
        {
            label: "Grief camp applications",
            value: stats.griefApps,
            to: "/admin/grief-camp",
            icon: HeartHandshake,
            bgColor: "bg-pink-50",
            iconColor: "text-pink-600",
        },
        {
            label: "New messages",
            value: stats.newMessages,
            to: "/admin/messages",
            icon: MessageSquare,
            bgColor: "bg-orange-50",
            iconColor: "text-orange-600",
        },
        {
            label: "Total customers",
            value: stats.totalCustomers,
            to: "/admin/customers",
            icon: Users,
            bgColor: "bg-indigo-50",
            iconColor: "text-indigo-600",
        },
    ];

    const statusTone = (s: string) =>
        s === "confirmed"
            ? "info"
            : s === "completed"
                ? "success"
                : s === "cancelled"
                    ? "danger"
                    : "warning";

    return (
        <AdminShell isAdmin={true}>
            <div className="p-6 space-y-6">
                <PageHeader
                    title="Dashboard"
                    description="What needs your attention today."
                />

                {/* KPI Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
                    {kpis.map((kpi) => {
                        const Icon = kpi.icon;
                        return (
                            <Link key={kpi.label} href={kpi.to}>
                                <Card className="p-4 hover:border-primary/40 transition-colors h-full">
                                    <div className="flex items-start justify-between">
                                        <div
                                            className={`grid h-9 w-9 place-items-center rounded-lg ${kpi.bgColor} ${kpi.iconColor}`}
                                        >
                                            <Icon size={16} />
                                        </div>
                                    </div>
                                    <p className="mt-3 text-2xl font-semibold tracking-tight">
                                        {kpi.value}
                                    </p>
                                    <p className="text-xs text-gray-600 mt-0.5">{kpi.label}</p>
                                </Card>
                            </Link>
                        );
                    })}
                </div>

                {/* Two-column layout */}
                <div className="grid lg:grid-cols-2 gap-4">
                    {/* Awaiting confirmation */}
                    <Card className="p-5">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-sm font-semibold">Awaiting confirmation</h3>
                            <Link
                                href="/admin/bookings"
                                className="text-xs font-semibold text-primary-deep hover:underline inline-flex items-center gap-1"
                            >
                                View all <ArrowRight size={11} />
                            </Link>
                        </div>
                        {pendingList.length === 0 ? (
                            <p className="text-sm text-gray-600">
                                Nothing pending. Great work.
                            </p>
                        ) : (
                            <ul className="divide-y divide-gray-100">
                                {pendingList.map((r: any) => (
                                    <li
                                        key={r.id}
                                        className="py-2.5 flex items-center justify-between gap-3"
                                    >
                                        <div className="min-w-0">
                                            <p className="text-sm font-medium truncate">
                                                {r.client_name}
                                            </p>
                                            <p className="text-xs text-gray-600">
                                                {r.reference} · {r.preferred_date ?? "no date"}
                                            </p>
                                        </div>
                                        <StatusBadge tone="warning">Confirm</StatusBadge>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </Card>

                    {/* Recent bookings */}
                    <Card className="p-5">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-sm font-semibold">Recent bookings</h3>
                            <Link
                                href="/admin/bookings"
                                className="text-xs font-semibold text-primary-deep hover:underline inline-flex items-center gap-1"
                            >
                                View all <ArrowRight size={11} />
                            </Link>
                        </div>
                        {recentBookings.length === 0 ? (
                            <p className="text-sm text-gray-600">No bookings yet.</p>
                        ) : (
                            <ul className="divide-y divide-gray-100">
                                {recentBookings.map((r) => (
                                    <li
                                        key={r.id}
                                        className="py-2.5 flex items-center justify-between gap-3"
                                    >
                                        <div className="min-w-0">
                                            <p className="text-sm font-medium truncate">
                                                {r.client_name}
                                            </p>
                                            <p className="text-xs text-gray-600">{r.reference}</p>
                                        </div>
                                        <StatusBadge tone={statusTone(r.status) as any}>
                                            {r.status}
                                        </StatusBadge>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </Card>
                </div>
            </div>
        </AdminShell>
    );
}
