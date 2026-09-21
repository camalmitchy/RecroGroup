import { redirect } from "next/navigation";

import { StaffProfilePage } from "@/features/portal/components/staff-profile-page";
import { getRequiredSession } from "@/features/portal/lib/portal-guard";
import { getCustomerProfile } from "@/server/queries/profile";

export default async function PortalProfilePage() {
  const session = await getRequiredSession("/dashboard/profile");
  const profile = await getCustomerProfile(session.userId);

  if (!profile) {
    redirect("/dashboard");
  }

  return <StaffProfilePage user={profile.user} />;
}
