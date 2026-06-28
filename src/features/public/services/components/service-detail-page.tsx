import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Brain,
  Calendar,
  CalendarDays,
  Check,
  Clock,
  HeartHandshake,
  Sparkles,
  Tag,
  UserRound,
} from "lucide-react";

import type { ServiceDetail } from "../data";
import { ServiceFaqAccordion } from "./service-faq-accordion";

type ServiceDetailPageProps = {
  service: ServiceDetail;
};

const approachIcons = [Brain, HeartHandshake, Sparkles] as const;

export function ServiceDetailPage({ service }: ServiceDetailPageProps) {
  const ServiceIcon = service.icon;

  return (
    <>
      <section className="bg-background">
        <div className="container-page pt-10 pb-16 lg:pt-14 lg:pb-24">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-sm text-primary-deep/70 transition-colors hover:text-primary-deep"
          >
            <ArrowLeft size={16} /> All services
          </Link>

          <div className="mt-8 grid items-start gap-10 lg:grid-cols-12 lg:gap-12">
            <div className="pt-4 lg:col-span-5 lg:pt-10">
              <p className="mb-6 text-[10px] font-semibold tracking-[0.35em] text-primary-deep/60 uppercase">
                {service.eyebrow}
              </p>
              <h1 className="font-serif text-5xl leading-[0.95] tracking-tight text-primary-deep md:text-6xl lg:text-7xl">
                {service.titleItalic}
                <span className="block">{service.titleRest}</span>
              </h1>
              <p className="mt-8 max-w-md text-base leading-relaxed text-foreground/75 md:text-lg">
                {service.intro}
              </p>
              <div className="mt-10 flex flex-wrap gap-3">
                <Link
                  href={`/join-us?service=${service.key}`}
                  className="btn-primary rounded-full px-7"
                >
                  {service.ctaLabel}
                </Link>
                <Link href="/contact" className="btn-secondary rounded-full px-7">
                  Ask a question
                </Link>
              </div>
            </div>

            <div className="relative lg:col-span-7">
              <div className="aspect-[5/4] overflow-hidden rounded-3xl bg-primary-soft/40 shadow-[var(--shadow-lift)]">
                <Image
                  src={service.heroImage}
                  alt={service.title}
                  width={1024}
                  height={820}
                  priority
                  className="size-full object-cover"
                />
              </div>

              <div className="mt-6 rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-soft)] lg:absolute lg:-right-4 lg:-bottom-10 lg:mt-0 lg:max-w-[320px] lg:p-7 lg:shadow-[var(--shadow-lift)]">
                <ul className="space-y-5">
                  {service.features.map((f) => {
                    const FIcon = f.icon;
                    return (
                      <li key={f.title} className="flex gap-4">
                        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary-soft text-primary-deep">
                          <FIcon size={18} strokeWidth={1.6} />
                        </span>
                        <div className="min-w-0">
                          <p className="text-sm leading-tight font-semibold text-primary-deep">
                            {f.title}
                          </p>
                          <p className="mt-1 text-xs leading-snug text-muted-foreground">
                            {f.body}
                          </p>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-muted/30">
        <div className="container-page py-14 lg:py-16">
          <div className="mx-auto max-w-3xl text-center">
            <span className="font-serif text-5xl leading-none text-primary/25">
              &ldquo;
            </span>
            <blockquote className="mt-2 font-serif text-xl leading-relaxed text-foreground md:text-2xl">
              {service.testimonial.quote}
            </blockquote>
            <p className="mt-5 text-sm font-semibold text-foreground">
              — {service.testimonial.author}
            </p>
            <p className="text-xs text-muted-foreground">
              {service.testimonial.role}
            </p>
          </div>
        </div>
      </section>

      <section className="container-page py-16 lg:py-24">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7">
            <h2 className="font-serif text-3xl text-primary-deep md:text-4xl">
              Overview
            </h2>
            <div className="mt-6 space-y-5">
              {service.overview.map((paragraph) => (
                <p
                  key={paragraph.slice(0, 40)}
                  className="text-base leading-[1.85] text-foreground/80"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          <div className="space-y-5 lg:col-span-5">
            <div className="rounded-2xl border border-border bg-card p-7 shadow-[var(--shadow-soft)]">
              <h3 className="font-serif text-xl text-primary-deep">
                Who this helps
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                {service.whoFor}
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-7 shadow-[var(--shadow-soft)]">
              <h3 className="font-serif text-xl text-primary-deep">
                Focus areas
              </h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {service.concerns.map((c) => (
                  <span
                    key={c}
                    className="rounded-full bg-muted px-3 py-1.5 text-xs font-medium text-foreground/80"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-primary-soft/35">
        <div className="container-page py-16 lg:py-20">
          <h2 className="font-serif text-3xl text-primary-deep md:text-4xl">
            Therapeutic approaches
          </h2>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Methods our clinicians use for {service.title.toLowerCase()} —
            selected and adapted to your specific needs.
          </p>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {service.approaches.map((approach, index) => {
              const Icon = approachIcons[index % approachIcons.length];
              return (
                <div
                  key={approach.name}
                  className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]"
                >
                  <span className="grid size-11 place-items-center rounded-full bg-primary-soft text-primary-deep">
                    <Icon size={20} strokeWidth={1.6} />
                  </span>
                  <h3 className="mt-5 font-semibold text-primary-deep">
                    {approach.name}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {approach.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="container-page py-16 lg:py-24">
        <div className="grid gap-14 lg:grid-cols-2 lg:gap-20">
          <div>
            <h2 className="font-serif text-3xl text-primary-deep md:text-4xl">
              What to expect
            </h2>
            <ol className="mt-8 space-y-7">
              {service.expect.map((step, i) => (
                <li key={step} className="flex items-start gap-6">
                  <span className="w-12 shrink-0 font-serif text-3xl leading-none text-primary-deep/30 italic md:text-4xl">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="max-w-md pt-1.5 leading-relaxed text-foreground/80">
                    {step}
                  </p>
                </li>
              ))}
            </ol>
          </div>

          <div>
            <h2 className="font-serif text-3xl text-primary-deep md:text-4xl">
              Benefits
            </h2>
            <ul className="mt-8 space-y-4">
              {service.benefits.map((b) => (
                <li key={b} className="flex items-start gap-3">
                  <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-primary-soft text-primary-deep">
                    <Check size={12} strokeWidth={2.5} />
                  </span>
                  <span className="text-sm leading-relaxed text-foreground/80">
                    {b}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="bg-surface pb-16 lg:pb-20">
        <div className="container-page">
          <div className="overflow-hidden rounded-3xl border border-border bg-card p-8 shadow-[var(--shadow-soft)] md:p-10">
            <div className="grid items-center gap-10 lg:grid-cols-12">
              <div className="lg:col-span-8">
                <h2 className="font-serif text-3xl text-primary-deep md:text-4xl">
                  At a glance
                </h2>
                <dl className="mt-8 grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-5">
                  {[
                    { icon: Clock, k: "Duration", v: service.duration },
                    { icon: Tag, k: "Pricing", v: service.pricing },
                    { icon: UserRound, k: "Mode", v: service.mode },
                    {
                      icon: CalendarDays,
                      k: "Availability",
                      v: service.availability,
                    },
                    { icon: Calendar, k: "Booking", v: service.booking },
                  ].map(({ icon: GIcon, k, v }) => (
                    <div key={k}>
                      <GIcon
                        size={22}
                        strokeWidth={1.5}
                        className="text-primary-deep/70"
                      />
                      <dt className="mt-3 text-xs text-muted-foreground">
                        {k}
                      </dt>
                      <dd className="mt-1 text-sm font-semibold text-primary-deep">
                        {v}
                      </dd>
                    </div>
                  ))}
                </dl>
                {service.pricingNote && (
                  <p className="mt-6 text-sm text-muted-foreground">
                    {service.pricingNote}
                  </p>
                )}
              </div>
              <div className="lg:col-span-4">
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
                  <Image
                    src={service.glanceImage}
                    alt={`${service.title} at Recro Group`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 33vw"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container-page py-16 lg:py-20">
        <h2 className="font-serif text-3xl text-primary-deep md:text-4xl">
          Common questions
        </h2>
        <ServiceFaqAccordion faqs={service.faqs} />
      </section>

      {service.reading.length > 0 && (
        <section className="border-t border-border bg-muted/20">
          <div className="container-page py-16 lg:py-20">
            <h3 className="font-serif text-3xl text-primary-deep md:text-4xl">
              Related reading
            </h3>
            <div className="mt-8 space-y-4">
              {service.reading.map((r) => (
                <Link
                  key={r.slug}
                  href={`/insights/${r.slug}`}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-soft)] transition-all hover:shadow-[var(--shadow-lift)] sm:flex-row"
                >
                  <div className="relative aspect-[16/10] w-full shrink-0 sm:aspect-auto sm:h-auto sm:w-48 md:w-56">
                    <Image
                      src={r.image}
                      alt={r.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="224px"
                    />
                  </div>
                  <div className="flex flex-col justify-center p-5 md:p-6">
                    <p className="text-[10px] font-semibold tracking-[0.25em] text-primary-deep/60 uppercase">
                      {r.category}
                    </p>
                    <h4 className="mt-2 font-serif text-lg leading-snug text-primary-deep md:text-xl">
                      {r.title}
                    </h4>
                    <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-primary-deep transition-all group-hover:gap-2.5">
                      Read article <ArrowRight size={12} />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="container-page pb-24">
        <div className="relative overflow-hidden rounded-3xl px-6 py-16 lg:py-20">
          <Image
            src={service.ctaImage}
            alt=""
            aria-hidden
            fill
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-primary-deep/75" />
          <div className="relative mx-auto max-w-xl text-center">
            <div className="mx-auto grid h-10 w-10 place-items-center rounded-full bg-white/15 text-white">
              <ServiceIcon size={20} strokeWidth={1.6} />
            </div>
            <h2 className="mt-6 font-serif text-3xl text-white md:text-4xl">
              Ready to begin the conversation?
            </h2>
            <p className="mt-4 text-white/85">
              Taking the first step is often the hardest. We&apos;re here whenever
              you&apos;re ready.
            </p>
            <Link
              href={`/join-us?service=${service.key}`}
              className="mt-8 inline-flex items-center justify-center rounded-full bg-white px-8 py-3 text-sm font-semibold text-primary-deep transition hover:bg-white/90"
            >
              {service.ctaLabel}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
