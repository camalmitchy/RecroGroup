import { PortalSectionPlaceholder } from "@/features/portal/components/portal-section-placeholder";
import { getRequiredSession } from "@/features/portal/lib/portal-guard";

export default async function ProgramsPage() {
  await getRequiredSession("/dashboard/programs");

  return (
    <PortalSectionPlaceholder
      title="Programs"
      description="Review and manage Grief Camp applications."
    />
  );
}
