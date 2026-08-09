"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";
import { Input } from "@/components/ui/input";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  PortalCrud,
  type CrudValues,
} from "@/features/portal/components/portal-crud";
import { PortalPageHeader } from "@/features/portal/components/portal-page-header";
import { PortalTabBar } from "@/features/portal/components/portal-tab-bar";
import { StatusBadge } from "@/features/portal/components/status-badge";
import { formatKes } from "@/features/portal/lib/format";
import {
  deleteService,
  deleteTherapist,
  setUserRole,
  upsertService,
  upsertTherapist,
} from "@/server/actions/catalog";

export type ServiceRow = {
  id: string;
  title: string;
  slug: string;
  category: string | null;
  description: string | null;
  priceKes: number | null;
  durationMin: number | null;
  isPublished: boolean;
  bookings: number;
};

export type TherapistRow = {
  id: string;
  fullName: string;
  title: string | null;
  email: string | null;
  phone: string | null;
  bio: string | null;
  specialties: string[];
  isActive: boolean;
  bookings: number;
};

export type StaffRow = {
  id: string;
  name: string;
  email: string;
  role: string;
  banned: boolean;
  joinedLabel: string;
};

type SettingsPanelProps = {
  services: ServiceRow[];
  therapists: TherapistRow[];
  staff: StaffRow[];
  currentUserId: string;
};

type SettingsTab = "team" | "services" | "therapists" | "org";

const TABS: { key: SettingsTab; label: string }[] = [
  { key: "team", label: "Team & Roles" },
  { key: "services", label: "Services" },
  { key: "therapists", label: "Therapists" },
  { key: "org", label: "Organisation" },
];

function text(value: string | number | boolean | null | undefined): string {
  return typeof value === "string" ? value : "";
}

export function SettingsPanel({
  services,
  therapists,
  staff,
  currentUserId,
}: SettingsPanelProps) {
  const [tab, setTab] = useState<SettingsTab>("team");

  return (
    <div className="space-y-5">
      <PortalPageHeader
        title="Settings"
        description="Manage staff, catalogue and organisation details."
      />

      <PortalTabBar tabs={TABS} active={tab} onChange={setTab} />

      {tab === "team" && (
        <TeamRolesPanel staff={staff} currentUserId={currentUserId} />
      )}

      {tab === "services" && (
        <PortalCrud<ServiceRow>
          title="Services"
          description="Therapy and program services shown publicly."
          rows={services}
          emptyDescription="Add a service to make it bookable on the public site."
          deleteDescription="Services with existing bookings cannot be deleted — unpublish them instead."
          columns={[
            { key: "title", label: "Title" },
            { key: "slug", label: "Slug" },
            {
              key: "category",
              label: "Category",
              render: (row) => row.category ?? "—",
            },
            {
              key: "priceKes",
              label: "Price (KES)",
              render: (row) => formatKes(row.priceKes),
            },
            {
              key: "bookings",
              label: "Bookings",
              render: (row) => row.bookings,
            },
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
            { name: "description", label: "Description", type: "textarea" },
            { name: "priceKes", label: "Price (KES)", type: "number" },
            { name: "durationMin", label: "Duration (min)", type: "number" },
            {
              name: "isPublished",
              label: "Published",
              type: "checkbox",
              defaultValue: true,
            },
          ]}
          onSave={(values: CrudValues, id) =>
            upsertService({
              id,
              title: text(values.title),
              slug: text(values.slug),
              category: text(values.category),
              description: text(values.description),
              priceKes: values.priceKes === null ? null : Number(values.priceKes),
              durationMin:
                values.durationMin === null ? null : Number(values.durationMin),
              isPublished: Boolean(values.isPublished),
            })
          }
          onDelete={deleteService}
        />
      )}

      {tab === "therapists" && (
        <PortalCrud<TherapistRow>
          title="Therapists"
          description="Clinical team — visible on public services pages."
          rows={therapists}
          emptyDescription="Add a therapist so clients can book them."
          deleteDescription="Therapists with existing bookings cannot be deleted — deactivate them instead."
          columns={[
            { key: "fullName", label: "Name" },
            { key: "title", label: "Title", render: (row) => row.title ?? "—" },
            { key: "email", label: "Email", render: (row) => row.email ?? "—" },
            { key: "phone", label: "Phone", render: (row) => row.phone ?? "—" },
            {
              key: "specialties",
              label: "Specialties",
              render: (row) =>
                row.specialties.length > 0 ? row.specialties.join(", ") : "—",
            },
            {
              key: "bookings",
              label: "Bookings",
              render: (row) => row.bookings,
            },
            {
              key: "isActive",
              label: "Status",
              render: (row) => (
                <StatusBadge tone={row.isActive ? "success" : "muted"}>
                  {row.isActive ? "Active" : "Hidden"}
                </StatusBadge>
              ),
            },
          ]}
          fields={[
            { name: "fullName", label: "Full name", required: true },
            { name: "title", label: "Title" },
            { name: "email", label: "Email" },
            { name: "phone", label: "Phone" },
            { name: "bio", label: "Short bio", type: "textarea" },
            { name: "specialties", label: "Specialties (comma separated)" },
            {
              name: "isActive",
              label: "Active",
              type: "checkbox",
              defaultValue: true,
            },
          ]}
          onSave={(values: CrudValues, id) =>
            upsertTherapist({
              id,
              fullName: text(values.fullName),
              title: text(values.title),
              bio: text(values.bio),
              email: text(values.email),
              phone: text(values.phone),
              specialties: text(values.specialties)
                .split(",")
                .map((entry) => entry.trim())
                .filter(Boolean),
              isActive: Boolean(values.isActive),
            })
          }
          onDelete={deleteTherapist}
        />
      )}

      {tab === "org" && <OrgInfoPanel />}
    </div>
  );
}

function TeamRolesPanel({
  staff,
  currentUserId,
}: {
  staff: StaffRow[];
  currentUserId: string;
}) {
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const changeRole = (
    userId: string,
    role: "admin" | "receptionist" | "customer",
    message: string,
  ) => {
    setPendingId(userId);
    startTransition(async () => {
      const result = await setUserRole(userId, role);
      setPendingId(null);
      if (result.ok) {
        toast.success(message);
      } else {
        toast.error(result.error);
      }
    });
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="space-y-2 p-5">
          <h3 className="text-sm font-semibold">Staff access</h3>
          <p className="text-xs text-muted-foreground">
            Admin = full control. Receptionist = bookings only. Removing access
            returns the account to a normal customer profile; the user keeps
            their login.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          {staff.length === 0 ? (
            <Empty className="py-12">
              <EmptyHeader>
                <EmptyTitle>No staff accounts</EmptyTitle>
                <EmptyDescription>
                  Promote an existing customer account to grant portal access.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {staff.map((row) => {
                  const busy = isPending && pendingId === row.id;
                  const isSelf = row.id === currentUserId;
                  const nextRole =
                    row.role === "admin" ? "receptionist" : "admin";

                  return (
                    <TableRow key={row.id}>
                      <TableCell className="font-medium">{row.name}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {row.email}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <StatusBadge
                            tone={row.role === "admin" ? "info" : "muted"}
                          >
                            {row.role}
                          </StatusBadge>
                          {row.banned && (
                            <StatusBadge tone="danger">suspended</StatusBadge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {row.joinedLabel}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-3">
                          <Button
                            type="button"
                            variant="link"
                            className="h-auto p-0"
                            disabled={busy || isSelf}
                            onClick={() =>
                              changeRole(
                                row.id,
                                nextRole,
                                `Now a ${nextRole}`,
                              )
                            }
                          >
                            Make {nextRole}
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                type="button"
                                variant="link"
                                className="h-auto p-0 text-destructive"
                                disabled={busy || isSelf}
                              >
                                Remove
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Remove staff access?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  {row.name} will lose access to the staff
                                  portal and revert to a customer account.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() =>
                                    changeRole(
                                      row.id,
                                      "customer",
                                      "Access removed",
                                    )
                                  }
                                >
                                  Remove access
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <GrantAccessCard />
    </div>
  );
}

function GrantAccessCard() {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"admin" | "receptionist">("receptionist");

  return (
    <Card>
      <CardContent className="space-y-3 p-5">
        <h3 className="text-sm font-semibold">Grant access by email</h3>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Input
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="user@example.com"
            aria-label="Email address"
            className="bg-[var(--admin-bg)] sm:flex-1"
          />
          <NativeSelect
            value={role}
            onChange={(event) =>
              setRole(event.target.value as "admin" | "receptionist")
            }
            aria-label="Role"
            className="sm:w-44"
          >
            <NativeSelectOption value="receptionist">
              Receptionist
            </NativeSelectOption>
            <NativeSelectOption value="admin">Admin (Staff)</NativeSelectOption>
          </NativeSelect>
          <Button
            type="button"
            disabled
            className="bg-[var(--admin-primary)] hover:bg-[var(--admin-primary)]/90"
          >
            Grant access
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Lookup by email is not wired up yet. Ask the person to sign up, then
          promote their account from the table above.
        </p>
      </CardContent>
    </Card>
  );
}

function OrgInfoPanel() {
  const fields = [
    { label: "Organisation", value: "Recro Group Limited" },
    { label: "M-Pesa Till (Buy Goods)", value: "747736" },
    { label: "SBM Bank KES", value: "0182074946001" },
    { label: "SBM Bank USD", value: "0182074946003" },
    { label: "Support email", value: "hello@recrogroup.org" },
    { label: "Phone", value: "+254 700 000 000" },
  ];

  return (
    <Card>
      <CardContent className="space-y-4 p-6">
        <div>
          <h3 className="text-sm font-semibold">Organisation details</h3>
          <p className="text-xs text-muted-foreground">
            Used across the site and on payment instructions.
          </p>
        </div>
        <div className="grid gap-4 text-sm sm:grid-cols-2">
          {fields.map((field) => (
            <div key={field.label}>
              <p className="text-xs text-muted-foreground">{field.label}</p>
              <p className="font-medium">{field.value}</p>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">
          To change these, ask a developer to update the site config.
        </p>
      </CardContent>
    </Card>
  );
}
