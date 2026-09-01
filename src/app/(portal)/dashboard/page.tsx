import {
  StaffDashboardHome,
  type DashboardBookingRow,
} from "@/features/portal/components/staff-dashboard-home";
import { formatDate } from "@/features/portal/lib/format";
import { getRequiredSession } from "@/features/portal/lib/portal-guard";
import { listBookings } from "@/server/queries/bookings";
import {
  getDashboardStats,
  getRecentActivity,
} from "@/server/queries/dashboard";

export default async function DashboardPage() {
  await getRequiredSession("/dashboard");

  const [stats, activity, pendingBookings] = await Promise.all([
    getDashboardStats(),
    getRecentActivity(6),
    listBookings({ status: "REQUESTED", take: 6 }),
  ]);

  const pending: DashboardBookingRow[] = pendingBookings.items.map(
    (booking) => ({
      id: booking.id,
      reference: booking.reference,
      clientName: booking.clientName,
      preferredDateLabel: formatDate(booking.preferredDate),
      status: booking.status,
    }),
  );

  const recent: DashboardBookingRow[] = activity.bookings.map((booking) => ({
    id: booking.id,
    reference: booking.reference,
    clientName: booking.clientName,
    preferredDateLabel: formatDate(booking.preferredDate),
    status: booking.status,
  }));

  return (
    <StaffDashboardHome stats={stats} pending={pending} recent={recent} />
  );
}
