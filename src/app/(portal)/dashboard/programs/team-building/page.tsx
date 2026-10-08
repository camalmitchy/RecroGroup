import {
  InquiriesPanel,
  type InquiryRow,
} from "@/features/portal/components/inquiries-panel";
import { formatDate } from "@/features/portal/lib/format";
import { getRequiredSession } from "@/features/portal/lib/portal-guard";
import { listInquiries } from "@/server/queries/inquiries";

export default async function TeamBuildingApplicationsPage() {
  await getRequiredSession("/dashboard/programs/team-building");

  const inquiries = await listInquiries({ program: "team-building", take: 200 });
  const rows: InquiryRow[] = inquiries.items.map((inquiry) => ({
    id: inquiry.id,
    type: inquiry.type,
    name: inquiry.name,
    email: inquiry.email,
    phone: inquiry.phone,
    subject: inquiry.subject,
    message: inquiry.message,
    status: inquiry.status,
    createdAtLabel: formatDate(inquiry.createdAt),
  }));

  return (
    <InquiriesPanel
      inquiries={rows}
      title="Team building"
      description="Applications submitted from the grief camp team building form."
      emptyTitle="No team building applications yet"
      emptyDescription="Completed team building applications appear here."
      showTypeFilters={false}
    />
  );
}
