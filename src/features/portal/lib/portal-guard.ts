import { redirect } from "next/navigation";

import { canAccessRoute } from "@/features/portal/lib/permissions";
import {
  getDevPortalSession,
  getPortalSession,
} from "@/features/portal/lib/session";

export async function getRequiredSession(pathname?: string) {
  const session =
    (await getPortalSession()) ??
    (process.env.NODE_ENV === "development"
      ? getDevPortalSession("ADMIN")
      : null);

  if (!session) {
    redirect("/join-us");
  }

  if (pathname && !canAccessRoute(session.role, pathname)) {
    redirect("/dashboard");
  }

  return session;
}
