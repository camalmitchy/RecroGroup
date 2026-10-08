"use server";

// Saves contact, consortium, corporate, team-building, and therapist forms
// into inquiries, then emails staff and copies a matching Google Sheet tab.
// Grief-camp camper applications do not come through here.

import { revalidatePath } from "next/cache";

import { recordGoogleSheetRow, sheetTabForInquiry } from "@/lib/google-sheets";
import { notifyInquiryReceived } from "@/lib/mail/notifications";
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

    await notifyInquiryReceived({
      name: values.name,
      email: values.email,
      phone: values.phone,
      subject: values.subject,
      type: values.type,
      message: values.message,
    });

    const tab = sheetTabForInquiry({
      type: values.type,
      subject: values.subject,
    });
    if (tab) {
      await recordGoogleSheetRow({
        tab,
        submittedAt: new Date().toISOString(),
        name: values.name,
        email: values.email,
        phone: values.phone ?? "",
        subject: values.subject ?? "",
        message: values.message,
      });
    }

    revalidatePath("/dashboard/inquiries");
    revalidatePath("/dashboard/programs/corporate");
    revalidatePath("/dashboard/programs/consortium");
    revalidatePath("/dashboard/programs/team-building");
    revalidatePath("/dashboard/programs/therapist-applications");
    revalidatePath("/admin/messages");
    revalidatePath("/admin/grief-camp/team-building");
    revalidatePath("/admin/grief-camp/therapist-applications");
    revalidatePath("/dashboard");

    return ok({ inquiryId: inquiry.id });
  } catch (error) {
    return failure("submitInquiry", error);
  }
}
