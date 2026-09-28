import type { Metadata } from "next";

import { HomePage } from "@/features/public/home/components/home-page";
import {
  listPublishedMedia,
  listPublishedResources,
} from "@/server/queries/catalog";
import { listBookableServices } from "@/server/queries/bookable-services";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Recro Group — Restoring families through therapy & care",
  description:
    "Recro Group offers psychotherapy, family and couples therapy, children's grief support and corporate speaking across Kenya. Book a safe, professional session today.",
  openGraph: {
    title: "Recro Group — Restoring families",
    description:
      "Bright, hopeful behavioral health care for individuals, couples, families, children and corporate teams.",
  },
};

export default async function Page() {
  const [resources, videos, services] = await Promise.all([
    listPublishedResources(),
    listPublishedMedia(),
    listBookableServices(),
  ]);

  return (
    <HomePage
      resources={resources}
      videos={videos}
      bookableServices={services.map((service) => ({
        value: service.slug,
        label: service.title,
      }))}
    />
  );
}
