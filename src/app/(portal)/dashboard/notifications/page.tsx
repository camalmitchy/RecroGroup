import { NotificationsPanel } from "@/features/portal/components/notifications-panel";
import { getRequiredSession } from "@/features/portal/lib/portal-guard";
import { getStaffNotifications } from "@/server/queries/notifications";

export default async function NotificationsPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const session = await getRequiredSession("/dashboard/notifications");
  const { tab } = await searchParams;
  const feed = await getStaffNotifications(session.userId, { take: 100 });

  const initialFilter =
    tab === "subscribers" || tab === "NEWSLETTER"
      ? "NEWSLETTER"
      : tab === "bookings" || tab === "BOOKING"
        ? "BOOKING"
        : "all";

  return (
    <NotificationsPanel
      unreadCount={feed.unreadCount}
      initialFilter={initialFilter}
      items={feed.items.map((item) => ({
        ...item,
        createdAt: item.createdAt.toISOString(),
      }))}
    />
  );
}
