"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Mail, Play } from "lucide-react";

import {
  TEASER_COUNT,
  allContent,
  categories,
  filterInsights,
  getFeaturedContent,
  popularVideos,
  type InsightCategory,
  type InsightContent,
} from "../data";
import { InsightsVideoCard } from "./insights-video-card";

function scrollToFilterBar() {
  document
    .getElementById("filter-bar")
    ?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function InsightCard({ content }: { content: InsightContent }) {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <article className="card-lift flex flex-col overflow-hidden rounded-3xl border border-border bg-card">
      {content.type === "video" ? (
        <div className="relative aspect-video bg-black">
          {!isPlaying ? (
            <>
              <Image
                src={content.thumbnail}
                alt={content.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 25vw"
              />
              <div className="absolute inset-0 bg-black/20 transition-colors group-hover:bg-black/30" />
              <button
                type="button"
                onClick={() => setIsPlaying(true)}
                aria-label={`Play ${content.title}`}
                className="absolute inset-0 grid place-items-center"
              >
                <span className="grid h-14 w-14 place-items-center rounded-full bg-white/95 text-primary-deep shadow-lg backdrop-blur transition-transform hover:scale-110">
                  <Play size={20} className="ml-0.5" fill="currentColor" />
                </span>
              </button>
              <div className="absolute right-3 bottom-3 rounded bg-black/70 px-2 py-0.5 text-xs font-medium text-white">
                {content.duration}
              </div>
            </>
          ) : (
            <iframe
              src={`https://www.youtube.com/embed/${content.videoId}?autoplay=1&rel=0`}
              title={content.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 size-full"
            />
          )}
        </div>
      ) : (
        <div className="relative aspect-video overflow-hidden bg-surface-2">
          <Image
            src={content.image}
            alt={content.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 25vw"
          />
        </div>
      )}

      <div className="flex flex-1 flex-col p-6">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="rounded-full bg-primary-soft px-2.5 py-1 font-semibold text-primary-deep">
            {content.category}
          </span>
          <span className="rounded-full bg-surface px-2.5 py-1 font-medium text-muted-foreground">
            {content.type === "video" ? "Video" : "Article"}
          </span>
          {content.type === "article" && (
            <span className="text-muted-foreground">
              {content.readTime} read
            </span>
          )}
          {content.type === "video" && (
            <span className="text-muted-foreground">{content.duration}</span>
          )}
        </div>
        <h3 className="mt-4 line-clamp-2 text-lg leading-snug font-semibold">
          {content.title}
        </h3>
        <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-muted-foreground">
          {content.excerpt}
        </p>
        <Link
          href={
            content.type === "article"
              ? `/insights/${content.slug}`
              : "/insights"
          }
          className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary-deep"
        >
          {content.type === "video" ? "Watch now" : "Read article"}
          <ArrowRight size={13} />
        </Link>
      </div>
    </article>
  );
}

export function InsightsPage() {
  const [activeCategory, setActiveCategory] = useState<InsightCategory>("All");
  const [email, setEmail] = useState("");

  const featuredContent = getFeaturedContent();
  const filteredContentAll = filterInsights(allContent, activeCategory);
  const isTeaser = activeCategory === "All";
  const filteredContent = isTeaser
    ? filteredContentAll.slice(0, TEASER_COUNT)
    : filteredContentAll;

  const handleSelectCategory = (cat: InsightCategory) => {
    setActiveCategory(cat);
    if (cat !== "All") {
      scrollToFilterBar();
    }
  };

  const showArticlesLink =
    activeCategory === "All" || activeCategory !== "Articles";

  return (
    <>
      <section className="relative overflow-hidden bg-surface">
        <div className="absolute inset-0">
          <div className="absolute inset-y-0 right-0 w-full md:w-[65%] lg:w-[55%]">
            <Image
              src="/assets/therapy-session.jpg"
              alt="Calming therapy setting"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 55vw"
              priority
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-surface via-surface/95 to-transparent" />
        </div>

        <div className="relative z-10">
          <div className="container-page py-12 md:py-16 lg:py-20">
            <div className="max-w-xl lg:max-w-2xl">
              <span className="eyebrow">Insights</span>
              <h1 className="mt-6 text-5xl leading-[1.05] font-semibold tracking-tight md:text-6xl lg:text-7xl">
                Insights that support{" "}
                <em className="font-serif text-primary-deep not-italic">
                  healing
                </em>
                .
              </h1>
              <p className="mt-6 max-w-lg text-base leading-relaxed text-muted-foreground md:text-lg">
                Articles, talks, and resources from our therapists to help you
                navigate relationships, grief, and life.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section
        id="filter-bar"
        className="sticky top-0 z-20 border-y border-border bg-background"
      >
        <div className="container-page py-4">
          <div className="scrollbar-hide flex gap-2 overflow-x-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => handleSelectCategory(cat)}
                className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                  activeCategory === cat
                    ? "scale-105 bg-primary text-white shadow-md"
                    : "bg-surface text-muted-foreground hover:bg-surface-2"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {featuredContent && activeCategory === "All" && (
        <section className="bg-background">
          <div className="container-page py-12 md:py-16">
            <span className="text-xs font-semibold tracking-[0.15em] text-primary-deep uppercase">
              Featured article
            </span>
            <div className="card-lift mt-6 grid items-center gap-8 rounded-3xl border border-border bg-card p-6 md:grid-cols-2 md:p-8">
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
                <Image
                  src={featuredContent.image}
                  alt={featuredContent.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div>
                <span className="inline-block rounded-full bg-primary-soft px-3 py-1 text-xs font-semibold text-primary-deep">
                  {featuredContent.category}
                </span>
                <h2 className="mt-4 text-2xl leading-snug font-semibold md:text-3xl">
                  {featuredContent.title}
                </h2>
                <p className="mt-4 leading-relaxed text-muted-foreground">
                  {featuredContent.excerpt}
                </p>
                <Link
                  href={`/insights/${featuredContent.slug}`}
                  className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary-deep"
                >
                  Read article <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      <section id="all-insights" className="bg-background">
        <div className="container-page py-12 md:py-16">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-2xl font-semibold transition-all duration-200 md:text-3xl">
              {activeCategory === "All"
                ? "Latest insights"
                : activeCategory}
            </h2>
            {showArticlesLink && (
              <button
                type="button"
                onClick={() => handleSelectCategory("Articles")}
                className="inline-flex items-center gap-1 text-sm font-medium text-primary-deep hover:underline"
              >
                View all Articles <ArrowRight size={14} />
              </button>
            )}
          </div>

          <div className="grid gap-6 transition-opacity duration-300 sm:grid-cols-2 lg:grid-cols-4">
            {filteredContent.map((content) => (
              <InsightCard key={content.id} content={content} />
            ))}
          </div>
        </div>
      </section>

      {activeCategory === "All" && (
        <section className="border-y border-border bg-surface">
          <div className="container-page py-12 md:py-16">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold tracking-[0.15em] text-primary-deep uppercase">
                  Popular videos
                </span>
                <h2 className="mt-2 text-2xl font-semibold md:text-3xl">
                  Most watched
                </h2>
              </div>
              <button
                type="button"
                onClick={() => handleSelectCategory("Videos")}
                className="hidden items-center gap-1 text-sm font-medium text-primary-deep hover:underline md:inline-flex"
              >
                View all videos <ArrowRight size={14} />
              </button>
            </div>

            <div className="scrollbar-hide flex gap-6 overflow-x-auto pb-2">
              {popularVideos.map((video) => (
                <InsightsVideoCard key={video.id} video={video} compact />
              ))}
            </div>

            <button
              type="button"
              onClick={() => handleSelectCategory("Videos")}
              className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-primary-deep hover:underline md:hidden"
            >
              View all videos <ArrowRight size={14} />
            </button>
          </div>
        </section>
      )}

      <section className="bg-background">
        <div className="container-page py-12 md:py-16">
          <div className="card-lift flex flex-col gap-6 rounded-3xl border border-border bg-card p-6 md:flex-row md:items-center md:gap-10 md:p-8">
            <div className="flex items-center gap-4 md:flex-1">
              <span className="inline-grid h-14 w-14 shrink-0 place-items-center rounded-full bg-primary-soft text-primary-deep">
                <Mail size={24} strokeWidth={1.5} />
              </span>
              <div>
                <h2 className="text-xl font-semibold tracking-tight md:text-2xl">
                  Stay connected
                </h2>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  Get new insights, videos, and resources delivered to your
                  inbox.
                </p>
              </div>
            </div>
            <form
              className="flex flex-col gap-3 sm:flex-row md:min-w-[380px]"
              onSubmit={(e) => {
                e.preventDefault();
              }}
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                required
                className="flex-1 rounded-full border border-border bg-background px-5 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:outline-none"
              />
              <button type="submit" className="btn-primary shrink-0">
                Subscribe
              </button>
            </form>
          </div>
          <p className="mt-4 text-center text-xs text-muted-foreground md:text-left">
            We respect your privacy. Unsubscribe anytime.
          </p>
        </div>
      </section>
    </>
  );
}
