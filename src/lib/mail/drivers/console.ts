import "server-only";

import { randomUUID } from "node:crypto";

import type { EmailMessage, EmailRecipient, MailDriver, SendResult } from "../types";

function formatRecipient(recipient: EmailRecipient) {
  if (typeof recipient === "string") return recipient;
  return recipient.name ? `${recipient.name} <${recipient.email}>` : recipient.email;
}

function formatRecipients(recipients: EmailRecipient | EmailRecipient[] | undefined) {
  if (!recipients) return undefined;
  const list = Array.isArray(recipients) ? recipients : [recipients];
  const formatted = list.map(formatRecipient).filter((value) => value !== "");
  return formatted.length > 0 ? formatted.join(", ") : undefined;
}

export const consoleMailDriver: MailDriver = {
  name: "console",
  async send(message: EmailMessage): Promise<SendResult> {
    const id = `console-${randomUUID()}`;

    try {
      const lines = [
        "",
        "──────── mail:console ────────",
        `id:      ${id}`,
        `to:      ${formatRecipients(message.to) ?? "(none)"}`,
      ];

      const cc = formatRecipients(message.cc);
      if (cc) lines.push(`cc:      ${cc}`);

      const bcc = formatRecipients(message.bcc);
      if (bcc) lines.push(`bcc:     ${bcc}`);

      const replyTo = formatRecipients(message.replyTo);
      if (replyTo) lines.push(`replyTo: ${replyTo}`);

      lines.push(`subject: ${message.subject}`, "", message.text, "──────────────────────────────", "");

      console.info(lines.join("\n"));
    } catch {
      return { id, accepted: false };
    }

    return { id, accepted: true };
  },
};
