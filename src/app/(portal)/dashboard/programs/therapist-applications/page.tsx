import {
  InquiriesPanel,
  type InquiryRow,
} from "@/features/portal/components/inquiries-panel";
import { formatDate } from "@/features/portal/lib/format";
import { getRequiredSession } from "@/features/portal/lib/portal-guard";
import { listInquiries } from "@/server/queries/inquiries";

export default async function TherapistApplicationsPage() {
  await getRequiredSession("/dashboard/programs/therapist-applications");

  const inquiries = await listInquiries({ program: "therapist", take: 200 });
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
      title="Therapist applications"
      description="Applications submitted from the grief camp therapist form."
      emptyTitle="No therapist applications yet"
      emptyDescription="Completed therapist and facilitator applications appear here."
      showTypeFilters={false}
    />
  );
}
