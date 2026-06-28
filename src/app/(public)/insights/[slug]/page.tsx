import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getArticleBySlug } from "@/features/public/insights/articles";
import { ArticlePage } from "@/features/public/insights/components/article-page";
import {
  articleMetaSlugs,
  getArticleMetaBySlug,
} from "@/features/public/insights/data";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return articleMetaSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleMetaBySlug(slug);

  if (!article) {
    return { title: "Article | Recro Group" };
  }

  return {
    title: `${article.title} | Recro Group Insights`,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      images: [{ url: article.image }],
    },
  };
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const article = getArticleMetaBySlug(slug);
  const body = getArticleBySlug(slug);

  if (!article || !body) {
    notFound();
  }

  return <ArticlePage article={article} sections={body.sections} />;
}
