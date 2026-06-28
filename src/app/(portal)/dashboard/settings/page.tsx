import { SettingsPanel } from "@/features/portal/components/settings-panel";
import { getRequiredSession } from "@/features/portal/lib/portal-guard";

export default async function SettingsPage() {
  const session = await getRequiredSession("/dashboard/settings");

  return <SettingsPanel />;
}
