"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  CalendarDays,
  CreditCard,
  HeartHandshake,
  Inbox,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PortalPageHeader } from "@/features/portal/components/portal-page-header";
import { StatusBadge } from "@/features/portal/components/status-badge";
import {
  DASHBOARD_ACTIVITY,
  DASHBOARD_KPIS,
  DASHBOARD_QUEUE,
} from "@/features/portal/data/mock-portal-data";
import type { AppRole } from "@/features/portal/lib/roles";
import { ROLE_LABELS } from "@/features/portal/lib/roles";

type StaffDashboardHomeProps = {
  role: AppRole;
};

export function StaffDashboardHome({ role }: StaffDashboardHomeProps) {
  const queueTabs = Object.keys(DASHBOARD_QUEUE) as Array<
    keyof typeof DASHBOARD_QUEUE
  >;
  const [tab, setTab] = useState(queueTabs[0]);

  return (
    <div className="space-y-6">
      <PortalPageHeader
        title="Control center"
        description={`${ROLE_LABELS[role]} overview — everything that needs attention today.`}
      />

      <div className="grid grid-cols-2 gap-3 xl:grid-cols-5">
        {DASHBOARD_KPIS.map((kpi) => (
          <Link key={kpi.label} href={kpi.href} className="group">
            <Card className="h-full transition-colors hover:border-primary/40">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <span className="grid size-9 place-items-center rounded-lg bg-primary/10 text-primary">
                    {kpi.label.includes("booking") ||
                    kpi.label.includes("appointment") ? (
                      <CalendarDays className="size-4" />
                    ) : kpi.label.includes("M-Pesa") ? (
                      <CreditCard className="size-4" />
                    ) : kpi.label.includes("Grief") ? (
                      <HeartHandshake className="size-4" />
                    ) : (
                      <Inbox className="size-4" />
                    )}
                  </span>
                  <span
                    className={`inline-flex items-center gap-0.5 text-[11px] font-semibold ${
                      kpi.up ? "text-primary" : "text-destructive"
                    }`}
                  >
                    {kpi.up ? (
                      <TrendingUp className="size-3" />
                    ) : (
                      <TrendingDown className="size-3" />
                    )}
                    {kpi.delta}
                  </span>
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

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Live activity</CardTitle>
          </CardHeader>
          <CardContent className="px-0 pb-0">
            <ul className="divide-y divide-border">
              {DASHBOARD_ACTIVITY.map((item) => (
                <li key={item.text}>
                  <Link
                    href={item.href}
                    className="flex items-center justify-between gap-4 px-6 py-3 hover:bg-muted/50"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <span
                        className={`size-2 shrink-0 rounded-full ${
                          item.tone === "success"
                            ? "bg-primary"
                            : item.tone === "info"
                              ? "bg-secondary"
                              : "bg-muted-foreground"
                        }`}
                      />
                      <span className="truncate text-sm">{item.text}</span>
                    </div>
                    <span className="shrink-0 text-xs text-muted-foreground">
                      {item.time}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Quick actions</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2">
            <Button asChild variant="outline" className="justify-start">
              <Link href="/dashboard/bookings">
                <CalendarDays className="size-4" />
                Review bookings
              </Link>
            </Button>
            <Button asChild variant="outline" className="justify-start">
              <Link href="/dashboard/payments">
                <CreditCard className="size-4" />
                Verify payments
              </Link>
            </Button>
            <Button asChild variant="outline" className="justify-start">
              <Link href="/dashboard/programs">
                <HeartHandshake className="size-4" />
                Grief camp queue
              </Link>
            </Button>
            {role === "admin" && (
              <Button asChild variant="outline" className="justify-start">
                <Link href="/dashboard/settings">
                  Portal settings
                </Link>
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Work queue</CardTitle>
          <p className="text-sm text-muted-foreground">
            Daily operations — clear these to keep clients moving
          </p>
        </CardHeader>
        <CardContent>
          <Tabs
            value={tab}
            onValueChange={(value) =>
              setTab(value as keyof typeof DASHBOARD_QUEUE)
            }
          >
            <TabsList className="mb-4 h-auto w-full justify-start gap-1 overflow-x-auto">
              {queueTabs.map((key) => (
                <TabsTrigger key={key} value={key} className="shrink-0">
                  {key}
                  <Badge variant="secondary" className="ml-1.5">
                    {DASHBOARD_QUEUE[key].length}
                  </Badge>
                </TabsTrigger>
              ))}
            </TabsList>
            {queueTabs.map((key) => (
              <TabsContent key={key} value={key} className="mt-0">
                <ul className="divide-y divide-border">
                  {DASHBOARD_QUEUE[key].map((row) => (
                    <li
                      key={row.who}
                      className="flex items-center justify-between gap-4 py-3.5"
                    >
                      <div className="flex min-w-0 items-center gap-4">
                        <span className="grid size-9 shrink-0 place-items-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                          {row.who
                            .split(" ")
                            .map((w) => w[0])
                            .slice(0, 2)
                            .join("")}
                        </span>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium">
                            {row.who}
                          </p>
                          <p className="truncate text-xs text-muted-foreground">
                            {row.type} · {row.status}
                          </p>
                        </div>
                      </div>
                      <div className="flex shrink-0 items-center gap-3">
                        <StatusBadge tone="info">{row.type}</StatusBadge>
                        <Button variant="link" className="h-auto p-0">
                          {row.action}
                          <ArrowRight className="size-3.5" />
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
