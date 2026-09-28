import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ServiceDetailPage } from "@/features/public/services/components/service-detail-page";
import {
  getServiceBySlug,
  serviceSlugs,
  type ServiceDetail,
} from "@/features/public/services/data";
import { prisma } from "@/lib/prisma";
import {
  formatServiceDuration,
  formatServicePrice,
} from "@/server/queries/bookable-services";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return serviceSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlug(slug);

  if (!service) {
    return { title: "Service | Recro Group" };
  }

  return {
    title: `${service.title} | Recro Group`,
    description: service.intro.slice(0, 155),
    openGraph: {
      title: `${service.title} | Recro Group`,
      description: service.intro.slice(0, 155),
    },
  };
}

async function withLiveCatalog(slug: string, service: ServiceDetail) {
  const live = await prisma.service.findUnique({
    where: { slug },
    select: {
      title: true,
      priceKes: true,
      durationMin: true,
      isPublished: true,
    },
  });

  if (!live?.isPublished) return service;

  return {
    ...service,
    title: live.title || service.title,
    duration: live.durationMin
      ? formatServiceDuration(live.durationMin)
      : service.duration,
    pricing: live.priceKes ? formatServicePrice(live.priceKes) : service.pricing,
  };
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);

  if (!service) {
    notFound();
  }

  return <ServiceDetailPage service={await withLiveCatalog(slug, service)} />;
}
