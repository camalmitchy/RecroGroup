import {
  BookingsPanel,
  type BookingRow,
} from "@/features/portal/components/bookings-panel";
import { formatDate } from "@/features/portal/lib/format";
import { getRequiredSession } from "@/features/portal/lib/portal-guard";
import { listBookings } from "@/server/queries/bookings";

export default async function BookingsPage() {
  await getRequiredSession("/dashboard/bookings");

  const bookings = await listBookings({ take: 200 });

  const rows: BookingRow[] = bookings.items.map((booking) => ({
    id: booking.id,
    clientName: booking.clientName,
    serviceTitle: booking.service?.title ?? null,
    preferredDateLabel: formatDate(booking.preferredDate),
    status: booking.status,
    paymentStatus: booking.paymentStatus,
  }));

  return <BookingsPanel bookings={rows} />;
}
