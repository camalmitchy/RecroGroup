import { BookingsPanel } from "@/features/portal/components/bookings-panel";
import { getRequiredSession } from "@/features/portal/lib/portal-guard";

export default async function BookingsPage() {
  await getRequiredSession("/dashboard/bookings");

  return <BookingsPanel />;
}
