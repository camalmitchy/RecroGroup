"use client";

import type { ReactNode } from "react";
import { Bell, Search } from "lucide-react";

import { AppSidebar } from "@/components/app-sidebar";
import { Input } from "@/components/ui/input";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { TooltipProvider } from "@/components/ui/tooltip";
import type { PortalSession } from "@/features/portal/lib/session";
import { ROLE_LABELS } from "@/features/portal/lib/roles";

type PortalShellProps = {
  session: PortalSession;
  children: ReactNode;
};

export function PortalShell({ session, children }: PortalShellProps) {
  const isStaff =
    session.role === "admin" || session.role === "receptionist";

  return (
    <TooltipProvider>
      <SidebarProvider>
        <AppSidebar role={session.role} session={session} />
        <SidebarInset className="bg-[var(--admin-bg)]">
          <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center gap-4 border-b border-[var(--admin-border)] bg-[var(--admin-surface)] px-4 md:px-6">
            <SidebarTrigger className="-ml-1 lg:hidden" />
            <Separator orientation="vertical" className="mr-2 hidden h-4 lg:block" />
            {isStaff ? (
              <div className="relative max-w-md flex-1">
                <Search className="absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search bookings, customers…"
                  className="h-9 bg-[var(--admin-bg)] pl-9"
                />
              </div>
            ) : (
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">
                  {session.name ?? "Portal user"}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {ROLE_LABELS[session.role]} · {session.email}
                </p>
              </div>
            )}
            {isStaff && (
              <>
                <button
                  type="button"
                  aria-label="Notifications"
                  className="grid size-9 place-items-center rounded-lg hover:bg-[var(--admin-bg)]"
                >
                  <Bell className="size-4" />
                </button>
                <div className="hidden min-w-0 sm:block">
                  <p className="truncate text-sm font-medium">
                    {session.name ?? "Staff user"}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {ROLE_LABELS[session.role]}
                  </p>
                </div>
              </>
            )}
          </header>
          <main className="flex flex-1 flex-col gap-4 p-4 md:p-6 lg:p-8">
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
