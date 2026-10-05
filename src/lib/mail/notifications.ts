import "server-only";

import { mailConfig, sendEmail } from "./index";
import {
  bookingBalanceReminder,
  bookingConfirmation,
  donationThankYou,
  griefCampApplicationReceived,
  paymentFailed,
  paymentReceipt,
  staffBookingAlert,
  staffInquiryAlert,
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

    const staffAddresses = mailConfig.staffAddresses;
    if (input.notifyStaff !== false) {
      await Promise.all(
        staffAddresses.map((recipientEmail) =>
          sendEmail(
            staffPaymentAlert({
              recipientEmail,
              reference: input.reference,
              amountKes: input.amountKes,
              purposeLabel: input.purposeLabel,
              customerName: input.recipientName,
            }),
          ),
        ),
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

export async function notifyPaidBooking(input: {
  recipientName: string;
  recipientEmail: string;
  clientPhone?: string | null;
  reference: string;
  serviceTitle: string;
  preferredDateLabel?: string | null;
  preferredTime?: string | null;
  amountKes: number;
  depositKes: number;
  balanceKes: number;
}): Promise<void> {
  await dispatch("paidBooking", async () => {
    await sendEmail(
      bookingConfirmation({
        ...input,
        scheduledFor: null,
        paid: true,
      }),
    );

    await Promise.all(
      mailConfig.staffAddresses.map((recipientEmail) =>
        sendEmail(
          staffBookingAlert({
            recipientEmail,
            reference: input.reference,
            clientName: input.recipientName,
            clientEmail: input.recipientEmail,
            clientPhone: input.clientPhone,
            serviceTitle: input.serviceTitle,
            preferredDateLabel: input.preferredDateLabel,
            preferredTime: input.preferredTime,
            amountPaidKes: input.depositKes,
            amountKes: input.amountKes,
          }),
        ),
      ),
    );
  });
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

export async function notifyInquiryReceived(input: {
  name: string;
  email: string;
  phone?: string | null;
  subject?: string | null;
  type: string;
  message: string;
}): Promise<void> {
  await dispatch("inquiryReceived", async () => {
    const staffAddresses = mailConfig.staffAddresses;
    await Promise.all(
      staffAddresses.map((recipientEmail) =>
        sendEmail(staffInquiryAlert({ recipientEmail, ...input })),
      ),
    );
  });
}

export async function notifyDonationReceived(input: {
  recipientName: string;
  recipientEmail: string;
  reference: string;
  amountKes: number;
}): Promise<void> {
  await dispatch("donationReceived", () => sendEmail(donationThankYou(input)));
}
