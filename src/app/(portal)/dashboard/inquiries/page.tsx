import { PortalSectionPlaceholder } from "@/features/portal/components/portal-section-placeholder";
import { getRequiredSession } from "@/features/portal/lib/portal-guard";

export default async function InquiriesPage() {
  await getRequiredSession("/dashboard/inquiries");

  return (
    <PortalSectionPlaceholder
      title="Inquiries"
      description="Contact form submissions, corporate leads, and newsletter subscribers."
    />
  );
}
