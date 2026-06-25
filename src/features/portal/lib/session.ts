import type { UserRole } from "@prisma/client";

export type PortalSession = {
  userId: string;
  email: string;
  fullName: string | null;
  role: UserRole;
};

/**
 * Temporary session stub until auth API is wired.
 * Replace with real session from cookies / JWT.
 */
export async function getPortalSession(): Promise<PortalSession | null> {
  return null;
}

/** Dev helper — remove once auth is live */
export function getDevPortalSession(role: UserRole = "ADMIN"): PortalSession {
  return {
    userId: "dev-user",
    email: "dev@recrogroup.org",
    fullName: "Dev User",
    role,
  };
}
