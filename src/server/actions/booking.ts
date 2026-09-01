"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { notifyBookingCreated } from "@/lib/mail/notifications";
import { resolveServicePrice } from "@/lib/payments/pricing";
import { generateReference, normalizePhone } from "@/lib/payments/utils";
import { getOptionalSession } from "@/server/authz";
import type { ActionResult } from "@/server/result";
import { fail, failure, invalid, ok } from "@/server/result";
import type { BookingInput } from "@/server/validation/booking";
import { BOOKABLE_SERVICE_SLUGS, bookingSchema } from "@/server/validation/booking";

export type CreateBookingResult = {
  bookingId: string;
  reference: string;
  totalKes: number;
  depositKes: number;
  balanceKes: number;
};

export async function createBooking(
  input: BookingInput,
): Promise<ActionResult<CreateBookingResult>> {
  const parsed = bookingSchema.safeParse(input);
  if (!parsed.success) return invalid(parsed.error);

  const values = parsed.data;

  try {
    if (
      !BOOKABLE_SERVICE_SLUGS.includes(
        values.serviceSlug as (typeof BOOKABLE_SERVICE_SLUGS)[number],
      )
    ) {
      return fail("That service is booked through a different form", {
        serviceSlug: ["Choose a therapy session"],
      });
    }

    const price = await resolveServicePrice(values.serviceSlug);
    const session = await getOptionalSession();

    const therapist = values.therapistId
      ? await prisma.therapist.findFirst({
          where: { id: values.therapistId, isActive: true },
          select: { id: true },
        })
      : null;

    const booking = await prisma.booking.create({
      data: {
        reference: generateReference("RB"),
        userId: session?.userId ?? null,
        serviceId: price.serviceId,
        therapistId: therapist?.id ?? null,
        clientName: values.clientName,
        clientEmail: values.clientEmail,
        clientPhone: normalizePhone(values.clientPhone),
        preferredDate: values.preferredDate,
        preferredTime: values.preferredTime,
        sessionMode: values.sessionMode,
        notes: values.notes ?? null,
        amountKes: price.totalKes,
        depositKes: price.depositKes,
        amountPaidKes: 0,
      },
      select: { id: true, reference: true },
    });

    await notifyBookingCreated({
      recipientName: values.clientName,
      recipientEmail: values.clientEmail,
      reference: booking.reference,
      serviceTitle: price.title,
      scheduledFor: combineDateAndTime(values.preferredDate, values.preferredTime),
      amountKes: price.totalKes,
      depositKes: price.depositKes,
      balanceKes: price.balanceKes,
    });

    revalidatePath("/dashboard/bookings");
    revalidatePath("/dashboard");

    return ok({
      bookingId: booking.id,
      reference: booking.reference,
      totalKes: price.totalKes,
      depositKes: price.depositKes,
      balanceKes: price.balanceKes,
    });
  } catch (error) {
    return failure("createBooking", error);
  }
}

function combineDateAndTime(date: Date, time: string) {
  const match = /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i.exec(time.trim());
  const scheduled = new Date(date);
  if (!match) return scheduled;

  let hours = Number(match[1]);
  const minutes = Number(match[2]);
  const meridiem = match[3].toUpperCase();
  if (meridiem === "PM" && hours < 12) hours += 12;
  if (meridiem === "AM" && hours === 12) hours = 0;
  scheduled.setHours(hours, minutes, 0, 0);
  return scheduled;
}
