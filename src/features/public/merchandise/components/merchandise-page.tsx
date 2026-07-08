import Image from "next/image";
import Link from "next/link";
import { Mail, ArrowRight } from "lucide-react";

export function MerchandisePage() {
    return (
        <>
            {/* Hero Section */}
            <section className="relative h-[500px] md:h-[600px] overflow-hidden">
                <Image
                    src="/assets/home.png"
                    alt="Merchandise coming soon"
                    fill
                    className="object-cover"
                    sizes="100vw"
                    priority
                />
                <div className="absolute inset-0 bg-primary-deep/50" />
                <div className="absolute inset-0 z-[1] bg-gradient-to-r from-black/40 via-black/20 to-black/10" />

                <div className="relative z-10 flex h-full items-center">
                    <div className="container-page w-full">
                        <div className="max-w-3xl mx-auto text-center">
                            <span className="inline-flex items-center rounded-full border border-white/30 bg-white/20 px-4 py-1.5 text-xs font-semibold tracking-[0.18em] text-white uppercase backdrop-blur-sm">
                                Coming Soon
                            </span>
                            <h1 className="mt-6 text-5xl md:text-6xl lg:text-7xl font-serif text-white leading-[1.05]">
                                Merchandise
                            </h1>
                            <p className="mt-6 text-white/95 leading-relaxed text-base md:text-lg max-w-2xl mx-auto">
                                We're working on something special. Soon you'll be able to explore
                                our curated collection of wellness products, therapeutic tools, and
                                meaningful items that support your healing journey.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <section className="container-page py-20 lg:py-28">
                <div className="max-w-3xl mx-auto text-center">
                    <h2 className="font-serif text-3xl text-foreground md:text-4xl lg:text-5xl">
                        Stay in the loop
                    </h2>
                    <p className="mt-6 text-base text-muted-foreground leading-relaxed md:text-lg">
                        Be the first to know when our merchandise store launches. We'll send you
                        a quick note with details about our opening collection, pricing, and
                        special launch offers.
                    </p>

                    {/* Newsletter Signup */}
                    <div className="mt-12">
                        <div className="rounded-3xl border border-border bg-card p-8 md:p-10 shadow-[var(--shadow-soft)]">
                            <div className="flex flex-col items-center gap-4 md:flex-row md:gap-6">
                                <div className="flex size-16 shrink-0 items-center justify-center rounded-full bg-primary/10">
                                    <Mail className="size-8 text-primary" strokeWidth={1.5} />
                                </div>
                                <div className="flex-1 text-center md:text-left">
                                    <h3 className="text-xl font-semibold text-foreground">
                                        Get notified on launch
                                    </h3>
                                    <p className="mt-1 text-sm text-muted-foreground">
                                        No spam, just a friendly heads-up when we're ready.
                                    </p>
                                </div>
                            </div>

                            <form className="mt-8 flex flex-col gap-3 sm:flex-row">
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    required
                                    className="flex-1 rounded-full border border-border bg-background px-5 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                                />
                                <button
                                    type="submit"
                                    className="inline-flex items-center justify-center gap-2 rounded-full bg-primary-deep px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary-deep/90"
                                >
                                    Notify me
                                    <ArrowRight className="size-4" />
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* What to Expect */}
                    <div className="mt-20">
                        <h3 className="font-serif text-2xl text-foreground md:text-3xl">
                            What to expect
                        </h3>
                        <div className="mt-10 grid gap-8 md:grid-cols-3">
                            <div className="text-center">
                                <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-muted">
                                    <span className="font-serif text-2xl text-primary-deep">1</span>
                                </div>
                                <h4 className="mt-4 font-semibold text-foreground">
                                    Wellness Products
                                </h4>
                                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                                    Carefully selected items to support mental health and emotional
                                    wellbeing.
                                </p>
                            </div>

                            <div className="text-center">
                                <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-muted">
                                    <span className="font-serif text-2xl text-primary-deep">2</span>
                                </div>
                                <h4 className="mt-4 font-semibold text-foreground">
                                    Therapeutic Tools
                                </h4>
                                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                                    Resources and materials designed by our clinical team for home use.
                                </p>
                            </div>

                            <div className="text-center">
                                <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-muted">
                                    <span className="font-serif text-2xl text-primary-deep">3</span>
                                </div>
                                <h4 className="mt-4 font-semibold text-foreground">
                                    Meaningful Gifts
                                </h4>
                                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                                    Thoughtful items perfect for supporting loved ones on their healing
                                    journey.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="border-t border-border bg-muted/30">
                <div className="container-page py-16 lg:py-20">
                    <div className="max-w-3xl mx-auto text-center">
                        <h2 className="font-serif text-3xl text-foreground md:text-4xl">
                            In the meantime
                        </h2>
                        <p className="mt-4 text-base text-muted-foreground leading-relaxed">
                            Explore our services or reach out if you have questions about our
                            upcoming merchandise offerings.
                        </p>
                        <div className="mt-8 flex flex-wrap justify-center gap-3">
                            <Link
                                href="/services"
                                className="inline-flex items-center justify-center gap-2 rounded-full bg-primary-deep px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary-deep/90"
                            >
                                View Services
                            </Link>
                            <Link
                                href="/contact"
                                className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-border bg-transparent px-6 py-3 text-sm font-semibold text-foreground transition hover:bg-muted"
                            >
                                Contact Us
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
