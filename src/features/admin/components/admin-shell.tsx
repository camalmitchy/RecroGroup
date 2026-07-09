"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Calendar,
    CreditCard,
    Users,
    HeartHandshake,
    MessageSquare,
    FileText,
    Settings,
    Search,
    Bell,
    ArrowLeft,
} from "lucide-react";

interface AdminShellProps {
    children: React.ReactNode;
    isAdmin?: boolean;
}

export function AdminShell({ children, isAdmin = false }: AdminShellProps) {
    const pathname = usePathname();

    const navItems = [
        { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
        { href: "/admin/bookings", icon: Calendar, label: "Bookings" },
        { href: "/admin/payments", icon: CreditCard, label: "Payments" },
        { href: "/admin/customers", icon: Users, label: "Customers" },
        { href: "/admin/grief-camp", icon: HeartHandshake, label: "Grief Camp" },
        { href: "/admin/messages", icon: MessageSquare, label: "Messages" },
        { href: "/admin/content", icon: FileText, label: "Content" },
        { href: "/admin/settings", icon: Settings, label: "Settings", adminOnly: true },
    ];

    const visibleItems = navItems.filter((item) => !item.adminOnly || isAdmin);

    return (
        <div className="flex min-h-screen bg-[#fafafa]">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
                {/* Logo - Match header height */}
                <div className="h-16 px-4 border-b border-gray-200 flex items-center">
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-primary-deep text-white grid place-items-center text-sm font-semibold">
                            R
                        </div>
                        <div>
                            <p className="text-sm font-semibold">Recro Admin</p>
                            <p className="text-xs text-muted-foreground">Staff</p>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-3 space-y-1">
                    {visibleItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition ${isActive
                                    ? "bg-primary-soft text-primary-deep"
                                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                    }`}
                            >
                                <Icon size={18} />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                {/* Back to site */}
                <div className="p-3 border-t border-gray-200">
                    <Link
                        href="/"
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition"
                    >
                        <ArrowLeft size={16} />
                        Back to site
                    </Link>
                </div>
            </aside>

            {/* Main content */}
            <div className="flex-1 flex flex-col">
                {/* Top bar */}
                <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
                    <div className="flex-1 max-w-md">
                        <div className="relative">
                            <Search
                                size={16}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                            />
                            <input
                                type="search"
                                placeholder="Search bookings, customers..."
                                className="w-full pl-9 pr-3 h-9 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="h-9 w-9 grid place-items-center rounded-lg hover:bg-gray-100 text-gray-600">
                            <Bell size={18} />
                        </button>
                        <div className="flex items-center gap-2 pl-3 border-l border-gray-200">
                            <span className="text-xs font-semibold text-gray-600">AD</span>
                            <span className="text-sm font-medium text-gray-900">Staff</span>
                        </div>
                    </div>
                </header>

                {/* Page content */}
                <main className="flex-1 overflow-auto">{children}</main>
            </div>
        </div>
    );
}

// Shared components
export function PageHeader({
    title,
    description,
    actions,
}: {
    title: string;
    description?: string;
    actions?: React.ReactNode;
}) {
    return (
        <div className="flex items-start justify-between">
            <div>
                <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
                    {title}
                </h1>
                {description && (
                    <p className="mt-1 text-sm text-gray-600">{description}</p>
                )}
            </div>
            {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
    );
}

export function Card({
    children,
    className = "",
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <div className={`bg-white rounded-xl border border-gray-200 ${className}`}>
            {children}
        </div>
    );
}

export function StatusBadge({
    children,
    tone = "muted",
}: {
    children: React.ReactNode;
    tone?: "success" | "warning" | "danger" | "info" | "muted";
}) {
    const colors = {
        success: "bg-green-50 text-green-700 border-green-200",
        warning: "bg-yellow-50 text-yellow-700 border-yellow-200",
        danger: "bg-red-50 text-red-700 border-red-200",
        info: "bg-blue-50 text-blue-700 border-blue-200",
        muted: "bg-gray-50 text-gray-600 border-gray-200",
    };

    return (
        <span
            className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border ${colors[tone]}`}
        >
            {children}
        </span>
    );
}

export function DataTable({
    columns,
    rows,
}: {
    columns: string[];
    rows: React.ReactNode[][];
}) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead>
                    <tr className="border-b border-gray-200">
                        {columns.map((col, i) => (
                            <th
                                key={i}
                                className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                            >
                                {col}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {rows.map((row, i) => (
                        <tr key={i} className="hover:bg-gray-50">
                            {row.map((cell, j) => (
                                <td key={j} className="px-4 py-3 text-sm text-gray-900">
                                    {cell}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
