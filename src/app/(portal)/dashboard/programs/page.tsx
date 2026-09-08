import {
  GriefCampPanel,
  type GriefApplicationRow,
} from "@/features/portal/components/grief-camp-panel";
import { formatDate } from "@/features/portal/lib/format";
import { getRequiredSession } from "@/features/portal/lib/portal-guard";
import { listGriefApplications } from "@/server/queries/grief-camp";

export default async function ProgramsPage() {
  await getRequiredSession("/dashboard/programs");

  const applications = await listGriefApplications({ take: 200 });

  const rows: GriefApplicationRow[] = applications.items.map((application) => ({
    id: application.id,
    reference: application.reference,
    childName: application.childName,
    childAge: application.childAge,
    parentName: application.parentName,
    parentEmail: application.parentEmail,
    parentPhone: application.parentPhone,
    tier: application.tier,
    campSessionName: application.campSession?.name ?? null,
    amountKes: application.amountKes,
    paymentStatus: application.paymentStatus,
    status: application.status,
    createdAtLabel: formatDate(application.createdAt),
  }));

  return <GriefCampPanel applications={rows} />;
}
