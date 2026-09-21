import { z } from "zod";

export const newsletterSchema = z.object({
  email: z.email("Enter a valid email address"),
});

export type NewsletterInput = z.input<typeof newsletterSchema>;
