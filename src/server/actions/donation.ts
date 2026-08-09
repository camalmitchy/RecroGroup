"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import {
  assertPositiveAmount,
  generateReference,
  normalizePhone,
} from "@/lib/payments/utils";
import { getOptionalSession } from "@/server/authz";
import type { ActionResult } from "@/server/result";
import { failure, invalid, ok } from "@/server/result";
import type { DonationInput } from "@/server/validation/donation";
import { donationSchema } from "@/server/validation/donation";

export type CreateDonationResult = {
  donationId: string;
  reference: string;
  amountKes: number;
};

export async function createDonation(
  input: DonationInput,
): Promise<ActionResult<CreateDonationResult>> {
  const parsed = donationSchema.safeParse(input);
  if (!parsed.success) return invalid(parsed.error);

  const values = parsed.data;

  try {
    assertPositiveAmount(values.amountKes, "Donation");
    const session = await getOptionalSession();

    const donation = await prisma.donation.create({
      data: {
        reference: generateReference("DN"),
        userId: session?.userId ?? null,
        donorName: values.donorName,
        donorEmail: values.donorEmail,
        donorPhone: values.donorPhone ? normalizePhone(values.donorPhone) : null,
        isAnonymous: values.isAnonymous,
        message: values.message ?? null,
        amountKes: values.amountKes,
      },
      select: { id: true, reference: true, amountKes: true },
    });

    revalidatePath("/dashboard/payments");
    revalidatePath("/dashboard");

    return ok({
      donationId: donation.id,
      reference: donation.reference,
      amountKes: donation.amountKes,
    });
  } catch (error) {
    return failure("createDonation", error);
  }
}
