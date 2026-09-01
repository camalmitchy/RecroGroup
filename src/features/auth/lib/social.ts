import "server-only";

export function isGoogleSignInAvailable() {
  if (process.env.NEXT_PUBLIC_GOOGLE_AUTH_ENABLED === "false") {
    return false;
  }

  return Boolean(
    process.env.GOOGLE_CLIENT_ID?.trim() &&
      process.env.GOOGLE_CLIENT_SECRET?.trim(),
  );
}
