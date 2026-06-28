import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { serviceList } from "../data";

export function ServicesPage() {
  return (
    <>
      <section className="relative h-[400px] overflow-hidden bg-surface lg:h-[450px]">
        <Image
          src="/assets/therapy-session.jpg"
          alt="Therapy session"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 z-[1] bg-gradient-to-r from-black/60 via-black/40 to-black/30" />
        <div className="relative z-10 h-full">
          <div className="container-page flex h-full items-center py-16 lg:py-20">
            <div className="max-w-2xl">
              <span className="inline-flex items-center rounded-full border border-white/30 bg-white/20 px-4 py-1.5 text-xs font-semibold tracking-[0.18em] text-white uppercase backdrop-blur-sm">
                Our Services
              </span>
              <h1 className="mt-6 font-serif text-5xl leading-[1.05] text-white drop-shadow-lg md:text-6xl">
                Care that meets you
                <br />
                where you are
              </h1>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-white/95 drop-shadow">
                From individual sessions to family work and organisational
                wellness — we build the right journey with you.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/contact" className="btn-primary">
                  Talk to us <ArrowRight size={16} />
                </Link>
                <Link
                  href="/join-us"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/40 bg-white/20 px-6 py-2.5 font-semibold text-white backdrop-blur-sm transition hover:bg-white/30"
                >
                  Book a session
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
                  <div className="flex items-start justify-between text-sm">
                    <div>
                      <p className="mb-1.5 text-[10px] tracking-[0.15em] text-muted-foreground/70 uppercase">
                        Duration
                      </p>
                      <p className="text-[13px] font-normal whitespace-pre-line text-foreground">
                        {service.duration}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="mb-1.5 text-[10px] tracking-[0.15em] text-muted-foreground/70 uppercase">
                        From
                      </p>
                      <p className="text-[13px] font-normal whitespace-pre-line text-foreground">
                        {service.price}
                      </p>
                    </div>
                  </div>
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

      <section className="bg-muted/30 py-16 lg:py-20">
        <div className="container-page">
          <div className="mx-auto max-w-3xl">
            <div className="flex flex-col items-center rounded-3xl border border-border bg-card p-8 text-center shadow-[var(--shadow-soft)] lg:p-10">
              <div className="mb-6 font-serif text-5xl text-primary/20">
                &ldquo;
              </div>
              <blockquote className="font-serif text-lg leading-relaxed text-foreground md:text-xl">
                I felt heard from the very first session. Recro gave me language
                for things I had carried silently for years.
              </blockquote>
              <div className="mt-6 flex gap-1 text-primary">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} className="text-xl">
                    ★
                  </span>
                ))}
              </div>
              <p className="mt-3 text-sm font-semibold text-foreground">
                A. M.
              </p>
              <p className="text-xs text-muted-foreground">
                Individual therapy client
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="container-page bg-background pb-20">
        <div className="rounded-3xl border border-border bg-muted/30 p-8 text-center md:p-12">
          <h2 className="mb-4 font-serif text-3xl text-primary-deep md:text-4xl">
            Not sure where to start?
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-muted-foreground">
            A short intake call helps match you with the right therapist and
            approach. We&apos;re here to guide you.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/contact" className="btn-primary">
              Talk to us
            </Link>
            <Link href="/join-us" className="btn-secondary">
              Book a session
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
