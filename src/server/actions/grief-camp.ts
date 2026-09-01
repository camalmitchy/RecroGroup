"use server";

import { revalidatePath } from "next/cache";
import type { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { resolveCampPrice } from "@/lib/payments/pricing";
import { generateReference, normalizePhone } from "@/lib/payments/utils";
import { getOptionalSession } from "@/server/authz";
import type { ActionResult } from "@/server/result";
import { failure, invalid, ok } from "@/server/result";
import type { GriefApplicationInput } from "@/server/validation/grief-camp";
import {
  deriveChildAge,
  deriveParentPhone,
  griefApplicationSchema,
} from "@/server/validation/grief-camp";

export type GriefPriceBreakdown = {
  campName: string;
  camperTierLabel: string;
  camperAmountKes: number;
  parentTierLabel: string | null;
  parentAmountKes: number;
  totalKes: number;
};

export type SubmitGriefApplicationResult = {
  applicationId: string;
  reference: string;
  amountKes: number;
  breakdown: GriefPriceBreakdown;
};

export async function submitGriefApplication(
  input: GriefApplicationInput,
): Promise<ActionResult<SubmitGriefApplicationResult>> {
  const parsed = griefApplicationSchema.safeParse(input);
  if (!parsed.success) return invalid(parsed.error);

  const values = parsed.data;
  const parentAttending = values.consent.attendingParentSession;

  try {
    const price = await resolveCampPrice({
      parentAttending,
      campSessionId: values.campSessionId,
    });

    const session = await getOptionalSession();
    const rawPhone = deriveParentPhone(values);

    const formData: Prisma.InputJsonValue = {
      parentQuestionnaire: values.parentQuestionnaire,
      camperSelfReport: values.camperSelfReport,
      otherLosses: values.otherLosses ?? null,
      parentSelfReport: values.parentSelfReport ?? null,
      registration: values.registration,
      healthHistory: values.healthHistory,
      consent: values.consent,
      pricing: {
        camperTierLabel: price.camperTierLabel,
        camperAmountKes: price.camperAmountKes,
        parentTierLabel: price.parentTierLabel,
        parentAmountKes: price.parentAmountKes,
      },
    };

    const application = await prisma.griefApplication.create({
      data: {
        reference: generateReference("GC"),
        userId: session?.userId ?? null,
        campSessionId: price.campSessionId,
        parentName: values.parentQuestionnaire.parentName,
        parentEmail: values.parentQuestionnaire.parentEmail,
        parentPhone: rawPhone ? safeNormalize(rawPhone) : null,
        childName: values.registration.childName,
        childAge: deriveChildAge(values),
        lossContext: values.registration.causeOfDeath,
        tier: price.camperTierLabel,
        parentAttending,
        formData,
        amountKes: price.totalKes,
      },
      select: { id: true, reference: true },
    });

    revalidatePath("/dashboard/programs");
    revalidatePath("/dashboard");

    return ok({
      applicationId: application.id,
      reference: application.reference,
      amountKes: price.totalKes,
      breakdown: {
        campName: price.campName,
        camperTierLabel: price.camperTierLabel,
        camperAmountKes: price.camperAmountKes,
        parentTierLabel: price.parentTierLabel,
        parentAmountKes: price.parentAmountKes,
        totalKes: price.totalKes,
      },
    });
  } catch (error) {
    return failure("submitGriefApplication", error);
  }
}

function safeNormalize(phone: string) {
  try {
    return normalizePhone(phone);
  } catch {
    return phone;
  }
}
