"use client";

import { useState, useTransition, type FormEvent, type ReactNode } from "react";
import { Edit2, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  deleteService,
  deleteTherapist,
  setUserRole,
  upsertService,
  upsertTherapist,
} from "@/server/actions/catalog";
import type { ActionResult } from "@/server/result";

import { AdminConfirmButton } from "./admin-confirm-button";
import { AdminShell, Card, DataTable, PageHeader, StatusBadge } from "./admin-shell";

export type AdminServiceRow = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  category: string | null;
  priceKes: number | null;
  durationMin: number | null;
  isPublished: boolean;
  bookingCount: number;
};

export type AdminTherapistRow = {
  id: string;
  fullName: string;
  title: string | null;
  bio: string | null;
  specialties: string[];
  email: string | null;
  phone: string | null;
  isActive: boolean;
  bookingCount: number;
};

export type AdminStaffRow = {
  id: string;
  name: string;
  email: string;
  role: string;
  banned: boolean;
  joinedAtLabel: string;
};

type AdminSettingsPageProps = {
  services: AdminServiceRow[];
  therapists: AdminTherapistRow[];
  staff: AdminStaffRow[];
  currentUserId: string;
  isAdmin: boolean;
};

type Tab = "team" | "services" | "therapists" | "org";

const TABS: { key: Tab; label: string }[] = [
  { key: "team", label: "Team & Roles" },
  { key: "services", label: "Services" },
  { key: "therapists", label: "Therapists" },
  { key: "org", label: "Organisation" },
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

export function AdminSettingsPage({
  services,
  therapists,
  staff,
  currentUserId,
  isAdmin,
}: AdminSettingsPageProps) {
  const [tab, setTab] = useState<Tab>("team");

  return (
    <AdminShell isAdmin={isAdmin}>
      <div className="space-y-5 p-6 lg:p-8">
        <PageHeader
          title="Settings"
          description="Manage staff, catalogue and organisation details."
        />

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

        {tab === "team" && (
          <TeamPanel staff={staff} currentUserId={currentUserId} />
        )}
        {tab === "services" && <ServicesPanel services={services} />}
        {tab === "therapists" && <TherapistsPanel therapists={therapists} />}
        {tab === "org" && <OrgPanel />}
      </div>
    </AdminShell>
  );
}

function TeamPanel({
  staff,
  currentUserId,
}: {
  staff: AdminStaffRow[];
  currentUserId: string;
}) {
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const changeRole = (
    userId: string,
    role: "admin" | "receptionist" | "customer",
  ) => {
    setPendingId(userId);
    startTransition(async () => {
      const result = await setUserRole(userId, role);
      setPendingId(null);
      if (result.ok) {
        toast.success(
          role === "customer" ? "Staff access revoked" : `Role set to ${role}`,
        );
      } else {
        toast.error(result.error);
      }
    });
  };

  return (
    <div className="space-y-4">
      <Card className="p-5">
        <h3 className="text-sm font-semibold">Staff access</h3>
        <p className="mt-1 text-xs text-gray-600">
          Admin has full control; receptionist can work bookings, payments and
          inquiries but not settings. New members must create an account first —
          they appear here once promoted.
        </p>
      </Card>

      <Card>
        {staff.length === 0 ? (
          <div className="p-10 text-center text-sm text-gray-600">
            No staff accounts yet.
          </div>
        ) : (
          <DataTable
            columns={["Name", "Email", "Role", "Joined", "Actions"]}
            rows={staff.map((member) => {
              const busy = isPending && pendingId === member.id;
              const isSelf = member.id === currentUserId;

              return [
                <div key="name">
                  <span className="font-medium">{member.name}</span>
                  {isSelf && (
                    <span className="ml-2 text-xs text-gray-500">(you)</span>
                  )}
                </div>,
                <span key="email" className="text-gray-600">
                  {member.email}
                </span>,
                <div key="role" className="flex items-center gap-2">
                  <StatusBadge tone={member.role === "admin" ? "info" : "muted"}>
                    {member.role}
                  </StatusBadge>
                  {member.banned && (
                    <StatusBadge tone="danger">banned</StatusBadge>
                  )}
                </div>,
                <span key="joined" className="text-xs text-gray-600">
                  {member.joinedAtLabel}
                </span>,
                <div
                  key="actions"
                  className="flex items-center gap-3 text-xs font-semibold"
                >
                  {isSelf ? (
                    <span className="text-gray-400">—</span>
                  ) : (
                    <>
                      {member.role !== "admin" && (
                        <button
                          type="button"
                          disabled={busy}
                          onClick={() => changeRole(member.id, "admin")}
                          className="text-primary-deep hover:underline disabled:opacity-50"
                        >
                          Make admin
                        </button>
                      )}
                      {member.role !== "receptionist" && (
                        <button
                          type="button"
                          disabled={busy}
                          onClick={() => changeRole(member.id, "receptionist")}
                          className="text-primary-deep hover:underline disabled:opacity-50"
                        >
                          Make receptionist
                        </button>
                      )}
                      <AdminConfirmButton
                        title="Revoke staff access?"
                        description={`${member.name} will lose access to the admin panel and be moved back to a customer account.`}
                        confirmLabel="Revoke access"
                        onConfirm={() => changeRole(member.id, "customer")}
                        disabled={busy}
                        className="text-red-600 hover:underline disabled:opacity-50"
                      >
                        Revoke
                      </AdminConfirmButton>
                    </>
                  )}
                </div>,
              ];
            })}
          />
        )}
      </Card>
    </div>
  );
}

function ServicesPanel({ services }: { services: AdminServiceRow[] }) {
  const [editing, setEditing] = useState<AdminServiceRow | null>(null);
  const [open, setOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const openDialog = (service: AdminServiceRow | null) => {
    setEditing(service);
    setErrors({});
    setOpen(true);
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const price = String(form.get("priceKes") ?? "");
    const duration = String(form.get("durationMin") ?? "");

    startTransition(async () => {
      const result = await upsertService({
        id: editing?.id,
        title: String(form.get("title") ?? ""),
        slug: String(form.get("slug") ?? ""),
        description: String(form.get("description") ?? ""),
        category: String(form.get("category") ?? ""),
        priceKes: price === "" ? null : Number(price),
        durationMin: duration === "" ? null : Number(duration),
        isPublished: form.get("isPublished") === "on",
      });

      if (result.ok) {
        toast.success(editing ? "Service updated" : "Service created");
        setOpen(false);
        setEditing(null);
        setErrors({});
      } else {
        setErrors({
          title: fieldError(result, "title"),
          slug: fieldError(result, "slug"),
          priceKes: fieldError(result, "priceKes"),
          durationMin: fieldError(result, "durationMin"),
        });
        toast.error(result.error);
      }
    });
  };

  const remove = (id: string) => {
    setPendingId(id);
    startTransition(async () => {
      const result = await deleteService(id);
      setPendingId(null);
      if (result.ok) {
        toast.success("Service deleted");
      } else {
        toast.error(result.error);
      }
    });
  };

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Services</h3>
          <p className="text-sm text-gray-600">
            Therapy and program services shown publicly.
          </p>
        </div>
        <button
          type="button"
          onClick={() => openDialog(null)}
          className={primaryButtonClass}
        >
          <Plus size={14} /> Add service
        </button>
      </div>

      <Card>
        {services.length === 0 ? (
          <div className="p-10 text-center text-sm text-gray-600">
            No services yet. Add one to make it bookable on the public site.
          </div>
        ) : (
          <DataTable
            columns={[
              "Title",
              "Slug",
              "Category",
              "Price (KES)",
              "Duration",
              "Bookings",
              "Status",
              "Actions",
            ]}
            rows={services.map((service) => {
              const busy = isPending && pendingId === service.id;

              return [
                <span key="title" className="font-medium">
                  {service.title}
                </span>,
                <span key="slug" className="font-mono text-xs">
                  {service.slug}
                </span>,
                service.category ?? "—",
                service.priceKes === null
                  ? "—"
                  : service.priceKes.toLocaleString(),
                service.durationMin === null
                  ? "—"
                  : `${service.durationMin} min`,
                service.bookingCount,
                <StatusBadge
                  key="status"
                  tone={service.isPublished ? "success" : "muted"}
                >
                  {service.isPublished ? "Published" : "Draft"}
                </StatusBadge>,
                <div key="actions" className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => openDialog(service)}
                    disabled={busy}
                    title="Edit"
                    className={`${iconButtonClass} bg-blue-100 text-blue-700 hover:bg-blue-200`}
                  >
                    <Edit2 size={16} />
                  </button>
                  <AdminConfirmButton
                    title="Delete this service?"
                    description={`"${service.title}" will be removed from the public site. Services with existing bookings cannot be deleted — unpublish them instead.`}
                    onConfirm={() => remove(service.id)}
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
            <DialogTitle>{editing ? "Edit service" : "New service"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={submit} className="space-y-4">
            <Field label="Title" error={errors.title}>
              <input
                name="title"
                defaultValue={editing?.title ?? ""}
                required
                className={inputClass}
              />
            </Field>
            <Field
              label="Slug"
              error={errors.slug}
              hint="Lowercase words separated by hyphens, e.g. couples-therapy"
            >
              <input
                name="slug"
                defaultValue={editing?.slug ?? ""}
                required
                className={inputClass}
              />
            </Field>
            <Field label="Description">
              <textarea
                name="description"
                defaultValue={editing?.description ?? ""}
                rows={4}
                className={textareaClass}
              />
            </Field>
            <div className="grid grid-cols-3 gap-3">
              <Field label="Category">
                <input
                  name="category"
                  defaultValue={editing?.category ?? ""}
                  className={inputClass}
                />
              </Field>
              <Field label="Price (KES)" error={errors.priceKes}>
                <input
                  name="priceKes"
                  type="number"
                  min={0}
                  defaultValue={editing?.priceKes ?? ""}
                  className={inputClass}
                />
              </Field>
              <Field label="Duration (min)" error={errors.durationMin}>
                <input
                  name="durationMin"
                  type="number"
                  min={0}
                  defaultValue={editing?.durationMin ?? ""}
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
            <DialogActions pending={isPending} onCancel={() => setOpen(false)} />
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

function TherapistsPanel({ therapists }: { therapists: AdminTherapistRow[] }) {
  const [editing, setEditing] = useState<AdminTherapistRow | null>(null);
  const [open, setOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const openDialog = (therapist: AdminTherapistRow | null) => {
    setEditing(therapist);
    setErrors({});
    setOpen(true);
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);

    startTransition(async () => {
      const result = await upsertTherapist({
        id: editing?.id,
        fullName: String(form.get("fullName") ?? ""),
        title: String(form.get("title") ?? ""),
        bio: String(form.get("bio") ?? ""),
        specialties: String(form.get("specialties") ?? "")
          .split(",")
          .map((entry) => entry.trim())
          .filter(Boolean),
        email: String(form.get("email") ?? ""),
        phone: String(form.get("phone") ?? ""),
        isActive: form.get("isActive") === "on",
      });

      if (result.ok) {
        toast.success(editing ? "Therapist updated" : "Therapist added");
        setOpen(false);
        setEditing(null);
        setErrors({});
      } else {
        setErrors({
          fullName: fieldError(result, "fullName"),
          email: fieldError(result, "email"),
        });
        toast.error(result.error);
      }
    });
  };

  const remove = (id: string) => {
    setPendingId(id);
    startTransition(async () => {
      const result = await deleteTherapist(id);
      setPendingId(null);
      if (result.ok) {
        toast.success("Therapist deleted");
      } else {
        toast.error(result.error);
      }
    });
  };

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Therapists</h3>
          <p className="text-sm text-gray-600">
            Clinical team — visible on public services pages.
          </p>
        </div>
        <button
          type="button"
          onClick={() => openDialog(null)}
          className={primaryButtonClass}
        >
          <Plus size={14} /> Add therapist
        </button>
      </div>

      <Card>
        {therapists.length === 0 ? (
          <div className="p-10 text-center text-sm text-gray-600">
            No therapists on file yet.
          </div>
        ) : (
          <DataTable
            columns={[
              "Name",
              "Title",
              "Specialties",
              "Contact",
              "Bookings",
              "Status",
              "Actions",
            ]}
            rows={therapists.map((therapist) => {
              const busy = isPending && pendingId === therapist.id;

              return [
                <span key="name" className="font-medium">
                  {therapist.fullName}
                </span>,
                therapist.title ?? "—",
                <span key="specialties" className="text-xs text-gray-600">
                  {therapist.specialties.length > 0
                    ? therapist.specialties.join(", ")
                    : "—"}
                </span>,
                <div key="contact">
                  <div className="text-xs">{therapist.email ?? "—"}</div>
                  <div className="text-xs text-gray-600">
                    {therapist.phone ?? "—"}
                  </div>
                </div>,
                therapist.bookingCount,
                <StatusBadge
                  key="status"
                  tone={therapist.isActive ? "success" : "muted"}
                >
                  {therapist.isActive ? "Active" : "Hidden"}
                </StatusBadge>,
                <div key="actions" className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => openDialog(therapist)}
                    disabled={busy}
                    title="Edit"
                    className={`${iconButtonClass} bg-blue-100 text-blue-700 hover:bg-blue-200`}
                  >
                    <Edit2 size={16} />
                  </button>
                  <AdminConfirmButton
                    title="Delete this therapist?"
                    description={`${therapist.fullName} will be removed. Therapists with existing bookings cannot be deleted — deactivate them instead.`}
                    onConfirm={() => remove(therapist.id)}
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
              {editing ? "Edit therapist" : "New therapist"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={submit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Full name" error={errors.fullName}>
                <input
                  name="fullName"
                  defaultValue={editing?.fullName ?? ""}
                  required
                  className={inputClass}
                />
              </Field>
              <Field label="Title">
                <input
                  name="title"
                  defaultValue={editing?.title ?? ""}
                  className={inputClass}
                />
              </Field>
            </div>
            <Field label="Bio">
              <textarea
                name="bio"
                defaultValue={editing?.bio ?? ""}
                rows={4}
                className={textareaClass}
              />
            </Field>
            <Field label="Specialties" hint="Comma separated">
              <input
                name="specialties"
                defaultValue={editing?.specialties.join(", ") ?? ""}
                className={inputClass}
              />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Email" error={errors.email}>
                <input
                  name="email"
                  type="email"
                  defaultValue={editing?.email ?? ""}
                  className={inputClass}
                />
              </Field>
              <Field label="Phone">
                <input
                  name="phone"
                  defaultValue={editing?.phone ?? ""}
                  className={inputClass}
                />
              </Field>
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input
                name="isActive"
                type="checkbox"
                defaultChecked={editing?.isActive ?? true}
                className="size-4 rounded border-gray-300"
              />
              Active and assignable to bookings
            </label>
            <DialogActions pending={isPending} onCancel={() => setOpen(false)} />
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

function OrgPanel() {
  return (
    <Card className="space-y-4 p-6">
      <h3 className="text-sm font-semibold">Organisation details</h3>
      <p className="text-xs text-gray-600">
        Used across the site and on payment instructions.
      </p>
      <div className="grid gap-4 text-sm sm:grid-cols-2">
        <ReadOnlyField label="Organisation" value="Recro Group Limited" />
        <ReadOnlyField label="M-Pesa Till (Buy Goods)" value="747736" />
        <ReadOnlyField label="SBM Bank KES" value="0182074946001" />
        <ReadOnlyField label="SBM Bank USD" value="0182074946003" />
        <ReadOnlyField label="Support email" value="hello@recrogroup.org" />
        <ReadOnlyField label="Phone" value="+254 700 000 000" />
      </div>
      <p className="text-xs text-gray-600">
        To change these, ask a developer to update the site config.
      </p>
    </Card>
  );
}

function ReadOnlyField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-gray-600">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  );
}

function Field({
  label,
  error,
  hint,
  children,
}: {
  label: string;
  error?: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-medium text-gray-700">{label}</label>
      {children}
      {hint && !error && <p className="text-xs text-gray-500">{hint}</p>}
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}

function DialogActions({
  pending,
  onCancel,
}: {
  pending: boolean;
  onCancel: () => void;
}) {
  return (
    <div className="flex justify-end gap-2 pt-2">
      <button
        type="button"
        onClick={onCancel}
        className="h-9 rounded-lg border border-gray-200 px-3 text-sm font-semibold hover:bg-gray-50"
      >
        Cancel
      </button>
      <button type="submit" disabled={pending} className={primaryButtonClass}>
        {pending ? "Saving…" : "Save"}
      </button>
    </div>
  );
}
