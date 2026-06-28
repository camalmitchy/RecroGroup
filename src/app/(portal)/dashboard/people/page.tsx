import { PeoplePanel } from "@/features/portal/components/people-panel";
import { getRequiredSession } from "@/features/portal/lib/portal-guard";

export default async function PeoplePage() {
  await getRequiredSession("/dashboard/people");

  return <PeoplePanel />;
}
