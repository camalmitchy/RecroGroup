"use server";

import { APIError } from "better-auth/api";
import { headers } from "next/headers";

import {
  signInSchema,
  signUpSchema,
  type SignInInput,
  type SignUpInput,
} from "@/features/auth/lib/schemas";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { ActionResult } from "@/server/result";
import { fail, failure, invalid, ok } from "@/server/result";

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function isUnauthorized(error: unknown) {
  if (!(error instanceof APIError)) return false;
  const status = String(error.status);
  return status === "UNAUTHORIZED" || status === "401";
}

function isExistingUser(error: unknown) {
  if (!(error instanceof APIError)) return false;
  const status = String(error.status);
  const message = error.message.toLowerCase();
  return (
    status === "UNPROCESSABLE_ENTITY" ||
    status === "422" ||
    message.includes("already exists")
  );
}

export async function signInWithPassword(
  input: SignInInput,
): Promise<ActionResult<{ signedIn: true }>> {
  const parsed = signInSchema.safeParse(input);
  if (!parsed.success) return invalid(parsed.error);

  const email = normalizeEmail(parsed.data.email);

  try {
    const user = await prisma.user.findFirst({
      where: { email: { equals: email, mode: "insensitive" } },
      select: {
        id: true,
        email: true,
        accounts: {
          select: { providerId: true, password: true },
        },
      },
    });

    if (!user) {
      return fail(
        "No account found for that email. Create an account or continue with Google.",
        { email: ["No account found for that email"] },
      );
    }

    const hasPassword = user.accounts.some(
      (account) => account.providerId === "credential" && Boolean(account.password),
    );

    if (!hasPassword) {
      const usesGoogle = user.accounts.some(
        (account) => account.providerId === "google",
      );
      return fail(
        usesGoogle
          ? "This account uses Google. Click Continue with Google."
          : "This account has no password. Continue with Google or create a new account.",
      );
    }

    if (user.email !== email) {
      await prisma.user.update({
        where: { id: user.id },
        data: { email },
      });
    }

    await auth.api.signInEmail({
      body: {
        email,
        password: parsed.data.password,
        rememberMe: parsed.data.rememberMe,
      },
      headers: await headers(),
    });

    return ok({ signedIn: true });
  } catch (error) {
    if (isUnauthorized(error)) {
      return fail("Incorrect email or password.");
    }

    return failure("signInWithPassword", error);
  }
}

export async function signUpWithPassword(
  input: SignUpInput,
): Promise<ActionResult<{ signedIn: true }>> {
  const parsed = signUpSchema.safeParse(input);
  if (!parsed.success) return invalid(parsed.error);

  const email = normalizeEmail(parsed.data.email);

  try {
    await auth.api.signUpEmail({
      body: {
        name: parsed.data.name,
        email,
        password: parsed.data.password,
        phone: parsed.data.phone || undefined,
        commsEmail: parsed.data.commsEmail,
        commsSms: parsed.data.commsSms,
      },
      headers: await headers(),
    });

    return ok({ signedIn: true });
  } catch (error) {
    if (isExistingUser(error)) {
      return fail("An account with this email already exists. Sign in instead.", {
        email: ["An account with this email already exists"],
      });
    }

    return failure("signUpWithPassword", error);
  }
}
