import type {
  ForgotPasswordInput,
  SignInInput,
  SignUpInput,
} from "@/features/auth/lib/schemas";

type AuthErrorBody = {
  message?: string;
  errors?: Record<string, string[] | undefined>;
};

async function parseAuthResponse<T>(response: Response): Promise<T> {
  const data = (await response.json().catch(() => null)) as
    | (T & AuthErrorBody)
    | null;

  if (!response.ok) {
    throw new Error(data?.message ?? "Something went wrong. Please try again.");
  }

  return data as T;
}

export async function getSession() {
  const response = await fetch("/api/auth/session", {
    credentials: "include",
  });

  return parseAuthResponse<{ user: Record<string, unknown> | null }>(response);
}

export async function signIn(input: SignInInput) {
  const response = await fetch("/api/auth/sign-in", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(input),
  });

  return parseAuthResponse<{ user: Record<string, unknown> }>(response);
}

export async function signUp(input: SignUpInput) {
  const { confirmPassword: _confirmPassword, ...body } = input;

  const response = await fetch("/api/auth/sign-up", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(body),
  });

  return parseAuthResponse<{ user: Record<string, unknown> }>(response);
}

export async function signOut() {
  const response = await fetch("/api/auth/sign-out", {
    method: "POST",
    credentials: "include",
  });

  return parseAuthResponse<{ success: boolean }>(response);
}

export async function requestPasswordReset(input: ForgotPasswordInput) {
  const response = await fetch("/api/auth/forgot-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(input),
  });

  return parseAuthResponse<{ status: boolean; message: string }>(response);
}
