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
    { label: "Commitment fee", value: formatKes(input.depositKes) },
    { label: "Balance at session", value: formatKes(input.balanceKes) },
  );

  const paragraphs = [
    input.scheduledFor
      ? `We have received your booking request for ${input.serviceTitle} on ${formatDateTime(input.scheduledFor)}. Pay the commitment fee to secure this slot.`
      : `We have received your booking request for ${input.serviceTitle}. Pay the commitment fee to secure your slot.`,
  ];

  if (input.balanceKes > 0) {
    paragraphs.push(
      `A balance of ${formatKes(input.balanceKes)} remains and can be settled before or on the day of your session.`,
    );
  }

  const { html, text } = layout({
    heading: "We received your booking",
    greeting: `Hello ${firstName(input.recipientName)},`,
    paragraphs,
    details,
    closing: "If you need to move or cancel your session, reply to this email and we will make the change.",
  });

  return {
    to: { email: input.recipientEmail, name: input.recipientName },
    subject: `Booking request ${input.reference}`,
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

export function passwordReset(input: {
  recipientEmail: string;
  recipientName: string;
  url: string;
}): EmailMessage {
  const { html, text } = layout({
    heading: "Reset your password",
    greeting: `Hello ${firstName(input.recipientName)},`,
    paragraphs: [
      "We received a request to reset the password for your Recro account. Use the button below. This link expires soon and can only be used once.",
      "If you did not ask for a reset, you can ignore this email.",
    ],
    cta: { label: "Reset password", url: input.url },
  });

  return {
    to: { email: input.recipientEmail, name: input.recipientName },
    subject: "Reset your Recro password",
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


// ─── Appointment Reminder Templates ───────────────────────────────────────

export function appointmentReminderEmail(data: {
  customerName: string;
  serviceName: string;
  appointmentDate: string;
  appointmentTime: string;
  therapistName?: string;
  sessionNumber?: number;
  totalSessions?: number;
  location?: string;
  notes?: string;
}) {
  const sessionInfo =
    data.sessionNumber && data.totalSessions
      ? `This is session ${data.sessionNumber} of ${data.totalSessions}.`
      : "";

  const therapistInfo = data.therapistName
    ? `<p style="margin: 16px 0; color: #374151;">Your session will be with <strong>${data.therapistName}</strong>.</p>`
    : "";

  const locationInfo = data.location
    ? `<p style="margin: 16px 0; color: #374151;"><strong>Location:</strong> ${data.location}</p>`
    : "";

  const notesInfo = data.notes
    ? `<div style="margin: 20px 0; padding: 16px; background: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 4px;">
         <p style="margin: 0; color: #92400e; font-size: 14px;"><strong>Important Note:</strong> ${data.notes}</p>
       </div>`
    : "";

  return {
    subject: `Reminder: Your ${data.serviceName} Appointment Tomorrow`,
    text: `
Hello ${data.customerName},

This is a friendly reminder about your upcoming appointment:

Service: ${data.serviceName}
Date: ${data.appointmentDate}
Time: ${data.appointmentTime}
${data.therapistName ? `Therapist: ${data.therapistName}` : ""}
${data.location ? `Location: ${data.location}` : ""}

${sessionInfo}

${data.notes ? `Important Note: ${data.notes}` : ""}

If you need to reschedule or have any questions, please contact us as soon as possible.

We look forward to seeing you!

Best regards,
The Recro Group Team
    `.trim(),
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f9fafb;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); padding: 40px 40px 30px;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600;">
                Appointment Reminder
              </h1>
              <p style="margin: 8px 0 0; color: rgba(255,255,255,0.9); font-size: 16px;">
                Your session is coming up soon
              </p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <p style="margin: 0 0 24px; color: #1f2937; font-size: 16px; line-height: 1.6;">
                Hello <strong>${data.customerName}</strong>,
              </p>

              <p style="margin: 0 0 24px; color: #374151; font-size: 16px; line-height: 1.6;">
                This is a friendly reminder about your upcoming appointment with Recro Group.
              </p>

              <!-- Appointment Details Card -->
              <div style="background: #f3f4f6; border-radius: 8px; padding: 24px; margin: 24px 0;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280; font-size: 14px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px;">
                      Service
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 0 0 16px; color: #1f2937; font-size: 18px; font-weight: 600;">
                      ${data.serviceName}
                    </td>
                  </tr>
                  
                  <tr>
                    <td style="padding: 16px 0 0; border-top: 1px solid #e5e7eb;">
                      <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td width="50%" style="padding: 8px 0; vertical-align: top;">
                            <div style="color: #6b7280; font-size: 14px; margin-bottom: 4px;">📅 Date</div>
                            <div style="color: #1f2937; font-size: 16px; font-weight: 600;">${data.appointmentDate}</div>
                          </td>
                          <td width="50%" style="padding: 8px 0; vertical-align: top;">
                            <div style="color: #6b7280; font-size: 14px; margin-bottom: 4px;">🕐 Time</div>
                            <div style="color: #1f2937; font-size: 16px; font-weight: 600;">${data.appointmentTime}</div>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </div>

              ${therapistInfo}
              ${locationInfo}
              
              ${sessionInfo ? `<p style="margin: 16px 0; color: #6b7280; font-size: 14px; font-style: italic;">${sessionInfo}</p>` : ""}
              
              ${notesInfo}

              <p style="margin: 24px 0 16px; color: #374151; font-size: 16px; line-height: 1.6;">
                If you need to reschedule or have any questions, please contact us as soon as possible.
              </p>

              <p style="margin: 24px 0 0; color: #374151; font-size: 16px; line-height: 1.6;">
                We look forward to seeing you!
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 32px 40px; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 8px; color: #1f2937; font-size: 14px; font-weight: 600;">
                Recro Group
              </p>
              <p style="margin: 0; color: #6b7280; font-size: 14px; line-height: 1.5;">
                Professional Therapy & Counseling Services
              </p>
              <p style="margin: 16px 0 0; color: #9ca3af; font-size: 12px;">
                This is an automated reminder. Please do not reply to this email.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `.trim(),
  };
}

export function appointmentConfirmationEmail(data: {
  customerName: string;
  serviceName: string;
  appointmentDate: string;
  appointmentTime: string;
  therapistName?: string;
  location?: string;
  bookingReference?: string;
}) {
  return {
    subject: `Appointment Confirmed: ${data.serviceName}`,
    text: `
Hello ${data.customerName},

Your appointment has been confirmed!

Service: ${data.serviceName}
Date: ${data.appointmentDate}
Time: ${data.appointmentTime}
${data.therapistName ? `Therapist: ${data.therapistName}` : ""}
${data.location ? `Location: ${data.location}` : ""}
${data.bookingReference ? `Reference: ${data.bookingReference}` : ""}

You will receive a reminder 24 hours before your appointment.

If you need to reschedule, please contact us as soon as possible.

Best regards,
The Recro Group Team
    `.trim(),
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f9fafb;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
          
          <!-- Header with Success Icon -->
          <tr>
            <td style="background: linear-gradient(135deg, #059669 0%, #10b981 100%); padding: 40px; text-align: center;">
              <div style="width: 64px; height: 64px; background: rgba(255,255,255,0.2); border-radius: 50%; margin: 0 auto 16px; display: flex; align-items: center; justify-content: center;">
                <span style="font-size: 32px;">✓</span>
              </div>
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600;">
                Appointment Confirmed
              </h1>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <p style="margin: 0 0 24px; color: #1f2937; font-size: 16px; line-height: 1.6;">
                Hello <strong>${data.customerName}</strong>,
              </p>

              <p style="margin: 0 0 24px; color: #374151; font-size: 16px; line-height: 1.6;">
                Great news! Your appointment has been successfully confirmed.
              </p>

              <!-- Appointment Details Card -->
              <div style="background: #f3f4f6; border-radius: 8px; padding: 24px; margin: 24px 0;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280; font-size: 14px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px;">
                      Service
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 0 0 16px; color: #1f2937; font-size: 18px; font-weight: 600;">
                      ${data.serviceName}
                    </td>
                  </tr>
                  
                  <tr>
                    <td style="padding: 16px 0 0; border-top: 1px solid #e5e7eb;">
                      <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td width="50%" style="padding: 8px 0; vertical-align: top;">
                            <div style="color: #6b7280; font-size: 14px; margin-bottom: 4px;">📅 Date</div>
                            <div style="color: #1f2937; font-size: 16px; font-weight: 600;">${data.appointmentDate}</div>
                          </td>
                          <td width="50%" style="padding: 8px 0; vertical-align: top;">
                            <div style="color: #6b7280; font-size: 14px; margin-bottom: 4px;">🕐 Time</div>
                            <div style="color: #1f2937; font-size: 16px; font-weight: 600;">${data.appointmentTime}</div>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  
                  ${data.therapistName
        ? `
                  <tr>
                    <td style="padding: 16px 0 0; border-top: 1px solid #e5e7eb;">
                      <div style="color: #6b7280; font-size: 14px; margin-bottom: 4px;">👨‍⚕️ Therapist</div>
                      <div style="color: #1f2937; font-size: 16px; font-weight: 600;">${data.therapistName}</div>
                    </td>
                  </tr>
                  `
        : ""
      }
                  
                  ${data.location
        ? `
                  <tr>
                    <td style="padding: 16px 0 0; border-top: 1px solid #e5e7eb;">
                      <div style="color: #6b7280; font-size: 14px; margin-bottom: 4px;">📍 Location</div>
                      <div style="color: #1f2937; font-size: 16px;">${data.location}</div>
                    </td>
                  </tr>
                  `
        : ""
      }
                  
                  ${data.bookingReference
        ? `
                  <tr>
                    <td style="padding: 16px 0 0; border-top: 1px solid #e5e7eb;">
                      <div style="color: #6b7280; font-size: 14px; margin-bottom: 4px;">🔖 Reference</div>
                      <div style="color: #1f2937; font-size: 14px; font-family: monospace;">${data.bookingReference}</div>
                    </td>
                  </tr>
                  `
        : ""
      }
                </table>
              </div>

              <div style="background: #dbeafe; border-left: 4px solid #3b82f6; border-radius: 4px; padding: 16px; margin: 24px 0;">
                <p style="margin: 0; color: #1e40af; font-size: 14px;">
                  <strong>📧 Reminder:</strong> You will receive an email reminder 24 hours before your appointment.
                </p>
              </div>

              <p style="margin: 24px 0 0; color: #374151; font-size: 16px; line-height: 1.6;">
                If you need to reschedule or have any questions, please contact us as soon as possible.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 32px 40px; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 8px; color: #1f2937; font-size: 14px; font-weight: 600;">
                Recro Group
              </p>
              <p style="margin: 0; color: #6b7280; font-size: 14px; line-height: 1.5;">
                Professional Therapy & Counseling Services
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `.trim(),
  };
}
