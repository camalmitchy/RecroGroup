import { SiteShell } from "@/shared/components/site-shell/site-shell";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <SiteShell>{children}</SiteShell>;
}
