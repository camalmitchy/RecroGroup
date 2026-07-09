import Image from "next/image";
import Link from "next/link";

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
                            <h1 className="text-6xl md:text-7xl lg:text-8xl font-serif text-white leading-[1.05]">
                                Coming Soon
                            </h1>
                            <p className="mt-8 text-white/95 leading-relaxed text-lg md:text-xl max-w-2xl mx-auto">
                                Our merchandise store is launching soon.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="container-page py-20 lg:py-28">
                <div className="max-w-3xl mx-auto text-center">
                    <h2 className="font-serif text-3xl text-foreground md:text-4xl">
                        In the meantime
                    </h2>
                    <p className="mt-4 text-base text-muted-foreground leading-relaxed">
                        Explore our services or reach out if you have any questions.
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
            </section>
        </>
    );
}
