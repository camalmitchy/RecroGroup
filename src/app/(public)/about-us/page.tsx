import type { Metadata } from "next";

import { AboutPage } from "@/features/public/about/components/about-page";

export const metadata: Metadata = {
  title: "About Recro Group | Behavioral health for Kenyan families",
  description:
    "Recro Group is a Behavioral Health Organization using psychotherapy to walk alongside individuals, families, couples, groups and organizations.",
  openGraph: {
    title: "About Recro Group",
    description:
      "A holistic, systemic approach to healing for individuals, families, couples, groups and organisations.",
  },
};

export default function Page() {
  return <AboutPage />;
}
