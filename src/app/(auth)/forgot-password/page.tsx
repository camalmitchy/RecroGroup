import type { Metadata } from "next";

import { AuthSplitLayout } from "@/features/auth/components/auth-split-layout";
import { ForgotPasswordForm } from "@/features/auth/components/forgot-password-form";

export const metadata: Metadata = {
  title: "Forgot password",
};

export default function ForgotPasswordPage() {
  return (
    <AuthSplitLayout
      imageSrc="/assets/grief-camp.jpg"
      imageAlt="Children in a therapeutic camp setting"
      quote={{
        text: "A compassionate space for healing, growth, and emotional wellness.",
        author: "Recro Group",
      }}
    >
      <ForgotPasswordForm />
    </AuthSplitLayout>
  );
}
