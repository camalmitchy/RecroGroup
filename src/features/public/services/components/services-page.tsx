import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { serviceList } from "../data";

export function ServicesPage() {
  return (
    <>
      <section className="relative h-[500px] md:h-[600px] overflow-hidden bg-surface">
        <Image
          src="/assets/hero-services.jpg"
          alt="Care for every stage of your journey"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-primary-deep/45" />
        <div className="absolute inset-0 z-[1] bg-gradient-to-r from-black/60 via-black/40 to-black/30" />
        <div className="relative z-10 h-full">
          <div className="container-page flex h-full items-center py-16 lg:py-20">
            <div className="max-w-4xl mx-auto text-center">
              <span className="inline-flex items-center rounded-full border border-white/30 bg-white/20 px-4 py-1.5 text-xs font-semibold tracking-[0.18em] text-white uppercase backdrop-blur-sm">
                Our Services
              </span>
              <h1 className="mt-6 font-serif text-5xl leading-[1.05] text-white md:text-6xl lg:text-7xl">
                Care for every stage of your{" "}
                <em className="italic text-white/90">journey</em>.
              </h1>
              <p className="mt-6 max-w-2xl mx-auto text-base leading-relaxed text-white/95 md:text-lg">
                Six core services — each one staffed by clinicians trained for
                that specific kind of work.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-full bg-primary-deep hover:bg-primary-deep/90 px-8 py-3 font-semibold text-white transition"
                >
                  Book a Session
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-full border-2 border-white/40 bg-white/20 px-8 py-3 font-semibold text-white backdrop-blur-sm transition hover:bg-white/30"
                >
                  Help Me Choose
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container-page bg-background py-16 lg:py-20">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {serviceList.map((service) => (
            <article
              key={service.slug}
              className="group relative overflow-hidden rounded-[2rem] border border-border/40 bg-white p-7 transition-all hover:shadow-md"
            >
              <div className="absolute top-6 right-6 text-[56px] leading-none font-light tracking-tight text-muted-foreground/[0.08]">
                {service.id}
              </div>

              <div className="relative z-10 mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-muted-foreground/[0.15]">
                <Image
                  src={service.icon}
                  alt=""
                  width={24}
                  height={24}
                  className="h-6 w-6 object-contain"
                />
              </div>

              <div className="relative z-10">
                <h3 className="mb-3 font-serif text-xl leading-tight text-foreground">
                  {service.title}
                </h3>
                <p className="mb-6 text-[14px] leading-relaxed text-muted-foreground">
                  {service.description}
                </p>

                <div className="mb-5 border-t border-border/50 pt-4">
                  <p className="mb-1.5 text-[10px] tracking-[0.15em] text-muted-foreground/70 uppercase">
                    Duration
                  </p>
                  <p className="text-[13px] font-normal text-foreground">
                    {service.duration}
                  </p>
                </div>

                <Link
                  href={`/services/${service.slug}`}
                  className="inline-flex items-center gap-2 text-xs font-medium tracking-[0.12em] text-muted-foreground/80 uppercase transition-colors hover:text-foreground"
                >
                  View Service <ArrowRight size={14} strokeWidth={1.5} />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
