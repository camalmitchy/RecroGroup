import { z } from "zod";

import { isValidKenyanPhone } from "@/lib/payments/utils";

const startOfToday = () => {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return now;
};

export const bookingSchema = z.object({
  serviceSlug: z.string().min(1, "Select a service"),
  clientName: z.string().trim().min(2, "Enter your full name"),
  clientEmail: z.email("Enter a valid email address"),
  clientPhone: z
    .string()
    .trim()
    .refine(isValidKenyanPhone, "Enter a valid Kenyan phone number"),
  preferredDate: z.coerce
    .date({ error: "Choose a preferred date" })
    .refine((date) => date >= startOfToday(), "Preferred date cannot be in the past"),
  preferredTime: z.string().trim().min(1, "Choose a preferred time"),
  sessionMode: z.enum(["IN_PERSON", "ONLINE", "PHONE"]),
  notes: z.string().trim().max(2000).optional(),
  therapistId: z.string().trim().min(1).optional(),
});

export type BookingInput = z.input<typeof bookingSchema>;
export type BookingValues = z.output<typeof bookingSchema>;
