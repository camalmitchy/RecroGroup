import { z } from "zod";

export const inquirySchema = z.object({
  name: z.string().trim().min(2, "Enter your name"),
  email: z.email("Enter a valid email address"),
  phone: z.string().trim().min(7, "Enter a valid phone number").optional(),
  subject: z.string().trim().max(200).optional(),
  message: z.string().trim().min(10, "Tell us a little more").max(5000),
  type: z.enum(["CONTACT", "CORPORATE"]).default("CONTACT"),
});

export type InquiryInput = z.input<typeof inquirySchema>;
export type InquiryValues = z.output<typeof inquirySchema>;
