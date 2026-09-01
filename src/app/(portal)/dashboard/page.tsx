import {
  CustomerDashboard,
  type CustomerBookingRow,
  type CustomerPaymentRow,
} from "@/features/portal/components/customer-dashboard";
import {
  StaffDashboardHome,
  type DashboardBookingRow,
} from "@/features/portal/components/staff-dashboard-home";
import { formatDate } from "@/features/portal/lib/format";
import { getRequiredSession } from "@/features/portal/lib/portal-guard";
import { prisma } from "@/lib/prisma";
import { listBookings } from "@/server/queries/bookings";
import {
  getDashboardStats,
  getRecentActivity,
} from "@/server/queries/dashboard";

export default async function DashboardPage() {
  const session = await getRequiredSession("/dashboard");

  if (session.role === "customer") {
    const [bookings, payments, griefApplicationCount] = await Promise.all([
      prisma.booking.findMany({
        where: { userId: session.userId },
        include: { service: { select: { title: true } } },
        orderBy: { createdAt: "desc" },
        take: 20,
      }),
      prisma.payment.findMany({
        where: { userId: session.userId },
        orderBy: { createdAt: "desc" },
        take: 20,
      }),
      prisma.griefApplication.count({ where: { userId: session.userId } }),
    ]);

    const ownBookings: CustomerBookingRow[] = bookings.map((booking) => ({
      id: booking.id,
      reference: booking.reference,
      serviceTitle: booking.service?.title ?? null,
      preferredDateLabel: formatDate(booking.preferredDate),
      status: booking.status,
      paymentStatus: booking.paymentStatus,
      amountKes: booking.amountKes,
      amountPaidKes: booking.amountPaidKes,
    }));

    const ownPayments: CustomerPaymentRow[] = payments.map((payment) => ({
      id: payment.id,
      reference: payment.reference,
      method: payment.method,
      purpose: payment.purpose,
      amountKes: payment.amountKes,
      status: payment.status,
      createdAtLabel: formatDate(payment.createdAt),
    }));

    return (
      <CustomerDashboard
        name={session.name}
        bookings={ownBookings}
        payments={ownPayments}
        griefApplicationCount={griefApplicationCount}
      />
    );
  }

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
