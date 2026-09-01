import Link from "next/link";
import {
    ArrowRight,
    CalendarDays,
    Clock,
    CreditCard,
    HeartHandshake,
    MessageSquare,
    TrendingUp,
} from "lucide-react";

import type { DashboardStats } from "@/server/queries/dashboard";

import { AdminShell, Card, PageHeader, StatusBadge } from "./admin-shell";

export type AdminDashboardBooking = {
    id: string;
    reference: string;
    clientName: string;
    preferredDateLabel: string;
    status: string;
};

type AdminDashboardProps = {
    stats: DashboardStats;
    pending: AdminDashboardBooking[];
    recent: AdminDashboardBooking[];
    isAdmin: boolean;
};

function statusTone(status: string) {
    if (status === "CONFIRMED") return "info" as const;
    if (status === "COMPLETED") return "success" as const;
    if (status === "CANCELLED") return "danger" as const;
    return "warning" as const;
}

export function AdminDashboard({
    stats,
    pending,
    recent,
    isAdmin,
}: AdminDashboardProps) {
    const kpis = [
        {
            label: "Total bookings",
            value: stats.bookings.total,
            to: "/admin/bookings",
            icon: CalendarDays,
            bgColor: "bg-blue-50",
            iconColor: "text-blue-600",
        },
        {
            label: "Awaiting confirmation",
            value: stats.bookings.requested,
            to: "/admin/bookings",
            icon: Clock,
            bgColor: "bg-green-50",
            iconColor: "text-green-600",
        },
        {
            label: "Pending payments",
            value: stats.payments.pending,
            to: "/admin/payments",
            icon: CreditCard,
            bgColor: "bg-yellow-50",
            iconColor: "text-yellow-600",
        },
        {
            label: "Revenue collected",
            value: `KES ${stats.revenueKes.toLocaleString()}`,
            to: "/admin/payments",
            icon: TrendingUp,
            bgColor: "bg-purple-50",
            iconColor: "text-purple-600",
        },
        {
            label: "Grief camp applications",
            value: stats.applications.pending,
            to: "/admin/grief-camp",
            icon: HeartHandshake,
            bgColor: "bg-pink-50",
            iconColor: "text-pink-600",
        },
        {
            label: "Open messages",
            value: stats.inquiries.unresolved,
            to: "/admin/messages",
            icon: MessageSquare,
            bgColor: "bg-orange-50",
            iconColor: "text-orange-600",
        },
        {
            label: "Donations raised",
            value: `KES ${stats.donations.raisedKes.toLocaleString()}`,
            to: "/admin/payments",
            icon: HeartHandshake,
            bgColor: "bg-indigo-50",
            iconColor: "text-indigo-600",
        },
    ];

    return (
        <AdminShell isAdmin={isAdmin}>
            <div className="p-6 space-y-6">
                <PageHeader
                    title="Dashboard"
                    description="What needs your attention today."
                />

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

                <div className="grid lg:grid-cols-2 gap-4">
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
                        {pending.length === 0 ? (
                            <p className="text-sm text-gray-600">
                                Nothing pending. Great work.
                            </p>
                        ) : (
                            <ul className="divide-y divide-gray-100">
                                {pending.map((row) => (
                                    <li
                                        key={row.id}
                                        className="py-2.5 flex items-center justify-between gap-3"
                                    >
                                        <div className="min-w-0">
                                            <p className="text-sm font-medium truncate">
                                                {row.clientName}
                                            </p>
                                            <p className="text-xs text-gray-600">
                                                {row.reference} · {row.preferredDateLabel}
                                            </p>
                                        </div>
                                        <StatusBadge tone="warning">Confirm</StatusBadge>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </Card>

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
                        {recent.length === 0 ? (
                            <p className="text-sm text-gray-600">No bookings yet.</p>
                        ) : (
                            <ul className="divide-y divide-gray-100">
                                {recent.map((row) => (
                                    <li
                                        key={row.id}
                                        className="py-2.5 flex items-center justify-between gap-3"
                                    >
                                        <div className="min-w-0">
                                            <p className="text-sm font-medium truncate">
                                                {row.clientName}
                                            </p>
                                            <p className="text-xs text-gray-600">{row.reference}</p>
                                        </div>
                                        <StatusBadge tone={statusTone(row.status)}>
                                            {row.status.toLowerCase()}
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
