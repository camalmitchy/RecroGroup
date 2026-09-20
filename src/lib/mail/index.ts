import "server-only";

import { consoleMailDriver } from "./drivers/console";
import type { EmailMessage, MailDriver, SendResult } from "./types";

const SUPPORTED_DRIVERS = ["console"] as const;

type SupportedDriver = (typeof SUPPORTED_DRIVERS)[number];

function optional(key: string) {
  const value = process.env[key];
  return value && value.trim() !== "" ? value.trim() : undefined;
}

function isSupported(value: string): value is SupportedDriver {
  return (SUPPORTED_DRIVERS as readonly string[]).includes(value);
}

export const mailConfig = {
  get driver(): SupportedDriver {
    const requested = optional("MAIL_DRIVER")?.toLowerCase();
    if (!requested) return "console";
    if (isSupported(requested)) return requested;

    console.warn(
      `[mail] Unknown MAIL_DRIVER "${requested}", falling back to "console". Supported: ${SUPPORTED_DRIVERS.join(", ")}`,
    );
    return "console";
  },
  get from() {
    return optional("MAIL_FROM") ?? "Recro Group <no-reply@recrogroup.co.ke>";
  },
  get replyTo() {
    return optional("MAIL_REPLY_TO");
  },
  get staffAddress() {
    return optional("MAIL_STAFF_ADDRESS");
  },
};

export function getMailer(): MailDriver {
  switch (mailConfig.driver) {
    case "console":
    default:
      return consoleMailDriver;
  }
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
