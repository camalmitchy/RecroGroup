"use client";

import Link from "next/link";
import { LogOut } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import type { PortalSession } from "@/features/portal/lib/session";
import { ROLE_LABELS } from "@/features/portal/lib/roles";

type PortalHeaderProps = {
  session: PortalSession;
};

export function PortalHeader({ session }: PortalHeaderProps) {
  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b border-border px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />
      <div className="flex flex-1 items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">
            {session.name ?? "Portal user"}
          </p>
          <p className="truncate text-xs text-muted-foreground">
            {ROLE_LABELS[session.role]} · {session.email}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild variant="outline" size="sm" className="hidden sm:inline-flex">
            <Link href="/">Back to site</Link>
          </Button>
          <Button asChild variant="ghost" size="sm">
            <Link href="/login">
              <LogOut className="size-4" />
              Sign out
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
