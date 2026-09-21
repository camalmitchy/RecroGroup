import { z } from "zod";

import { isValidKenyanPhone, normalizePhone } from "@/lib/payments/utils";

export const profileUpdateSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(80, "Name is too long"),
  phone: z
    .string()
    .trim()
    .max(24, "Phone number is too long")
    .refine(
      (value) => value === "" || isValidKenyanPhone(value),
      "Enter a valid Kenyan phone number, e.g. 0712 345 678",
    ),
});

export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;

export function toStoredPhone(input: string) {
  const trimmed = input.trim();
  if (!trimmed) return null;
  return normalizePhone(trimmed);
}

export function toEditablePhone(input: string | null | undefined) {
  if (!input?.trim()) return "";
  if (!isValidKenyanPhone(input)) return input;
  return `0${normalizePhone(input).slice(3)}`;
}
