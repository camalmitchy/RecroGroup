"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
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

    revalidatePath("/dashboard/bookings");
    revalidatePath("/dashboard/notifications");
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
