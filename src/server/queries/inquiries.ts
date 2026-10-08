import "server-only";

import type { InquiryStatus, InquiryType, Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";

export type InquiryFilters = {
  type?: InquiryType;
  status?: InquiryStatus;
  /** Program application forms, kept off the general messages list. */
  program?: "consortium" | "corporate" | "team-building" | "therapist";
  excludePrograms?: boolean;
  search?: string;
  take?: number;
  skip?: number;
};

const TEAM_BUILDING: Prisma.InquiryWhereInput = {
  OR: [
    { subject: { contains: "team builder", mode: "insensitive" } },
    { subject: { contains: "team-building", mode: "insensitive" } },
  ],
};

const THERAPIST_APPLICATION: Prisma.InquiryWhereInput = {
  OR: [
    { subject: { contains: "therapist application", mode: "insensitive" } },
    { subject: { contains: "facilitator application", mode: "insensitive" } },
  ],
};

const CONSORTIUM: Prisma.InquiryWhereInput = {
  subject: { contains: "consortium", mode: "insensitive" },
};

const CORPORATE_SPEAKING: Prisma.InquiryWhereInput = {
  AND: [
    {
      OR: [
        { type: "CORPORATE" },
        { subject: { contains: "corporate", mode: "insensitive" } },
      ],
    },
    { NOT: TEAM_BUILDING },
    { NOT: THERAPIST_APPLICATION },
  ],
};

const PROGRAM_INQUIRIES: Prisma.InquiryWhereInput = {
  OR: [
    CONSORTIUM,
    { type: "CORPORATE" },
    { subject: { contains: "corporate", mode: "insensitive" } },
    TEAM_BUILDING,
    THERAPIST_APPLICATION,
  ],
};

export function buildInquiryWhere(filters: InquiryFilters): Prisma.InquiryWhereInput {
  const and: Prisma.InquiryWhereInput[] = [];

  if (filters.type) and.push({ type: filters.type });
  if (filters.status) and.push({ status: filters.status });
  if (filters.program === "consortium") and.push(CONSORTIUM);
  if (filters.program === "corporate") and.push(CORPORATE_SPEAKING);
  if (filters.program === "team-building") and.push(TEAM_BUILDING);
  if (filters.program === "therapist") and.push(THERAPIST_APPLICATION);
  if (filters.excludePrograms) and.push({ NOT: PROGRAM_INQUIRIES });

  const search = filters.search?.trim();
  if (search) {
    and.push({
      OR: [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { subject: { contains: search, mode: "insensitive" } },
        { message: { contains: search, mode: "insensitive" } },
      ],
    });
  }

  return and.length > 0 ? { AND: and } : {};
}

export async function listInquiries(filters: InquiryFilters = {}) {
  const where = buildInquiryWhere(filters);

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
