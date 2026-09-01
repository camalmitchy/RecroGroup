import type { Metadata } from "next";

import { AuthSplitLayout } from "@/features/auth/components/auth-split-layout";
import { SignUpForm } from "@/features/auth/components/sign-up-form";
import { isGoogleSignInAvailable } from "@/features/auth/lib/social";

export const metadata: Metadata = {
  title: "Join us",
};

export const dynamic = "force-dynamic";

export default async function JoinUsPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const { callbackUrl } = await searchParams;
  return (
    <AuthSplitLayout
      imageSrc="/assets/bg.png"
      imageAlt="Recro Group therapy background"
      quote={{
        text: "Walking with you, step by step.",
        author: "Recro Group",
      }}
    >
      <SignUpForm
        googleEnabled={isGoogleSignInAvailable()}
        callbackUrl={callbackUrl}
      />
    </AuthSplitLayout>
  );
}
