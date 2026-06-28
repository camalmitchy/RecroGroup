import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, Clock, Quote } from "lucide-react";

import type { ArticleSection } from "../articles";
import type { ArticleContent } from "../data";
import { getAllArticles } from "../data";
import { ArticleShareSidebar } from "./article-share-sidebar";

type ArticlePageProps = {
  article: ArticleContent;
  sections: ArticleSection[];
};

function ArticleBody({ sections }: { sections: ArticleSection[] }) {
  let firstParagraph = true;

  return (
    <div className="space-y-7">
      {sections.map((section, index) => {
        switch (section.type) {
          case "paragraph": {
            const isFirst = firstParagraph;
            firstParagraph = false;
            if (isFirst) {
              return (
                <p
                  key={index}
                  className="text-base leading-[1.9] text-foreground/85 md:text-[17px]"
                >
                  <span className="float-left mr-3 mt-1 font-serif text-6xl leading-none text-primary-deep md:text-7xl">
                    {section.content.charAt(0)}
                  </span>
                  {section.content.slice(1)}
                </p>
              );
            }
            return (
              <p
                key={index}
                className="text-base leading-[1.9] text-foreground/85 md:text-[17px]"
              >
                {section.content}
              </p>
            );
          }
          case "heading":
            return (
              <h2
                key={index}
                className="pt-2 font-serif text-2xl text-primary-deep md:text-[2rem]"
              >
                {section.content}
              </h2>
            );
          case "list":
            return (
              <ul key={index} className="space-y-3.5">
                {section.items.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-base leading-relaxed text-foreground/85"
                  >
                    <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-primary-soft text-primary-deep">
                      <Check size={12} strokeWidth={2.5} />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            );
          case "quote":
            return (
              <blockquote
                key={index}
                className="relative overflow-hidden rounded-[1.75rem] bg-[#f2f6f3] px-8 py-8 md:px-10 md:py-10"
              >
                <Quote
                  size={48}
                  className="text-[#517a61] opacity-50"
                  fill="currentColor"
                />
                <p className="mt-4 max-w-2xl font-serif text-xl leading-relaxed text-foreground md:text-2xl">
                  &ldquo;{section.content}&rdquo;
                </p>
                {section.attribution && (
                  <footer className="mt-5 text-sm font-semibold text-primary-deep">
                    — {section.attribution}
                  </footer>
                )}
                <div className="pointer-events-none absolute right-0 bottom-0 hidden opacity-15 md:block">
                  <svg
                    width="160"
                    height="160"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#517a61"
                    strokeWidth="1"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
                    <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
                  </svg>
                </div>
              </blockquote>
            );
          default:
            return null;
        }
      })}
    </div>
  );
}

export function ArticlePage({ article, sections }: ArticlePageProps) {
  const related = getAllArticles()
    .filter((a) => a.slug !== article.slug && a.category === article.category)
    .slice(0, 3);

  const fallbackRelated = getAllArticles()
    .filter((a) => a.slug !== article.slug)
    .slice(0, 3);

  const relatedArticles =
    related.length > 0 ? related : fallbackRelated.slice(0, 3);

  return (
    <>
      <section className="relative min-h-[420px] overflow-hidden lg:min-h-[520px]">
        <Image
          src={article.image}
          alt=""
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/55 to-black/30" />

        <div className="relative z-10 flex min-h-[420px] items-end lg:min-h-[520px]">
          <div className="container-page w-full py-12 md:py-16">
            <Link
              href="/insights"
              className="inline-flex items-center gap-2 text-sm text-white/90 transition-colors hover:text-white"
            >
              <ArrowLeft size={16} /> Back to insights
            </Link>

            <div className="mt-8 max-w-3xl">
              <span className="inline-flex rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                {article.category}
              </span>
              <h1 className="mt-5 font-serif text-4xl leading-[1.08] tracking-tight text-white drop-shadow md:text-5xl lg:text-6xl">
                {article.title}
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/90 md:text-lg">
                {article.excerpt}
              </p>
              <div className="mt-6 flex items-center gap-3">
                <div className="relative size-10 overflow-hidden rounded-full ring-2 ring-white/30">
                  <Image
                    src="/assets/founder-portrait.jpg"
                    alt="Dr. Michelle Karume"
                    fill
                    className="object-cover object-top"
                    sizes="40px"
                  />
                </div>
                <div className="text-sm text-white/90">
                  <p className="font-semibold text-white">Dr. Michelle Karume</p>
                  <p className="inline-flex items-center gap-1.5 text-white/80">
                    <Clock size={14} />
                    {article.readTime} read
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-background">
        <div className="container-page py-12 md:py-16 lg:py-20">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-2">
              <ArticleShareSidebar title={article.title} />
            </div>
            <article className="lg:col-span-8">
              <ArticleBody sections={sections} />
            </article>
          </div>
        </div>
      </section>

      <section className="bg-background pb-16 md:pb-20">
        <div className="container-page">
          <div className="relative flex min-h-[280px] flex-col items-center justify-between overflow-hidden rounded-[2rem] bg-[#e8e4db] md:flex-row">
            <div className="relative h-48 w-full shrink-0 md:h-auto md:min-h-[280px] md:w-1/4">
              <Image
                src="/assets/journey-camp.jpg"
                alt=""
                fill
                className="object-cover"
                sizes="25vw"
              />
            </div>

            <div className="z-10 flex-1 px-6 py-10 text-center md:py-8">
              <h2 className="font-serif text-3xl tracking-tight text-foreground md:text-4xl">
                Need someone to walk with you?
              </h2>
              <p className="mx-auto mt-4 max-w-md text-foreground/80">
                If this article resonated, a first conversation with our team
                is a quiet, confidential place to start.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <Link href="/join-us" className="btn-primary">
                  Book a session
                </Link>
                <Link href="/contact" className="btn-secondary">
                  Contact us
                </Link>
              </div>
            </div>

            <div className="relative h-48 w-full shrink-0 md:h-auto md:min-h-[280px] md:w-1/4">
              <Image
                src="/assets/journey-connection.jpg"
                alt=""
                fill
                className="object-cover"
                sizes="25vw"
              />
            </div>
          </div>
        </div>
      </section>

      {relatedArticles.length > 0 && (
        <section className="border-t border-border bg-surface pb-16 md:pb-20">
          <div className="container-page pt-12 md:pt-16">
            <h2 className="font-serif text-3xl text-foreground md:text-4xl">
              Related reading
            </h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedArticles.map((relatedArticle) => (
                <Link
                  key={relatedArticle.slug}
                  href={`/insights/${relatedArticle.slug}`}
                  className="group card-lift overflow-hidden rounded-2xl border border-border bg-card"
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={relatedArticle.image}
                      alt={relatedArticle.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                  <div className="p-5">
                    <p className="text-[10px] font-semibold tracking-[0.2em] text-primary-deep uppercase">
                      {relatedArticle.category}
                    </p>
                    <h3 className="mt-2 line-clamp-2 font-serif text-xl leading-snug">
                      {relatedArticle.title}
                    </h3>
                    <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary-deep">
                      Read article <ArrowRight size={13} />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
