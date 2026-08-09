import "server-only";

import { prisma } from "@/lib/prisma";

export async function listServices() {
  return prisma.service.findMany({
    orderBy: [{ category: "asc" }, { title: "asc" }],
    include: { _count: { select: { bookings: true } } },
  });
}

export async function listTherapists() {
  return prisma.therapist.findMany({
    orderBy: [{ isActive: "desc" }, { fullName: "asc" }],
    include: { _count: { select: { bookings: true } } },
  });
}

export async function listFaqs() {
  return prisma.faq.findMany({
    orderBy: [{ category: "asc" }, { sortOrder: "asc" }],
  });
}

export async function listTestimonials() {
  return prisma.testimonial.findMany({ orderBy: { createdAt: "desc" } });
}

export async function listBlogPosts() {
  return prisma.blogPost.findMany({ orderBy: { createdAt: "desc" } });
}

export async function listMediaItems() {
  return prisma.mediaItem.findMany({ orderBy: { createdAt: "desc" } });
}

export type StaffMember = {
  id: string;
  name: string;
  email: string;
  role: string;
  banned: boolean;
  createdAt: Date;
};

export async function listStaff(): Promise<StaffMember[]> {
  const users = await prisma.user.findMany({
    where: { role: { in: ["admin", "receptionist"] } },
    orderBy: [{ role: "asc" }, { name: "asc" }],
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      banned: true,
      createdAt: true,
    },
  });

  return users.map((user) => ({
    ...user,
    role: user.role ?? "customer",
    banned: user.banned ?? false,
  }));
}

export type CustomerFilters = {
  search?: string;
  take?: number;
  skip?: number;
};

export async function listCustomers(filters: CustomerFilters = {}) {
  const { search, take = 100, skip = 0 } = filters;

  const where = {
    role: "customer",
    ...(search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" as const } },
            { email: { contains: search, mode: "insensitive" as const } },
            { phone: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };

  const [items, total] = await Promise.all([
    prisma.user.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take,
      skip,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        accountType: true,
        createdAt: true,
        _count: { select: { bookings: true, payments: true } },
      },
    }),
    prisma.user.count({ where }),
  ]);

  return { items, total };
}
