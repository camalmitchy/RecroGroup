import { PortalShell } from "@/features/portal/components/portal-shell";
import { getRequiredSession } from "@/features/portal/lib/portal-guard";

type PortalLayoutProps = {
  children: React.ReactNode;
};

export default async function PortalLayout({ children }: PortalLayoutProps) {
  const session = await getRequiredSession();

  return <PortalShell role={session.role}>{children}</PortalShell>;
}
