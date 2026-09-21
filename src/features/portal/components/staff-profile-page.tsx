import { Shield } from "lucide-react";

import { PortalPageHeader } from "@/features/portal/components/portal-page-header";
import { ProfileEditor } from "@/features/profile/components/profile-editor";
import { formatDate } from "@/features/portal/lib/format";
import { parseAppRole, ROLE_LABELS } from "@/features/portal/lib/roles";

type StaffProfileUser = {
  name: string;
  email: string;
  image: string | null;
  phone: string | null;
  role: string | null;
  commsEmail: boolean;
  commsSms: boolean;
  createdAt: Date;
};

function Detail({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Shield;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-[var(--admin-border)] bg-[var(--admin-bg)] px-4 py-3">
      <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg bg-muted text-muted-foreground">
        <Icon className="size-4" />
      </span>
      <div className="min-w-0">
        <p className="text-xs font-medium tracking-[0.14em] text-muted-foreground uppercase">
          {label}
        </p>
        <p className="mt-1 truncate text-sm font-medium text-foreground">{value}</p>
      </div>
    </div>
  );
}

export function StaffProfilePage({ user }: { user: StaffProfileUser }) {
  const role = parseAppRole(user.role);
  const notifications = [
    user.commsEmail ? "Email" : null,
    user.commsSms ? "SMS" : null,
  ]
    .filter(Boolean)
    .join(" and ");

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6">
      <PortalPageHeader
        title="Profile"
        description="Update your name, contact number, and photo. These details are stored on your account."
      />

      <section className="rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-surface)] p-6 shadow-sm">
        <ProfileEditor
          appearance="staff"
          user={{
            name: user.name,
            email: user.email,
            image: user.image,
            phone: user.phone,
          }}
        />

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <Detail icon={Shield} label="Role" value={ROLE_LABELS[role]} />
        </div>

        <dl className="mt-6 grid gap-4 border-t border-[var(--admin-border)] pt-5 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-muted-foreground">Member since</dt>
            <dd className="mt-1 font-medium">{formatDate(user.createdAt)}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Notifications</dt>
            <dd className="mt-1 font-medium">{notifications || "None"}</dd>
          </div>
        </dl>
      </section>
    </div>
  );
}
