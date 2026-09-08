import "server-only";

import type { PortalSession } from "@/features/portal/lib/session";
import { getPortalSession } from "@/features/portal/lib/session";
import { isAdmin, isStaff } from "@/features/portal/lib/roles";

export class AuthorizationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthorizationError";
  }
}

export async function requireSession(): Promise<PortalSession> {
  const session = await getPortalSession();
  if (!session) {
    throw new AuthorizationError("You must be signed in to do that");
  }
  return session;
}

export async function requireStaff(): Promise<PortalSession> {
  const session = await requireSession();
  if (!isStaff(session.role)) {
    throw new AuthorizationError("You do not have access to this area");
  }
  return session;
}

export async function requireAdmin(): Promise<PortalSession> {
  const session = await requireSession();
  if (!isAdmin(session.role)) {
    throw new AuthorizationError("Administrator access is required");
  }
  return session;
}

export async function getOptionalSession(): Promise<PortalSession | null> {
  try {
    return await getPortalSession();
  } catch {
    return null;
  }
}
