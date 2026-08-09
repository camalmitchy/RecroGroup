"use client";

import { useState } from "react";

import {
  PortalCrud,
  type CrudValues,
} from "@/features/portal/components/portal-crud";
import { PortalTabBar } from "@/features/portal/components/portal-tab-bar";
import { StatusBadge } from "@/features/portal/components/status-badge";
import {
  deleteFaq,
  deleteTestimonial,
  upsertFaq,
  upsertTestimonial,
} from "@/server/actions/catalog";

export type BlogPostRow = {
  id: string;
  title: string;
  slug: string;
  author: string | null;
  isPublished: boolean;
  publishedLabel: string;
  createdLabel: string;
};

export type MediaItemRow = {
  id: string;
  title: string;
  mediaType: string;
  url: string;
  isPublished: boolean;
  createdLabel: string;
};

export type FaqRow = {
  id: string;
  question: string;
  answer: string;
  category: string | null;
  sortOrder: number;
  isPublished: boolean;
};

export type TestimonialRow = {
  id: string;
  authorName: string;
  authorRole: string | null;
  quote: string;
  rating: number | null;
  isPublished: boolean;
};

type ContentPanelProps = {
  blogPosts: BlogPostRow[];
  mediaItems: MediaItemRow[];
  faqs: FaqRow[];
  testimonials: TestimonialRow[];
};

type ContentTab = "blog" | "media" | "faqs" | "testimonials";

const TABS: { key: ContentTab; label: string }[] = [
  { key: "blog", label: "Blog" },
  { key: "media", label: "Media" },
  { key: "faqs", label: "FAQs" },
  { key: "testimonials", label: "Testimonials" },
];

function text(value: string | number | boolean | null | undefined): string {
  return typeof value === "string" ? value : "";
}

export function ContentPanel({
  blogPosts,
  mediaItems,
  faqs,
  testimonials,
}: ContentPanelProps) {
  const [tab, setTab] = useState<ContentTab>("blog");

  return (
    <div className="space-y-5">
      <PortalTabBar tabs={TABS} active={tab} onChange={setTab} />

      {tab === "blog" && (
        <PortalCrud<BlogPostRow>
          title="Blog posts"
          description="Articles published on the public site. Read-only here — edit them in the database."
          rows={blogPosts}
          emptyDescription="Published articles will be listed here."
          columns={[
            { key: "title", label: "Title" },
            { key: "slug", label: "Slug" },
            {
              key: "author",
              label: "Author",
              render: (row) => row.author ?? "—",
            },
            { key: "publishedLabel", label: "Published on" },
            { key: "createdLabel", label: "Created" },
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
        />
      )}

      {tab === "media" && (
        <PortalCrud<MediaItemRow>
          title="Media"
          description="Videos and podcast episodes. Read-only here — edit them in the database."
          rows={mediaItems}
          emptyDescription="Videos and podcast episodes will be listed here."
          columns={[
            { key: "title", label: "Title" },
            {
              key: "mediaType",
              label: "Type",
              render: (row) => (
                <span className="capitalize">
                  {row.mediaType.toLowerCase()}
                </span>
              ),
            },
            {
              key: "url",
              label: "URL",
              render: (row) => (
                <span className="block max-w-[260px] truncate text-muted-foreground">
                  {row.url}
                </span>
              ),
            },
            { key: "createdLabel", label: "Created" },
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
        />
      )}

      {tab === "faqs" && (
        <PortalCrud<FaqRow>
          title="FAQs"
          description="Frequently asked questions on the public site."
          rows={faqs}
          emptyDescription="Add a question to show it on the public FAQ page."
          columns={[
            {
              key: "question",
              label: "Question",
              render: (row) => (
                <span className="block max-w-[320px] truncate">
                  {row.question}
                </span>
              ),
            },
            {
              key: "category",
              label: "Category",
              render: (row) => row.category ?? "—",
            },
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
            {
              name: "answer",
              label: "Answer",
              type: "textarea",
              required: true,
            },
            { name: "category", label: "Category" },
            {
              name: "sortOrder",
              label: "Sort order",
              type: "number",
              defaultValue: 0,
            },
            {
              name: "isPublished",
              label: "Published",
              type: "checkbox",
              defaultValue: true,
            },
          ]}
          onSave={(values: CrudValues, id) =>
            upsertFaq({
              id,
              question: text(values.question),
              answer: text(values.answer),
              category: text(values.category),
              sortOrder: values.sortOrder === null ? 0 : Number(values.sortOrder),
              isPublished: Boolean(values.isPublished),
            })
          }
          onDelete={deleteFaq}
        />
      )}

      {tab === "testimonials" && (
        <PortalCrud<TestimonialRow>
          title="Testimonials"
          description="Client testimonials shown across the site."
          rows={testimonials}
          emptyDescription="Add a testimonial to feature it on the public site."
          columns={[
            { key: "authorName", label: "Author" },
            {
              key: "authorRole",
              label: "Role",
              render: (row) => row.authorRole ?? "—",
            },
            {
              key: "quote",
              label: "Quote",
              render: (row) => (
                <span className="block max-w-[320px] truncate text-muted-foreground">
                  {row.quote}
                </span>
              ),
            },
            {
              key: "rating",
              label: "Rating",
              render: (row) => (row.rating === null ? "—" : `${row.rating}/5`),
            },
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
            { name: "authorRole", label: "Role / context" },
            { name: "quote", label: "Quote", type: "textarea", required: true },
            {
              name: "rating",
              label: "Rating (1-5)",
              type: "number",
              defaultValue: 5,
            },
            {
              name: "isPublished",
              label: "Published",
              type: "checkbox",
              defaultValue: true,
            },
          ]}
          onSave={(values: CrudValues, id) =>
            upsertTestimonial({
              id,
              authorName: text(values.authorName),
              authorRole: text(values.authorRole),
              quote: text(values.quote),
              rating: values.rating === null ? null : Number(values.rating),
              isPublished: Boolean(values.isPublished),
            })
          }
          onDelete={deleteTestimonial}
        />
      )}
    </div>
  );
}
