"use client";

import Link from "next/link";
import {
  CalendarDays,
  CreditCard,
  HeartHandshake,
  UserRound,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { StatusBadge } from "@/features/portal/components/status-badge";

export function CustomerDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <Badge variant="secondary" className="mb-3 rounded-full">
          Customer portal
        </Badge>
        <h1 className="text-2xl font-semibold tracking-tight">My dashboard</h1>
        <p className="mt-1 text-muted-foreground">
          Appointments, bookings, payments and saved resources in one place.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Next appointment</CardDescription>
            <CardTitle className="text-lg">Thu, 3 Jul · 14:00</CardTitle>
          </CardHeader>
          <CardContent>
            <StatusBadge tone="info">Confirmed</StatusBadge>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Active booking</CardDescription>
            <CardTitle className="text-lg">Individual therapy</CardTitle>
          </CardHeader>
          <CardContent>
            <StatusBadge tone="warning">Payment pending</StatusBadge>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Grief camp</CardDescription>
            <CardTitle className="text-lg">Not applied</CardTitle>
          </CardHeader>
          <CardContent>
            <Button asChild size="sm" variant="outline" className="rounded-full">
              <Link href="/grief-camp">Learn more</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="flex h-auto w-full flex-wrap justify-start gap-1">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Welcome back</CardTitle>
              <CardDescription>
                Here&apos;s a summary of your care with Recro Group.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div className="flex items-start gap-3 rounded-xl border border-border p-4">
                <CalendarDays className="mt-0.5 size-5 text-primary" />
                <div>
                  <p className="font-medium">Upcoming session</p>
                  <p className="text-sm text-muted-foreground">
                    Individual therapy with Dr. Michelle Karume
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-xl border border-border p-4">
                <CreditCard className="mt-0.5 size-5 text-primary" />
                <div>
                  <p className="font-medium">Payment due</p>
                  <p className="text-sm text-muted-foreground">
                    KES 4,500 · M-Pesa pending confirmation
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appointments" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserRound className="size-5 text-primary" />
                Appointments
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Your scheduled sessions will appear here once booking is confirmed.
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bookings" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarDays className="size-5 text-primary" />
                Bookings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Reference RC-2401 · Individual therapy · Requested
              </p>
              <Button asChild className="rounded-full">
                <Link href="/booking">Book another session</Link>
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="size-5 text-primary" />
                Payments
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Payment history and receipts will be listed here.
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resources" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HeartHandshake className="size-5 text-primary" />
                Saved resources
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Articles and videos you save from Insights will show up here.
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
