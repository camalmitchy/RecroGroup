"use server";

import { revalidatePath } from "next/cache";

import { getPortalSession } from "@/features/portal/lib/session";
import { prisma } from "@/lib/prisma";
import { ensureStaffInboxTables } from "@/server/queries/notifications";
import type { ActionResult } from "@/server/result";
import { fail, failure, ok } from "@/server/result";

function revalidateInbox() {
  revalidatePath("/dashboard", "layout");
  revalidatePath("/dashboard/notifications");
}

export async function markNotificationsRead(
  notificationId?: string,
): Promise<ActionResult<{ viewedAt?: string; notificationId?: string }>> {
  try {
    const session = await getPortalSession();
    if (!session) return fail("You must be signed in to do that");

    await ensureStaffInboxTables();

    if (notificationId) {
      await prisma.$executeRaw`
        INSERT INTO "staff_notification_reads" ("userId", "notificationId")
        VALUES (${session.userId}, ${notificationId})
        ON CONFLICT ("userId", "notificationId") DO NOTHING
      `;
      revalidateInbox();
      return ok({ notificationId });
    }

    const viewedAt = new Date();
    await prisma.$executeRaw`
      INSERT INTO "staff_inbox_cursors" ("userId", "viewedAt")
      VALUES (${session.userId}, ${viewedAt})
      ON CONFLICT ("userId") DO UPDATE SET "viewedAt" = EXCLUDED."viewedAt"
    `;
    revalidateInbox();
    return ok({ viewedAt: viewedAt.toISOString() });
  } catch (error) {
    return failure("markNotificationsRead", error);
  }
}
