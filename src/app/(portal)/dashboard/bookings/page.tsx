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
    reference: booking.reference,
    clientName: booking.clientName,
    clientEmail: booking.clientEmail,
    clientPhone: booking.clientPhone,
    preferredDateLabel: formatDate(booking.preferredDate),
    therapistId: booking.therapistId,
    therapistName: booking.therapist?.fullName ?? null,
    serviceTitle: booking.service?.title ?? null,
    status: booking.status,
    paymentStatus: booking.paymentStatus,
    amountKes: booking.amountKes,
    depositKes: booking.depositKes,
    amountPaidKes: booking.amountPaidKes,
  }));

  return <BookingsPanel bookings={rows} />;
}
