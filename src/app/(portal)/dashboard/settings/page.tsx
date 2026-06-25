import { PortalSectionPlaceholder } from "@/features/portal/components/portal-section-placeholder";
import { getRequiredSession } from "@/features/portal/lib/portal-guard";

export default async function SettingsPage() {
  await getRequiredSession("/dashboard/settings");

  return (
    <PortalSectionPlaceholder
      title="Settings"
      description="Site configuration and operational preferences."
    />
  );
}
