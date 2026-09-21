"use client";

import { useState } from "react";

import {
  PortalCrud,
  type CrudValues,
} from "@/features/portal/components/portal-crud";
import { PortalPageHeader } from "@/features/portal/components/portal-page-header";
import { PortalTabBar } from "@/features/portal/components/portal-tab-bar";
import { StatusBadge } from "@/features/portal/components/status-badge";
import {
  MEDIA_CATEGORIES,
  RESOURCE_CATEGORIES,
  dropdownOptions,
} from "@/features/public/content/options";
import {
  deleteMediaItem,
  deleteResource,
  upsertMediaItem,
  upsertResource,
} from "@/server/actions/catalog";

export type ResourceRow = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  category: string;
  author: string;
  isPublished: boolean;
  publishedLabel: string;
};

export type MediaItemRow = {
  id: string;
  title: string;
  description: string;
  url: string;
  category: string;
  duration: string;
  therapist: string;
  isPublished: boolean;
  createdLabel: string;
};

type ContentPanelProps = {
  resources: ResourceRow[];
  mediaItems: MediaItemRow[];
  therapists: string[];
};

type ContentTab = "media" | "resources";

function text(value: string | number | boolean | null | undefined): string {
  return typeof value === "string" ? value : "";
}

export function ContentPanel({
  resources,
  mediaItems,
  therapists = [],
}: ContentPanelProps) {
  const [tab, setTab] = useState<ContentTab>("media");
  const speakerOptions = dropdownOptions(
    therapists.length > 0 ? therapists : ["Recro Group"],
    [
      "Recro Group",
      ...mediaItems.map((item) => item.therapist),
      ...resources.map((item) => item.author),
    ],
  );
  const mediaCategoryOptions = dropdownOptions(
    MEDIA_CATEGORIES,
    mediaItems.map((item) => item.category),
  );
  const resourceCategoryOptions = dropdownOptions(
    RESOURCE_CATEGORIES,
    resources.map((item) => item.category),
  );

  return (
    <div className="space-y-5">
      <PortalPageHeader
        title="Content"
        description="Videos and articles published on the public Media and Resources pages."
      />
      <PortalTabBar
        tabs={[
          { key: "media", label: `Media (${mediaItems.length})` },
          { key: "resources", label: `Resources (${resources.length})` },
        ]}
        active={tab}
        onChange={setTab}
      />

      {tab === "media" && (
        <PortalCrud<MediaItemRow>
          title="Media"
          description="Videos shown on the public Media page. Paste a YouTube URL or video ID."
          rows={mediaItems}
          emptyDescription="Add a video to show it on the public Media page."
          columns={[
            { key: "title", label: "Title" },
            {
              key: "category",
              label: "Category",
              render: (row) => row.category || "—",
            },
            {
              key: "duration",
              label: "Duration",
              render: (row) => row.duration || "—",
            },
            {
              key: "url",
              label: "YouTube",
              render: (row) => (
                <span className="block max-w-[240px] truncate text-muted-foreground">
                  {row.url}
                </span>
              ),
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
            { name: "title", label: "Title", required: true },
            {
              name: "url",
              label: "YouTube URL or video ID",
              required: true,
            },
            {
              name: "description",
              label: "Excerpt",
              type: "textarea",
              rows: 3,
              required: true,
            },
            {
              name: "category",
              label: "Category",
              type: "select",
              options: mediaCategoryOptions,
              required: true,
            },
            { name: "duration", label: "Duration", required: true },
            {
              name: "therapist",
              label: "Therapist",
              type: "select",
              options: speakerOptions,
              required: true,
            },
            {
              name: "isPublished",
              label: "Published",
              type: "checkbox",
              defaultValue: true,
            },
          ]}
          onSave={(values: CrudValues, id) =>
            upsertMediaItem({
              id,
              title: text(values.title),
              url: text(values.url),
              description: text(values.description),
              category: text(values.category),
              duration: text(values.duration),
              therapist: text(values.therapist),
              isPublished: Boolean(values.isPublished),
            })
          }
          onDelete={deleteMediaItem}
        />
      )}

      {tab === "resources" && (
        <PortalCrud<ResourceRow>
          title="Resources"
          description="Articles shown on the public Resources page."
          rows={resources}
          emptyDescription="Add an article to show it on the public Resources page."
          dialogClassName="max-w-2xl"
          columns={[
            { key: "title", label: "Title" },
            {
              key: "category",
              label: "Category",
              render: (row) => row.category || "—",
            },
            {
              key: "author",
              label: "Author",
              render: (row) => row.author || "—",
            },
            { key: "publishedLabel", label: "Published" },
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
              name: "category",
              label: "Category",
              type: "select",
              options: resourceCategoryOptions,
              required: true,
            },
            {
              name: "author",
              label: "Author",
              type: "select",
              options: speakerOptions,
              required: true,
            },
            {
              name: "excerpt",
              label: "Excerpt",
              type: "textarea",
              rows: 3,
              required: true,
            },
            {
              name: "body",
              label: "Article",
              type: "textarea",
              rows: 12,
              required: true,
            },
            {
              name: "isPublished",
              label: "Published",
              type: "checkbox",
              defaultValue: true,
            },
          ]}
          onSave={(values: CrudValues, id) =>
            upsertResource({
              id,
              title: text(values.title),
              slug: id
                ? resources.find((row) => row.id === id)?.slug
                : undefined,
              excerpt: text(values.excerpt),
              body: text(values.body),
              category: text(values.category),
              author: text(values.author),
              isPublished: Boolean(values.isPublished),
            })
          }
          onDelete={deleteResource}
        />
      )}
    </div>
  );
}
