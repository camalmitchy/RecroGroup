"use client";

import { useMemo, useState } from "react";
import { Play, X, Search } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import type { PublicMediaItem } from "@/features/public/content/types";

export function MediaPage({ videos }: { videos: PublicMediaItem[] }) {
  const categories = useMemo(
    () => ["All", ...Array.from(new Set(videos.map((video) => video.category)))],
    [videos],
  );
  const [active, setActive] = useState("All");
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState<string | null>(null);

  const filtered = useMemo(
    () =>
      videos.filter((video) => {
        const categoryMatch = active === "All" || video.category === active;
        const searchMatch =
          query.trim() === "" ||
          video.title.toLowerCase().includes(query.toLowerCase()) ||
          video.excerpt.toLowerCase().includes(query.toLowerCase());
        return categoryMatch && searchMatch;
      }),
    [videos, active, query],
  );

  const featured = videos[0];
  const openVideo = open ? videos.find((video) => video.id === open) : null;

  return (
    <>
      <section className="relative h-[500px] overflow-hidden md:h-[600px]">
        <Image
          src="/assets/media.jpg"
          alt="Media library"
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-primary-deep/55" />

        <div className="relative z-10 flex h-full items-center justify-center">
          <div className="container-page text-center text-white">
            <span className="text-xs font-medium tracking-[0.2em] uppercase">
              Media Library
            </span>
            <h1 className="mt-4 font-serif text-5xl md:text-6xl lg:text-7xl">
              Watch & <em className="italic">reflect</em>.
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed md:text-lg">
              Short, honest conversations with our clinicians — on grief,
              relationships, parenting, and mental health.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-background">
        <div className="container-page py-12 md:py-16">
          <span className="text-xs font-medium tracking-[0.15em] text-muted-foreground uppercase">
            Featured
          </span>
          {featured ? (
            <button
              type="button"
              onClick={() => setOpen(featured.id)}
              className="group relative mt-6 aspect-[21/9] w-full overflow-hidden rounded-2xl bg-black"
            >
              <Image
                src={featured.thumbnail}
                alt={featured.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 1200px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="grid size-16 place-items-center rounded-full border border-white/30 bg-white/20 backdrop-blur-sm transition-transform group-hover:scale-110 md:size-20">
                  <Play className="ml-1 size-6 fill-white text-white md:size-8" />
                </div>
              </div>
              <div className="absolute right-0 bottom-0 left-0 p-6 text-center text-white md:p-8">
                <p className="font-serif text-2xl md:text-3xl">{featured.title}</p>
                <p className="mt-2 text-sm text-white/80 md:text-base">
                  {featured.excerpt}
                </p>
                <p className="mt-3 text-xs text-white/60">
                  {featured.category}
                  {featured.duration ? ` • ${featured.duration}` : ""}
                </p>
              </div>
            </button>
          ) : (
            <p className="mt-6 text-muted-foreground">
              New videos will appear here once they are published.
            </p>
          )}
        </div>
      </section>

      <section className="sticky top-16 z-10 bg-background">
        <div className="container-page py-4">
          <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
            <div className="relative max-w-xs flex-1">
              <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                aria-label="Search videos"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search videos..."
                className="w-full rounded-full border border-border bg-background py-2 pr-4 pl-9 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="scrollbar-hide flex gap-2 overflow-x-auto">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActive(category)}
                  className={`shrink-0 rounded-full px-5 py-2 text-xs font-medium tracking-wider uppercase transition-all ${
                    active === category
                      ? "bg-primary text-white"
                      : "border border-border bg-transparent text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-background">
        <div className="container-page py-12 md:py-16">
          {filtered.length === 0 ? (
            <p className="py-16 text-center text-muted-foreground">
              {videos.length === 0
                ? "No videos published yet."
                : "No videos match your search."}
            </p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((video) => (
                <button
                  key={video.id}
                  type="button"
                  onClick={() => setOpen(video.id)}
                  className="group text-left"
                >
                  <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-muted">
                    <Image
                      src={video.thumbnail}
                      alt={video.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
                      <div className="grid size-14 place-items-center rounded-full bg-white/90 backdrop-blur-sm transition-transform group-hover:scale-110">
                        <Play className="ml-0.5 size-5 fill-foreground text-foreground" />
                      </div>
                    </div>
                    <span className="absolute top-3 left-3 rounded-full bg-black/70 px-2.5 py-1 text-[10px] font-medium tracking-wider text-white uppercase backdrop-blur-sm">
                      {video.category}
                    </span>
                    {video.duration && (
                      <span className="absolute right-3 bottom-3 rounded bg-black/70 px-2 py-0.5 text-xs font-medium text-white tabular-nums backdrop-blur-sm">
                        {video.duration}
                      </span>
                    )}
                  </div>
                  <h3 className="mt-4 font-serif text-xl text-foreground transition-colors group-hover:text-primary-deep line-clamp-2">
                    {video.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                    {video.excerpt}
                  </p>
                  {video.therapist && (
                    <p className="mt-1 text-xs text-muted-foreground">
                      {video.therapist}
                    </p>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="bg-muted">
        <div className="container-page py-16 md:py-20">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-serif text-3xl text-foreground md:text-4xl">
              Ready to talk to someone?
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
              Our therapists are taking new clients this week.
            </p>
            <div className="mt-8">
              <Button asChild size="lg" className="rounded-full">
                <Link href="/booking">Book a Session</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {openVideo && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={openVideo.title}
          onClick={() => setOpen(null)}
          className="fixed inset-0 z-[60] grid place-items-center bg-black/90 p-4 backdrop-blur-sm"
        >
          <div
            onClick={(event) => event.stopPropagation()}
            className="relative w-full max-w-5xl"
          >
            <button
              type="button"
              onClick={() => setOpen(null)}
              aria-label="Close video"
              className="absolute -top-12 right-0 grid size-10 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
            >
              <X className="size-5" />
            </button>
            <div className="overflow-hidden rounded-xl bg-black">
              <iframe
                title={openVideo.title}
                src={openVideo.embedUrl}
                className="aspect-video w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <div className="mt-4 text-white">
              <p className="font-serif text-xl md:text-2xl">{openVideo.title}</p>
              <p className="mt-1 text-sm text-white/70">{openVideo.excerpt}</p>
              {openVideo.therapist && (
                <p className="mt-2 text-xs text-white/60">{openVideo.therapist}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
