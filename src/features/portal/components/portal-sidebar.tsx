"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { AppRole } from "@/features/portal/lib/roles";

import { cn } from "@/lib/utils";
import { getNavForRole } from "@/features/portal/lib/permissions";
import { ROLE_LABELS } from "@/features/portal/lib/roles";

type PortalSidebarProps = {
  role: AppRole;
};

export function PortalSidebar({ role }: PortalSidebarProps) {
  const pathname = usePathname();
  const items = getNavForRole(role);
  const groups = [...new Set(items.map((item) => item.group))];

  return (
    <aside className="hidden w-60 shrink-0 border-r border-border bg-card lg:block">
      <div className="border-b border-border px-5 py-4">
        <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
          Portal
        </p>
        <p className="mt-1 text-sm font-medium">{ROLE_LABELS[role]}</p>
      </div>
      <nav className="space-y-6 p-3">
        {groups.map((group) => (
          <div key={group}>
            <p className="px-3 pb-2 text-[11px] font-semibold tracking-widest text-muted-foreground uppercase">
              {group}
            </p>
            <ul className="space-y-1">
              {items
                .filter((item) => item.group === group)
                .map((item) => {
                  const isActive =
                    item.href === "/dashboard"
                      ? pathname === "/dashboard"
                      : pathname.startsWith(item.href);
                  const Icon = item.icon;

                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={cn(
                          "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                          isActive
                            ? "bg-primary/10 text-primary"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground",
                        )}
                      >
                        <Icon className="size-4" />
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}
