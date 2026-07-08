import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { resources } from "@/features/public/resources/data/resources-data";
import { Button } from "@/components/ui/button";

type Props = {
    params: {
        slug: string;
    };
};

export async function generateStaticParams() {
    return resources.map((resource) => ({
        slug: resource.slug,
    }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const resource = resources.find((r) => r.slug === params.slug);

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

export default function ResourceArticlePage({ params }: Props) {
    const resource = resources.find((r) => r.slug === params.slug);

    if (!resource) {
        notFound();
    }

    return (
        <article className="bg-background">
            <div className="container-page py-12 md:py-16">
                <div className="mx-auto max-w-3xl">
                    <Link
                        href="/resources"
                        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary-deep"
                    >
                        <ArrowLeft className="size-4" />
                        Back to Resources
                    </Link>

                    <div className="mt-8">
                        <span className="inline-block rounded-full bg-primary-soft px-3 py-1 text-xs font-semibold text-primary-deep">
                            {resource.category}
                        </span>
                        <h1 className="mt-4 font-serif text-4xl text-foreground md:text-5xl">
                            {resource.title}
                        </h1>
                        <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
                            <span>{resource.readingTime}</span>
                            <span>•</span>
                            <time dateTime={resource.publishedAt}>
                                {new Date(resource.publishedAt).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                })}
                            </time>
                        </div>
                    </div>

                    <div className="prose prose-lg mt-12 max-w-none">
                        <p className="lead text-xl text-muted-foreground">
                            {resource.excerpt}
                        </p>

                        <div className="mt-8 rounded-2xl border border-border bg-surface p-8">
                            <p className="text-center text-muted-foreground">
                                Article content coming soon. This is a placeholder for the full
                                article.
                            </p>
                        </div>
                    </div>

                    <div className="mt-12 border-t border-border pt-8">
                        <div className="card-lift rounded-3xl border border-border bg-card p-8 text-center">
                            <h2 className="font-serif text-2xl text-foreground">
                                Need support now?
                            </h2>
                            <p className="mt-3 text-muted-foreground">
                                Our therapists are here to help you through difficult times.
                            </p>
                            <div className="mt-6 flex justify-center">
                                <Button asChild size="lg" className="rounded-full">
                                    <Link href="/join-us">Book a Session</Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </article>
    );
}
