// Sign-in, join, and password reset. These pages do not use the public header.
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Account",
};

export const dynamic = "force-dynamic";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
