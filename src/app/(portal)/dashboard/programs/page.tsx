import { GriefCampPanel } from "@/features/portal/components/grief-camp-panel";
import { getRequiredSession } from "@/features/portal/lib/portal-guard";

export default async function ProgramsPage() {
  await getRequiredSession("/dashboard/programs");

  return <GriefCampPanel />;
}
