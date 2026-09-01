"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, LayoutDashboard, LogOut, User } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSignOut } from "@/features/auth/lib/queries";
import { isStaff, parseAppRole } from "@/features/portal/lib/roles";
import { useSession } from "@/lib/auth-client";
import { userInitials } from "@/shared/lib/user-initials";

import { AccountIdentity } from "./account-identity";

const menuItemClassName =
  "hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground not-data-[variant=destructive]:focus:**:text-primary-foreground";

export function UserMenu() {
  const router = useRouter();
  const { data, isPending } = useSession();
  const signOut = useSignOut();
  const user = data?.user;

  if (isPending) {
    return (
      <span
        className="size-8 shrink-0 rounded-full bg-muted"
        aria-hidden="true"
      />
    );
  }

  if (!user) {
    return (
      <Button
        asChild
        variant="outline"
        className="hidden rounded-full border-2 lg:inline-flex"
        size="lg"
      >
        <Link href="/login">
          <ArrowRight className="mr-2 size-4" />
          Sign in
        </Link>
      </Button>
    );
  }

  const displayName = user.name?.trim() || user.email;
  const initials = userInitials(user.name, user.email);
  const staff = isStaff(parseAppRole(user.role));

  const handleSignOut = async () => {
    await signOut.mutateAsync();
    router.push("/");
    router.refresh();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="rounded-full outline-none transition hover:opacity-90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          aria-label={`Account menu for ${displayName}`}
        >
          <Avatar>
            {user.image ? (
              <AvatarImage src={user.image} alt="" />
            ) : null}
            <AvatarFallback className="bg-primary text-xs font-semibold text-primary-foreground">
              {initials}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={8} className="w-72 min-w-72">
        <DropdownMenuLabel className="p-2 font-normal">
          <AccountIdentity
            name={user.name}
            email={user.email}
            image={user.image}
          />
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild className={menuItemClassName}>
          <Link href="/profile">
            <User />
            Your profile
          </Link>
        </DropdownMenuItem>
        {staff ? (
          <DropdownMenuItem asChild className={menuItemClassName}>
            <Link href="/dashboard">
              <LayoutDashboard />
              Dashboard
            </Link>
          </DropdownMenuItem>
        ) : null}
        <DropdownMenuItem
          className={menuItemClassName}
          disabled={signOut.isPending}
          onClick={handleSignOut}
        >
          <LogOut />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
