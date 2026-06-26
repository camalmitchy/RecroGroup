import { PaymentsPanel } from "@/features/portal/components/payments-panel";
import { getRequiredSession } from "@/features/portal/lib/portal-guard";

export default async function PaymentsPage() {
  await getRequiredSession("/dashboard/payments");

  return <PaymentsPanel />;
}
