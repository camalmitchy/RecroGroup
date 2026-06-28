import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ServiceDetailPage } from "@/features/public/services/components/service-detail-page";
import {
  getServiceBySlug,
  serviceSlugs,
} from "@/features/public/services/data";

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

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);

  if (!service) {
    notFound();
  }

  return <ServiceDetailPage service={service} />;
}
