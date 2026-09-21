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

async function safeCount(query: Promise<number>) {
  try {
    return await query;
  } catch (error) {
    console.error("[getDashboardStats]", error);
    return 0;
  }
}

async function safeSum(query: Promise<{ _sum: { amountKes: number | null } }>) {
  try {
    return await query;
  } catch (error) {
    console.error("[getDashboardStats]", error);
    return { _sum: { amountKes: 0 } };
  }
}

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
    safeCount(prisma.booking.count()),
    safeCount(prisma.booking.count({ where: { status: "REQUESTED" } })),
    safeCount(prisma.booking.count({ where: { status: "CONFIRMED" } })),
    safeCount(prisma.payment.count()),
    safeCount(prisma.payment.count({ where: { status: "PENDING" } })),
    safeCount(prisma.payment.count({ where: { status: "PAID" } })),
    safeCount(prisma.griefApplication.count()),
    safeCount(prisma.griefApplication.count({ where: { status: "PENDING" } })),
    safeCount(prisma.inquiry.count()),
    safeCount(
      prisma.inquiry.count({ where: { status: { in: ["NEW", "IN_PROGRESS"] } } }),
    ),
    safeCount(prisma.donation.count()),
    safeSum(
      prisma.donation.aggregate({
        where: { paymentStatus: "PAID" },
        _sum: { amountKes: true },
      }),
    ),
    safeSum(
      prisma.payment.aggregate({
        where: { status: "PAID" },
        _sum: { amountKes: true },
      }),
    ),
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
    prisma.booking
      .findMany({
        orderBy: { createdAt: "desc" },
        take,
        include: { service: { select: { title: true } } },
      })
      .catch((error) => {
        console.error("[getRecentActivity.bookings]", error);
        return [];
      }),
    prisma.payment
      .findMany({
        orderBy: { createdAt: "desc" },
        take,
        include: { booking: { select: { reference: true, clientName: true } } },
      })
      .catch((error) => {
        console.error("[getRecentActivity.payments]", error);
        return [];
      }),
    prisma.griefApplication
      .findMany({ orderBy: { createdAt: "desc" }, take })
      .catch((error) => {
        console.error("[getRecentActivity.applications]", error);
        return [];
      }),
    prisma.inquiry
      .findMany({ orderBy: { createdAt: "desc" }, take })
      .catch((error) => {
        console.error("[getRecentActivity.inquiries]", error);
        return [];
      }),
  ]);

  return { bookings, payments, applications, inquiries };
}
