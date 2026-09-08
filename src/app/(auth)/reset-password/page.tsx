import type { Metadata } from "next";

import { AuthSplitLayout } from "@/features/auth/components/auth-split-layout";
import { ResetPasswordForm } from "@/features/auth/components/reset-password-form";

export const metadata: Metadata = {
  title: "Reset password",
};

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  return (
    <AuthSplitLayout
      imageSrc="/assets/grief-camp.jpg"
      imageAlt="Children in a therapeutic camp setting"
      quote={{
        text: "A compassionate space for healing, growth, and emotional wellness.",
        author: "Recro Group",
      }}
    >
      <ResetPasswordForm token={token} />
    </AuthSplitLayout>
  );
}
