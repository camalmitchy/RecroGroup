"use client";

import { useState } from "react";
import { AdminShell, Card, PageHeader, DataTable, StatusBadge } from "./admin-shell";
import { Plus } from "lucide-react";

export function AdminSettingsPage() {
    const [tab, setTab] = useState<"team" | "services" | "therapists" | "org">("team");

    const tabs: Array<{ k: typeof tab; label: string }> = [
        { k: "team", label: "Team & Roles" },
        { k: "services", label: "Services" },
        { k: "therapists", label: "Therapists" },
        { k: "org", label: "Organisation" },
    ];

    return (
        <AdminShell isAdmin={true}>
            <div className="p-6 lg:p-8 space-y-5">
                <PageHeader
                    title="Settings"
                    description="Manage staff, catalogue and organisation details."
                />

                {/* Tabs */}
                <div className="flex gap-1 border-b border-gray-200">
                    {tabs.map((t) => (
                        <button
                            key={t.k}
                            onClick={() => setTab(t.k)}
                            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${tab === t.k
                                    ? "border-primary text-primary-deep"
                                    : "border-transparent text-gray-600 hover:text-gray-900"
                                }`}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>

                {tab === "team" && <TeamRoles />}
                {tab === "services" && <ServicesCrud />}
                {tab === "therapists" && <TherapistsCrud />}
                {tab === "org" && <OrgInfo />}
            </div>
        </AdminShell>
    );
}

function TeamRoles() {
    const [email, setEmail] = useState("");
    const [role, setRole] = useState<"admin" | "receptionist">("receptionist");
    const [busy, setBusy] = useState(false);

    // TODO: Replace with real data
    const teamMembers = [
        {
            user_id: "1",
            full_name: "Admin User",
            email: "admin@recrogroup.org",
            role: "admin",
        },
    ];

    const handleGrant = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.trim()) return;
        setBusy(true);
        // TODO: Implement grant logic
        setTimeout(() => {
            alert(`${role} access granted`);
            setEmail("");
            setBusy(false);
        }, 1000);
    };

    const handleRevoke = (userId: string, r: string) => {
        if (!confirm(`Remove ${r} access?`)) return;
        // TODO: Implement revoke logic
        alert("Access removed");
    };

    return (
        <div className="space-y-4">
            <Card className="p-5">
                <h3 className="text-sm font-semibold mb-3">
                    Grant admin or receptionist access
                </h3>
                <form onSubmit={handleGrant} className="flex flex-col sm:flex-row gap-2">
                    <input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="user@example.com"
                        className="flex-1 h-10 px-3 rounded-lg border border-gray-200 bg-white text-sm"
                    />
                    <select
                        value={role}
                        onChange={(e) => setRole(e.target.value as any)}
                        className="h-10 px-3 rounded-lg border border-gray-200 bg-white text-sm"
                    >
                        <option value="receptionist">Receptionist</option>
                        <option value="admin">Admin (Staff)</option>
                    </select>
                    <button
                        disabled={busy}
                        className="h-10 px-4 rounded-lg bg-primary text-white text-sm font-semibold disabled:opacity-50"
                    >
                        {busy ? "Granting…" : "Grant access"}
                    </button>
                </form>
                <p className="text-xs text-gray-600 mt-2">
                    User must already have an account. Admin = full control. Receptionist =
                    bookings only.
                </p>
            </Card>

            <Card>
                {teamMembers.length === 0 ? (
                    <div className="p-10 text-center text-gray-600 text-sm">No staff yet.</div>
                ) : (
                    <DataTable
                        columns={["Name", "Email", "Role", "Actions"]}
                        rows={teamMembers.map((r) => [
                            <span key="n" className="font-medium">
                                {r.full_name ?? "—"}
                            </span>,
                            <span key="e" className="text-gray-600">
                                {r.email}
                            </span>,
                            <StatusBadge key="r" tone={r.role === "admin" ? "info" : "muted"}>
                                {r.role}
                            </StatusBadge>,
                            <button
                                key="a"
                                onClick={() => handleRevoke(r.user_id, r.role)}
                                className="text-xs font-semibold text-red-600 hover:underline"
                            >
                                Remove
                            </button>,
                        ])}
                    />
                )}
            </Card>
        </div>
    );
}

function ServicesCrud() {
    // TODO: Implement full CRUD
    const services = [
        {
            id: "1",
            title: "Individual Therapy",
            slug: "individual",
            category: "Therapy",
            price_kes: 5000,
            is_published: true,
        },
    ];

    return (
        <>
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="text-lg font-semibold">Services</h3>
                    <p className="text-sm text-gray-600">
                        Therapy and program services shown publicly.
                    </p>
                </div>
                <button className="inline-flex items-center gap-1.5 px-3 h-9 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90">
                    <Plus size={14} /> Add service
                </button>
            </div>
            <Card>
                <DataTable
                    columns={["Title", "Slug", "Category", "Price (KES)", "Status"]}
                    rows={services.map((r) => [
                        r.title,
                        r.slug,
                        r.category,
                        r.price_kes.toLocaleString(),
                        <StatusBadge key="s" tone={r.is_published ? "success" : "muted"}>
                            {r.is_published ? "Published" : "Draft"}
                        </StatusBadge>,
                    ])}
                />
            </Card>
        </>
    );
}

function TherapistsCrud() {
    // TODO: Implement full CRUD
    const therapists = [
        {
            id: "1",
            full_name: "Dr. Sarah Johnson",
            title: "Clinical Psychologist",
            email: "sarah@recrogroup.org",
            phone: "+254 700 000 001",
            is_active: true,
        },
    ];

    return (
        <>
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="text-lg font-semibold">Therapists</h3>
                    <p className="text-sm text-gray-600">
                        Clinical team — visible on public services pages.
                    </p>
                </div>
                <button className="inline-flex items-center gap-1.5 px-3 h-9 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90">
                    <Plus size={14} /> Add therapist
                </button>
            </div>
            <Card>
                <DataTable
                    columns={["Name", "Title", "Email", "Phone", "Status"]}
                    rows={therapists.map((r) => [
                        r.full_name,
                        r.title,
                        r.email,
                        r.phone,
                        <StatusBadge key="s" tone={r.is_active ? "success" : "muted"}>
                            {r.is_active ? "Active" : "Hidden"}
                        </StatusBadge>,
                    ])}
                />
            </Card>
        </>
    );
}

function OrgInfo() {
    return (
        <Card className="p-6 space-y-4">
            <h3 className="text-sm font-semibold">Organisation details</h3>
            <p className="text-xs text-gray-600">
                Used across the site and on payment instructions.
            </p>
            <div className="grid sm:grid-cols-2 gap-4 text-sm">
                <Field label="Organisation" value="Recro Group Limited" />
                <Field label="M-Pesa Till (Buy Goods)" value="747736" />
                <Field label="SBM Bank KES" value="0182074946001" />
                <Field label="SBM Bank USD" value="0182074946003" />
                <Field label="Support email" value="hello@recrogroup.org" />
                <Field label="Phone" value="+254 700 000 000" />
            </div>
            <p className="text-xs text-gray-600">
                To change these, ask a developer to update the site config.
            </p>
        </Card>
    );
}

function Field({ label, value }: { label: string; value: string }) {
    return (
        <div>
            <p className="text-xs text-gray-600">{label}</p>
            <p className="font-medium">{value}</p>
        </div>
    );
}
