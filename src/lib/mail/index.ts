// Resend when RESEND_API_KEY is set (forced on Vercel). Otherwise messages
// are logged. Form alerts always include info@recrogroup.org. A send failure
// must not fail the form that triggered it. See HANDOVER.md.
import "server-only";

import { consoleMailDriver } from "./drivers/console";
import { createResendDriver } from "./drivers/resend";
import type { EmailMessage, MailDriver, SendResult } from "./types";

const SUPPORTED_DRIVERS = ["console", "resend"] as const;

type SupportedDriver = (typeof SUPPORTED_DRIVERS)[number];

function optional(key: string) {
  const value = process.env[key];
  return value && value.trim() !== "" ? value.trim() : undefined;
}

function isSupported(value: string): value is SupportedDriver {
  return (SUPPORTED_DRIVERS as readonly string[]).includes(value);
}

function resolveDriver(): SupportedDriver {
  const hasResend = Boolean(optional("RESEND_API_KEY"));
  // A leftover MAIL_DRIVER=console must not swallow live booking emails.
  if (process.env.VERCEL && hasResend) return "resend";

  const requested = optional("MAIL_DRIVER")?.toLowerCase();
  if (requested && isSupported(requested)) return requested;
  if (requested) {
    console.warn(
      `[mail] Unknown MAIL_DRIVER "${requested}", falling back. Supported: ${SUPPORTED_DRIVERS.join(", ")}`,
    );
  }
  return hasResend ? "resend" : "console";
}

/** True only when a message will leave this server and reach an inbox. */
export function mailDelivers() {
  return resolveDriver() === "resend";
}

const ADMIN_FORM_EMAIL = "info@recrogroup.org";

export const mailConfig = {
  get driver(): SupportedDriver {
    return resolveDriver();
  },
  get from() {
    return optional("MAIL_FROM") ?? "Recro Group <no-reply@recrogroup.org>";
  },
  get replyTo() {
    return optional("MAIL_REPLY_TO");
  },
  get staffAddress() {
    return this.staffAddresses[0];
  },
  get staffAddresses(): string[] {
    const configured = optional("MAIL_STAFF_ADDRESS");
    if (configured) {
      return configured
        .split(/[,;\s]+/)
        .map((email) => email.trim().toLowerCase())
        .filter(Boolean);
    }
    return [ADMIN_FORM_EMAIL];
  },
};

/** Staff inboxes that should hear about a public form, always including the admin mailbox. */
export function formAlertRecipients() {
  const seen = new Set<string>();
  const recipients: string[] = [];

  for (const email of [...mailConfig.staffAddresses, ADMIN_FORM_EMAIL]) {
    const normalized = email.trim().toLowerCase();
    if (!normalized || seen.has(normalized)) continue;
    seen.add(normalized);
    recipients.push(normalized);
  }

  return recipients;
}

export function getMailer(): MailDriver {
  const driver = mailConfig.driver;

  if (driver === "resend") {
    const apiKey = optional("RESEND_API_KEY");
    if (!apiKey) {
      console.warn(
        "[mail] MAIL_DRIVER=resend but RESEND_API_KEY is missing. Falling back to console.",
      );
      return consoleMailDriver;
    }
    return createResendDriver({
      apiKey,
      from: mailConfig.from,
      replyTo: mailConfig.replyTo,
    });
  }

  if (
    process.env.NODE_ENV === "production" &&
    process.env.VERCEL &&
    !optional("RESEND_API_KEY")
  ) {
    console.warn(
      "[mail] Production is logging email to the console. Set RESEND_API_KEY to send password resets and receipts.",
    );
  }

  return consoleMailDriver;
}

export async function sendEmail(message: EmailMessage): Promise<SendResult | null> {
  try {
    return await getMailer().send(message);
  } catch (error) {
    console.error("[mail] Failed to send email", {
      subject: message.subject,
      error: error instanceof Error ? error.message : error,
    });
    return null;
  }
}

export type { EmailAddress, EmailMessage, EmailRecipient, MailDriver, SendResult } from "./types";
