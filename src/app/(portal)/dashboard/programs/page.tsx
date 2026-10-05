import {
  GriefCampPanel,
  type GriefApplicationRow,
} from "@/features/portal/components/grief-camp-panel";
import { FlyerUpload } from "@/features/portal/components/flyer-upload";
import { formatDate } from "@/features/portal/lib/format";
import { getRequiredSession } from "@/features/portal/lib/portal-guard";
import { listGriefApplications } from "@/server/queries/grief-camp";
import { getGriefCampFlyerUrl } from "@/server/queries/settings";

export default async function ProgramsPage() {
  const session = await getRequiredSession("/dashboard/programs");

  const [applications, flyerUrl] = await Promise.all([
    listGriefApplications({ take: 200 }),
    getGriefCampFlyerUrl(),
  ]);

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

  return (
    <div className="space-y-8">
      <FlyerUpload currentUrl={flyerUrl} canManage={session.role === "admin"} />
      <GriefCampPanel applications={rows} />
    </div>
  );
}
