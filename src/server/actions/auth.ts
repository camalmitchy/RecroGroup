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
    const matches = await prisma.user.findMany({
      where: { email: { equals: email, mode: "insensitive" } },
      select: {
        id: true,
        email: true,
        accounts: {
          select: { providerId: true, password: true },
        },
      },
    });

    const user =
      matches.find((candidate) =>
        candidate.accounts.some(
          (account) => account.providerId === "credential" && Boolean(account.password),
        ),
      ) ?? matches[0];

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
      if (usesGoogle) {
        const headerList = await headers();
        const host = headerList.get("x-forwarded-host") ?? headerList.get("host");
        const proto =
          headerList.get("x-forwarded-proto") ??
          (host?.startsWith("localhost") || host?.startsWith("127.0.0.1")
            ? "http"
            : "https");
        const redirectTo = host
          ? `${proto}://${host}/reset-password`
          : "/reset-password";

        try {
          await auth.api.requestPasswordReset({
            body: { email: user.email, redirectTo },
            headers: headerList,
          });
        } catch (error) {
          console.error("[signInWithPassword] password setup email failed", error);
          return fail(
            "This account was created with Google and has no password yet. Open Forgot password to set one, then sign in with email and password.",
          );
        }

        return fail(
          "This account was created with Google and has no password yet. We emailed you a link to set one. After that, sign in here with email and password.",
        );
      }

      return fail(
        "This account has no password. Continue with Google or create a new account.",
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
