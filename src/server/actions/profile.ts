"use server";

import { revalidatePath } from "next/cache";

import {
  profileUpdateSchema,
  toStoredPhone,
} from "@/features/profile/lib/schema";
import { uploadAvatar } from "@/lib/uploads/avatar";
import { prisma } from "@/lib/prisma";
import { AuthorizationError, requireSession } from "@/server/authz";
import type { ActionResult } from "@/server/result";
import { fail, failure, invalid, ok } from "@/server/result";

export type ProfileUpdateResult = {
  name: string;
  phone: string | null;
  image: string | null;
};

export async function updateProfile(input: {
  name: string;
  phone: string;
  image?: File | null;
}): Promise<ActionResult<ProfileUpdateResult>> {
  try {
    const session = await requireSession();
    const parsed = profileUpdateSchema.safeParse({
      name: input.name,
      phone: input.phone,
    });
    if (!parsed.success) return invalid(parsed.error);

    let imageUrl: string | undefined;
    if (input.image && input.image.size > 0) {
      const uploaded = await uploadAvatar(input.image, session.userId);
      if (!uploaded.ok) return fail(uploaded.error);
      imageUrl = uploaded.url;
    }

    const updated = await prisma.user.update({
      where: { id: session.userId },
      data: {
        name: parsed.data.name,
        phone: toStoredPhone(parsed.data.phone),
        ...(imageUrl ? { image: imageUrl } : {}),
      },
      select: {
        name: true,
        phone: true,
        image: true,
      },
    });

    revalidatePath("/dashboard/profile");
    revalidatePath("/dashboard", "layout");
    revalidatePath("/profile");

    return ok(updated);
  } catch (error) {
    if (error instanceof AuthorizationError) {
      return fail(error.message);
    }
    return failure("updateProfile", error);
  }
}
