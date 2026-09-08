export type EmailAddress = {
  email: string;
  name?: string;
};

export type EmailRecipient = string | EmailAddress;

export type EmailMessage = {
  from?: string;
  to: EmailRecipient | EmailRecipient[];
  cc?: EmailRecipient | EmailRecipient[];
  bcc?: EmailRecipient | EmailRecipient[];
  replyTo?: EmailRecipient;
  subject: string;
  html: string;
  text: string;
};

export type SendResult = {
  id: string;
  accepted: boolean;
  error?: string;
};

export interface MailDriver {
  readonly name: string;
  send(message: EmailMessage): Promise<SendResult>;
}
