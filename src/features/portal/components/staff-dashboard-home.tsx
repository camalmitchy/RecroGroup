import { PortalSectionPlaceholder } from "./portal-section-placeholder";

export function StaffDashboardHome() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="mt-1 text-muted-foreground">
          Bookings, payments, and programme activity at a glance.
        </p>
      </div>
      <PortalSectionPlaceholder
        title="Staff overview"
        description="KPI cards and recent activity will appear here."
      />
    </div>
  );
}
