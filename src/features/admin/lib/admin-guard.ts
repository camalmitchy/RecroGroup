import { redirect } from "next/navigation";

import { isStaff } from "@/features/portal/lib/roles";
import { getRequiredSession } from "@/features/portal/lib/portal-guard";
import type { PortalSession } from "@/features/portal/lib/session";

export async function requireAdminArea(): Promise<PortalSession> {
  const session = await getRequiredSession();

  if (!isStaff(session.role)) {
    redirect("/dashboard");
  }

  return session;
}
