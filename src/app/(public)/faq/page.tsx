import type { Metadata } from "next";

import { FaqPage } from "@/features/public/faq/components/faq-page";

export const metadata: Metadata = {
  title: "FAQ | Recro Group",
  description:
    "Answers to common questions about therapy, fees, confidentiality, sessions and Grief Camp at Recro Group.",
  openGraph: {
    title: "FAQ | Recro Group",
    description:
      "Answers to common questions about therapy, fees, confidentiality, sessions and Grief Camp at Recro Group.",
    url: "/faq",
  },
};

export default function Page() {
  return <FaqPage />;
}
