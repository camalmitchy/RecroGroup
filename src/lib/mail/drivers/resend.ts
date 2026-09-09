import { Resend } from "resend";

import { formatRecipient, formatRecipientList } from "../outbound";
import type { EmailMessage, MailDriver, SendResult } from "../types";

function getResendClient(): Resend {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey || apiKey.trim() === "") {
    throw new Error(
      "[mail/resend] RESEND_API_KEY is not set. Get one at https://resend.com/api-keys",
    );
  }
  return new Resend(apiKey);
}

export const resendMailDriver: MailDriver = {
  name: "resend",

  async send(message: EmailMessage): Promise<SendResult> {
    const from = message.from?.trim();
    const to = formatRecipientList(message.to);

    if (!from) {
      return { id: "", accepted: false, error: "MAIL_FROM is missing" };
    }

    if (to.length === 0) {
      return { id: "", accepted: false, error: "No email recipients" };
    }

    const resend = getResendClient();
    const cc = formatRecipientList(message.cc);
    const bcc = formatRecipientList(message.bcc);
    const replyTo = message.replyTo
      ? formatRecipient(message.replyTo)
      : undefined;

    try {
      const { data, error } = await resend.emails.send({
        from,
        to,
        subject: message.subject,
        html: message.html,
        text: message.text,
        ...(replyTo ? { replyTo } : {}),
        ...(cc.length > 0 ? { cc } : {}),
        ...(bcc.length > 0 ? { bcc } : {}),
      });

      if (error) {
        console.error("[mail/resend] Failed to send email", {
          subject: message.subject,
          error,
        });
        return { id: "", accepted: false, error: error.message };
      }

      console.log("[mail/resend] Email sent", {
        id: data?.id,
        subject: message.subject,
        to,
      });

      return { id: data?.id ?? "", accepted: true };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      console.error("[mail/resend] Exception while sending email", {
        subject: message.subject,
        error: errorMessage,
      });
      return { id: "", accepted: false, error: errorMessage };
    }
  },
};
