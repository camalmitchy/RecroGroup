import "server-only";

import type {
  GriefApplicationStatus,
  PaymentStatus,
  Prisma,
} from "@prisma/client";

import { prisma } from "@/lib/prisma";

export type GriefApplicationFilters = {
  status?: GriefApplicationStatus;
  paymentStatus?: PaymentStatus;
  campSessionId?: string;
  search?: string;
  take?: number;
  skip?: number;
};

function applicationWhere(
  filters: GriefApplicationFilters,
): Prisma.GriefApplicationWhereInput {
  const where: Prisma.GriefApplicationWhereInput = {};

  if (filters.status) where.status = filters.status;
  if (filters.paymentStatus) where.paymentStatus = filters.paymentStatus;
  if (filters.campSessionId) where.campSessionId = filters.campSessionId;

  const search = filters.search?.trim();
  if (search) {
    where.OR = [
      { reference: { contains: search, mode: "insensitive" } },
      { parentName: { contains: search, mode: "insensitive" } },
      { parentEmail: { contains: search, mode: "insensitive" } },
      { childName: { contains: search, mode: "insensitive" } },
    ];
  }

  return where;
}

export async function listGriefApplications(
  filters: GriefApplicationFilters = {},
) {
  const where = applicationWhere(filters);

  const [items, total] = await Promise.all([
    prisma.griefApplication.findMany({
      where,
      include: {
        campSession: { select: { id: true, name: true, startsOn: true } },
      },
      orderBy: { createdAt: "desc" },
      take: filters.take ?? 50,
      skip: filters.skip ?? 0,
    }),
    prisma.griefApplication.count({ where }),
  ]);

  return { items, total };
}

export async function getGriefApplicationById(id: string) {
  return prisma.griefApplication.findUnique({
    where: { id },
    include: {
      campSession: { include: { priceTiers: { orderBy: { sortOrder: "asc" } } } },
      payments: { orderBy: { createdAt: "desc" } },
      user: { select: { id: true, name: true, email: true } },
    },
  });
}

export async function listCampSessions() {
  return prisma.campSession.findMany({
    orderBy: { startsOn: "desc" },
    include: {
      priceTiers: { orderBy: { sortOrder: "asc" } },
      _count: { select: { applications: true } },
    },
  });
}
