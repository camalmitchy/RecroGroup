import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import type { Resource } from "../data/resources-data";
import { resources } from "../data/resources-data";
import { MarkdownContent } from "./markdown-content";

type ResourceArticlePageProps = {
  resource: Resource;
};

export function ResourceArticlePage({ resource }: ResourceArticlePageProps) {
  const related = resources
    .filter((r) => r.slug !== resource.slug && r.category === resource.category)
    .slice(0, 3);

  const fallbackRelated = resources
    .filter((r) => r.slug !== resource.slug)
    .slice(0, 3);

  const relatedArticles = related.length > 0 ? related : fallbackRelated;

  const publishedLabel = new Date(resource.publishedAt).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    },
  );

  return (
    <div className="bg-background py-12 md:py-16">
      <div className="container-page">
        <div className="mx-auto max-w-4xl">
          <Link
            href="/resources"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary-deep"
          >
            <ArrowLeft size={16} /> Back to resources
          </Link>

          <article className="mt-8 bg-white px-8 py-12 shadow-sm md:px-16 md:py-16">
            <header className="border-b border-border pb-6">
              <h1 className="font-serif text-3xl font-bold uppercase tracking-tight text-foreground md:text-4xl">
                {resource.title}
              </h1>
              <div className="mt-4 flex flex-wrap items-center gap-x-2 text-sm text-muted-foreground">
                <span>by recro001</span>
                <span>|</span>
                <time dateTime={resource.publishedAt}>{publishedLabel}</time>
                <span>|</span>
                <span>{resource.category}</span>
                <span>|</span>
                <span>0 comments</span>
              </div>
            </header>

            <div className="prose prose-slate mt-8 max-w-none">
              {resource.content ? (
                <MarkdownContent content={resource.content} />
              ) : (
                <p className="text-muted-foreground">
                  Article content coming soon.
                </p>
              )}
            </div>
          </article>

          {relatedArticles.length > 0 && (
            <aside className="mt-12">
              <h2 className="mb-6 text-lg font-semibold text-foreground">
                Recent Posts
              </h2>
              <div className="space-y-4">
                {relatedArticles.map((relatedArticle) => (
                  <Link
                    key={relatedArticle.slug}
                    href={`/resources/${relatedArticle.slug}`}
                    className="block text-sm text-primary-deep transition-colors hover:underline"
                  >
                    {relatedArticle.title}
                  </Link>
                ))}
              </div>
            </aside>
          )}
        </div>
      </div>
    </div>
  );
}
