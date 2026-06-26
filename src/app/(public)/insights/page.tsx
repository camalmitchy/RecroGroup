import type { Metadata } from "next";

import { InsightsPage } from "@/features/public/insights/components/insights-page";

export const metadata: Metadata = {
  title: "Insights | Articles, talks & resources — Recro Group",
  description:
    "Articles, talks, and resources from our therapists to help you navigate relationships, grief, and life.",
  openGraph: {
    title: "Insights | Recro Group",
    description:
      "Articles, talks, and resources from our therapists to help you navigate relationships, grief, and life.",
  },
};

export default function Page() {
  return <InsightsPage />;
}
