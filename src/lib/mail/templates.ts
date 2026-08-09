import { format } from "date-fns";

import { formatKes } from "../payments/utils";
import type { EmailMessage } from "./types";

const SIGN_OFF = "Recro Group";

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatDateTime(value: Date) {
  return format(value, "d MMM yyyy, h:mm a");
}

function firstName(name: string) {
  const trimmed = name.trim();
  if (trimmed === "") return "there";
  return trimmed.split(/\s+/)[0];
}

type DetailRow = { label: string; value: string };

function detailsHtml(rows: DetailRow[]) {
  return rows
    .map(
      ({ label, value }) =>
        `<p style="margin:0 0 8px;font-size:15px;line-height:1.5;color:#111827;"><span style="color:#6b7280;">${escapeHtml(label)}:</span> ${escapeHtml(value)}</p>`,
    )
    .join("");
}

function detailsText(rows: DetailRow[]) {
  return rows.map(({ label, value }) => `${label}: ${value}`).join("\n");
}

function layout(options: {
  heading: string;
  greeting?: string;
  paragraphs: string[];
  details?: DetailRow[];
  cta?: { label: string; url: string };
  closing?: string;
}) {
  const { heading, greeting, paragraphs, details, cta, closing } = options;

  const body = [
    `<h1 style="margin:0 0 16px;font-size:20px;line-height:1.3;font-weight:600;color:#111827;">${escapeHtml(heading)}</h1>`,
    greeting
      ? `<p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#374151;">${escapeHtml(greeting)}</p>`
      : "",
    ...paragraphs.map(
      (text) =>
        `<p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#374151;">${escapeHtml(text)}</p>`,
    ),
    details && details.length > 0
      ? `<div style="margin:0 0 20px;padding:16px;background:#f9fafb;border-radius:8px;">${detailsHtml(details)}</div>`
      : "",
    cta
      ? `<p style="margin:0 0 20px;"><a href="${escapeHtml(cta.url)}" style="display:inline-block;padding:12px 20px;background:#111827;color:#ffffff;text-decoration:none;border-radius:8px;font-size:15px;font-weight:500;">${escapeHtml(cta.label)}</a></p>`
      : "",
    closing
      ? `<p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#374151;">${escapeHtml(closing)}</p>`
      : "",
    `<p style="margin:24px 0 0;font-size:15px;line-height:1.6;color:#374151;">${escapeHtml(SIGN_OFF)}</p>`,
  ]
    .filter((chunk) => chunk !== "")
    .join("");

  const html = `<div style="margin:0;padding:24px 16px;background:#f3f4f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;"><div style="max-width:560px;margin:0 auto;padding:28px 24px;background:#ffffff;border-radius:12px;">${body}</div></div>`;

  const text = [
    heading,
    "",
    greeting,
    greeting ? "" : undefined,
    ...paragraphs.flatMap((paragraph) => [paragraph, ""]),
    details && details.length > 0 ? detailsText(details) : undefined,
    details && details.length > 0 ? "" : undefined,
    cta ? `${cta.label}: ${cta.url}` : undefined,
    cta ? "" : undefined,
    closing,
    closing ? "" : undefined,
    SIGN_OFF,
  ]
    .filter((line): line is string => line !== undefined)
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  return { html, text };
}

export function paymentReceipt(input: {
  recipientName: string;
  recipientEmail: string;
  reference: string;
  amountKes: number;
  method: string;
  purposeLabel: string;
  paidAt: Date;
}): EmailMessage {
  const { html, text } = layout({
    heading: "Payment received",
    greeting: `Hello ${firstName(input.recipientName)},`,
    paragraphs: [
      `We have received your payment of ${formatKes(input.amountKes)} for ${input.purposeLabel}. This email is your receipt.`,
    ],
    details: [
      { label: "Reference", value: input.reference },
      { label: "Amount", value: formatKes(input.amountKes) },
      { label: "Method", value: input.method },
      { label: "Paid on", value: formatDateTime(input.paidAt) },
    ],
    closing: "Keep this reference for your records. Reply to this email if anything looks wrong.",
  });

  return {
    to: { email: input.recipientEmail, name: input.recipientName },
    subject: `Payment receipt ${input.reference}`,
    html,
    text,
  };
}

export function paymentFailed(input: {
  recipientName: string;
  recipientEmail: string;
  reference: string;
  amountKes: number;
  reason: string;
}): EmailMessage {
  const { html, text } = layout({
    heading: "Your payment did not go through",
    greeting: `Hello ${firstName(input.recipientName)},`,
    paragraphs: [
      `We were unable to complete your payment of ${formatKes(input.amountKes)}. No money has been taken from your account.`,
      "You can try again when you are ready, or reply to this email and we will help you sort it out.",
    ],
    details: [
      { label: "Reference", value: input.reference },
      { label: "Amount", value: formatKes(input.amountKes) },
      { label: "Reason", value: input.reason },
    ],
  });

  return {
    to: { email: input.recipientEmail, name: input.recipientName },
    subject: `Payment unsuccessful ${input.reference}`,
    html,
    text,
  };
}

export function bookingConfirmation(input: {
  recipientName: string;
  recipientEmail: string;
  reference: string;
  serviceTitle: string;
  scheduledFor: Date | null;
  amountKes: number;
  depositKes: number;
  balanceKes: number;
}): EmailMessage {
  const details: DetailRow[] = [
    { label: "Reference", value: input.reference },
    { label: "Service", value: input.serviceTitle },
  ];

  if (input.scheduledFor) {
    details.push({ label: "Session", value: formatDateTime(input.scheduledFor) });
  }

  details.push(
    { label: "Total", value: formatKes(input.amountKes) },
    { label: "Deposit paid", value: formatKes(input.depositKes) },
    { label: "Balance", value: formatKes(input.balanceKes) },
  );

  const paragraphs = [
    input.scheduledFor
      ? `Your booking for ${input.serviceTitle} is confirmed for ${formatDateTime(input.scheduledFor)}.`
      : `Your booking for ${input.serviceTitle} is confirmed. We will be in touch shortly to agree on a time that works for you.`,
  ];

  if (input.balanceKes > 0) {
    paragraphs.push(
      `A balance of ${formatKes(input.balanceKes)} remains and can be settled before or on the day of your session.`,
    );
  }

  const { html, text } = layout({
    heading: "Your booking is confirmed",
    greeting: `Hello ${firstName(input.recipientName)},`,
    paragraphs,
    details,
    closing: "If you need to move or cancel your session, reply to this email and we will make the change.",
  });

  return {
    to: { email: input.recipientEmail, name: input.recipientName },
    subject: `Booking confirmed ${input.reference}`,
    html,
    text,
  };
}

export function bookingBalanceReminder(input: {
  recipientName: string;
  recipientEmail: string;
  reference: string;
  serviceTitle: string;
  balanceKes: number;
  payUrl: string;
}): EmailMessage {
  const { html, text } = layout({
    heading: "A balance is outstanding on your booking",
    greeting: `Hello ${firstName(input.recipientName)},`,
    paragraphs: [
      `A balance of ${formatKes(input.balanceKes)} remains on your booking for ${input.serviceTitle}.`,
      "You can settle it using the link below, or pay in person at your session.",
    ],
    details: [
      { label: "Reference", value: input.reference },
      { label: "Service", value: input.serviceTitle },
      { label: "Balance", value: formatKes(input.balanceKes) },
    ],
    cta: { label: "Pay balance", url: input.payUrl },
  });

  return {
    to: { email: input.recipientEmail, name: input.recipientName },
    subject: `Balance due on booking ${input.reference}`,
    html,
    text,
  };
}

export function griefCampApplicationReceived(input: {
  recipientName: string;
  recipientEmail: string;
  reference: string;
  childName: string;
  campName: string;
  amountKes: number;
}): EmailMessage {
  const { html, text } = layout({
    heading: "We have received your application",
    greeting: `Hello ${firstName(input.recipientName)},`,
    paragraphs: [
      `Thank you for applying for a place for ${input.childName} at ${input.campName}. We know this is a tender step to take, and we are grateful for the trust it carries.`,
      "Our team will review the application and write to you with the next steps. If you have any questions in the meantime, you can reply to this email.",
    ],
    details: [
      { label: "Reference", value: input.reference },
      { label: "Child", value: input.childName },
      { label: "Camp", value: input.campName },
      { label: "Fee", value: formatKes(input.amountKes) },
    ],
  });

  return {
    to: { email: input.recipientEmail, name: input.recipientName },
    subject: `Application received ${input.reference}`,
    html,
    text,
  };
}

export function donationThankYou(input: {
  recipientName: string;
  recipientEmail: string;
  reference: string;
  amountKes: number;
}): EmailMessage {
  const { html, text } = layout({
    heading: "Thank you for your gift",
    greeting: `Hello ${firstName(input.recipientName)},`,
    paragraphs: [
      `We have received your donation of ${formatKes(input.amountKes)}. Your support helps us keep grief care within reach of the families who need it.`,
      "This email serves as your receipt.",
    ],
    details: [
      { label: "Reference", value: input.reference },
      { label: "Amount", value: formatKes(input.amountKes) },
    ],
  });

  return {
    to: { email: input.recipientEmail, name: input.recipientName },
    subject: `Thank you for your donation ${input.reference}`,
    html,
    text,
  };
}

export function staffPaymentAlert(input: {
  recipientEmail: string;
  reference: string;
  amountKes: number;
  purposeLabel: string;
  customerName: string;
}): EmailMessage {
  const { html, text } = layout({
    heading: "New payment received",
    paragraphs: [`${input.customerName} has paid ${formatKes(input.amountKes)} for ${input.purposeLabel}.`],
    details: [
      { label: "Reference", value: input.reference },
      { label: "Customer", value: input.customerName },
      { label: "Amount", value: formatKes(input.amountKes) },
      { label: "Purpose", value: input.purposeLabel },
    ],
  });

  return {
    to: input.recipientEmail,
    subject: `Payment ${input.reference} — ${formatKes(input.amountKes)}`,
    html,
    text,
  };
}
