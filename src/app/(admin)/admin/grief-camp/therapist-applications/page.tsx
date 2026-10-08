import { AdminShell } from "@/features/admin/components/admin-shell";
import {
  InquiriesPanel,
  type InquiryRow,
} from "@/features/portal/components/inquiries-panel";
import { requireAdminArea } from "@/features/admin/lib/admin-guard";
import { formatDateTime } from "@/features/portal/lib/format";
import { listInquiries } from "@/server/queries/inquiries";

export default async function AdminTherapistApplicationsPage() {
  const session = await requireAdminArea();
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
    createdAtLabel: formatDateTime(inquiry.createdAt),
  }));

  return (
    <AdminShell isAdmin={session.role === "admin"}>
      <div className="p-6 lg:p-8">
        <InquiriesPanel
          inquiries={rows}
          title="Therapist applications"
          description="Applications submitted from the grief camp therapist form."
          emptyTitle="No therapist applications yet"
          emptyDescription="Completed therapist and facilitator applications appear here."
          showTypeFilters={false}
        />
      </div>
    </AdminShell>
  );
}
