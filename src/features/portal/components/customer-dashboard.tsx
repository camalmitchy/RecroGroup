"use client";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

import { PortalSectionPlaceholder } from "./portal-section-placeholder";

export function CustomerDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">My dashboard</h1>
        <p className="mt-1 text-muted-foreground">
          Appointments, bookings, payments and saved resources in one place.
        </p>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="flex h-auto w-full flex-wrap justify-start gap-1">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="personal">Personal info</TabsTrigger>
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {(
          [
            ["overview", "Overview"],
            ["personal", "Personal info"],
            ["appointments", "Appointments"],
            ["bookings", "Bookings"],
            ["payments", "Payments"],
            ["resources", "Saved resources"],
            ["settings", "Settings"],
          ] as const
        ).map(([value, title]) => (
          <TabsContent key={value} value={value} className="mt-6">
            <PortalSectionPlaceholder title={title} />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
