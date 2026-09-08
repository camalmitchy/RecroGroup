import type { EmailMessage, EmailRecipient } from "./types";

export type MailDefaults = {
  from: string;
  replyTo?: string;
};

export type OutboundEmailMessage = EmailMessage & { from: string };

export function formatRecipient(recipient: EmailRecipient) {
  if (typeof recipient === "string") return recipient.trim();
  const email = recipient.email.trim();
  if (!email) return "";
  const name = recipient.name?.trim();
  return name ? `${name} <${email}>` : email;
}

export function formatRecipientList(
  recipients: EmailRecipient | EmailRecipient[] | undefined,
) {
  if (!recipients) return [];
  const list = Array.isArray(recipients) ? recipients : [recipients];
  return list.map(formatRecipient).filter((value) => value !== "");
}

export function applyMailDefaults(
  message: EmailMessage,
  defaults: MailDefaults,
): OutboundEmailMessage {
  return {
    ...message,
    from: message.from?.trim() || defaults.from,
    replyTo: message.replyTo ?? defaults.replyTo,
  };
}
