"use client";

import type { ReactNode } from "react";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import type { PortalSession } from "@/features/portal/lib/session";
import { isStaff } from "@/features/portal/lib/roles";

import { PortalAppSidebar } from "./portal-app-sidebar";
import { PortalHeader } from "./portal-header";

type PortalShellProps = {
  session: PortalSession;
  children: ReactNode;
};

export function PortalShell({ session, children }: PortalShellProps) {
  if (!isStaff(session.role)) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-background">
        <header className="flex h-14 items-center justify-between border-b border-border px-4 lg:px-6">
          <p className="text-sm font-semibold">My dashboard</p>
          <a
            href="/"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Back to site
          </a>
        </header>
        <main className="container-page py-8">{children}</main>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <SidebarProvider>
        <PortalAppSidebar role={session.role} session={session} />
        <SidebarInset>
          <PortalHeader session={session} />
          <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
