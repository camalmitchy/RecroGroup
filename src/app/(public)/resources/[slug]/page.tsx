import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ResourceArticlePage } from "@/features/public/resources/components/resource-article-page";
import { resources } from "@/features/public/resources/data/resources-data";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return resources.map((resource) => ({
    slug: resource.slug,
  }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const resource = resources.find((r) => r.slug === slug);

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
  const resource = resources.find((r) => r.slug === slug);

  if (!resource) {
    notFound();
  }

  return <ResourceArticlePage resource={resource} />;
}
