import type { FieldValues, Path, UseFormSetError } from "react-hook-form";

import { AuthApiError } from "@/features/auth/lib/errors";

export function applyServerFieldErrors<T extends FieldValues>(
  error: unknown,
  setError: UseFormSetError<T>,
): boolean {
  if (!(error instanceof AuthApiError) || !error.fieldErrors) {
    return false;
  }

  let applied = false;

  for (const [field, messages] of Object.entries(error.fieldErrors)) {
    const message = messages?.[0];

    if (message) {
      setError(field as Path<T>, { type: "server", message });
      applied = true;
    }
  }

  return applied;
}

export function getFormErrorMessage(error: unknown): string | undefined {
  if (error instanceof AuthApiError && error.fieldErrors) {
    const hasFieldErrors = Object.values(error.fieldErrors).some(
      (messages) => messages?.length,
    );

    if (hasFieldErrors) {
      return undefined;
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong. Please try again.";
}
