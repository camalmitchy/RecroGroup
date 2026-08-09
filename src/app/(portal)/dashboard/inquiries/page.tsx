import {
  InquiriesPanel,
  type InquiryRow,
  type NewsletterRow,
} from "@/features/portal/components/inquiries-panel";
import { formatDate } from "@/features/portal/lib/format";
import { getRequiredSession } from "@/features/portal/lib/portal-guard";
import { prisma } from "@/lib/prisma";
import { listInquiries } from "@/server/queries/inquiries";

export default async function InquiriesPage() {
  await getRequiredSession("/dashboard/inquiries");

  const [inquiries, subscribers] = await Promise.all([
    listInquiries({ take: 200 }),
    prisma.newsletterSubscriber.findMany({
      orderBy: { createdAt: "desc" },
      take: 200,
    }),
  ]);

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

  const subscriberRows: NewsletterRow[] = subscribers.map((subscriber) => ({
    id: subscriber.id,
    email: subscriber.email,
    status: subscriber.status,
    createdAtLabel: formatDate(subscriber.createdAt),
  }));

  return (
    <InquiriesPanel inquiries={inquiryRows} subscribers={subscriberRows} />
  );
}
