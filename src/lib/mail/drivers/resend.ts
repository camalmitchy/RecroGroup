import "server-only";

import type {
  EmailAddress,
  EmailMessage,
  EmailRecipient,
  MailDriver,
  SendResult,
} from "../types";

function toResendAddress(recipient: EmailRecipient): string {
  if (typeof recipient === "string") return recipient;
  return recipient.name
    ? `${recipient.name} <${recipient.email}>`
    : recipient.email;
}

function toResendList(recipients: EmailRecipient | EmailRecipient[] | undefined) {
  if (!recipients) return undefined;
  const list = Array.isArray(recipients) ? recipients : [recipients];
  const formatted = list.map(toResendAddress).filter(Boolean);
  return formatted.length > 0 ? formatted : undefined;
}

function fromAddress(from: EmailAddress | string | undefined, fallback: string) {
  if (!from) return fallback;
  return typeof from === "string" ? from : toResendAddress(from);
}

export function createResendDriver(options: {
  apiKey: string;
  from: string;
  replyTo?: string;
}): MailDriver {
  const { apiKey, from, replyTo } = options;

  return {
    name: "resend",
    async send(message: EmailMessage): Promise<SendResult> {
      const to = toResendList(message.to);
      if (!to) {
        return { id: "resend-skipped", accepted: false };
      }

      const payload: Record<string, unknown> = {
        from: fromAddress(undefined, from),
        to,
        subject: message.subject,
        html: message.html,
        text: message.text,
      };

      const cc = toResendList(message.cc);
      if (cc) payload.cc = cc;
      const bcc = toResendList(message.bcc);
      if (bcc) payload.bcc = bcc;

      const reply = message.replyTo
        ? toResendAddress(message.replyTo)
        : replyTo;
      if (reply) payload.reply_to = reply;

      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const body = (await response.json().catch(() => null)) as
        | { id?: string; message?: string }
        | null;

      if (!response.ok) {
        throw new Error(
          body?.message ?? `Resend returned ${response.status}`,
        );
      }

      return {
        id: body?.id ?? "resend-unknown",
        accepted: true,
      };
    },
  };
}
