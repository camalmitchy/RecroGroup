"use client";

import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  Clock,
  CreditCard,
  HeartHandshake,
  MessageSquare,
  TrendingUp,
  Users,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { PortalPageHeader } from "@/features/portal/components/portal-page-header";
import {
  StatusBadge,
  bookingStatusTone,
} from "@/features/portal/components/status-badge";
import {
  INITIAL_BOOKINGS,
  INITIAL_GRIEF_APPLICATIONS,
  INITIAL_INQUIRIES,
  INITIAL_PAYMENTS,
  MOCK_CUSTOMERS,
} from "@/features/portal/data/mock-portal-data";

const todayIso = new Date().toISOString().slice(0, 10);

function buildCounts() {
  const todayBookings = INITIAL_BOOKINGS.filter(
    (row) => row.preferredDate === todayIso,
  ).length;
  const pendingBookings = INITIAL_BOOKINGS.filter(
    (row) => row.status === "REQUESTED",
  ).length;
  const pendingPayments = INITIAL_PAYMENTS.filter(
    (row) => row.status === "PENDING",
  ).length;
  const bankToVerify = INITIAL_PAYMENTS.filter(
    (row) => row.method === "BANK" && row.status !== "PAID",
  ).length;
  const griefApps = INITIAL_GRIEF_APPLICATIONS.filter(
    (row) => row.status === "PENDING" || row.status === "REVIEWING",
  ).length;
  const newInquiries = INITIAL_INQUIRIES.filter(
    (row) => row.status === "NEW",
  ).length;

  return {
    todayBookings,
    pendingBookings,
    pendingPayments,
    bankToVerify,
    griefApps,
    newInquiries,
    customers: MOCK_CUSTOMERS.length,
  };
}

export function StaffDashboardHome() {
  const counts = buildCounts();
  const pendingList = INITIAL_BOOKINGS.filter((row) => row.status === "REQUESTED");
  const recent = [...INITIAL_BOOKINGS]
    .sort((a, b) => b.reference.localeCompare(a.reference))
    .slice(0, 6);

  const kpis = [
    {
      label: "Today's bookings",
      value: counts.todayBookings,
      href: "/dashboard/bookings",
      icon: CalendarDays,
    },
    {
      label: "Awaiting confirmation",
      value: counts.pendingBookings,
      href: "/dashboard/bookings",
      icon: Clock,
    },
    {
      label: "Pending payments",
      value: counts.pendingPayments,
      href: "/dashboard/payments",
      icon: CreditCard,
    },
    {
      label: "Bank transfers to verify",
      value: counts.bankToVerify,
      href: "/dashboard/payments",
      icon: TrendingUp,
    },
    {
      label: "Grief camp applications",
      value: counts.griefApps,
      href: "/dashboard/programs",
      icon: HeartHandshake,
    },
    {
      label: "New messages",
      value: counts.newInquiries,
      href: "/dashboard/inquiries",
      icon: MessageSquare,
    },
    {
      label: "Total customers",
      value: counts.customers,
      href: "/dashboard/people",
      icon: Users,
    },
  ];

  return (
    <div className="space-y-6">
      <PortalPageHeader
        title="Dashboard"
        description="What needs your attention today."
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
        {kpis.map((kpi) => (
          <Link key={kpi.label} href={kpi.href} className="group">
            <Card className="h-full transition-colors hover:border-primary/40">
              <CardContent className="p-4">
                <div className="grid size-9 place-items-center rounded-lg bg-primary-soft text-primary-deep">
                  <kpi.icon className="size-4" />
                </div>
                <p className="mt-3 text-2xl font-semibold tracking-tight">
                  {kpi.value}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {kpi.label}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardContent className="p-5">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold">Awaiting confirmation</h3>
              <Link
                href="/dashboard/bookings"
                className="inline-flex items-center gap-1 text-xs font-semibold text-primary-deep hover:underline"
              >
                View all
                <ArrowRight className="size-3" />
              </Link>
            </div>
            {pendingList.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Nothing pending. Great work.
              </p>
            ) : (
              <ul className="divide-y divide-[var(--admin-border)]">
                {pendingList.map((row) => (
                  <li
                    key={row.id}
                    className="flex items-center justify-between gap-3 py-2.5"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">
                        {row.clientName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {row.reference} · {row.preferredDate ?? "no date"}
                      </p>
                    </div>
                    <StatusBadge tone="warning">Confirm</StatusBadge>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold">Recent bookings</h3>
              <Link
                href="/dashboard/bookings"
                className="inline-flex items-center gap-1 text-xs font-semibold text-primary-deep hover:underline"
              >
                View all
                <ArrowRight className="size-3" />
              </Link>
            </div>
            {recent.length === 0 ? (
              <p className="text-sm text-muted-foreground">No bookings yet.</p>
            ) : (
              <ul className="divide-y divide-[var(--admin-border)]">
                {recent.map((row) => (
                  <li
                    key={row.id}
                    className="flex items-center justify-between gap-3 py-2.5"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">
                        {row.clientName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {row.reference}
                      </p>
                    </div>
                    <StatusBadge tone={bookingStatusTone(row.status)}>
                      {row.status.toLowerCase()}
                    </StatusBadge>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
