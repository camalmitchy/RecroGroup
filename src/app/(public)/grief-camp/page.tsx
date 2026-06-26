import type { Metadata } from "next";

import { GriefCampPage } from "@/features/public/grief-camp/components/grief-camp-page";

export const metadata: Metadata = {
  title: "Grief Camp 2026 | Recro Group",
  description:
    "Retreat for adolescents (10–16) who have lost a parent or sibling. Recro Grief Camp 14–16 August 2026.",
  openGraph: {
    title: "Recro Grief Camp 2026",
    description: "A safe place to grieve out loud — 14–16 August 2026.",
  },
};

export default function Page() {
  return <GriefCampPage />;
}
