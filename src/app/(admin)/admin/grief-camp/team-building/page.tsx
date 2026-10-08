import { AdminShell } from "@/features/admin/components/admin-shell";
import {
  InquiriesPanel,
  type InquiryRow,
} from "@/features/portal/components/inquiries-panel";
import { requireAdminArea } from "@/features/admin/lib/admin-guard";
import { formatDateTime } from "@/features/portal/lib/format";
import { listInquiries } from "@/server/queries/inquiries";

export default async function AdminTeamBuildingPage() {
  const session = await requireAdminArea();
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
    createdAtLabel: formatDateTime(inquiry.createdAt),
  }));

  return (
    <AdminShell isAdmin={session.role === "admin"}>
      <div className="p-6 lg:p-8">
        <InquiriesPanel
          inquiries={rows}
          title="Team building"
          description="Applications submitted from the grief camp team building form."
          emptyTitle="No team building applications yet"
          emptyDescription="Completed team building applications appear here."
          showTypeFilters={false}
        />
      </div>
    </AdminShell>
  );
}
