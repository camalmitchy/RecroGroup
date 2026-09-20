import type { Metadata } from "next";

import { ServicesPage } from "@/features/public/services/components/services-page";

export const metadata: Metadata = {
  title: "Services | Therapy, therapy & corporate speaking — Recro Group",
  description:
    "Explore Recro Group's services: individual, couples, family and group therapy, grief camp, corporate speaking, consortium, and supervision.",
  openGraph: {
    title: "Services | Recro Group",
    description:
      "Individual, couples, family and group therapy, grief camps, corporate speaking, consortium, and clinical supervision.",
  },
};

export default function Page() {
  return <ServicesPage />;
}
