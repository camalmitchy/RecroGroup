import {
    AdminBookingsPage,
    type AdminBookingRow,
    type AdminTherapistOption,
} from "@/features/admin/components/admin-bookings-page";
import { requireAdminArea } from "@/features/admin/lib/admin-guard";
import { formatDate } from "@/features/portal/lib/format";
import { listBookings } from "@/server/queries/bookings";
import { listTherapists } from "@/server/queries/catalog";

export default async function BookingsPage() {
    const session = await requireAdminArea();

    const [bookings, therapists] = await Promise.all([
        listBookings({ take: 200 }),
        listTherapists(),
    ]);

    const rows: AdminBookingRow[] = bookings.items.map((booking) => ({
        id: booking.id,
        reference: booking.reference,
        clientName: booking.clientName,
        clientEmail: booking.clientEmail,
        clientPhone: booking.clientPhone,
        serviceTitle: booking.service?.title ?? null,
        therapistId: booking.therapistId,
        therapistName: booking.therapist?.fullName ?? null,
        preferredDateLabel: formatDate(booking.preferredDate),
        preferredTime: booking.preferredTime,
        status: booking.status,
        paymentStatus: booking.paymentStatus,
        amountKes: booking.amountKes,
        amountPaidKes: booking.amountPaidKes,
        createdAtLabel: formatDate(booking.createdAt),
    }));

    const therapistOptions: AdminTherapistOption[] = therapists
        .filter((therapist) => therapist.isActive)
        .map((therapist) => ({
            id: therapist.id,
            fullName: therapist.fullName,
        }));

    return (
        <AdminBookingsPage
            bookings={rows}
            therapists={therapistOptions}
            total={bookings.total}
            isAdmin={session.role === "admin"}
        />
    );
}
