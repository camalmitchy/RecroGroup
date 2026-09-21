"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { Search, User, LogOut, Home } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { AppSidebar } from "@/components/app-sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  NotificationsBell,
  type NotificationRow,
} from "@/features/portal/components/notifications-panel";
import type { PortalSession } from "@/features/portal/lib/session";
import { ROLE_LABELS } from "@/features/portal/lib/roles";
import { useSignOut } from "@/features/auth/lib/queries";

type PortalShellProps = {
  session: PortalSession;
  children: ReactNode;
  notifications?: NotificationRow[];
  unreadCount?: number;
};

function initialsFor(name: string | null, email: string) {
  const source = name?.trim() || email;
  const parts = source.split(/[\s@._-]+/).filter(Boolean);
  return (parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "");
}

export function PortalShell({
  session,
  children,
  notifications = [],
  unreadCount = 0,
}: PortalShellProps) {
  const router = useRouter();
  const signOut = useSignOut();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const isStaff =
    session.role === "admin" || session.role === "receptionist";

  const handleSignOut = async () => {
    await signOut.mutateAsync();
    router.push("/login");
    router.refresh();
  };

  return (
    <TooltipProvider>
      <SidebarProvider>
        <AppSidebar role={session.role} session={session} />
        <SidebarInset className="bg-[var(--admin-bg)]">
          <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center gap-4 border-b border-[var(--admin-border)] bg-[var(--admin-surface)] px-4 md:px-6">
            <SidebarTrigger className="-ml-1 lg:hidden" />

            <div className="ml-auto flex items-center gap-3">
              {isStaff && (
                <div className="relative w-56 md:w-80">
                  <Search className="absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search bookings, customers…"
                    className="h-9 bg-[var(--admin-bg)] pl-9"
                  />
                </div>
              )}
              {isStaff && (
                <NotificationsBell items={notifications} unreadCount={unreadCount} />
              )}

              <div className="relative">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => setShowProfileMenu(!showProfileMenu)}
                      className="group relative size-9 overflow-hidden rounded-full shadow-sm transition-all duration-200 hover:scale-105 hover:shadow-md ring-2 ring-background"
                    >
                      <Avatar className="size-9">
                        {session.image ? (
                          <AvatarImage src={session.image} alt="" />
                        ) : null}
                        <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-xs font-semibold text-primary-foreground uppercase">
                          {initialsFor(session.name, session.email)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute inset-0 rounded-full bg-white/0 group-hover:bg-white/10 transition-colors duration-200" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="text-xs">
                    <p>Profile & Sign out</p>
                  </TooltipContent>
                </Tooltip>

                {/* Profile Dropdown */}
                {showProfileMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setShowProfileMenu(false)}
                    />
                    <div className="absolute right-0 top-12 z-20 w-72 bg-[var(--admin-surface)] border border-[var(--admin-border)] rounded-xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                      {/* User Info Header */}
                      <div className="px-4 py-3 bg-gradient-to-br from-muted/50 to-muted border-b border-[var(--admin-border)]">
                        <div className="flex items-center gap-3">
                          <Avatar className="size-10">
                            {session.image ? (
                              <AvatarImage src={session.image} alt="" />
                            ) : null}
                            <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-sm font-semibold text-primary-foreground uppercase">
                              {initialsFor(session.name, session.email)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold truncate">
                              {session.name ?? "User"}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                              {ROLE_LABELS[session.role]}
                            </p>
                          </div>
                        </div>
                        <div className="mt-2 pt-2 border-t border-[var(--admin-border)]/50">
                          <p className="text-xs text-muted-foreground truncate">
                            {session.email}
                          </p>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="p-2">
                        <Link
                          href="/"
                          onClick={() => setShowProfileMenu(false)}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-muted/50 transition-colors"
                        >
                          <div className="size-8 rounded-lg bg-muted grid place-items-center">
                            <Home className="size-4" />
                          </div>
                          <span>Back to home (Customer)</span>
                        </Link>
                        <Link
                          href="/dashboard/profile"
                          onClick={() => setShowProfileMenu(false)}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-muted/50 transition-colors"
                        >
                          <div className="size-8 rounded-lg bg-muted grid place-items-center">
                            <User className="size-4" />
                          </div>
                          <span>Profile Settings</span>
                        </Link>
                        <button
                          onClick={handleSignOut}
                          disabled={signOut.isPending}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 disabled:opacity-50 transition-colors"
                        >
                          <div className="size-8 rounded-lg bg-destructive/10 grid place-items-center">
                            <LogOut className="size-4" />
                          </div>
                          <span>{signOut.isPending ? "Signing out…" : "Sign Out"}</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </header>
          <main className="flex flex-1 flex-col gap-4 p-4 md:p-6 lg:p-8">
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
