import "server-only";

import { prisma } from "@/lib/prisma";

export type StaffNotificationType = "BOOKING" | "NEWSLETTER";

export type StaffNotification = {
  id: string;
  type: StaffNotificationType;
  title: string;
  message: string;
  href: string;
  createdAt: Date;
  unread: boolean;
};

export type StaffNotificationFeed = {
  items: StaffNotification[];
  unreadCount: number;
};

let readTableReady = false;

async function ensureReadTable() {
  if (readTableReady) return;
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "staff_notification_reads" (
      "userId" TEXT NOT NULL,
      "notificationId" TEXT NOT NULL,
      "readAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY ("userId", "notificationId")
    )
  `);
  readTableReady = true;
}

async function getInboxViewedAt(userId: string): Promise<Date | null> {
  const rows = await prisma.$queryRaw<Array<{ viewedAt: Date }>>`
    SELECT "viewedAt"
    FROM "staff_inbox_cursors"
    WHERE "userId" = ${userId}
    LIMIT 1
  `;
  return rows[0]?.viewedAt ?? null;
}

async function getReadIds(userId: string): Promise<Set<string>> {
  await ensureReadTable();
  const rows = await prisma.$queryRaw<Array<{ notificationId: string }>>`
    SELECT "notificationId"
    FROM "staff_notification_reads"
    WHERE "userId" = ${userId}
  `;
  return new Set(rows.map((row) => row.notificationId));
}

export async function getStaffNotifications(
  userId: string,
  options: { take?: number; unreadOnly?: boolean } = {},
): Promise<StaffNotificationFeed> {
  const take = options.take ?? 50;
  const fetchTake = options.unreadOnly ? Math.max(take * 4, 40) : take;

  const [viewedAt, readIds, bookings, subscribers] = await Promise.all([
    getInboxViewedAt(userId),
    getReadIds(userId),
    prisma.booking.findMany({
      orderBy: { createdAt: "desc" },
      take: fetchTake,
      select: {
        id: true,
        reference: true,
        clientName: true,
        createdAt: true,
        service: { select: { title: true } },
      },
    }),
    prisma.newsletterSubscriber.findMany({
      where: { status: "SUBSCRIBED" },
      orderBy: { createdAt: "desc" },
      take: fetchTake,
      select: { id: true, email: true, createdAt: true },
    }),
  ]);

  const isUnread = (id: string, createdAt: Date) =>
    !readIds.has(id) && (viewedAt ? createdAt.getTime() > viewedAt.getTime() : true);

  const items: StaffNotification[] = [
    ...bookings.map((booking) => {
      const id = `booking:${booking.id}`;
      return {
        id,
        type: "BOOKING" as const,
        title: "New booking",
        message: `${booking.clientName} requested ${booking.service?.title ?? "a session"} · ${booking.reference}`,
        href: `/dashboard/bookings/${booking.id}`,
        createdAt: booking.createdAt,
        unread: isUnread(id, booking.createdAt),
      };
    }),
    ...subscribers.map((subscriber) => {
      const id = `newsletter:${subscriber.id}`;
      return {
        id,
        type: "NEWSLETTER" as const,
        title: "New email subscriber",
        message: `${subscriber.email} joined the newsletter`,
        href: "/dashboard/notifications?tab=subscribers",
        createdAt: subscriber.createdAt,
        unread: isUnread(id, subscriber.createdAt),
      };
    }),
  ].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  const unreadCount = items.filter((item) => item.unread).length;
  const visible = options.unreadOnly ? items.filter((item) => item.unread) : items;

  return {
    items: visible.slice(0, take),
    unreadCount,
  };
}
