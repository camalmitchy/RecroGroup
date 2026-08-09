"use server";

import { revalidatePath } from "next/cache";

import type { PaymentMethod } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { resolveBookingChargeAmount } from "@/lib/payments/pricing";
import { createPendingPayment } from "@/lib/payments/service";
import { normalizePhone } from "@/lib/payments/utils";
import { AuthorizationError, requireStaff } from "@/server/authz";
import type { ActionResult } from "@/server/result";
import { fail, failure, ok } from "@/server/result";

export type PaymentActionResult = { paymentId: string };

export type BookingBalanceResult = {
  paymentId: string;
  reference: string;
  amountKes: number;
};

export async function requestBookingBalance(
  bookingId: string,
  method: PaymentMethod,
  phone?: string,
): Promise<ActionResult<BookingBalanceResult>> {
  try {
    const staff = await requireStaff();

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      select: {
        id: true,
        userId: true,
        clientPhone: true,
        amountKes: true,
        depositKes: true,
        amountPaidKes: true,
      },
    });

    if (!booking) return fail("Booking not found");

    const charge = resolveBookingChargeAmount(booking);
    if (charge.amountKes <= 0) return fail("This booking is fully paid");

    const contact = phone ?? booking.clientPhone;
    if (method === "MPESA" && !contact) {
      return fail("An M-Pesa number is required for this request");
    }

    const payment = await createPendingPayment({
      target: { kind: "booking", bookingId: booking.id },
      userId: booking.userId,
      method,
      provider: method === "MPESA" ? "MPESA_DARAJA" : "MANUAL",
      purpose: charge.purpose,
      amountKes: charge.amountKes,
      phone: contact ? safeNormalize(contact) : null,
      notes: `Requested by ${staff.email}`,
    });

    revalidatePath("/dashboard/bookings");
    revalidatePath("/dashboard/payments");

    return ok({
      paymentId: payment.id,
      reference: payment.reference,
      amountKes: payment.amountKes,
    });
  } catch (error) {
    if (error instanceof AuthorizationError) return fail(error.message);
    return failure("requestBookingBalance", error);
  }
}

function safeNormalize(phone: string) {
  try {
    return normalizePhone(phone);
  } catch {
    return phone;
  }
}

export async function markPaymentPaid(
  paymentId: string,
): Promise<ActionResult<PaymentActionResult>> {
  try {
    const staff = await requireStaff();

    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      select: { id: true, status: true, amountKes: true, bookingId: true },
    });

    if (!payment) return fail("Payment not found");
    if (payment.status === "PAID") return ok({ paymentId: payment.id });

    await prisma.$transaction(async (tx) => {
      await tx.payment.update({
        where: { id: payment.id },
        data: {
          status: "PAID",
          paidAt: new Date(),
          verifiedById: staff.userId,
          verifiedAt: new Date(),
          settledAmountKes: payment.amountKes,
          failureReason: null,
        },
      });

      if (!payment.bookingId) return;

      const booking = await tx.booking.update({
        where: { id: payment.bookingId },
        data: { amountPaidKes: { increment: payment.amountKes } },
        select: { id: true, amountKes: true, amountPaidKes: true },
      });

      await tx.booking.update({
        where: { id: booking.id },
        data: {
          paymentStatus:
            booking.amountPaidKes >= (booking.amountKes ?? 0)
              ? "PAID"
              : "PROCESSING",
        },
      });
    });

    revalidatePath("/dashboard/payments");
    revalidatePath("/dashboard/bookings");
    revalidatePath("/dashboard");

    return ok({ paymentId: payment.id });
  } catch (error) {
    if (error instanceof AuthorizationError) return fail(error.message);
    return failure("markPaymentPaid", error);
  }
}

export async function markPaymentFailed(
  paymentId: string,
  reason: string,
): Promise<ActionResult<PaymentActionResult>> {
  try {
    const staff = await requireStaff();

    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      select: { id: true, status: true },
    });

    if (!payment) return fail("Payment not found");
    if (payment.status === "PAID") {
      return fail("Reverse a settled payment with a refund instead");
    }

    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: "FAILED",
        failureReason: reason,
        verifiedById: staff.userId,
        verifiedAt: new Date(),
      },
    });

    revalidatePath("/dashboard/payments");
    revalidatePath("/dashboard");

    return ok({ paymentId: payment.id });
  } catch (error) {
    if (error instanceof AuthorizationError) return fail(error.message);
    return failure("markPaymentFailed", error);
  }
}

export type BankTransferResult = {
  paymentId: string;
  reference: string;
  amountKes: number;
};

export async function recordBankTransfer(input: {
  bookingId: string;
  bankReference?: string;
}): Promise<ActionResult<BankTransferResult>> {
  try {
    const booking = await prisma.booking.findUnique({
      where: { id: input.bookingId },
    });

    if (!booking) return fail("Booking not found");

    const charge = resolveBookingChargeAmount(booking);
    if (charge.amountKes <= 0) return fail("This booking is already paid");

    const payment = await createPendingPayment({
      target: { kind: "booking", bookingId: booking.id },
      userId: booking.userId,
      method: "BANK",
      provider: "MANUAL",
      purpose: charge.purpose,
      amountKes: charge.amountKes,
      notes: input.bankReference
        ? `Bank reference supplied by client: ${input.bankReference}`
        : null,
    });

    revalidatePath("/dashboard/payments");

    return ok({
      paymentId: payment.id,
      reference: payment.reference,
      amountKes: payment.amountKes,
    });
  } catch (error) {
    return failure("recordBankTransfer", error);
  }
}

export async function recordDonationBankTransfer(input: {
  donationId: string;
  bankReference?: string;
}): Promise<ActionResult<BankTransferResult>> {
  try {
    const donation = await prisma.donation.findUnique({
      where: { id: input.donationId },
    });

    if (!donation) return fail("Donation not found");
    if (donation.paymentStatus === "PAID") {
      return fail("This donation is already paid");
    }

    const payment = await createPendingPayment({
      target: { kind: "donation", donationId: donation.id },
      userId: donation.userId,
      method: "BANK",
      provider: "MANUAL",
      purpose: "DONATION",
      amountKes: donation.amountKes,
      notes: input.bankReference
        ? `Bank reference supplied by donor: ${input.bankReference}`
        : null,
    });

    revalidatePath("/dashboard/payments");

    return ok({
      paymentId: payment.id,
      reference: payment.reference,
      amountKes: payment.amountKes,
    });
  } catch (error) {
    return failure("recordDonationBankTransfer", error);
  }
}
