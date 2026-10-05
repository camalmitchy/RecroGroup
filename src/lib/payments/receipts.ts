import "server-only";

import { prisma } from "@/lib/prisma";
import {
  notifyDonationReceived,
  notifyPaidBooking,
  notifyPaymentFailed,
  notifyPaymentSucceeded,
} from "@/lib/mail/notifications";

const PURPOSE_LABELS: Record<string, string> = {
  BOOKING_DEPOSIT: "Booking commitment fee",
  BOOKING_BALANCE: "Booking balance",
  BOOKING_FULL: "Booking payment",
  GRIEF_CAMP_FEE: "Grief camp fee",
  DONATION: "Donation",
  MERCHANDISE: "Merchandise",
  OTHER: "Payment",
};

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Africa/Nairobi",
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
});

function formatBookingDate(value: Date | null | undefined) {
  if (!value) return null;
  return dateFormatter.format(value);
}

async function recipientFor(paymentId: string) {
  const payment = await prisma.payment.findUnique({
    where: { id: paymentId },
    include: {
      booking: { include: { service: { select: { title: true } } } },
      griefApplication: true,
      donation: true,
      user: true,
    },
  });

  if (!payment) return null;

  const name =
    payment.booking?.clientName ??
    payment.griefApplication?.parentName ??
    payment.donation?.donorName ??
    payment.user?.name ??
    "there";

  const email =
    payment.booking?.clientEmail ??
    payment.griefApplication?.parentEmail ??
    payment.donation?.donorEmail ??
    payment.user?.email ??
    null;

  return { payment, name, email };
}

export async function sendPaymentReceipt(paymentId: string) {
  const resolved = await recipientFor(paymentId);
  if (!resolved?.email) return;

  const { payment, name, email } = resolved;
  const amountKes = payment.settledAmountKes ?? payment.amountKes;

  if (payment.donationId) {
    await notifyDonationReceived({
      recipientName: name,
      recipientEmail: email,
      reference: payment.reference,
      amountKes,
    });
    return;
  }

  if (payment.booking) {
    const total = payment.booking.amountKes ?? amountKes;
    const paid = payment.booking.amountPaidKes || amountKes;
    await notifyPaidBooking({
      recipientName: name,
      recipientEmail: email,
      clientPhone: payment.booking.clientPhone,
      reference: payment.booking.reference,
      serviceTitle: payment.booking.service?.title ?? "Therapy session",
      preferredDateLabel: formatBookingDate(payment.booking.preferredDate),
      preferredTime: payment.booking.preferredTime,
      amountKes: total,
      depositKes: paid,
      balanceKes: Math.max(0, total - paid),
    });
    return;
  }

  await notifyPaymentSucceeded({
    recipientName: name,
    recipientEmail: email,
    reference: payment.reference,
    amountKes,
    method: payment.method,
    purposeLabel: PURPOSE_LABELS[payment.purpose] ?? "Payment",
    paidAt: payment.paidAt ?? new Date(),
  });
}

export async function sendPaymentFailureNotice(paymentId: string) {
  const resolved = await recipientFor(paymentId);
  if (!resolved?.email) return;

  const { payment, name, email } = resolved;

  await notifyPaymentFailed({
    recipientName: name,
    recipientEmail: email,
    reference: payment.reference,
    amountKes: payment.amountKes,
    reason: payment.failureReason ?? "The payment did not complete",
  });
}
