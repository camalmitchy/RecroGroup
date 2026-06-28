"use client";

import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import { PortalCrud } from "@/features/portal/components/portal-crud";
import { PortalPageHeader } from "@/features/portal/components/portal-page-header";
import { PortalTabBar } from "@/features/portal/components/portal-tab-bar";
import { StatusBadge } from "@/features/portal/components/status-badge";
import {
  INITIAL_SERVICES,
  INITIAL_STAFF_ROLES,
  INITIAL_THERAPIST_RECORDS,
  type MockStaffRole,
} from "@/features/portal/data/mock-portal-data";

type SettingsTab = "team" | "services" | "therapists" | "org";

export function SettingsPanel() {
  const [tab, setTab] = useState<SettingsTab>("team");

  const tabs: { key: SettingsTab; label: string }[] = [
    { key: "team", label: "Team & Roles" },
    { key: "services", label: "Services" },
    { key: "therapists", label: "Therapists" },
    { key: "org", label: "Organisation" },
  ];

  return (
    <div className="space-y-5">
      <PortalPageHeader
        title="Settings"
        description="Manage staff, catalogue and organisation details."
      />

      <PortalTabBar tabs={tabs} active={tab} onChange={setTab} />

      {tab === "team" && <TeamRolesPanel />}
      {tab === "services" && (
        <PortalCrud
          title="Services"
          description="Therapy and program services shown publicly."
          initialRows={INITIAL_SERVICES}
          columns={[
            { key: "title", label: "Title" },
            { key: "slug", label: "Slug" },
            { key: "category", label: "Category" },
            { key: "priceKes", label: "Price (KES)" },
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
        />
      )}
      {tab === "therapists" && (
        <PortalCrud
          title="Therapists"
          description="Clinical team — visible on public services pages."
          initialRows={INITIAL_THERAPIST_RECORDS}
          columns={[
            { key: "fullName", label: "Name" },
            { key: "title", label: "Title" },
            { key: "email", label: "Email" },
            { key: "phone", label: "Phone" },
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
            { name: "photoUrl", label: "Photo URL" },
            {
              name: "isActive",
              label: "Active",
              type: "checkbox",
              defaultValue: true,
            },
          ]}
        />
      )}
      {tab === "org" && <OrgInfoPanel />}
    </div>
  );
}

function TeamRolesPanel() {
  const [rows, setRows] = useState<MockStaffRole[]>(INITIAL_STAFF_ROLES);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"admin" | "receptionist">("receptionist");

  const onGrant = (event: React.FormEvent) => {
    event.preventDefault();
    if (!email.trim()) return;

    setRows((current) => [
      {
        id: crypto.randomUUID(),
        userId: crypto.randomUUID(),
        fullName: email.split("@")[0] ?? "New user",
        email: email.trim(),
        role,
      },
      ...current,
    ]);
    setEmail("");
    toast.success(`${role} access granted`);
  };

  const onRevoke = (id: string) => {
    setRows((current) => current.filter((row) => row.id !== id));
    toast.success("Access removed");
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="space-y-3 p-5">
          <h3 className="text-sm font-semibold">
            Grant admin or receptionist access
          </h3>
          <form
            onSubmit={onGrant}
            className="flex flex-col gap-2 sm:flex-row"
          >
            <Input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="user@example.com"
              className="bg-[var(--admin-bg)] sm:flex-1"
            />
            <NativeSelect
              value={role}
              onChange={(event) =>
                setRole(event.target.value as "admin" | "receptionist")
              }
              className="sm:w-44"
            >
              <NativeSelectOption value="receptionist">
                Receptionist
              </NativeSelectOption>
              <NativeSelectOption value="admin">Admin (Staff)</NativeSelectOption>
            </NativeSelect>
            <Button
              type="submit"
              className="bg-[var(--admin-primary)] hover:bg-[var(--admin-primary)]/90"
            >
              Grant access
            </Button>
          </form>
          <p className="text-xs text-muted-foreground">
            User must already have an account. Admin = full control.
            Receptionist = bookings only.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          {rows.length === 0 ? (
            <p className="p-10 text-center text-sm text-muted-foreground">
              No staff yet.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell className="font-medium">
                      {row.fullName}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {row.email}
                    </TableCell>
                    <TableCell>
                      <StatusBadge tone={row.role === "admin" ? "info" : "muted"}>
                        {row.role}
                      </StatusBadge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        type="button"
                        variant="link"
                        className="h-auto p-0 text-destructive"
                        onClick={() => onRevoke(row.id)}
                      >
                        Remove
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
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
