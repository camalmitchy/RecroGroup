"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Mail, Phone, ChevronRight } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { PortalPageHeader } from "@/features/portal/components/portal-page-header";
import {
  StatusBadge,
  inquiryStatusTone,
} from "@/features/portal/components/status-badge";
import { parseInquiryMessage } from "@/features/public/shared/inquiry-message";
import { deleteInquiry, setInquiryStatus } from "@/server/actions/operations";

export type InquiryRow = {
  id: string;
  type: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  status: string;
  createdAtLabel: string;
};

const STATUSES = ["NEW", "IN_PROGRESS", "RESOLVED", "CLOSED"] as const;

function humanize(value: string) {
  return value.toLowerCase().replace(/_/g, " ");
}

function preview(message: string) {
  const sections = parseInquiryMessage(message);
  const first = sections.flatMap((section) => section.fields)[0]?.value;
  const text = (first ?? message).replace(/\s+/g, " ").trim();
  if (!text) return "No written answers";
  return text.length > 140 ? `${text.slice(0, 137)}…` : text;
}

export function InquiriesPanel({
  inquiries,
  title = "Messages",
  description,
  emptyTitle = "No form submissions yet",
  emptyDescription = "Contact form submissions appear here.",
  showTypeFilters = true,
}: {
  inquiries: InquiryRow[];
  title?: string;
  description?: string;
  emptyTitle?: string;
  emptyDescription?: string;
  showTypeFilters?: boolean;
}) {
  const router = useRouter();
  const [typeFilter, setTypeFilter] = useState<"all" | "CONTACT" | "CORPORATE">("all");
  const [openId, setOpenId] = useState<string | null>(null);
  const [statuses, setStatuses] = useState<Record<string, string>>({});
  const [removedIds, setRemovedIds] = useState<string[]>([]);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeleting, startDelete] = useTransition();

  const visibleInquiries = useMemo(
    () => inquiries.filter((inquiry) => !removedIds.includes(inquiry.id)),
    [inquiries, removedIds],
  );

  const rows = useMemo(
    () =>
      visibleInquiries.filter(
        (inquiry) => typeFilter === "all" || inquiry.type === typeFilter,
      ),
    [visibleInquiries, typeFilter],
  );

  const removeInquiry = (inquiry: InquiryRow) => {
    const label = inquiry.subject || inquiry.name;
    if (!window.confirm(`Delete “${label}”? This cannot be undone.`)) return;

    setDeletingId(inquiry.id);
    startDelete(async () => {
      const result = await deleteInquiry(inquiry.id);
      setDeletingId(null);
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      setRemovedIds((current) => [...current, inquiry.id]);
      setOpenId((current) => (current === inquiry.id ? null : current));
      toast.success("Message deleted");
      router.refresh();
    });
  };

  const open = rows.find((row) => row.id === openId) ?? visibleInquiries.find((row) => row.id === openId) ?? null;
  const newCount = visibleInquiries.filter(
    (inquiry) => (statuses[inquiry.id] ?? inquiry.status) === "NEW",
  ).length;

  return (
    <div className="space-y-5">
      <PortalPageHeader
        title={title}
        description={
          description ??
          (newCount > 0
            ? `${newCount} new form ${newCount === 1 ? "submission" : "submissions"} waiting to be read.`
            : "Form submissions from the public site.")
        }
      />

      {showTypeFilters ? (
      <div className="flex flex-wrap gap-2">
        {(
          [
            ["all", "All"],
            ["CONTACT", "Contact"],
          ] as const
        ).map(([key, label]) => {
          const count =
            key === "all"
              ? visibleInquiries.length
              : visibleInquiries.filter((inquiry) => inquiry.type === key).length;
          const active = typeFilter === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => setTypeFilter(key)}
              className={`rounded-full px-3 py-1.5 text-sm font-medium ${
                active
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              {label}
              <span className="ml-1.5 tabular-nums">{count}</span>
            </button>
          );
        })}
      </div>
      ) : null}

      {rows.length === 0 ? (
        <Card>
          <CardContent>
            <Empty className="py-12">
              <EmptyHeader>
                <EmptyTitle>
                  {visibleInquiries.length === 0 ? emptyTitle : "Nothing in this group"}
                </EmptyTitle>
                <EmptyDescription>{emptyDescription}</EmptyDescription>
              </EmptyHeader>
            </Empty>
          </CardContent>
        </Card>
      ) : (
        <ul className="space-y-3">
          {rows.map((row) => {
            const status = statuses[row.id] ?? row.status;
            return (
              <li key={row.id} className="flex items-start gap-3">
                <button
                  type="button"
                  onClick={() => setOpenId(row.id)}
                  className="flex min-w-0 flex-1 items-start gap-4 rounded-2xl border border-border bg-card p-4 text-left shadow-[var(--shadow-soft)] transition hover:border-primary/40 hover:bg-muted/30"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold text-foreground">{row.name}</p>
                      <StatusBadge tone={inquiryStatusTone(status)}>
                        {humanize(status)}
                      </StatusBadge>
                      <span className="text-xs capitalize text-muted-foreground">
                        {humanize(row.type)}
                      </span>
                    </div>
                    <p className="mt-1 truncate text-sm font-medium">
                      {row.subject || "Form submission"}
                    </p>
                    <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                      {preview(row.message)}
                    </p>
                    <p className="mt-2 text-xs text-muted-foreground">
                      {row.email}
                      {row.phone ? ` · ${row.phone}` : ""}
                      {" · "}
                      {row.createdAtLabel}
                    </p>
                  </div>
                  <span className="mt-1 inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-primary">
                    Open
                    <ChevronRight className="size-4" />
                  </span>
                </button>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  disabled={isDeleting && deletingId === row.id}
                  onClick={() => removeInquiry(row)}
                  className="mt-4"
                >
                  {isDeleting && deletingId === row.id ? "Deleting…" : "Delete"}
                </Button>
              </li>
            );
          })}
        </ul>
      )}

      <InquiryDetail
        inquiry={open}
        status={open ? (statuses[open.id] ?? open.status) : "NEW"}
        onStatus={(status) => {
          if (!open) return;
          setStatuses((current) => ({ ...current, [open.id]: status }));
        }}
        onOpenChange={(next) => {
          if (!next) setOpenId(null);
        }}
        onDelete={() => {
          if (open) removeInquiry(open);
        }}
        deleting={isDeleting && open !== null && deletingId === open.id}
      />
    </div>
  );
}

function InquiryDetail({
  inquiry,
  status,
  onStatus,
  onOpenChange,
  onDelete,
  deleting,
}: {
  inquiry: InquiryRow | null;
  status: string;
  onStatus: (status: string) => void;
  onOpenChange: (open: boolean) => void;
  onDelete: () => void;
  deleting: boolean;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const sections = inquiry ? parseInquiryMessage(inquiry.message) : [];

  const changeStatus = (next: string) => {
    if (!inquiry || next === status) return;
    onStatus(next);
    startTransition(async () => {
      const result = await setInquiryStatus(
        inquiry.id,
        next as (typeof STATUSES)[number],
      );
      if (result.ok) {
        toast.success(`Marked ${humanize(next)}`);
        router.refresh();
      } else {
        onStatus(status);
        toast.error(result.error);
      }
    });
  };

  return (
    <Dialog open={inquiry !== null} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[min(90vh,840px)] flex-col gap-0 overflow-hidden p-0 sm:max-w-2xl">
        {inquiry ? (
          <>
            <DialogHeader className="border-b border-border px-6 py-5 pr-12">
              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge tone={inquiryStatusTone(status)}>
                  {humanize(status)}
                </StatusBadge>
                <span className="text-xs capitalize text-muted-foreground">
                  {humanize(inquiry.type)} · {inquiry.createdAtLabel}
                </span>
              </div>
              <DialogTitle className="text-xl">
                {inquiry.subject || inquiry.name}
              </DialogTitle>
              <DialogDescription>
                Full answers from {inquiry.name}&apos;s form.
              </DialogDescription>
            </DialogHeader>

            <div className="flex-1 space-y-5 overflow-y-auto px-6 py-5">
              <section className="grid gap-3 rounded-2xl bg-muted/50 p-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs text-muted-foreground">Name</p>
                  <p className="font-medium">{inquiry.name}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <a
                    href={`mailto:${inquiry.email}`}
                    className="inline-flex items-center gap-1.5 font-medium text-primary hover:underline"
                  >
                    <Mail className="size-3.5" />
                    {inquiry.email}
                  </a>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Phone</p>
                  {inquiry.phone ? (
                    <a
                      href={`tel:${inquiry.phone}`}
                      className="inline-flex items-center gap-1.5 font-medium text-primary hover:underline"
                    >
                      <Phone className="size-3.5" />
                      {inquiry.phone}
                    </a>
                  ) : (
                    <p className="font-medium">Not provided</p>
                  )}
                </div>
                <div>
                  <p className="mb-1 text-xs text-muted-foreground">Status</p>
                  <NativeSelect
                    value={status}
                    disabled={isPending}
                    aria-label="Inquiry status"
                    onChange={(event) => changeStatus(event.target.value)}
                  >
                    {STATUSES.map((option) => (
                      <NativeSelectOption key={option} value={option}>
                        {humanize(option)}
                      </NativeSelectOption>
                    ))}
                  </NativeSelect>
                </div>
              </section>

              {sections.length > 0 ? (
                sections.map((section) => (
                  <section key={section.heading} className="space-y-3">
                    <h3 className="text-sm font-semibold tracking-wide text-foreground">
                      {section.heading}
                    </h3>
                    <dl className="divide-y divide-border rounded-2xl border border-border">
                      {section.fields.map((field) => (
                        <div
                          key={`${section.heading}-${field.label}`}
                          className="grid gap-1 px-4 py-3 sm:grid-cols-[180px_1fr] sm:gap-4"
                        >
                          <dt className="text-xs font-medium text-muted-foreground">
                            {field.label}
                          </dt>
                          <dd className="whitespace-pre-wrap text-sm text-foreground">
                            {field.value}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  </section>
                ))
              ) : (
                <section>
                  <h3 className="mb-3 text-sm font-semibold">Message</h3>
                  <p className="whitespace-pre-wrap rounded-2xl border border-border px-4 py-3 text-sm">
                    {inquiry.message}
                  </p>
                </section>
              )}
            </div>

            <div className="flex items-center justify-between gap-3 border-t border-border px-6 py-4">
              <Button
                type="button"
                variant="destructive"
                disabled={deleting}
                onClick={onDelete}
              >
                {deleting ? "Deleting…" : "Delete"}
              </Button>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Close
              </Button>
            </div>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
