"use client";

import { useState, useTransition, type FormEvent } from "react";
import { Edit2, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  deleteFaq,
  deleteTestimonial,
  upsertFaq,
  upsertTestimonial,
} from "@/server/actions/catalog";
import type { ActionResult } from "@/server/result";

import { AdminConfirmButton } from "./admin-confirm-button";
import { AdminShell, Card, DataTable, PageHeader, StatusBadge } from "./admin-shell";

export type AdminFaqRow = {
  id: string;
  question: string;
  answer: string;
  category: string | null;
  sortOrder: number;
  isPublished: boolean;
};

export type AdminTestimonialRow = {
  id: string;
  authorName: string;
  authorRole: string | null;
  quote: string;
  rating: number | null;
  isPublished: boolean;
};

export type AdminBlogPostRow = {
  id: string;
  title: string;
  slug: string;
  author: string | null;
  isPublished: boolean;
  publishedAtLabel: string | null;
  createdAtLabel: string;
};

export type AdminMediaRow = {
  id: string;
  title: string;
  mediaType: string;
  url: string;
  isPublished: boolean;
  createdAtLabel: string;
};

type AdminContentPageProps = {
  faqs: AdminFaqRow[];
  testimonials: AdminTestimonialRow[];
  blogPosts: AdminBlogPostRow[];
  mediaItems: AdminMediaRow[];
  isAdmin: boolean;
};

type Tab = "blog" | "media" | "faqs" | "testimonials";

const TABS: { key: Tab; label: string }[] = [
  { key: "blog", label: "Blog" },
  { key: "media", label: "Media" },
  { key: "faqs", label: "FAQs" },
  { key: "testimonials", label: "Testimonials" },
];

const inputClass =
  "h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm focus:border-primary-deep focus:ring-1 focus:ring-primary-deep focus:outline-none";
const textareaClass =
  "w-full rounded-lg border border-gray-200 bg-white p-3 text-sm focus:border-primary-deep focus:ring-1 focus:ring-primary-deep focus:outline-none";
const primaryButtonClass =
  "inline-flex h-9 items-center gap-1.5 rounded-lg bg-primary-deep px-3 text-sm font-semibold text-white hover:bg-primary-deep/90 disabled:opacity-50";
const iconButtonClass = "rounded-md p-2 disabled:opacity-50";

function fieldError(
  result: ActionResult<unknown>,
  field: string,
): string | undefined {
  return result.ok ? undefined : result.fieldErrors?.[field]?.[0];
}

export function AdminContentPage({
  faqs,
  testimonials,
  blogPosts,
  mediaItems,
  isAdmin,
}: AdminContentPageProps) {
  const [tab, setTab] = useState<Tab>("faqs");

  return (
    <AdminShell isAdmin={isAdmin}>
      <div className="space-y-5 p-6 lg:p-8">
        <div className="flex gap-1 border-b border-gray-200">
          {TABS.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => setTab(item.key)}
              className={`-mb-px border-b-2 px-4 py-2 text-sm font-medium ${
                tab === item.key
                  ? "border-primary-deep text-primary-deep"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {tab === "blog" && <BlogPanel posts={blogPosts} />}
        {tab === "media" && <MediaPanel items={mediaItems} />}
        {tab === "faqs" && <FaqPanel faqs={faqs} />}
        {tab === "testimonials" && (
          <TestimonialPanel testimonials={testimonials} />
        )}
      </div>
    </AdminShell>
  );
}

function BlogPanel({ posts }: { posts: AdminBlogPostRow[] }) {
  return (
    <>
      <PageHeader
        title="Blog posts"
        description="Articles published on the public site. Editing is handled outside the admin panel."
      />
      <Card>
        {posts.length === 0 ? (
          <div className="p-10 text-center text-sm text-gray-600">
            No blog posts yet.
          </div>
        ) : (
          <DataTable
            columns={["Title", "Slug", "Author", "Status", "Published", "Created"]}
            rows={posts.map((post) => [
              <span key="title" className="font-medium">
                {post.title}
              </span>,
              <span key="slug" className="font-mono text-xs">
                {post.slug}
              </span>,
              post.author ?? "—",
              <StatusBadge key="status" tone={post.isPublished ? "success" : "muted"}>
                {post.isPublished ? "Published" : "Draft"}
              </StatusBadge>,
              <span key="published" className="text-xs text-gray-600">
                {post.publishedAtLabel ?? "—"}
              </span>,
              <span key="created" className="text-xs text-gray-600">
                {post.createdAtLabel}
              </span>,
            ])}
          />
        )}
      </Card>
    </>
  );
}

function MediaPanel({ items }: { items: AdminMediaRow[] }) {
  return (
    <>
      <PageHeader
        title="Media"
        description="Videos and podcast episodes. Editing is handled outside the admin panel."
      />
      <Card>
        {items.length === 0 ? (
          <div className="p-10 text-center text-sm text-gray-600">
            No media items yet.
          </div>
        ) : (
          <DataTable
            columns={["Title", "Type", "Link", "Status", "Added"]}
            rows={items.map((item) => [
              <span key="title" className="font-medium">
                {item.title}
              </span>,
              <span key="type" className="capitalize">
                {item.mediaType.toLowerCase()}
              </span>,
              <a
                key="url"
                href={item.url}
                target="_blank"
                rel="noreferrer"
                className="block max-w-xs truncate text-xs text-primary-deep hover:underline"
              >
                {item.url}
              </a>,
              <StatusBadge key="status" tone={item.isPublished ? "success" : "muted"}>
                {item.isPublished ? "Live" : "Draft"}
              </StatusBadge>,
              <span key="added" className="text-xs text-gray-600">
                {item.createdAtLabel}
              </span>,
            ])}
          />
        )}
      </Card>
    </>
  );
}

function FaqPanel({ faqs }: { faqs: AdminFaqRow[] }) {
  const [editing, setEditing] = useState<AdminFaqRow | null>(null);
  const [open, setOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const openDialog = (faq: AdminFaqRow | null) => {
    setEditing(faq);
    setErrors({});
    setOpen(true);
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);

    startTransition(async () => {
      const result = await upsertFaq({
        id: editing?.id,
        question: String(form.get("question") ?? ""),
        answer: String(form.get("answer") ?? ""),
        category: String(form.get("category") ?? ""),
        sortOrder: Number(form.get("sortOrder") ?? 0),
        isPublished: form.get("isPublished") === "on",
      });

      if (result.ok) {
        toast.success(editing ? "FAQ updated" : "FAQ created");
        setOpen(false);
        setEditing(null);
        setErrors({});
      } else {
        setErrors({
          question: fieldError(result, "question"),
          answer: fieldError(result, "answer"),
          sortOrder: fieldError(result, "sortOrder"),
        });
        toast.error(result.error);
      }
    });
  };

  const remove = (id: string) => {
    setPendingId(id);
    startTransition(async () => {
      const result = await deleteFaq(id);
      setPendingId(null);
      if (result.ok) {
        toast.success("FAQ deleted");
      } else {
        toast.error(result.error);
      }
    });
  };

  return (
    <>
      <PageHeader
        title="FAQs"
        description="Frequently asked questions on the public site."
        actions={
          <button
            type="button"
            onClick={() => openDialog(null)}
            className={primaryButtonClass}
          >
            <Plus size={14} /> Add FAQ
          </button>
        }
      />

      <Card>
        {faqs.length === 0 ? (
          <div className="p-10 text-center text-sm text-gray-600">
            No FAQs yet. Add the first one to populate the public FAQ page.
          </div>
        ) : (
          <DataTable
            columns={["Question", "Category", "Order", "Status", "Actions"]}
            rows={faqs.map((faq) => {
              const busy = isPending && pendingId === faq.id;

              return [
                <div key="question" className="max-w-md">
                  <div className="font-medium">{faq.question}</div>
                  <div className="line-clamp-1 text-xs text-gray-500">
                    {faq.answer}
                  </div>
                </div>,
                faq.category ?? "—",
                faq.sortOrder,
                <StatusBadge key="status" tone={faq.isPublished ? "success" : "muted"}>
                  {faq.isPublished ? "Live" : "Hidden"}
                </StatusBadge>,
                <div key="actions" className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => openDialog(faq)}
                    disabled={busy}
                    title="Edit"
                    className={`${iconButtonClass} bg-blue-100 text-blue-700 hover:bg-blue-200`}
                  >
                    <Edit2 size={16} />
                  </button>
                  <AdminConfirmButton
                    title="Delete this FAQ?"
                    description={`"${faq.question}" will be removed from the public FAQ page. This cannot be undone.`}
                    onConfirm={() => remove(faq.id)}
                    disabled={busy}
                    buttonTitle="Delete"
                    className={`${iconButtonClass} bg-gray-100 text-gray-700 hover:bg-gray-200`}
                  >
                    <Trash2 size={16} />
                  </AdminConfirmButton>
                </div>,
              ];
            })}
          />
        )}
      </Card>

      <Dialog
        open={open}
        onOpenChange={(next) => {
          setOpen(next);
          if (!next) {
            setEditing(null);
            setErrors({});
          }
        }}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit FAQ" : "New FAQ"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={submit} className="space-y-4">
            <Field label="Question" error={errors.question}>
              <input
                name="question"
                defaultValue={editing?.question ?? ""}
                required
                className={inputClass}
              />
            </Field>
            <Field label="Answer" error={errors.answer}>
              <textarea
                name="answer"
                defaultValue={editing?.answer ?? ""}
                required
                rows={5}
                className={textareaClass}
              />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Category">
                <input
                  name="category"
                  defaultValue={editing?.category ?? ""}
                  className={inputClass}
                />
              </Field>
              <Field label="Sort order" error={errors.sortOrder}>
                <input
                  name="sortOrder"
                  type="number"
                  min={0}
                  defaultValue={editing?.sortOrder ?? 0}
                  className={inputClass}
                />
              </Field>
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input
                name="isPublished"
                type="checkbox"
                defaultChecked={editing?.isPublished ?? true}
                className="size-4 rounded border-gray-300"
              />
              Published on the public site
            </label>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="h-9 rounded-lg border border-gray-200 px-3 text-sm font-semibold hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isPending}
                className={primaryButtonClass}
              >
                {isPending ? "Saving…" : "Save"}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

function TestimonialPanel({
  testimonials,
}: {
  testimonials: AdminTestimonialRow[];
}) {
  const [editing, setEditing] = useState<AdminTestimonialRow | null>(null);
  const [open, setOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const openDialog = (testimonial: AdminTestimonialRow | null) => {
    setEditing(testimonial);
    setErrors({});
    setOpen(true);
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const rating = String(form.get("rating") ?? "");

    startTransition(async () => {
      const result = await upsertTestimonial({
        id: editing?.id,
        authorName: String(form.get("authorName") ?? ""),
        authorRole: String(form.get("authorRole") ?? ""),
        quote: String(form.get("quote") ?? ""),
        rating: rating === "" ? null : Number(rating),
        isPublished: form.get("isPublished") === "on",
      });

      if (result.ok) {
        toast.success(editing ? "Testimonial updated" : "Testimonial created");
        setOpen(false);
        setEditing(null);
        setErrors({});
      } else {
        setErrors({
          authorName: fieldError(result, "authorName"),
          quote: fieldError(result, "quote"),
          rating: fieldError(result, "rating"),
        });
        toast.error(result.error);
      }
    });
  };

  const remove = (id: string) => {
    setPendingId(id);
    startTransition(async () => {
      const result = await deleteTestimonial(id);
      setPendingId(null);
      if (result.ok) {
        toast.success("Testimonial deleted");
      } else {
        toast.error(result.error);
      }
    });
  };

  return (
    <>
      <PageHeader
        title="Testimonials"
        description="Client testimonials shown across the site."
        actions={
          <button
            type="button"
            onClick={() => openDialog(null)}
            className={primaryButtonClass}
          >
            <Plus size={14} /> Add testimonial
          </button>
        }
      />

      <Card>
        {testimonials.length === 0 ? (
          <div className="p-10 text-center text-sm text-gray-600">
            No testimonials yet.
          </div>
        ) : (
          <DataTable
            columns={["Author", "Role", "Quote", "Rating", "Status", "Actions"]}
            rows={testimonials.map((testimonial) => {
              const busy = isPending && pendingId === testimonial.id;

              return [
                <span key="author" className="font-medium">
                  {testimonial.authorName}
                </span>,
                testimonial.authorRole ?? "—",
                <span
                  key="quote"
                  className="block max-w-xs text-xs text-gray-600"
                  title={testimonial.quote}
                >
                  <span className="line-clamp-2">{testimonial.quote}</span>
                </span>,
                testimonial.rating === null ? "—" : `${testimonial.rating}/5`,
                <StatusBadge
                  key="status"
                  tone={testimonial.isPublished ? "success" : "muted"}
                >
                  {testimonial.isPublished ? "Live" : "Draft"}
                </StatusBadge>,
                <div key="actions" className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => openDialog(testimonial)}
                    disabled={busy}
                    title="Edit"
                    className={`${iconButtonClass} bg-blue-100 text-blue-700 hover:bg-blue-200`}
                  >
                    <Edit2 size={16} />
                  </button>
                  <AdminConfirmButton
                    title="Delete this testimonial?"
                    description={`The testimonial from ${testimonial.authorName} will be removed from the site. This cannot be undone.`}
                    onConfirm={() => remove(testimonial.id)}
                    disabled={busy}
                    buttonTitle="Delete"
                    className={`${iconButtonClass} bg-gray-100 text-gray-700 hover:bg-gray-200`}
                  >
                    <Trash2 size={16} />
                  </AdminConfirmButton>
                </div>,
              ];
            })}
          />
        )}
      </Card>

      <Dialog
        open={open}
        onOpenChange={(next) => {
          setOpen(next);
          if (!next) {
            setEditing(null);
            setErrors({});
          }
        }}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editing ? "Edit testimonial" : "New testimonial"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={submit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Author" error={errors.authorName}>
                <input
                  name="authorName"
                  defaultValue={editing?.authorName ?? ""}
                  required
                  className={inputClass}
                />
              </Field>
              <Field label="Role">
                <input
                  name="authorRole"
                  defaultValue={editing?.authorRole ?? ""}
                  className={inputClass}
                />
              </Field>
            </div>
            <Field label="Quote" error={errors.quote}>
              <textarea
                name="quote"
                defaultValue={editing?.quote ?? ""}
                required
                rows={5}
                className={textareaClass}
              />
            </Field>
            <Field label="Rating (1-5)" error={errors.rating}>
              <input
                name="rating"
                type="number"
                min={1}
                max={5}
                defaultValue={editing?.rating ?? ""}
                className={inputClass}
              />
            </Field>
            <label className="flex items-center gap-2 text-sm">
              <input
                name="isPublished"
                type="checkbox"
                defaultChecked={editing?.isPublished ?? true}
                className="size-4 rounded border-gray-300"
              />
              Published on the public site
            </label>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="h-9 rounded-lg border border-gray-200 px-3 text-sm font-semibold hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isPending}
                className={primaryButtonClass}
              >
                {isPending ? "Saving…" : "Save"}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-medium text-gray-700">{label}</label>
      {children}
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
