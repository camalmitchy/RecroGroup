import { PortalSectionPlaceholder } from "@/features/portal/components/portal-section-placeholder";
import { getRequiredSession } from "@/features/portal/lib/portal-guard";

export default async function PaymentsPage() {
  await getRequiredSession("/dashboard/payments");

  return (
    <PortalSectionPlaceholder
      title="Payments"
      description="Verify M-Pesa, bank transfers, and link payments to bookings."
    />
  );
}
