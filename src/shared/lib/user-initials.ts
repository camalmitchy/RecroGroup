/** GitHub-style handle from the email local-part. */
export function userHandle(email: string | null | undefined): string {
  const local = email?.trim().split("@")[0];
  return local && local.length > 0 ? local : "account";
}

export function userInitials(
  name: string | null | undefined,
  email?: string | null,
): string {
  const parts = name?.trim().split(/\s+/).filter(Boolean) ?? [];

  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  }

  if (parts.length === 1 && parts[0].length > 0) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  const fromEmail = email?.trim().charAt(0);
  return fromEmail ? fromEmail.toUpperCase() : "?";
}
