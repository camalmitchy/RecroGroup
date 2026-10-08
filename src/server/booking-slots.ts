// A paid booking owns its weekday + start time in Nairobi until it is
// COMPLETED or CANCELLED. "Free time" completes the booking; it does not
// delete it. See HANDOVER.md.
import type { Prisma, PrismaClient } from "@prisma/client";

import { TIME_SLOTS } from "@/features/public/booking/lib/schedule";
import {
  SLOT_TAKEN_MESSAGE,
  isStartTaken,
  nairobiDate,
  nairobiWeekday,
  parseSlotMinutes,
  sessionMinutes,
  slotWinners,
  type HeldSlot,
  type SlotClaim,
} from "@/features/public/booking/lib/slots";
import { ensurePaymentsSchema } from "@/lib/payments/ensure-schema";
import { prisma } from "@/lib/prisma";

type SlotClient = Prisma.TransactionClient | PrismaClient;

export function ensureSlotColumns() {
  return ensurePaymentsSchema();
}

const activePaidWhere = {
  status: { notIn: ["CANCELLED", "COMPLETED"] as ("CANCELLED" | "COMPLETED")[] },
  preferredDate: { not: null },
  preferredTime: { not: null },
  payments: { some: { status: "PAID" as const, method: "MPESA" as const } },
};

async function loadClaims(db: SlotClient) {
  const rows = await db.booking.findMany({
    where: activePaidWhere,
    select: {
      id: true,
      preferredDate: true,
      preferredTime: true,
      durationMin: true,
      rescheduleReason: true,
      service: { select: { durationMin: true } },
      payments: {
        where: { status: "PAID", method: "MPESA" },
        select: { paidAt: true, createdAt: true },
      },
    },
  });

  const claims: SlotClaim[] = rows.flatMap((row) => {
    if (!row.preferredDate || !row.preferredTime) return [];
    const startMin = parseSlotMinutes(row.preferredTime);
    if (startMin === null) return [];
    const paidAtMs = Math.min(
      ...row.payments.map((payment) =>
        (payment.paidAt ?? payment.createdAt).getTime(),
      ),
    );
    if (!Number.isFinite(paidAtMs)) return [];
    return [
      {
        id: row.id,
        weekday: nairobiWeekday(row.preferredDate),
        startMin,
        durationMin: sessionMinutes(row.durationMin, row.service?.durationMin),
        paidAtMs,
      },
    ];
  });

  return { rows, claims };
}

export async function reconcileBookingSlots(db: SlotClient = prisma) {
  const { rows, claims } = await loadClaims(db);
  const { hold, release } = slotWinners(claims);
  const durationById = new Map(claims.map((claim) => [claim.id, claim.durationMin]));
  const reasonById = new Map(rows.map((row) => [row.id, row.rescheduleReason]));

  const writes = [];
  for (const id of release) {
    if (reasonById.get(id) !== SLOT_TAKEN_MESSAGE) {
      writes.push(
        db.booking.update({
          where: { id },
          data: { rescheduleReason: SLOT_TAKEN_MESSAGE },
        }),
      );
    }
  }
  for (const id of hold) {
    const durationMin = durationById.get(id);
    if (reasonById.get(id) || rows.find((row) => row.id === id)?.durationMin !== durationMin) {
      writes.push(
        db.booking.update({
          where: { id },
          data: { rescheduleReason: null, durationMin },
        }),
      );
    }
  }
  await Promise.all(writes);
  return claims;
}

function holders(claims: SlotClaim[], ignoreBookingId?: string): HeldSlot[] {
  const { hold } = slotWinners(claims);
  return claims
    .filter((claim) => hold.has(claim.id) && claim.id !== ignoreBookingId)
    .map(({ weekday, startMin, durationMin }) => ({
      weekday,
      startMin,
      durationMin,
    }));
}

export async function getSlotAvailability(date: string, durationMin: number) {
  const when = nairobiDate(date);
  if (!when) return TIME_SLOTS.map((time) => ({ time, taken: true }));

  await ensureSlotColumns();
  const claims = await reconcileBookingSlots();
  const held = holders(claims);
  const weekday = nairobiWeekday(when);
  const minutes = sessionMinutes(durationMin, null);

  return TIME_SLOTS.map((time) => ({
    time,
    taken: isStartTaken({
      weekday,
      startLabel: time,
      durationMin: minutes,
      held,
    }),
  }));
}

export async function isSlotAvailable(input: {
  date: Date;
  time: string;
  durationMin: number;
  ignoreBookingId?: string;
}) {
  await ensureSlotColumns();
  const claims = await reconcileBookingSlots();
  return !isStartTaken({
    weekday: nairobiWeekday(input.date),
    startLabel: input.time,
    durationMin: input.durationMin,
    held: holders(claims, input.ignoreBookingId),
  });
}
