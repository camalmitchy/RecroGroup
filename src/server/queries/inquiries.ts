import "server-only";

import type { InquiryStatus, InquiryType, Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";

export type InquiryFilters = {
  type?: InquiryType;
  status?: InquiryStatus;
  search?: string;
  take?: number;
  skip?: number;
};

function inquiryWhere(filters: InquiryFilters): Prisma.InquiryWhereInput {
  const where: Prisma.InquiryWhereInput = {};

  if (filters.type) where.type = filters.type;
  if (filters.status) where.status = filters.status;

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

export async function listNewsletterSubscribers(filters: {
  status?: "SUBSCRIBED" | "UNSUBSCRIBED";
  take?: number;
  skip?: number;
} = {}) {
  const { status, take = 200, skip = 0 } = filters;
  const where = status ? { status } : {};

  const [items, total, subscribedCount] = await Promise.all([
    prisma.newsletterSubscriber.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take,
      skip,
    }),
    prisma.newsletterSubscriber.count({ where }),
    prisma.newsletterSubscriber.count({ where: { status: "SUBSCRIBED" } }),
  ]);

  return { items, total, subscribedCount };
}
