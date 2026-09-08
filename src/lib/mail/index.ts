"use server";

import { consoleMailDriver } from "./drivers/console";
import { resendMailDriver } from "./drivers/resend";
import { applyMailDefaults } from "./outbound";
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
    case "resend":
      return resendMailDriver;
    case "console":
    default:
      return consoleMailDriver;
  }
}

export async function sendEmail(message: EmailMessage): Promise<SendResult | null> {
  const outbound = applyMailDefaults(message, {
    from: mailConfig.from,
    replyTo: mailConfig.replyTo,
  });

  try {
    const result = await getMailer().send(outbound);

    if (!result.accepted) {
      console.error("[mail] Send rejected", {
        subject: outbound.subject,
        error: result.error,
      });
    }

    return result;
  } catch (error) {
    console.error("[mail] Failed to send email", {
      subject: outbound.subject,
      error: error instanceof Error ? error.message : error,
    });
    return null;
  }
}

export type { EmailAddress, EmailMessage, EmailRecipient, MailDriver, SendResult } from "./types";
