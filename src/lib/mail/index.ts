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
  const requested = optional("MAIL_DRIVER")?.toLowerCase();
  if (requested && isSupported(requested)) return requested;
  if (requested) {
    console.warn(
      `[mail] Unknown MAIL_DRIVER "${requested}", falling back. Supported: ${SUPPORTED_DRIVERS.join(", ")}`,
    );
  }
  return optional("RESEND_API_KEY") ? "resend" : "console";
}

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
    return optional("MAIL_STAFF_ADDRESS");
  },
};

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
