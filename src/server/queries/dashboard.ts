import "server-only";

import { prisma } from "@/lib/prisma";

export type DashboardStats = {
  bookings: { total: number; requested: number; confirmed: number };
  payments: { total: number; pending: number; paid: number };
  applications: { total: number; pending: number };
  inquiries: { total: number; unresolved: number };
  donations: { total: number; raisedKes: number };
  revenueKes: number;
};

export async function getDashboardStats(): Promise<DashboardStats> {
  const [
    bookingTotal,
    bookingRequested,
    bookingConfirmed,
    paymentTotal,
    paymentPending,
    paymentPaid,
    applicationTotal,
    applicationPending,
    inquiryTotal,
    inquiryUnresolved,
    donationTotal,
    donationPaid,
    revenue,
  ] = await Promise.all([
    prisma.booking.count(),
    prisma.booking.count({ where: { status: "REQUESTED" } }),
    prisma.booking.count({ where: { status: "CONFIRMED" } }),
    prisma.payment.count(),
    prisma.payment.count({ where: { status: "PENDING" } }),
    prisma.payment.count({ where: { status: "PAID" } }),
    prisma.griefApplication.count(),
    prisma.griefApplication.count({ where: { status: "PENDING" } }),
    prisma.inquiry.count(),
    prisma.inquiry.count({ where: { status: { in: ["NEW", "IN_PROGRESS"] } } }),
    prisma.donation.count(),
    prisma.donation.aggregate({
      where: { paymentStatus: "PAID" },
      _sum: { amountKes: true },
    }),
    prisma.payment.aggregate({
      where: { status: "PAID" },
      _sum: { amountKes: true },
    }),
  ]);

  return {
    bookings: {
      total: bookingTotal,
      requested: bookingRequested,
      confirmed: bookingConfirmed,
    },
    payments: { total: paymentTotal, pending: paymentPending, paid: paymentPaid },
    applications: { total: applicationTotal, pending: applicationPending },
    inquiries: { total: inquiryTotal, unresolved: inquiryUnresolved },
    donations: {
      total: donationTotal,
      raisedKes: donationPaid._sum.amountKes ?? 0,
    },
    revenueKes: revenue._sum.amountKes ?? 0,
  };
}

export async function getRecentActivity(take = 5) {
  const [bookings, payments, applications, inquiries] = await Promise.all([
    prisma.booking.findMany({
      orderBy: { createdAt: "desc" },
      take,
      include: { service: { select: { title: true } } },
    }),
    prisma.payment.findMany({
      orderBy: { createdAt: "desc" },
      take,
      include: { booking: { select: { reference: true, clientName: true } } },
    }),
    prisma.griefApplication.findMany({ orderBy: { createdAt: "desc" }, take }),
    prisma.inquiry.findMany({ orderBy: { createdAt: "desc" }, take }),
  ]);

  return { bookings, payments, applications, inquiries };
}
