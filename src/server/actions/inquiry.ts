"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import type { ActionResult } from "@/server/result";
import { failure, invalid, ok } from "@/server/result";
import type { InquiryInput } from "@/server/validation/inquiry";
import { inquirySchema } from "@/server/validation/inquiry";

export type SubmitInquiryResult = {
  inquiryId: string;
};

export async function submitInquiry(
  input: InquiryInput,
): Promise<ActionResult<SubmitInquiryResult>> {
  const parsed = inquirySchema.safeParse(input);
  if (!parsed.success) return invalid(parsed.error);

  const values = parsed.data;

  try {
    const inquiry = await prisma.inquiry.create({
      data: {
        type: values.type,
        name: values.name,
        email: values.email,
        phone: values.phone ?? null,
        subject: values.subject ?? null,
        message: values.message,
      },
      select: { id: true },
    });

    revalidatePath("/dashboard/inquiries");
    revalidatePath("/dashboard");

    return ok({ inquiryId: inquiry.id });
  } catch (error) {
    return failure("submitInquiry", error);
  }
}
