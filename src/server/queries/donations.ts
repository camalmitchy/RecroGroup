import "server-only";

import type { PaymentStatus, Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";

export type DonationFilters = {
  paymentStatus?: PaymentStatus;
  search?: string;
  take?: number;
  skip?: number;
};

function donationWhere(filters: DonationFilters): Prisma.DonationWhereInput {
  const where: Prisma.DonationWhereInput = {};

  if (filters.paymentStatus) where.paymentStatus = filters.paymentStatus;

  const search = filters.search?.trim();
  if (search) {
    where.OR = [
      { reference: { contains: search, mode: "insensitive" } },
      { donorName: { contains: search, mode: "insensitive" } },
      { donorEmail: { contains: search, mode: "insensitive" } },
    ];
  }

  return where;
}

export async function listDonations(filters: DonationFilters = {}) {
  const where = donationWhere(filters);

  const [items, total, paid] = await Promise.all([
    prisma.donation.findMany({
      where,
      include: { payments: { orderBy: { createdAt: "desc" } } },
      orderBy: { createdAt: "desc" },
      take: filters.take ?? 50,
      skip: filters.skip ?? 0,
    }),
    prisma.donation.count({ where }),
    prisma.donation.aggregate({
      where: { paymentStatus: "PAID" },
      _sum: { amountKes: true },
    }),
  ]);

  return { items, total, totalRaisedKes: paid._sum.amountKes ?? 0 };
}

export async function getDonationById(id: string) {
  return prisma.donation.findUnique({
    where: { id },
    include: { payments: { orderBy: { createdAt: "desc" } } },
  });
}
