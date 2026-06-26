"use client";

import type { ReactNode } from "react";

import { AppSidebar } from "@/components/app-sidebar";
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
  return (
    <TooltipProvider>
      <SidebarProvider>
        <AppSidebar role={session.role} session={session} />
        <SidebarInset>
          <header className="flex h-14 shrink-0 items-center gap-2 border-b border-border px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">
                {session.name ?? "Portal user"}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {ROLE_LABELS[session.role]} · {session.email}
              </p>
            </div>
          </header>
          <main className="flex flex-1 flex-col gap-4 p-4 md:p-6">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
