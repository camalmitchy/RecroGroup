"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Mail, Play } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

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
  const href = content.type === "video" ? "/media" : "/blog";

  return (
    <Card className="flex h-full flex-col overflow-hidden rounded-3xl p-0 transition-all hover:-translate-y-0.5 hover:shadow-md">
      {content.type === "video" ? (
        <div className="relative aspect-video bg-foreground">
          <Image
            src={content.thumbnail}
            alt={content.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 25vw"
          />
          <div className="absolute inset-0 bg-foreground/20" />
          <span className="absolute top-1/2 left-1/2 grid size-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-background/95 text-primary shadow-lg">
            <Play className="ml-0.5 size-5" fill="currentColor" />
          </span>
          <span className="absolute right-3 bottom-3 rounded bg-foreground/70 px-2 py-0.5 text-xs font-medium text-background">
            {content.duration}
          </span>
        </div>
      ) : (
        <div className="relative aspect-video overflow-hidden bg-muted">
          <Image
            src={content.image}
            alt={content.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 25vw"
          />
        </div>
      )}

      <CardContent className="flex flex-1 flex-col p-6">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <Badge variant="secondary" className="rounded-full">
            {content.category}
          </Badge>
          <Badge variant="outline" className="rounded-full">
            {content.type === "video" ? "Video" : "Article"}
          </Badge>
          {content.type === "article" && (
            <span className="text-muted-foreground">
              {content.readTime} read
            </span>
          )}
          {content.type === "video" && (
            <span className="text-muted-foreground">{content.duration}</span>
          )}
        </div>
        <CardTitle className="mt-4 line-clamp-2 text-lg leading-snug">
          {content.title}
        </CardTitle>
        <CardDescription className="mt-2 line-clamp-3 flex-1 leading-relaxed">
          {content.excerpt}
        </CardDescription>
        <Button asChild variant="link" className="mt-5 h-auto justify-start p-0">
          <Link href={href}>
            {content.type === "video" ? "Watch now" : "Read article"}
            <ArrowRight className="size-3.5" />
          </Link>
        </Button>
      </CardContent>
    </Card>
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

  const showArticlesLink = activeCategory !== "Articles";

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
              <Badge variant="secondary" className="rounded-full tracking-[0.2em] uppercase">
                Insights
              </Badge>
              <h1 className="mt-6 text-5xl leading-[1.05] font-semibold tracking-tight md:text-6xl lg:text-7xl">
                Insights that support{" "}
                <em className="font-serif text-primary not-italic">healing</em>.
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
              <Button
                key={cat}
                type="button"
                variant={activeCategory === cat ? "default" : "secondary"}
                size="sm"
                className={`shrink-0 rounded-full ${
                  activeCategory === cat ? "shadow-md" : ""
                }`}
                onClick={() => handleSelectCategory(cat)}
              >
                {cat}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {featuredContent && activeCategory === "All" && (
        <section className="bg-background">
          <div className="container-page py-12 md:py-16">
            <Badge variant="secondary" className="rounded-full tracking-[0.15em] uppercase">
              Featured article
            </Badge>
            <Card className="mt-6 grid items-center gap-8 rounded-3xl p-6 shadow-md md:grid-cols-2 md:p-8">
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
                <Image
                  src={featuredContent.image}
                  alt={featuredContent.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <CardContent className="px-0">
                <Badge className="rounded-full">{featuredContent.category}</Badge>
                <CardTitle className="mt-4 text-2xl leading-snug md:text-3xl">
                  {featuredContent.title}
                </CardTitle>
                <CardDescription className="mt-4 leading-relaxed">
                  {featuredContent.excerpt}
                </CardDescription>
                <Button asChild variant="link" className="mt-6 h-auto p-0">
                  <Link href="/blog">
                    Read article
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
      )}

      <section id="all-insights" className="bg-background">
        <div className="container-page py-12 md:py-16">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-2xl font-semibold md:text-3xl">
              {activeCategory === "All"
                ? "Latest insights"
                : activeCategory}
            </h2>
            {showArticlesLink && (
              <Button
                type="button"
                variant="link"
                className="h-auto p-0"
                onClick={() => handleSelectCategory("Articles")}
              >
                View all Articles
                <ArrowRight className="size-3.5" />
              </Button>
            )}
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
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
                <Badge variant="secondary" className="rounded-full tracking-[0.15em] uppercase">
                  Popular videos
                </Badge>
                <h2 className="mt-2 text-2xl font-semibold md:text-3xl">
                  Most watched
                </h2>
              </div>
              <Button
                type="button"
                variant="link"
                className="hidden h-auto p-0 md:inline-flex"
                onClick={() => handleSelectCategory("Videos")}
              >
                View all videos
                <ArrowRight className="size-3.5" />
              </Button>
            </div>

            <div className="scrollbar-hide flex gap-6 overflow-x-auto pb-2">
              {popularVideos.map((video) => (
                <InsightsVideoCard key={video.id} video={video} compact />
              ))}
            </div>

            <Button
              type="button"
              variant="link"
              className="mt-6 h-auto p-0 md:hidden"
              onClick={() => handleSelectCategory("Videos")}
            >
              View all videos
              <ArrowRight className="size-3.5" />
            </Button>
          </div>
        </section>
      )}

      <section className="bg-background">
        <div className="container-page py-12 md:py-16">
          <Card className="rounded-3xl p-6 shadow-md md:p-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:gap-10">
              <div className="flex items-center gap-4 md:flex-1">
                <span className="grid size-14 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
                  <Mail size={24} strokeWidth={1.5} />
                </span>
                <div>
                  <CardTitle className="text-xl md:text-2xl">
                    Stay connected
                  </CardTitle>
                  <CardDescription className="mt-1 leading-relaxed">
                    Get new insights, videos, and resources delivered to your
                    inbox.
                  </CardDescription>
                </div>
              </div>
              <form
                className="flex flex-col gap-3 sm:flex-row md:min-w-[380px]"
                onSubmit={(e) => {
                  e.preventDefault();
                }}
              >
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  required
                  className="h-11 flex-1 rounded-full px-5"
                />
                <Button type="submit" size="lg" className="shrink-0 rounded-full">
                  Subscribe
                </Button>
              </form>
            </div>
          </Card>
          <p className="mt-4 text-center text-xs text-muted-foreground md:text-left">
            We respect your privacy. Unsubscribe anytime.
          </p>
        </div>
      </section>
    </>
  );
}
