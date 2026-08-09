"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { resolveServicePrice } from "@/lib/payments/pricing";
import { generateReference, normalizePhone } from "@/lib/payments/utils";
import { getOptionalSession } from "@/server/authz";
import type { ActionResult } from "@/server/result";
import { failure, invalid, ok } from "@/server/result";
import type { BookingInput } from "@/server/validation/booking";
import { bookingSchema } from "@/server/validation/booking";

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
    const price = await resolveServicePrice(values.serviceSlug);
    const session = await getOptionalSession();

    const booking = await prisma.booking.create({
      data: {
        reference: generateReference("RB"),
        userId: session?.userId ?? null,
        serviceId: price.serviceId,
        therapistId: values.therapistId ?? null,
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
