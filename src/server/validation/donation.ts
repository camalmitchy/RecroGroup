import { z } from "zod";

import { isValidKenyanPhone } from "@/lib/payments/utils";

export const MIN_DONATION_KES = 100;
export const MAX_DONATION_KES = 10_000_000;

export const donationSchema = z.object({
  donorName: z.string().trim().min(2, "Enter your name"),
  donorEmail: z.email("Enter a valid email address"),
  donorPhone: z
    .string()
    .trim()
    .refine(isValidKenyanPhone, "Enter a valid Kenyan phone number")
    .optional(),
  amountKes: z.coerce
    .number({ error: "Enter an amount" })
    .int("Amount must be whole shillings")
    .min(MIN_DONATION_KES, `Minimum donation is KES ${MIN_DONATION_KES}`)
    .max(MAX_DONATION_KES, "Amount is too large — contact us for large gifts"),
  isAnonymous: z.boolean().default(false),
  message: z.string().trim().max(1000).optional(),
});

export type DonationInput = z.input<typeof donationSchema>;
export type DonationValues = z.output<typeof donationSchema>;
