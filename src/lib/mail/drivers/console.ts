import { randomUUID } from "node:crypto";

import { formatRecipient, formatRecipientList } from "../outbound";
import type { EmailMessage, MailDriver, SendResult } from "../types";

export const consoleMailDriver: MailDriver = {
  name: "console",
  async send(message: EmailMessage): Promise<SendResult> {
    const id = `console-${randomUUID()}`;

    try {
      const lines = [
        "",
        "──────── mail:console ────────",
        `id:      ${id}`,
        `from:    ${message.from ?? "(unset)"}`,
        `to:      ${formatRecipientList(message.to).join(", ") || "(none)"}`,
      ];

      const cc = formatRecipientList(message.cc);
      if (cc.length > 0) lines.push(`cc:      ${cc.join(", ")}`);

      const bcc = formatRecipientList(message.bcc);
      if (bcc.length > 0) lines.push(`bcc:     ${bcc.join(", ")}`);

      if (message.replyTo) {
        lines.push(`replyTo: ${formatRecipient(message.replyTo)}`);
      }

      lines.push(
        `subject: ${message.subject}`,
        "",
        message.text,
        "──────────────────────────────",
        "",
      );

      console.info(lines.join("\n"));
    } catch {
      return { id, accepted: false, error: "Failed to write console mail" };
    }

    return { id, accepted: true };
  },
};
