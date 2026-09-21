import {
  InquiriesPanel,
  type InquiryRow,
} from "@/features/portal/components/inquiries-panel";
import { formatDate } from "@/features/portal/lib/format";
import { getRequiredSession } from "@/features/portal/lib/portal-guard";
import { listInquiries } from "@/server/queries/inquiries";

export default async function InquiriesPage() {
  await getRequiredSession("/dashboard/inquiries");

  const inquiries = await listInquiries({ take: 200 });

  const inquiryRows: InquiryRow[] = inquiries.items.map((inquiry) => ({
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

  return <InquiriesPanel inquiries={inquiryRows} />;
}
