import { headers } from "next/headers";

import { auth } from "@/lib/auth";

import type { AppRole } from "./roles";
import { parseAppRole } from "./roles";

export type PortalSession = {
  userId: string;
  email: string;
  name: string | null;
  role: AppRole;
};

export async function getPortalSession(): Promise<PortalSession | null> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return null;
  }

  return {
    userId: session.user.id,
    email: session.user.email,
    name: session.user.name,
    role: parseAppRole(session.user.role),
  };
}

/** Dev helper when no session cookie is present */
export function getDevPortalSession(role: AppRole = "admin"): PortalSession {
  return {
    userId: "dev-user",
    email: "dev@recrogroup.org",
    name: "Dev User",
    role,
  };
}
