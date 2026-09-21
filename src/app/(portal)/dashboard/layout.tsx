import { PortalShell } from "@/features/portal/components/portal-shell";
import { getRequiredSession } from "@/features/portal/lib/portal-guard";
import { isStaff } from "@/features/portal/lib/roles";
import { getStaffNotifications } from "@/server/queries/notifications";
import { redirect } from "next/navigation";

type PortalLayoutProps = {
  children: React.ReactNode;
};

export default async function PortalLayout({ children }: PortalLayoutProps) {
  const session = await getRequiredSession();

  if (!isStaff(session.role)) {
    redirect("/");
  }

  const feed = await getStaffNotifications(session.userId, {
    take: 8,
    unreadOnly: true,
  });

  return (
    <PortalShell
      session={session}
      notifications={feed.items.map((item) => ({
        ...item,
        createdAt: item.createdAt.toISOString(),
      }))}
      unreadCount={feed.unreadCount}
    >
      {children}
    </PortalShell>
  );
}
