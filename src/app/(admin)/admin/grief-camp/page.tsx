import {
    AdminGriefCampPage,
    type AdminGriefApplicationRow,
} from "@/features/admin/components/admin-grief-camp-page";
import { requireAdminArea } from "@/features/admin/lib/admin-guard";
import { formatDate } from "@/features/portal/lib/format";
import { listGriefApplications } from "@/server/queries/grief-camp";

export default async function GriefCampPage() {
    const session = await requireAdminArea();
    const applications = await listGriefApplications({ take: 200 });

    const rows: AdminGriefApplicationRow[] = applications.items.map((application) => ({
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
        <AdminGriefCampPage
            applications={rows}
            total={applications.total}
            isAdmin={session.role === "admin"}
        />
    );
}
