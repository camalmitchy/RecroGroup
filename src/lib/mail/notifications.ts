import "server-only";

import { mailConfig, sendEmail } from "./index";
import {
  bookingBalanceReminder,
  bookingConfirmation,
  donationThankYou,
  griefCampApplicationReceived,
  paymentFailed,
  paymentReceipt,
  staffPaymentAlert,
} from "./templates";

async function dispatch(label: string, run: () => Promise<unknown>) {
  try {
    await run();
  } catch (error) {
    console.error(`[mail] ${label} notification failed`, {
      error: error instanceof Error ? error.message : error,
    });
  }
}

export async function notifyPaymentSucceeded(input: {
  recipientName: string;
  recipientEmail: string;
  reference: string;
  amountKes: number;
  method: string;
  purposeLabel: string;
  paidAt: Date;
  notifyStaff?: boolean;
}): Promise<void> {
  await dispatch("paymentSucceeded", async () => {
    await sendEmail(paymentReceipt(input));

    const staffAddress = mailConfig.staffAddress;
    if (input.notifyStaff !== false && staffAddress) {
      await sendEmail(
        staffPaymentAlert({
          recipientEmail: staffAddress,
          reference: input.reference,
          amountKes: input.amountKes,
          purposeLabel: input.purposeLabel,
          customerName: input.recipientName,
        }),
      );
    }
  });
}

export async function notifyPaymentFailed(input: {
  recipientName: string;
  recipientEmail: string;
  reference: string;
  amountKes: number;
  reason: string;
}): Promise<void> {
  await dispatch("paymentFailed", () => sendEmail(paymentFailed(input)));
}

export async function notifyBookingCreated(input: {
  recipientName: string;
  recipientEmail: string;
  reference: string;
  serviceTitle: string;
  scheduledFor: Date | null;
  amountKes: number;
  depositKes: number;
  balanceKes: number;
}): Promise<void> {
  await dispatch("bookingCreated", () => sendEmail(bookingConfirmation(input)));
}

export async function notifyBookingBalanceDue(input: {
  recipientName: string;
  recipientEmail: string;
  reference: string;
  serviceTitle: string;
  balanceKes: number;
  payUrl: string;
}): Promise<void> {
  await dispatch("bookingBalanceDue", () => sendEmail(bookingBalanceReminder(input)));
}

export async function notifyGriefApplicationReceived(input: {
  recipientName: string;
  recipientEmail: string;
  reference: string;
  childName: string;
  campName: string;
  amountKes: number;
}): Promise<void> {
  await dispatch("griefApplicationReceived", () => sendEmail(griefCampApplicationReceived(input)));
}

export async function notifyDonationReceived(input: {
  recipientName: string;
  recipientEmail: string;
  reference: string;
  amountKes: number;
}): Promise<void> {
  await dispatch("donationReceived", () => sendEmail(donationThankYou(input)));
}
