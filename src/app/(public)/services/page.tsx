import type { Metadata } from "next";

import { ServicesPage } from "@/features/public/services/components/services-page";

export const metadata: Metadata = {
  title: "Services | Therapy, therapy & corporate speaking — Recro Group",
  description:
    "Explore Recro Group's services: individual, couples, family and group therapy, clinical supervision, consortium membership, children's grief support, and corporate speaking programs.",
  openGraph: {
    title: "Services | Recro Group",
    description:
      "Individual, couples, family and group therapy, supervision, consortium membership, grief camps, and corporate speaking.",
  },
};

export default function Page() {
  return <ServicesPage />;
}
