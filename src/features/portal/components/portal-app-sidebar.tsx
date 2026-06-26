"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import type { PortalSession } from "@/features/portal/lib/session";
import { getNavForRole } from "@/features/portal/lib/permissions";
import { ROLE_LABELS, type AppRole } from "@/features/portal/lib/roles";

type PortalAppSidebarProps = {
  role: AppRole;
  session: PortalSession;
};

export function PortalAppSidebar({ role, session }: PortalAppSidebarProps) {
  const pathname = usePathname();
  const items = getNavForRole(role);
  const groups = [...new Set(items.map((item) => item.group))];

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/dashboard">
                <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
                  R
                </span>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Recro Portal</span>
                  <span className="truncate text-xs text-muted-foreground">
                    {ROLE_LABELS[role]}
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {groups.map((group) => (
          <SidebarGroup key={group}>
            <SidebarGroupLabel>{group}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items
                  .filter((item) => item.group === group)
                  .map((item) => {
                    const isActive =
                      item.href === "/dashboard"
                        ? pathname === "/dashboard"
                        : pathname.startsWith(item.href);
                    const Icon = item.icon;

                    return (
                      <SidebarMenuItem key={item.href}>
                        <SidebarMenuButton
                          asChild
                          isActive={isActive}
                          tooltip={item.label}
                        >
                          <Link href={item.href}>
                            <Icon />
                            <span>{item.label}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Back to site">
              <Link href="/">← Back to site</Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <p className="truncate px-2 py-1 text-xs text-muted-foreground">
          {session.name ?? session.email}
        </p>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
