import Link from "next/link";
import type { ReactNode } from "react";
import type { UserRole } from "@prisma/client";

import { Button } from "@/components/ui/button";
import { isStaff } from "@/features/portal/lib/roles";

import { PortalSidebar } from "./portal-sidebar";

type PortalShellProps = {
  role: UserRole;
  children: ReactNode;
};

export function PortalShell({ role, children }: PortalShellProps) {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col bg-background">
      <header className="flex h-14 items-center justify-between border-b border-border px-4 lg:px-6">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-sm font-semibold text-foreground">
            Recro Group
          </Link>
          <span className="text-muted-foreground">/</span>
          <span className="text-sm text-muted-foreground">Dashboard</span>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link href="/">Back to site</Link>
        </Button>
      </header>

      <div className="flex flex-1">
        {isStaff(role) && <PortalSidebar role={role} />}
        <main className="flex-1 overflow-auto p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
