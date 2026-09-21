"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import type { ActionResult } from "@/server/result";
import { failure, invalid, ok } from "@/server/result";
import type { NewsletterInput } from "@/server/validation/newsletter";
import { newsletterSchema } from "@/server/validation/newsletter";

export type SubscribeNewsletterResult = {
  email: string;
  alreadySubscribed: boolean;
};

export async function subscribeNewsletter(
  input: NewsletterInput,
): Promise<ActionResult<SubscribeNewsletterResult>> {
  const parsed = newsletterSchema.safeParse(input);
  if (!parsed.success) return invalid(parsed.error);

  const email = parsed.data.email.trim().toLowerCase();

  try {
    const existing = await prisma.newsletterSubscriber.findUnique({
      where: { email },
      select: { id: true, status: true },
    });

    if (existing?.status === "SUBSCRIBED") {
      return ok({ email, alreadySubscribed: true });
    }

    await prisma.newsletterSubscriber.upsert({
      where: { email },
      create: { email, status: "SUBSCRIBED" },
      update: { status: "SUBSCRIBED" },
    });

    revalidatePath("/dashboard", "layout");
    revalidatePath("/dashboard/notifications");

    return ok({ email, alreadySubscribed: false });
  } catch (error) {
    return failure("subscribeNewsletter", error);
  }
}
