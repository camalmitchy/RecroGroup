"use client";

import { useState } from "react";
import { AdminShell, Card, PageHeader, DataTable, StatusBadge } from "./admin-shell";
import { Plus, Edit2, Trash2 } from "lucide-react";

export function AdminContentPage() {
    const [tab, setTab] = useState<"blog" | "media" | "faqs" | "testimonials">("blog");

    // TODO: Replace with real data from Prisma
    const blogPosts = [
        {
            id: "1",
            title: "Understanding Grief in Children",
            slug: "understanding-grief-children",
            category: "Grief",
            is_published: true,
        },
        {
            id: "2",
            title: "5 Signs You Might Need Therapy",
            slug: "5-signs-need-therapy",
            category: "Mental Health",
            is_published: false,
        },
    ];

    const mediaItems = [
        {
            id: "1",
            title: "Introduction to Family Therapy",
            kind: "video",
            is_published: true,
        },
    ];

    const faqs = [
        {
            id: "1",
            question: "How long is a typical therapy session?",
            category: "General",
            sort_order: 1,
            is_published: true,
        },
    ];

    const testimonials = [
        {
            id: "1",
            author_name: "Anonymous Client",
            role: "Individual therapy",
            rating: 5,
            is_published: true,
        },
    ];

    const handleAdd = (type: string) => {
        // TODO: Open modal or navigate to add form
        console.log(`Adding new ${type}`);
        alert(`Add new ${type} - Form coming soon`);
    };

    const handleEdit = (type: string, id: string) => {
        // TODO: Open modal or navigate to edit form
        console.log(`Editing ${type} ${id}`);
        alert(`Edit ${type} ${id} - Form coming soon`);
    };

    const handleDelete = (type: string, id: string) => {
        if (!confirm(`Delete this ${type}? This action cannot be undone.`)) return;
        // TODO: Implement delete logic with Prisma
        console.log(`Deleting ${type} ${id}`);
        alert(`${type} deleted`);
    };

    const tabs: Array<{ k: typeof tab; label: string }> = [
        { k: "blog", label: "Blog" },
        { k: "media", label: "Media" },
        { k: "faqs", label: "FAQs" },
        { k: "testimonials", label: "Testimonials" },
    ];

    return (
        <AdminShell isAdmin={true}>
            <div className="p-6 lg:p-8 space-y-5">
                {/* Tabs */}
                <div className="flex gap-1 border-b border-gray-200">
                    {tabs.map((t) => (
                        <button
                            key={t.k}
                            onClick={() => setTab(t.k)}
                            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${tab === t.k
                                ? "border-primary-deep text-primary-deep"
                                : "border-transparent text-gray-600 hover:text-gray-900"
                                }`}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>

                {/* Blog Posts */}
                {tab === "blog" && (
                    <>
                        <PageHeader
                            title="Blog posts"
                            description="Articles published on the public site."
                            actions={
                                <button
                                    onClick={() => handleAdd("blog post")}
                                    className="inline-flex items-center gap-1.5 px-3 h-9 rounded-lg bg-primary-deep text-white text-sm font-semibold hover:bg-primary-deep/90"
                                >
                                    <Plus size={14} /> Add post
                                </button>
                            }
                        />
                        <Card>
                            <DataTable
                                columns={["Title", "Slug", "Category", "Status", "Actions"]}
                                rows={blogPosts.map((r) => [
                                    r.title,
                                    r.slug,
                                    r.category,
                                    <StatusBadge key="s" tone={r.is_published ? "success" : "muted"}>
                                        {r.is_published ? "Published" : "Draft"}
                                    </StatusBadge>,
                                    <div key="a" className="flex gap-2">
                                        <button
                                            onClick={() => handleEdit("blog post", r.id)}
                                            className="rounded-md bg-blue-100 p-2 text-blue-700 hover:bg-blue-200"
                                            title="Edit"
                                        >
                                            <Edit2 size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete("blog post", r.id)}
                                            className="rounded-md bg-gray-100 p-2 text-gray-700 hover:bg-gray-200"
                                            title="Delete"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>,
                                ])}
                            />
                        </Card>
                    </>
                )}

                {/* Media Items */}
                {tab === "media" && (
                    <>
                        <PageHeader
                            title="Media"
                            description="Videos and podcast episodes."
                            actions={
                                <button
                                    onClick={() => handleAdd("media")}
                                    className="inline-flex items-center gap-1.5 px-3 h-9 rounded-lg bg-primary-deep text-white text-sm font-semibold hover:bg-primary-deep/90"
                                >
                                    <Plus size={14} /> Add media
                                </button>
                            }
                        />
                        <Card>
                            <DataTable
                                columns={["Title", "Type", "Status", "Actions"]}
                                rows={mediaItems.map((r) => [
                                    r.title,
                                    <span key="k" className="capitalize">
                                        {r.kind}
                                    </span>,
                                    <StatusBadge key="s" tone={r.is_published ? "success" : "muted"}>
                                        {r.is_published ? "Live" : "Draft"}
                                    </StatusBadge>,
                                    <div key="a" className="flex gap-2">
                                        <button
                                            onClick={() => handleEdit("media", r.id)}
                                            className="rounded-md bg-blue-100 p-2 text-blue-700 hover:bg-blue-200"
                                            title="Edit"
                                        >
                                            <Edit2 size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete("media", r.id)}
                                            className="rounded-md bg-gray-100 p-2 text-gray-700 hover:bg-gray-200"
                                            title="Delete"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>,
                                ])}
                            />
                        </Card>
                    </>
                )}

                {/* FAQs */}
                {tab === "faqs" && (
                    <>
                        <PageHeader
                            title="FAQs"
                            description="Frequently asked questions on the public site."
                            actions={
                                <button
                                    onClick={() => handleAdd("FAQ")}
                                    className="inline-flex items-center gap-1.5 px-3 h-9 rounded-lg bg-primary-deep text-white text-sm font-semibold hover:bg-primary-deep/90"
                                >
                                    <Plus size={14} /> Add FAQ
                                </button>
                            }
                        />
                        <Card>
                            <DataTable
                                columns={["Question", "Category", "Order", "Status", "Actions"]}
                                rows={faqs.map((r) => [
                                    r.question,
                                    r.category,
                                    r.sort_order,
                                    <StatusBadge key="s" tone={r.is_published ? "success" : "muted"}>
                                        {r.is_published ? "Live" : "Hidden"}
                                    </StatusBadge>,
                                    <div key="a" className="flex gap-2">
                                        <button
                                            onClick={() => handleEdit("FAQ", r.id)}
                                            className="rounded-md bg-blue-100 p-2 text-blue-700 hover:bg-blue-200"
                                            title="Edit"
                                        >
                                            <Edit2 size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete("FAQ", r.id)}
                                            className="rounded-md bg-gray-100 p-2 text-gray-700 hover:bg-gray-200"
                                            title="Delete"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>,
                                ])}
                            />
                        </Card>
                    </>
                )}

                {/* Testimonials */}
                {tab === "testimonials" && (
                    <>
                        <PageHeader
                            title="Testimonials"
                            description="Client testimonials shown across the site."
                            actions={
                                <button
                                    onClick={() => handleAdd("testimonial")}
                                    className="inline-flex items-center gap-1.5 px-3 h-9 rounded-lg bg-primary-deep text-white text-sm font-semibold hover:bg-primary-deep/90"
                                >
                                    <Plus size={14} /> Add testimonial
                                </button>
                            }
                        />
                        <Card>
                            <DataTable
                                columns={["Author", "Role", "Rating", "Status", "Actions"]}
                                rows={testimonials.map((r) => [
                                    r.author_name,
                                    r.role,
                                    `${r.rating}/5`,
                                    <StatusBadge key="s" tone={r.is_published ? "success" : "muted"}>
                                        {r.is_published ? "Live" : "Draft"}
                                    </StatusBadge>,
                                    <div key="a" className="flex gap-2">
                                        <button
                                            onClick={() => handleEdit("testimonial", r.id)}
                                            className="rounded-md bg-blue-100 p-2 text-blue-700 hover:bg-blue-200"
                                            title="Edit"
                                        >
                                            <Edit2 size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete("testimonial", r.id)}
                                            className="rounded-md bg-gray-100 p-2 text-gray-700 hover:bg-gray-200"
                                            title="Delete"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>,
                                ])}
                            />
                        </Card>
                    </>
                )}
            </div>
        </AdminShell>
    );
}
