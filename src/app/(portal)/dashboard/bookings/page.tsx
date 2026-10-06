import {
  BookingsPanel,
  type BookingRow,
} from "@/features/portal/components/bookings-panel";
import { permanentSlotLabel } from "@/features/public/booking/lib/slots";
import { formatDate } from "@/features/portal/lib/format";
import { getRequiredSession } from "@/features/portal/lib/portal-guard";
import { isAdmin } from "@/features/portal/lib/roles";
import { listBookings } from "@/server/queries/bookings";

export default async function BookingsPage() {
  const session = await getRequiredSession("/dashboard/bookings");

  const bookings = await listBookings({ hasSuccessfulPayment: true, take: 200 });

  const rows: BookingRow[] = bookings.items.map((booking) => ({
    id: booking.id,
    reference: booking.reference,
    clientName: booking.clientName,
    clientPhone: booking.clientPhone,
    serviceTitle: booking.service?.title ?? null,
    preferredDateLabel: formatDate(booking.preferredDate),
    preferredTime: booking.preferredTime,
    slotLabel:
      booking.preferredDate && booking.preferredTime
        ? permanentSlotLabel(booking.preferredDate, booking.preferredTime)
        : null,
    status: booking.status,
    paymentStatus: booking.paymentStatus,
    amountKes: booking.amountKes,
    amountPaidKes: booking.amountPaidKes,
    latestPaymentReference: booking.payments[0]?.reference ?? null,
    latestFailureReason: booking.payments[0]?.failureReason ?? null,
  }));

  return <BookingsPanel bookings={rows} canClear={isAdmin(session.role)} />;
}
