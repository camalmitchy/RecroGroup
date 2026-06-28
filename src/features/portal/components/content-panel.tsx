"use client";

import { useState } from "react";

import { PortalCrud } from "@/features/portal/components/portal-crud";
import { PortalTabBar } from "@/features/portal/components/portal-tab-bar";
import { StatusBadge } from "@/features/portal/components/status-badge";
import {
  INITIAL_BLOG_POSTS,
  INITIAL_FAQS,
  INITIAL_MEDIA_ITEMS,
  INITIAL_TESTIMONIALS,
} from "@/features/portal/data/mock-portal-data";

type ContentTab = "blog" | "media" | "faqs" | "testimonials";

export function ContentPanel() {
  const [tab, setTab] = useState<ContentTab>("blog");

  const tabs: { key: ContentTab; label: string }[] = [
    { key: "blog", label: "Blog" },
    { key: "media", label: "Media" },
    { key: "faqs", label: "FAQs" },
    { key: "testimonials", label: "Testimonials" },
  ];

  return (
    <div className="space-y-5">
      <PortalTabBar tabs={tabs} active={tab} onChange={setTab} />

      {tab === "blog" && (
        <PortalCrud
          title="Blog posts"
          description="Articles published on the public site."
          initialRows={INITIAL_BLOG_POSTS}
          columns={[
            { key: "title", label: "Title" },
            { key: "slug", label: "Slug" },
            { key: "category", label: "Category" },
            {
              key: "isPublished",
              label: "Status",
              render: (row) => (
                <StatusBadge tone={row.isPublished ? "success" : "muted"}>
                  {row.isPublished ? "Published" : "Draft"}
                </StatusBadge>
              ),
            },
          ]}
          fields={[
            { name: "title", label: "Title", required: true },
            { name: "slug", label: "Slug", required: true },
            { name: "category", label: "Category" },
            { name: "excerpt", label: "Excerpt", type: "textarea" },
            { name: "content", label: "Content (markdown)", type: "textarea" },
            { name: "coverImageUrl", label: "Cover image URL" },
            {
              name: "isPublished",
              label: "Published",
              type: "checkbox",
              defaultValue: true,
            },
          ]}
        />
      )}

      {tab === "media" && (
        <PortalCrud
          title="Media"
          description="Videos and podcast episodes."
          initialRows={INITIAL_MEDIA_ITEMS}
          columns={[
            { key: "title", label: "Title" },
            { key: "kind", label: "Type" },
            {
              key: "isPublished",
              label: "Status",
              render: (row) => (
                <StatusBadge tone={row.isPublished ? "success" : "muted"}>
                  {row.isPublished ? "Live" : "Draft"}
                </StatusBadge>
              ),
            },
          ]}
          fields={[
            { name: "title", label: "Title", required: true },
            {
              name: "kind",
              label: "Type",
              type: "select",
              options: [
                { value: "video", label: "Video" },
                { value: "podcast", label: "Podcast" },
                { value: "audio", label: "Audio" },
              ],
            },
            { name: "url", label: "URL", required: true },
            { name: "description", label: "Description", type: "textarea" },
            { name: "thumbnailUrl", label: "Thumbnail URL" },
            {
              name: "isPublished",
              label: "Published",
              type: "checkbox",
              defaultValue: true,
            },
          ]}
        />
      )}

      {tab === "faqs" && (
        <PortalCrud
          title="FAQs"
          description="Frequently asked questions on the public site."
          initialRows={INITIAL_FAQS}
          columns={[
            { key: "question", label: "Question" },
            { key: "category", label: "Category" },
            { key: "sortOrder", label: "Order" },
            {
              key: "isPublished",
              label: "Status",
              render: (row) => (
                <StatusBadge tone={row.isPublished ? "success" : "muted"}>
                  {row.isPublished ? "Live" : "Hidden"}
                </StatusBadge>
              ),
            },
          ]}
          fields={[
            { name: "question", label: "Question", required: true },
            { name: "answer", label: "Answer", type: "textarea", required: true },
            { name: "category", label: "Category" },
            { name: "sortOrder", label: "Sort order", type: "number", defaultValue: 0 },
            {
              name: "isPublished",
              label: "Published",
              type: "checkbox",
              defaultValue: true,
            },
          ]}
        />
      )}

      {tab === "testimonials" && (
        <PortalCrud
          title="Testimonials"
          description="Client testimonials shown across the site."
          initialRows={INITIAL_TESTIMONIALS}
          columns={[
            { key: "authorName", label: "Author" },
            { key: "role", label: "Role" },
            { key: "rating", label: "Rating" },
            {
              key: "isPublished",
              label: "Status",
              render: (row) => (
                <StatusBadge tone={row.isPublished ? "success" : "muted"}>
                  {row.isPublished ? "Live" : "Draft"}
                </StatusBadge>
              ),
            },
          ]}
          fields={[
            { name: "authorName", label: "Author name", required: true },
            { name: "role", label: "Role / context" },
            { name: "quote", label: "Quote", type: "textarea", required: true },
            { name: "rating", label: "Rating (1-5)", type: "number", defaultValue: 5 },
            {
              name: "isPublished",
              label: "Published",
              type: "checkbox",
              defaultValue: true,
            },
          ]}
        />
      )}
    </div>
  );
}
