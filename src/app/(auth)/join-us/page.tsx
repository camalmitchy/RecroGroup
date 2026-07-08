import type { Metadata } from "next";

import { AuthSplitLayout } from "@/features/auth/components/auth-split-layout";
import { SignUpForm } from "@/features/auth/components/sign-up-form";

export const metadata: Metadata = {
  title: "Join us",
};

export default function JoinUsPage() {
  return (
    <AuthSplitLayout
      imageSrc="/assets/bg.png"
      imageAlt="Recro Group therapy background"
      quote={{
        text: "Walking with you, step by step.",
        author: "Recro Group",
      }}
    >
      <SignUpForm />
    </AuthSplitLayout>
  );
}
