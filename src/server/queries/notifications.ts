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

const EMPTY_FEED: StaffNotificationFeed = { items: [], unreadCount: 0 };

let tablesReady = false;

export async function ensureStaffInboxTables() {
  if (tablesReady) return;

  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "staff_inbox_cursors" (
      "userId" TEXT NOT NULL,
      "viewedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY ("userId")
    )
  `);
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "staff_notification_reads" (
      "userId" TEXT NOT NULL,
      "notificationId" TEXT NOT NULL,
      "readAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY ("userId", "notificationId")
    )
  `);

  tablesReady = true;
}

async function getInboxViewedAt(userId: string): Promise<Date | null> {
  try {
    await ensureStaffInboxTables();
    const rows = await prisma.$queryRaw<Array<{ viewedAt: Date }>>`
      SELECT "viewedAt"
      FROM "staff_inbox_cursors"
      WHERE "userId" = ${userId}
      LIMIT 1
    `;
    return rows[0]?.viewedAt ?? null;
  } catch (error) {
    console.error("[getInboxViewedAt]", error);
    return null;
  }
}

async function getReadIds(userId: string): Promise<Set<string>> {
  try {
    await ensureStaffInboxTables();
    const rows = await prisma.$queryRaw<Array<{ notificationId: string }>>`
      SELECT "notificationId"
      FROM "staff_notification_reads"
      WHERE "userId" = ${userId}
    `;
    return new Set(rows.map((row) => row.notificationId));
  } catch (error) {
    console.error("[getReadIds]", error);
    return new Set();
  }
}

export async function getStaffNotifications(
  userId: string,
  options: { take?: number; unreadOnly?: boolean } = {},
): Promise<StaffNotificationFeed> {
  try {
    const take = options.take ?? 50;
    const fetchTake = options.unreadOnly ? Math.max(take * 4, 40) : take;

    const [viewedAt, readIds, bookings, subscribers] = await Promise.all([
      getInboxViewedAt(userId),
      getReadIds(userId),
      prisma.booking
        .findMany({
          orderBy: { createdAt: "desc" },
          take: fetchTake,
          select: {
            id: true,
            reference: true,
            clientName: true,
            createdAt: true,
            service: { select: { title: true } },
          },
        })
        .catch((error) => {
          console.error("[getStaffNotifications.bookings]", error);
          return [];
        }),
      prisma.newsletterSubscriber
        .findMany({
          where: { status: "SUBSCRIBED" },
          orderBy: { createdAt: "desc" },
          take: fetchTake,
          select: { id: true, email: true, createdAt: true },
        })
        .catch((error) => {
          console.error("[getStaffNotifications.subscribers]", error);
          return [];
        }),
    ]);

    const isUnread = (id: string, createdAt: Date) =>
      !readIds.has(id) &&
      (viewedAt ? createdAt.getTime() > viewedAt.getTime() : true);

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
    const visible = options.unreadOnly
      ? items.filter((item) => item.unread)
      : items;

    return {
      items: visible.slice(0, take),
      unreadCount,
    };
  } catch (error) {
    console.error("[getStaffNotifications]", error);
    return EMPTY_FEED;
  }
}
