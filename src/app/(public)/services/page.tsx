import type { Metadata } from "next";

import { ServicesPage } from "@/features/public/services/components/services-page";
import { serviceList, type ServiceListItem } from "@/features/public/services/data";
import {
  formatServiceDuration,
  formatServicePrice,
  listPublishedServices,
} from "@/server/queries/bookable-services";
import { PROGRAM_SERVICE_SLUGS } from "@/server/validation/booking";

export const dynamic = "force-dynamic";

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

const FALLBACK_ICON = "/assets/icons/individual-therapy.svg";
const programSlugs = new Set<string>(PROGRAM_SERVICE_SLUGS);

function withLiveCatalog(
  catalog: Awaited<ReturnType<typeof listPublishedServices>>,
): ServiceListItem[] {
  const bySlug = new Map(catalog.map((service) => [service.slug, service]));
  const known = new Set(serviceList.map((service) => service.slug));

  const listed = serviceList.map((service) => {
    const live = bySlug.get(service.slug);
    if (!live) return service;
    return {
      ...service,
      title: live.title || service.title,
      description: live.description?.trim() || service.description,
      duration: live.durationMin
        ? formatServiceDuration(live.durationMin)
        : service.duration,
      price: live.priceKes ? formatServicePrice(live.priceKes) : service.price,
    };
  });

  const added = catalog
    .filter(
      (service) =>
        !known.has(service.slug) &&
        !programSlugs.has(service.slug) &&
        (service.priceKes ?? 0) > 0,
    )
    .map((service, index) => ({
      id: String(serviceList.length + index + 1).padStart(2, "0"),
      slug: service.slug,
      icon: FALLBACK_ICON,
      title: service.title,
      description:
        service.description?.trim() ||
        "Book this session and pay the M-Pesa commitment to confirm it.",
      duration: formatServiceDuration(service.durationMin) || "By arrangement",
      price: formatServicePrice(service.priceKes),
    }));

  return [...listed, ...added];
}

export default async function Page() {
  const catalog = await listPublishedServices();
  return <ServicesPage services={withLiveCatalog(catalog)} />;
}
