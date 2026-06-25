import { PortalSectionPlaceholder } from "@/features/portal/components/portal-section-placeholder";
import { getRequiredSession } from "@/features/portal/lib/portal-guard";

export default async function PeoplePage() {
  await getRequiredSession("/dashboard/people");

  return (
    <PortalSectionPlaceholder
      title="People"
      description="Therapists, users, and role management."
    />
  );
}
