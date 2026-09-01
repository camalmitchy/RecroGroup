import "server-only";

import { prisma } from "@/lib/prisma";

export async function getCustomerProfile(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      phone: true,
      accountType: true,
      commsEmail: true,
      commsSms: true,
      createdAt: true,
      role: true,
    },
  });

  if (!user) return null;

  const bookings = await prisma.booking.findMany({
    where: {
      OR: [{ userId }, { clientEmail: user.email }],
    },
    orderBy: { createdAt: "desc" },
    take: 8,
    include: {
      service: { select: { title: true } },
      therapist: { select: { fullName: true } },
    },
  });

  return { user, bookings };
}
