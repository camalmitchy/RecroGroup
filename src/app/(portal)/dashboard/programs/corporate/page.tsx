import {
  InquiriesPanel,
  type InquiryRow,
} from "@/features/portal/components/inquiries-panel";
import { formatDate } from "@/features/portal/lib/format";
import { getRequiredSession } from "@/features/portal/lib/portal-guard";
import { listInquiries } from "@/server/queries/inquiries";

export default async function CorporateApplicationsPage() {
  await getRequiredSession("/dashboard/programs/corporate");

  const inquiries = await listInquiries({ program: "corporate", take: 200 });
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
      title="Corporate speaking"
      description="Applications submitted from the corporate training form."
      emptyTitle="No corporate applications yet"
      emptyDescription="Completed corporate speaking applications appear here."
      showTypeFilters={false}
    />
  );
}
