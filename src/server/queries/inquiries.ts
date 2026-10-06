import "server-only";

import type { InquiryStatus, InquiryType, Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";

export type InquiryFilters = {
  type?: InquiryType;
  status?: InquiryStatus;
  /** Program application forms, kept off the general messages list. */
  program?: "consortium" | "corporate";
  excludePrograms?: boolean;
  search?: string;
  take?: number;
  skip?: number;
};

const PROGRAM_INQUIRIES: Prisma.InquiryWhereInput = {
  OR: [
    { subject: { contains: "consortium", mode: "insensitive" } },
    { type: "CORPORATE" },
    { subject: { contains: "corporate", mode: "insensitive" } },
  ],
};

function inquiryWhere(filters: InquiryFilters): Prisma.InquiryWhereInput {
  const where: Prisma.InquiryWhereInput = {};

  if (filters.type) where.type = filters.type;
  if (filters.status) where.status = filters.status;
  if (filters.program === "consortium") {
    where.subject = { contains: "consortium", mode: "insensitive" };
  }
  if (filters.program === "corporate") {
    where.OR = [
      { type: "CORPORATE" },
      { subject: { contains: "corporate", mode: "insensitive" } },
    ];
  }
  if (filters.excludePrograms) where.NOT = PROGRAM_INQUIRIES;

  const search = filters.search?.trim();
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
      { subject: { contains: search, mode: "insensitive" } },
      { message: { contains: search, mode: "insensitive" } },
    ];
  }

  return where;
}

export async function listInquiries(filters: InquiryFilters = {}) {
  const where = inquiryWhere(filters);

  const [items, total, unread] = await Promise.all([
    prisma.inquiry.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: filters.take ?? 50,
      skip: filters.skip ?? 0,
    }),
    prisma.inquiry.count({ where }),
    prisma.inquiry.count({ where: { status: "NEW" } }),
  ]);

  return { items, total, newCount: unread };
}

export async function getInquiryById(id: string) {
  return prisma.inquiry.findUnique({ where: { id } });
}
