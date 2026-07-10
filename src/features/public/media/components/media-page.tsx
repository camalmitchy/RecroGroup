"use client";

import { useMemo, useState } from "react";
import { Play, X, Search } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { allContent } from "@/features/public/insights/data";

type VideoContent = {
    id: string;
    type: "video";
    category: string;
    title: string;
    excerpt: string;
    duration: string;
    videoId: string;
    thumbnail: string;
    therapist: string;
};

const mediaCategories = [
    "All",
    "Therapy",
    "Relationships",
    "Parenting",
    "Grief",
    "Mental Health Education",
] as const;

// Extract all videos from insights
const allVideos = allContent.filter(
    (item): item is VideoContent => item.type === "video"
);

export function MediaPage() {
    const [active, setActive] = useState<(typeof mediaCategories)[number]>("All");
    const [query, setQuery] = useState("");
    const [open, setOpen] = useState<string | null>(null);

    const filtered = useMemo(() => {
        return allVideos.filter((v) => {
            // Category filter
            const categoryMatch =
                active === "All" ||
                (active === "Therapy" && v.category === "Therapy 101") ||
                (active === "Grief" && v.category === "Grief & Loss") ||
                v.category === active;

            // Search filter
            const searchMatch =
                query.trim() === "" ||
                v.title.toLowerCase().includes(query.toLowerCase()) ||
                v.excerpt.toLowerCase().includes(query.toLowerCase());

            return categoryMatch && searchMatch;
        });
    }, [active, query]);

    const featured = allVideos[0];
    const openVideo = open ? allVideos.find((v) => v.id === open) : null;

    return (
        <>
            {/* Hero Section - Increased height */}
            <section className="relative h-[500px] md:h-[600px] overflow-hidden">
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
                        <p className="mx-auto mt-6 max-w-2xl text-base md:text-lg leading-relaxed">
                            Short, honest conversations with our clinicians — on grief,
                            relationships, parenting, and mental health.
                        </p>
                    </div>
                </div>
            </section>

            {/* Featured Video - Reduced height */}
            <section className="bg-background">
                <div className="container-page py-12 md:py-16">
                    <span className="text-xs font-medium tracking-[0.15em] uppercase text-muted-foreground">
                        Featured
                    </span>
                    <button
                        type="button"
                        onClick={() => setOpen(featured.id)}
                        className="group mt-6 relative w-full aspect-[21/9] rounded-2xl overflow-hidden bg-black"
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
                            <div className="grid size-16 md:size-20 place-items-center rounded-full bg-white/20 backdrop-blur-sm border border-white/30 transition-transform group-hover:scale-110">
                                <Play className="size-6 md:size-8 fill-white text-white ml-1" />
                            </div>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white text-center">
                            <p className="font-serif text-2xl md:text-3xl">{featured.title}</p>
                            <p className="mt-2 text-sm md:text-base text-white/80">
                                {featured.excerpt}
                            </p>
                            <p className="mt-3 text-xs text-white/60">
                                {featured.category} • {featured.duration}
                            </p>
                        </div>
                    </button>
                </div>
            </section>

            {/* Filter Section - Updated design with search */}
            <section className="bg-background sticky top-16 z-10">
                <div className="container-page py-4">
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                        {/* Search Input */}
                        <div className="relative flex-1 max-w-xs">
                            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                            <input
                                aria-label="Search videos"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Search videos..."
                                className="w-full rounded-full border border-border bg-background py-2 pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/20"
                            />
                        </div>

                        {/* Category Pills */}
                        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                            {mediaCategories.map((c) => (
                                <button
                                    key={c}
                                    onClick={() => setActive(c)}
                                    className={`shrink-0 rounded-full px-5 py-2 text-xs font-medium uppercase tracking-wider transition-all ${active === c
                                        ? "bg-primary text-white"
                                        : "bg-transparent text-muted-foreground hover:bg-muted border border-border"
                                        }`}
                                >
                                    {c}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Video Grid */}
            <section className="bg-background">
                <div className="container-page py-12 md:py-16">
                    {filtered.length === 0 ? (
                        <p className="py-16 text-center text-muted-foreground">
                            No videos match your search.
                        </p>
                    ) : (
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {filtered.map((v) => (
                                <button
                                    key={v.id}
                                    onClick={() => setOpen(v.id)}
                                    className="group text-left"
                                >
                                    <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-muted">
                                        <Image
                                            src={v.thumbnail}
                                            alt={v.title}
                                            fill
                                            className="object-cover"
                                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <div className="grid size-14 place-items-center rounded-full bg-white/90 backdrop-blur-sm transition-transform group-hover:scale-110">
                                                <Play className="size-5 fill-foreground text-foreground ml-0.5" />
                                            </div>
                                        </div>
                                        <span className="absolute top-3 left-3 rounded-full bg-black/70 backdrop-blur-sm px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-white">
                                            {v.category}
                                        </span>
                                        <span className="absolute bottom-3 right-3 rounded bg-black/70 backdrop-blur-sm px-2 py-0.5 text-xs font-medium tabular-nums text-white">
                                            {v.duration}
                                        </span>
                                    </div>
                                    <h3 className="mt-4 font-serif text-xl text-foreground group-hover:text-primary-deep transition-colors line-clamp-2">
                                        {v.title}
                                    </h3>
                                    <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                                        {v.excerpt}
                                    </p>
                                    {v.therapist && (
                                        <p className="mt-1 text-xs text-muted-foreground">
                                            {v.therapist}
                                        </p>
                                    )}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-muted">
                <div className="container-page py-16 md:py-20">
                    <div className="mx-auto max-w-2xl text-center">
                        <h2 className="font-serif text-3xl md:text-4xl text-foreground">
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

            {/* Video Modal */}
            {openVideo && (
                <div
                    role="dialog"
                    aria-modal="true"
                    aria-label={openVideo.title}
                    onClick={() => setOpen(null)}
                    className="fixed inset-0 z-[60] grid place-items-center bg-black/90 p-4 backdrop-blur-sm"
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="relative w-full max-w-5xl"
                    >
                        <button
                            onClick={() => setOpen(null)}
                            aria-label="Close video"
                            className="absolute -top-12 right-0 grid size-10 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
                        >
                            <X className="size-5" />
                        </button>
                        <div className="overflow-hidden rounded-xl bg-black">
                            <iframe
                                title={openVideo.title}
                                src={`https://www.youtube.com/embed/${openVideo.videoId}?autoplay=1&rel=0`}
                                className="aspect-video w-full"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        </div>
                        <div className="mt-4 text-white">
                            <p className="font-serif text-xl md:text-2xl">
                                {openVideo.title}
                            </p>
                            <p className="mt-1 text-sm text-white/70">{openVideo.excerpt}</p>
                            {openVideo.therapist && (
                                <p className="mt-2 text-xs text-white/60">
                                    {openVideo.therapist}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
