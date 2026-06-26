import { InquiriesPanel } from "@/features/portal/components/inquiries-panel";
import { getRequiredSession } from "@/features/portal/lib/portal-guard";

export default async function InquiriesPage() {
  await getRequiredSession("/dashboard/inquiries");

  return <InquiriesPanel />;
}
