"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { Bell, CalendarDays, Mail } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";
import { PortalPageHeader } from "@/features/portal/components/portal-page-header";
import { PortalTabBar } from "@/features/portal/components/portal-tab-bar";
import { formatDateTime, formatRelativeTime } from "@/features/portal/lib/format";
import { markNotificationsRead } from "@/server/actions/notifications";

export type NotificationRow = {
  id: string;
  type: "BOOKING" | "NEWSLETTER";
  title: string;
  message: string;
  href: string;
  createdAt: string;
  unread: boolean;
};

type Filter = "all" | "BOOKING" | "NEWSLETTER";

export function NotificationsPanel({
  items,
  unreadCount,
  initialFilter = "all",
}: {
  items: NotificationRow[];
  unreadCount: number;
  initialFilter?: Filter;
}) {
  const [filter, setFilter] = useState<Filter>(initialFilter);
  const [isPending, startTransition] = useTransition();
  const [cleared, setCleared] = useState(unreadCount === 0);

  const visible = useMemo(
    () => (filter === "all" ? items : items.filter((item) => item.type === filter)),
    [filter, items],
  );

  return (
    <div className="space-y-5">
      <PortalPageHeader
        title="Notifications"
        description="New session bookings and newsletter subscribers."
        actions={
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={isPending || cleared}
            onClick={() => {
              startTransition(async () => {
                await markNotificationsRead();
                setCleared(true);
              });
            }}
          >
            {cleared ? "All caught up" : "Mark all as read"}
          </Button>
        }
      />

      <PortalTabBar
        tabs={[
          { key: "all", label: `All (${items.length})` },
          {
            key: "BOOKING",
            label: `Bookings (${items.filter((item) => item.type === "BOOKING").length})`,
          },
          {
            key: "NEWSLETTER",
            label: `Subscribers (${items.filter((item) => item.type === "NEWSLETTER").length})`,
          },
        ]}
        active={filter}
        onChange={setFilter}
      />

      <Card>
        <CardContent className="p-0">
          {visible.length === 0 ? (
            <Empty className="py-12">
              <EmptyHeader>
                <EmptyTitle>No notifications yet</EmptyTitle>
                <EmptyDescription>
                  New bookings and newsletter sign-ups will appear here.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            <ul className="divide-y divide-border">
              {visible.map((item) => {
                const Icon = item.type === "BOOKING" ? CalendarDays : Mail;
                const unread = item.unread && !cleared;
                return (
                  <li key={item.id}>
                    <Link
                      href={item.href}
                      className={`flex gap-3 px-5 py-4 transition-colors hover:bg-muted/40 ${
                        unread ? "bg-primary-soft/40" : ""
                      }`}
                    >
                      <div className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-lg bg-muted text-muted-foreground">
                        <Icon className="size-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <p className="text-sm font-semibold">
                            {unread && (
                              <span className="mr-2 inline-block size-2 rounded-full bg-primary align-middle" />
                            )}
                            {item.title}
                          </p>
                          <span className="shrink-0 text-xs text-muted-foreground">
                            {formatRelativeTime(item.createdAt)}
                          </span>
                        </div>
                        <p className="mt-0.5 text-sm text-muted-foreground">
                          {item.message}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {formatDateTime(item.createdAt)}
                        </p>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export function NotificationsBell({
  items,
  unreadCount,
}: {
  items: NotificationRow[];
  unreadCount: number;
}) {
  const [open, setOpen] = useState(false);
  const [dismissed, setDismissed] = useState<string[]>([]);
  const [clearedAll, setClearedAll] = useState(false);
  const [isPending, startTransition] = useTransition();

  const unread = clearedAll
    ? []
    : items.filter((item) => item.unread && !dismissed.includes(item.id));
  const remaining = Math.max(0, unreadCount - dismissed.length);
  const badge = clearedAll ? 0 : remaining;

  const markOne = (id: string) => {
    setDismissed((current) => (current.includes(id) ? current : [...current, id]));
    startTransition(async () => {
      await markNotificationsRead(id);
    });
  };

  const markAll = () => {
    setClearedAll(true);
    startTransition(async () => {
      await markNotificationsRead();
    });
  };

  return (
    <div className="relative">
      <button
        type="button"
        aria-label="Notifications"
        onClick={() => setOpen((value) => !value)}
        className="relative grid size-9 place-items-center rounded-lg hover:bg-[var(--admin-bg)] transition-colors"
      >
        <Bell className="size-4" />
        {badge > 0 && (
          <span className="absolute top-1 right-1 grid h-4 min-w-4 place-items-center rounded-full bg-red-500 px-0.5 text-[10px] font-bold text-white">
            {badge > 9 ? "9+" : badge}
          </span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-12 z-20 w-96 overflow-hidden rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface)] shadow-xl">
            <div className="flex items-center justify-between gap-2 border-b border-[var(--admin-border)] px-4 py-3">
              <h3 className="text-sm font-semibold">Notifications</h3>
              {unread.length > 0 && (
                <button
                  type="button"
                  onClick={markAll}
                  disabled={isPending}
                  className="text-xs font-medium text-primary-deep hover:underline disabled:opacity-50"
                >
                  Mark all as read
                </button>
              )}
            </div>
            <div className="max-h-96 overflow-y-auto">
              {unread.length === 0 ? (
                <p className="px-4 py-6 text-center text-sm text-muted-foreground">
                  You&apos;re all caught up.
                </p>
              ) : (
                unread.slice(0, 8).map((item) => (
                  <div
                    key={item.id}
                    className="border-b border-[var(--admin-border)]/60 px-3 py-3 hover:bg-muted/40"
                  >
                    <Link
                      href={item.href}
                      onClick={() => {
                        markOne(item.id);
                        setOpen(false);
                      }}
                      className="block min-w-0"
                    >
                      <p className="text-sm font-medium">{item.title}</p>
                      <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
                        {item.message}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {formatRelativeTime(item.createdAt)}
                      </p>
                    </Link>
                    <button
                      type="button"
                      disabled={isPending}
                      onClick={() => markOne(item.id)}
                      className="mt-2 text-xs font-medium text-primary-deep hover:underline disabled:opacity-50"
                    >
                      Mark as read
                    </button>
                  </div>
                ))
              )}
            </div>
            <div className="border-t border-[var(--admin-border)] px-4 py-2">
              <Link
                href="/dashboard/notifications"
                onClick={() => setOpen(false)}
                className="text-xs font-medium text-primary-deep hover:underline"
              >
                View all notifications
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
