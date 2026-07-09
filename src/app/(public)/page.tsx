import type { Metadata } from "next";

import { HomePage } from "@/features/public/home/components/home-page";

export const metadata: Metadata = {
  title: "Recro Group — Restoring families through therapy & care",
  description:
    "Recro Group offers psychotherapy, family and couples therapy, children's grief support and corporate wellness across Kenya. Book a safe, professional session today.",
  openGraph: {
    title: "Recro Group — Restoring families",
    description:
      "Bright, hopeful behavioral health care for individuals, couples, families, children and corporate teams.",
  },
};

export default function Page() {
  return <HomePage />;
}
