"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { userHandle, userInitials } from "@/shared/lib/user-initials";

type AccountIdentityProps = {
  name?: string | null;
  email: string;
  image?: string | null;
};

export function AccountIdentity({ name, email, image }: AccountIdentityProps) {
  const handle = userHandle(email);
  const fullName = name?.trim() || null;
  const initials = userInitials(name, email);
  const showName = Boolean(
    fullName && fullName.toLowerCase() !== handle.toLowerCase(),
  );

  return (
    <div className="flex items-center gap-3">
      <Avatar className="size-12 ring-1 ring-border">
        {image ? <AvatarImage src={image} alt={fullName || handle} /> : null}
        <AvatarFallback className="bg-primary text-sm font-semibold text-primary-foreground">
          {initials}
        </AvatarFallback>
      </Avatar>
      <div className="min-w-0 leading-tight">
        <p className="truncate text-[15px] font-semibold text-foreground">
          {handle}
        </p>
        {showName ? (
          <p className="truncate text-sm text-muted-foreground">{fullName}</p>
        ) : null}
      </div>
    </div>
  );
}
