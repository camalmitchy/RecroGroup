import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ResourceArticlePage } from "@/features/public/resources/components/resource-article-page";
import {
  getPublishedResourceBySlug,
  listRelatedResources,
} from "@/server/queries/catalog";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const resource = await getPublishedResourceBySlug(slug);

  if (!resource) {
    return {
      title: "Resource Not Found — Recro Group",
    };
  }

  return {
    title: `${resource.title} — Recro Group`,
    description: resource.excerpt,
    openGraph: {
      title: resource.title,
      description: resource.excerpt,
      url: `/resources/${resource.slug}`,
    },
  };
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const resource = await getPublishedResourceBySlug(slug);

  if (!resource) {
    notFound();
  }

  const related = await listRelatedResources(resource.slug, resource.category);

  return <ResourceArticlePage resource={resource} related={related} />;
}
