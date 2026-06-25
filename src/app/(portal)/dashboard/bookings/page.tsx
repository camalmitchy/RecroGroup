import { PortalSectionPlaceholder } from "@/features/portal/components/portal-section-placeholder";
import { getRequiredSession } from "@/features/portal/lib/portal-guard";

export default async function BookingsPage() {
  await getRequiredSession("/dashboard/bookings");

  return (
    <PortalSectionPlaceholder
      title="Bookings"
      description="Manage booking requests, assign therapists, and update status."
    />
  );
}
