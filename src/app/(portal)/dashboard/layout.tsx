import { PortalShell } from "@/features/portal/components/portal-shell";
import { getRequiredSession } from "@/features/portal/lib/portal-guard";
import { isStaff } from "@/features/portal/lib/roles";
import { redirect } from "next/navigation";

type PortalLayoutProps = {
  children: React.ReactNode;
};

export default async function PortalLayout({ children }: PortalLayoutProps) {
  const session = await getRequiredSession();

  if (!isStaff(session.role)) {
    redirect("/");
  }

  return <PortalShell session={session}>{children}</PortalShell>;
}
