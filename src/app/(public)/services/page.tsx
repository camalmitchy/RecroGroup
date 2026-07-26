import type { Metadata } from "next";

import { ServicesPage } from "@/features/public/services/components/services-page";

export const metadata: Metadata = {
  title: "Services | Therapy, therapy & corporate speaking — Recro Group",
  description:
    "Explore Recro Group's services: individual therapy, couples and family therapy, children's grief support, group therapy and corporate speaking programs.",
  openGraph: {
    title: "Services | Recro Group",
    description:
      "Individual therapy, couples and family therapy, grief camps, group therapy and corporate speaking.",
  },
};

export default function Page() {
  return <ServicesPage />;
}
