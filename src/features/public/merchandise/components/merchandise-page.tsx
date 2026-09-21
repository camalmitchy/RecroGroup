"use client";

import { Mail, ShoppingBag } from "lucide-react";

import { NewsletterSignup } from "@/features/public/shared/newsletter-signup";

export function MerchandisePage() {
    return (
        <>
            <section className="relative overflow-hidden bg-primary-deep py-24 text-white md:py-32">
                <div className="container-page relative z-10 text-center">
                    <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold tracking-[0.2em] uppercase">
                        <ShoppingBag size={14} /> Store
                    </span>
                    <h1 className="mt-6 font-serif text-5xl md:text-6xl lg:text-7xl">
                        Merchandise coming soon
                    </h1>
                    <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/90 md:text-lg">
                        We are preparing a small collection of wellness products, therapeutic
                        tools, and meaningful items. Checkout is not live yet — leave your
                        email and we will tell you when it opens.
                    </p>
                </div>
            </section>

            <section className="bg-background py-16 md:py-20">
                <div className="container-page">
                    <div className="mx-auto max-w-2xl rounded-3xl border border-border bg-card p-8 shadow-[var(--shadow-soft)] md:p-10">
                        <div className="flex items-start gap-4">
                            <span className="inline-grid h-14 w-14 shrink-0 place-items-center rounded-full bg-primary-soft text-primary-deep">
                                <Mail size={24} strokeWidth={1.5} />
                            </span>
                            <div>
                                <h2 className="font-serif text-2xl font-semibold text-primary-deep">
                                    Get launch updates
                                </h2>
                                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                                    No catalogue, cart, or card checkout yet. Subscribe and we will
                                    email you when merchandise is ready.
                                </p>
                            </div>
                        </div>
                        <div className="mt-8">
                            <NewsletterSignup placeholder="you@example.com" />
                        </div>
                        <p className="mt-4 text-xs text-muted-foreground">
                            We respect your privacy. Unsubscribe anytime.
                        </p>
                    </div>
                </div>
            </section>
        </>
    );
}
