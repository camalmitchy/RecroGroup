import {
    AdminDashboard,
    type AdminDashboardBooking,
} from "@/features/admin/components/admin-dashboard";
import { requireAdminArea } from "@/features/admin/lib/admin-guard";
import { formatDate } from "@/features/portal/lib/format";
import { listBookings } from "@/server/queries/bookings";
import {
    getDashboardStats,
    getRecentActivity,
} from "@/server/queries/dashboard";

export default async function AdminPage() {
    const session = await requireAdminArea();

    const [stats, activity, pendingBookings] = await Promise.all([
        getDashboardStats(),
        getRecentActivity(6),
        listBookings({ status: "REQUESTED", take: 6 }),
    ]);

    const pending: AdminDashboardBooking[] = pendingBookings.items.map(
        (booking) => ({
            id: booking.id,
            reference: booking.reference,
            clientName: booking.clientName,
            preferredDateLabel: formatDate(booking.preferredDate),
            status: booking.status,
        }),
    );

    const recent: AdminDashboardBooking[] = activity.bookings.map((booking) => ({
        id: booking.id,
        reference: booking.reference,
        clientName: booking.clientName,
        preferredDateLabel: formatDate(booking.preferredDate),
        status: booking.status,
    }));

    return (
        <AdminDashboard
            stats={stats}
            pending={pending}
            recent={recent}
            isAdmin={session.role === "admin"}
        />
    );
}
