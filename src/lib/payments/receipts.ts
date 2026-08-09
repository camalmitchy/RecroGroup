import "server-only";

import { prisma } from "@/lib/prisma";
import {
  notifyDonationReceived,
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

async function recipientFor(paymentId: string) {
  const payment = await prisma.payment.findUnique({
    where: { id: paymentId },
    include: {
      booking: true,
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

  if (payment.donationId) {
    await notifyDonationReceived({
      recipientName: name,
      recipientEmail: email,
      reference: payment.reference,
      amountKes: payment.settledAmountKes ?? payment.amountKes,
    });
    return;
  }

  await notifyPaymentSucceeded({
    recipientName: name,
    recipientEmail: email,
    reference: payment.reference,
    amountKes: payment.settledAmountKes ?? payment.amountKes,
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
