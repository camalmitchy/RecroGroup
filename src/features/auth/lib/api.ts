import { authClient } from "@/lib/auth-client";
import { AuthApiError } from "@/features/auth/lib/errors";
import type {
  ForgotPasswordInput,
  SignInInput,
  SignUpInput,
} from "@/features/auth/lib/schemas";

type AuthClientResult<T> = {
  data: T | null;
  error: { message?: string } | null;
};

function unwrapAuthResult<T>(result: AuthClientResult<T>): T {
  if (result.error) {
    throw new AuthApiError(
      result.error.message ?? "Something went wrong. Please try again.",
    );
  }

  if (result.data === null || result.data === undefined) {
    throw new AuthApiError("Something went wrong. Please try again.");
  }

  return result.data;
}

export async function getSession() {
  const result = await authClient.getSession();

  if (result.error) {
    throw new AuthApiError(
      result.error.message ?? "Failed to load session.",
    );
  }

  return { user: result.data?.user ?? null };
}

export async function signIn(input: SignInInput) {
  return unwrapAuthResult(
    await authClient.signIn.email({
      email: input.email,
      password: input.password,
      rememberMe: input.rememberMe,
    }),
  );
}

export async function signUp(input: SignUpInput) {
  return unwrapAuthResult(
    await authClient.signUp.email({
      name: input.name,
      email: input.email,
      password: input.password,
      phone: input.phone || undefined,
      accountType: "CUSTOMER",
      commsEmail: input.commsEmail,
      commsSms: input.commsSms,
    }),
  );
}

export async function signOut() {
  return unwrapAuthResult(await authClient.signOut());
}

export async function requestPasswordReset(input: ForgotPasswordInput) {
  return unwrapAuthResult(
    await authClient.requestPasswordReset({
      email: input.email,
      redirectTo: `${window.location.origin}/reset-password`,
    }),
  );
}
