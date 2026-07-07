"use client";

import Image from "next/image";
import Link from "next/link";

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { faqs } from "../data/faq-data";

export function FaqPage() {
    return (
        <>
            {/* Hero Section */}
            <section className="relative h-[500px] md:h-[600px] overflow-hidden">
                <Image
                    src="/assets/home.png"
                    alt="FAQ"
                    fill
                    className="object-cover"
                    sizes="100vw"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/30" />

                <div className="relative z-10 flex h-full items-center">
                    <div className="container-page">
                        <div className="max-w-3xl mx-auto text-center">
                            <span className="inline-flex items-center rounded-full bg-white/20 backdrop-blur-sm border border-white/30 px-4 py-1.5 text-xs font-semibold tracking-[0.18em] uppercase text-white">
                                FAQ
                            </span>
                            <h1 className="mt-6 text-5xl md:text-6xl font-serif text-white leading-[1.05]">
                                Questions,
                                <br />
                                gently answered
                            </h1>
                            <p className="mt-6 text-white/95 leading-relaxed text-base max-w-2xl mx-auto">
                                Everything you might want to know before reaching out.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Content */}
            <section className="container-page py-16 lg:py-24">
                {/* Intro */}
                <div className="max-w-3xl mx-auto text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-serif text-primary-deep">
                        Everything you need to know
                    </h2>
                    <p className="mt-4 text-muted-foreground leading-relaxed">
                        Find answers to the most common questions about therapy, booking,
                        and working with Recro Group.
                    </p>
                </div>

                {/* FAQ Categories in Grid */}
                <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
                    {faqs.map((category, catIndex) => (
                        <div key={category.category} className="space-y-5">
                            {/* Category Header */}
                            <div className="flex items-center gap-3 mb-6">
                                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-border"></div>
                                <h3 className="text-sm font-semibold tracking-[0.2em] uppercase text-primary-deep">
                                    {category.category}
                                </h3>
                                <div className="h-px flex-1 bg-gradient-to-l from-transparent via-border to-border"></div>
                            </div>

                            {/* Questions in this category */}
                            <Accordion type="single" collapsible className="space-y-4">
                                {category.questions.map((faq, qIndex) => (
                                    <AccordionItem
                                        key={qIndex}
                                        value={`cat-${catIndex}-q-${qIndex}`}
                                        className="rounded-2xl border border-border bg-card px-6 py-1 shadow-sm hover:shadow-md transition-shadow"
                                    >
                                        <AccordionTrigger className="text-left text-base font-semibold hover:no-underline py-5">
                                            {faq.q}
                                        </AccordionTrigger>
                                        <AccordionContent className="text-muted-foreground leading-relaxed pb-5">
                                            {faq.a}
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </div>
                    ))}
                </div>

                {/* Still have questions CTA */}
                <div className="mt-20 max-w-4xl mx-auto">
                    <div className="rounded-3xl bg-muted/50 border border-border p-8 md:p-12 text-center">
                        <h3 className="text-2xl md:text-3xl font-serif text-primary-deep">
                            Still have questions?
                        </h3>
                        <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
                            We're here to help. Reach out and we'll get back to you within one
                            business day.
                        </p>
                        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                            <Button asChild size="lg" className="rounded-full">
                                <Link href="/contact">Contact us</Link>
                            </Button>
                            <Button
                                asChild
                                size="lg"
                                variant="outline"
                                className="rounded-full"
                            >
                                <Link href="/contact">Book a session</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
