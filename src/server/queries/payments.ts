import "server-only";

import type {
  PaymentMethod,
  PaymentProvider,
  PaymentStatus,
  Prisma,
} from "@prisma/client";

import { prisma } from "@/lib/prisma";

export type PaymentFilters = {
  status?: PaymentStatus;
  method?: PaymentMethod;
  provider?: PaymentProvider;
  search?: string;
  take?: number;
  skip?: number;
};

function paymentWhere(filters: PaymentFilters): Prisma.PaymentWhereInput {
  const where: Prisma.PaymentWhereInput = {};

  if (filters.status) where.status = filters.status;
  if (filters.method) where.method = filters.method;
  if (filters.provider) where.provider = filters.provider;

  const search = filters.search?.trim();
  if (search) {
    where.OR = [
      { reference: { contains: search, mode: "insensitive" } },
      { providerRef: { contains: search, mode: "insensitive" } },
      { mpesaReceipt: { contains: search, mode: "insensitive" } },
      { phone: { contains: search, mode: "insensitive" } },
      { booking: { clientName: { contains: search, mode: "insensitive" } } },
      { booking: { clientEmail: { contains: search, mode: "insensitive" } } },
      { booking: { reference: { contains: search, mode: "insensitive" } } },
    ];
  }

  return where;
}

export async function listPayments(filters: PaymentFilters = {}) {
  const where = paymentWhere(filters);

  const [items, total] = await Promise.all([
    prisma.payment.findMany({
      where,
      include: {
        booking: { include: { service: true } },
        griefApplication: { select: { id: true, reference: true, parentName: true } },
        donation: { select: { id: true, reference: true, donorName: true } },
        user: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
      take: filters.take ?? 50,
      skip: filters.skip ?? 0,
    }),
    prisma.payment.count({ where }),
  ]);

  return { items, total };
}

export type PaymentStats = {
  totalCount: number;
  totalAmountKes: number;
  byStatus: Record<PaymentStatus, { count: number; amountKes: number }>;
};

export async function getPaymentStats(): Promise<PaymentStats> {
  const [grouped, overall] = await Promise.all([
    prisma.payment.groupBy({
      by: ["status"],
      _count: { _all: true },
      _sum: { amountKes: true },
    }),
    prisma.payment.aggregate({
      _count: { _all: true },
      _sum: { amountKes: true },
    }),
  ]);

  const byStatus = {
    PENDING: { count: 0, amountKes: 0 },
    PROCESSING: { count: 0, amountKes: 0 },
    PAID: { count: 0, amountKes: 0 },
    FAILED: { count: 0, amountKes: 0 },
    CANCELLED: { count: 0, amountKes: 0 },
    REFUNDED: { count: 0, amountKes: 0 },
  } satisfies Record<PaymentStatus, { count: number; amountKes: number }>;

  for (const row of grouped) {
    byStatus[row.status] = {
      count: row._count._all,
      amountKes: row._sum.amountKes ?? 0,
    };
  }

  return {
    totalCount: overall._count._all,
    totalAmountKes: overall._sum.amountKes ?? 0,
    byStatus,
  };
}

export type PaymentPanelStats = {
  totalPaidKes: number;
  pendingCount: number;
  failedCount: number;
  bankToVerify: number;
};

export async function getPaymentPanelStats(): Promise<PaymentPanelStats> {
  const [paid, pendingCount, failedCount, bankToVerify] = await Promise.all([
    prisma.payment.aggregate({
      where: { status: "PAID" },
      _sum: { amountKes: true },
    }),
    prisma.payment.count({ where: { status: { in: ["PENDING", "PROCESSING"] } } }),
    prisma.payment.count({ where: { status: "FAILED" } }),
    prisma.payment.count({
      where: { method: "BANK", status: { in: ["PENDING", "PROCESSING"] } },
    }),
  ]);

  return {
    totalPaidKes: paid._sum.amountKes ?? 0,
    pendingCount,
    failedCount,
    bankToVerify,
  };
}

export async function getPaymentById(id: string) {
  return prisma.payment.findUnique({
    where: { id },
    include: {
      booking: { include: { service: true, therapist: true } },
      griefApplication: true,
      donation: true,
      events: { orderBy: { createdAt: "desc" } },
      verifiedBy: { select: { id: true, name: true, email: true } },
    },
  });
}
