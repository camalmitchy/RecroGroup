"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { Bell, Search, User, LogOut } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { AppSidebar } from "@/components/app-sidebar";
import { Input } from "@/components/ui/input";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { PortalSession } from "@/features/portal/lib/session";
import { ROLE_LABELS } from "@/features/portal/lib/roles";
import { useSignOut } from "@/features/auth/lib/queries";

type PortalShellProps = {
  session: PortalSession;
  children: ReactNode;
};

function initialsFor(name: string | null, email: string) {
  const source = name?.trim() || email;
  const parts = source.split(/[\s@._-]+/).filter(Boolean);
  return (parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "");
}

export function PortalShell({ session, children }: PortalShellProps) {
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
              <div className="flex-1" />
            )}

            {/* User Profile Section */}
            <div className="flex items-center gap-3">
              {isStaff && (
                <button
                  type="button"
                  aria-label="Notifications"
                  className="grid size-9 place-items-center rounded-lg hover:bg-[var(--admin-bg)] transition-colors"
                >
                  <Bell className="size-4" />
                </button>
              )}

              <div className="relative">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => setShowProfileMenu(!showProfileMenu)}
                      className="group relative size-9 rounded-full bg-gradient-to-br from-primary to-primary/80 text-primary-foreground grid place-items-center text-xs font-semibold uppercase shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105 ring-2 ring-background"
                    >
                      {initialsFor(session.name, session.email)}
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
                          <div className="size-10 rounded-full bg-gradient-to-br from-primary to-primary/80 text-primary-foreground grid place-items-center text-sm font-semibold uppercase shadow-sm">
                            {initialsFor(session.name, session.email)}
                          </div>
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
                          href="/dashboard/settings"
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
