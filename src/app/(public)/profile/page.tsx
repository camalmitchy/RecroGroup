import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { loginUrl } from "@/features/auth/lib/redirect";
import { ProfilePage } from "@/features/public/profile/components/profile-page";
import { getOptionalSession } from "@/server/authz";
import { getCustomerProfile } from "@/server/queries/profile";

export const metadata: Metadata = {
  title: "Your profile — Recro Group",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function Page() {
  const session = await getOptionalSession();
  if (!session) {
    redirect(loginUrl("/profile"));
  }

  const profile = await getCustomerProfile(session.userId);
  if (!profile) {
    redirect(loginUrl("/profile"));
  }

  return <ProfilePage user={profile.user} bookings={profile.bookings} />;
}
