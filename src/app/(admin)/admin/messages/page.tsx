import {
    AdminMessagesPage,
    type AdminInquiryRow,
} from "@/features/admin/components/admin-messages-page";
import { requireAdminArea } from "@/features/admin/lib/admin-guard";
import { formatDateTime } from "@/features/portal/lib/format";
import { listInquiries } from "@/server/queries/inquiries";

export default async function MessagesPage() {
    const session = await requireAdminArea();
    const inquiries = await listInquiries({ take: 200 });

    const rows: AdminInquiryRow[] = inquiries.items.map((inquiry) => ({
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
        <AdminMessagesPage
            inquiries={rows}
            total={inquiries.total}
            newCount={inquiries.newCount}
            isAdmin={session.role === "admin"}
        />
    );
}
