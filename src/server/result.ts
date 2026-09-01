import type { ZodError } from "zod";

export type ActionResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string; fieldErrors?: Record<string, string[]> };

export function ok<T>(data: T): ActionResult<T> {
  return { ok: true, data };
}

export function fail<T>(
  error: string,
  fieldErrors?: Record<string, string[]>,
): ActionResult<T> {
  return fieldErrors ? { ok: false, error, fieldErrors } : { ok: false, error };
}

export function invalid<T>(error: ZodError): ActionResult<T> {
  const fieldErrors: Record<string, string[]> = {};

  for (const issue of error.issues) {
    const key = issue.path.map(String).join(".") || "_form";
    (fieldErrors[key] ??= []).push(issue.message);
  }

  return {
    ok: false,
    error: "Please correct the highlighted fields",
    fieldErrors,
  };
}

export function failure<T>(scope: string, error: unknown): ActionResult<T> {
  console.error(`[${scope}]`, error);
  return {
    ok: false,
    error: "Something went wrong. Please try again or contact us directly.",
  };
}
