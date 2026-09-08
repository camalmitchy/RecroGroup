import { redirect } from "next/navigation";

import { canAccessRoute } from "@/features/portal/lib/permissions";
import { isStaff } from "@/features/portal/lib/roles";
import {
  getDevPortalSession,
  getPortalSession,
} from "@/features/portal/lib/session";

export async function getRequiredSession(pathname?: string) {
  const session =
    (await getPortalSession()) ??
    (process.env.NODE_ENV === "development" &&
    !process.env.BETTER_AUTH_SECRET
      ? getDevPortalSession("admin")
      : null);

  if (!session) {
    redirect("/login");
  }

  if (pathname && !canAccessRoute(session.role, pathname)) {
    redirect(isStaff(session.role) ? "/dashboard" : "/");
  }

  return session;
}
