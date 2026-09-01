export const DEFAULT_AFTER_AUTH = "/";

const AUTH_PREFIXES = [
  "/login",
  "/join-us",
  "/forgot-password",
  "/reset-password",
];

export function safeCallbackUrl(
  value: string | null | undefined,
  fallback = DEFAULT_AFTER_AUTH,
): string {
  if (!value) return fallback;

  let decoded = value.trim();
  try {
    decoded = decodeURIComponent(decoded);
  } catch {
    return fallback;
  }

  if (!decoded.startsWith("/")) return fallback;
  if (decoded.startsWith("//") || decoded.startsWith("/\\")) return fallback;
  if (decoded.includes("://")) return fallback;

  const pathOnly = decoded.split("?")[0] ?? decoded;
  if (AUTH_PREFIXES.some((prefix) => pathOnly === prefix || pathOnly.startsWith(`${prefix}/`))) {
    return fallback;
  }

  return decoded;
}

export function loginUrl(returnTo?: string | null) {
  const callbackUrl = safeCallbackUrl(returnTo);
  if (callbackUrl === DEFAULT_AFTER_AUTH) return "/login";
  return `/login?callbackUrl=${encodeURIComponent(callbackUrl)}`;
}

export function joinUsUrl(returnTo?: string | null) {
  const callbackUrl = safeCallbackUrl(returnTo);
  if (callbackUrl === DEFAULT_AFTER_AUTH) return "/join-us";
  return `/join-us?callbackUrl=${encodeURIComponent(callbackUrl)}`;
}
