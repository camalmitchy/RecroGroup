import type { Metadata } from "next";

import { AuthSplitLayout } from "@/features/auth/components/auth-split-layout";
import { SignInForm } from "@/features/auth/components/sign-in-form";
import { isGoogleSignInAvailable } from "@/features/auth/lib/social";

export const metadata: Metadata = {
  title: "Sign in",
};

export const dynamic = "force-dynamic";

export default async function LoginPage({
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
        text: "I left lighter than I came in.",
        author: "A Recro client",
      }}
    >
      <SignInForm
        googleEnabled={isGoogleSignInAvailable()}
        callbackUrl={callbackUrl}
      />
    </AuthSplitLayout>
  );
}
