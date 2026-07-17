"use client";

import { useMemo, useState } from "react";
import { Search, ArrowRight, Mail } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { resources } from "../data/resources-data";

const categories = [
    "All",
    ...Array.from(new Set(resources.map((r) => r.category))),
];

export function ResourcesPage() {
    const [active, setActive] = useState("All");
    const [q, setQ] = useState("");
    const [email, setEmail] = useState("");

    const filtered = useMemo(
        () =>
            resources.filter(
                (r) =>
                    (active === "All" || r.category === active) &&
                    (q.trim() === "" || r.title.toLowerCase().includes(q.toLowerCase())),
            ),
        [active, q],
    );

    return (
        <>
            {/* Hero Section */}
            <section className="relative h-[500px] md:h-[600px] overflow-hidden">
                <Image
                    src="/assets/resources.jpg"
                    alt="Resources library"
                    fill
                    className="object-cover"
                    sizes="100vw"
                    priority
                />
                <div className="absolute inset-0 bg-primary-deep/65" />

                <div className="relative z-10 flex h-full items-center justify-center">
                    <div className="container-page text-center text-white">
                        <span className="text-xs font-medium tracking-[0.2em] uppercase">
                            Resources
                        </span>
                        <h1 className="mt-4 font-serif text-5xl md:text-6xl lg:text-7xl">
                            Read, reflect, <em className="italic">recover</em>.
                        </h1>
                        {/* <p className="mx-auto mt-6 max-w-2xl text-base md:text-lg leading-relaxed">
                            Honest articles and guides written by our clinical team.
                        </p> */}
                    </div>
                </div>
            </section>

            {/* Filters */}
            <section className="bg-background border-y border-border">
                <div className="container-page py-6">
                    <div className="flex flex-wrap items-center gap-4">
                        <div className="relative flex-1 min-w-[220px]">
                            <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                            <input
                                aria-label="Search articles"
                                value={q}
                                onChange={(e) => setQ(e.target.value)}
                                placeholder="Search articles…"
                                className="w-full rounded-full border border-border bg-background py-3 pl-11 pr-4 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/20"
                            />
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {categories.map((c) => (
                                <button
                                    key={c}
                                    onClick={() => setActive(c)}
                                    className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] transition-colors ${active === c
                                        ? "bg-primary text-white"
                                        : "bg-surface text-muted-foreground border border-border hover:border-primary/30"
                                        }`}
                                >
                                    {c}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Articles Grid */}
            <section className="bg-background">
                <div className="container-page py-12 md:py-16">
                    {filtered.length === 0 ? (
                        <p className="py-16 text-center text-muted-foreground">
                            No articles match that search.
                        </p>
                    ) : (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {filtered.map((r) => (
                                <Link
                                    key={r.slug}
                                    href={`/resources/${r.slug}`}
                                    className="card-lift group flex flex-col rounded-3xl border border-border bg-card p-8 transition-all hover:-translate-y-1"
                                >
                                    <span className="inline-block rounded-full bg-primary-soft px-3 py-1 text-xs font-semibold text-primary-deep w-fit">
                                        {r.category}
                                    </span>
                                    <h3 className="mt-4 font-serif text-2xl text-foreground">
                                        {r.title}
                                    </h3>
                                    <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                                        {r.excerpt}
                                    </p>
                                    <div className="mt-6 flex items-center justify-between text-xs text-muted-foreground">
                                        <span>{r.readingTime}</span>
                                        <span className="inline-flex items-center gap-1.5 font-semibold uppercase tracking-[0.16em] text-primary-deep">
                                            Read{" "}
                                            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                                        </span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Newsletter Section */}
            <section className="border-t border-border bg-surface">
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
                                    A short monthly note with new resources and camp updates. No
                                    spam, ever.
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
                                placeholder="you@example.com"
                                required
                                className="flex-1 rounded-full border border-border bg-background px-5 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:outline-none"
                            />
                            <Button type="submit" className="shrink-0 rounded-full">
                                Subscribe
                            </Button>
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
