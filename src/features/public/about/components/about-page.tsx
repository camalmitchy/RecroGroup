import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Briefcase,
  FlaskConical,
  GraduationCap,
  HeartHandshake,
  Quote,
  Sparkles,
} from "lucide-react";

import { serviceList } from "@/features/public/services/data";

import {
  founder,
  founderHighlights,
  framework,
  mftVideo,
  recroCoreValues,
} from "../data";

const highlightIcons = [
  FlaskConical,
  HeartHandshake,
  Briefcase,
  GraduationCap,
  BookOpen,
] as const;

export function AboutPage() {
  return (
    <>
      {/* Founder */}
      <section className="container-page grid items-start gap-12 py-16 lg:grid-cols-2 lg:gap-16 lg:py-20">
        <div className="max-w-2xl lg:sticky lg:top-24">
          <span className="text-[10px] font-bold tracking-[0.2em] text-primary-deep uppercase">
            Our Founder
          </span>
          <h1 className="mt-5 font-serif text-4xl leading-[1.1] tracking-tight text-foreground md:text-5xl lg:text-6xl">
            <span className="text-primary-deep">{founder.name}</span>
          </h1>
          <p className="mt-4 text-sm font-medium tracking-wide text-primary-deep/80">
            {founder.credentials}
          </p>
          <p className="mt-8 font-serif text-lg leading-relaxed text-foreground/80 italic md:text-xl">
            &ldquo;{founder.tagline}&rdquo;
          </p>
          <p className="mt-8 text-[15px] leading-[1.75] text-muted-foreground">
            {founder.intro}
          </p>
          <p className="mt-5 text-[15px] leading-[1.75] text-muted-foreground">
            {founder.philosophy}
          </p>
        </div>

        <div className="relative overflow-hidden rounded-[2rem] bg-surface-2 shadow-[var(--shadow-lift)] ring-1 ring-border">
          <Image
            src="/assets/founder-portrait.jpg"
            alt="Dr. Michelle Karume"
            width={1067}
            height={1600}
            priority
            className="h-auto w-full object-contain"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>
      </section>

      {/* Philosophy quote */}
      <section className="bg-background py-10">
        <div className="container-page">
          <div className="relative flex flex-col items-center gap-8 overflow-hidden rounded-[2.5rem] bg-primary-soft p-10 md:flex-row md:p-16">
            <Quote
              size={64}
              className="shrink-0 self-start text-primary opacity-60 md:self-auto"
              fill="currentColor"
            />
            <p className="max-w-4xl text-xl leading-relaxed font-medium text-foreground md:text-2xl">
              Health is not the absence of disease — it is the inclusion of
              biological, psychological, and spiritual wellbeing.
            </p>
          </div>
        </div>
      </section>

      {/* Highlights — was Intro, removed duplicate */}
      <section className="border-y border-border bg-surface py-16 lg:py-20">
        <div className="container-page">
          <div className="max-w-2xl">
            <span className="eyebrow">Her work</span>
            <h2 className="mt-4 font-serif text-3xl tracking-tight text-foreground md:text-4xl">
              Clinical, academic &amp; community impact
            </h2>
          </div>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {founderHighlights.map((item, index) => {
              const Icon = highlightIcons[index];
              return (
                <article
                  key={item.title}
                  className="card-lift rounded-3xl border border-border bg-card p-7 shadow-[var(--shadow-soft)]"
                >
                  <span className="grid size-11 place-items-center rounded-2xl bg-primary-soft text-primary-deep">
                    <Icon size={20} strokeWidth={1.6} />
                  </span>
                  <h3 className="mt-5 text-lg font-semibold text-foreground">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {item.body}
                  </p>
                </article>
              );
            })}
          </div>
          <p className="mx-auto mt-14 max-w-3xl text-center font-serif text-lg leading-relaxed text-foreground/85 italic md:text-xl">
            {founder.closing}
          </p>
        </div>
      </section>

      {/* MFT Video */}
      <section className="container-page py-16 lg:py-20">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <div>
            <span className="eyebrow">Marriage &amp; Family Therapy</span>
            <h2 className="mt-4 font-serif text-3xl tracking-tight text-foreground md:text-4xl">
              {mftVideo.title}
            </h2>
            <p className="mt-5 leading-relaxed text-muted-foreground">
              {mftVideo.description}
            </p>
          </div>
          <div className="overflow-hidden rounded-3xl border border-border bg-black shadow-[var(--shadow-lift)]">
            <div className="relative aspect-video">
              <iframe
                src={`https://www.youtube.com/embed/${mftVideo.youtubeId}`}
                title={mftVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="absolute inset-0 size-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Framework */}
      <section className="bg-primary-deep py-16 text-primary-foreground lg:py-20">
        <div className="container-page grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <span className="text-xs font-semibold tracking-[0.2em] text-accent uppercase">
              {framework.title}
            </span>
            <p className="mt-5 text-lg leading-relaxed text-primary-foreground/90">
              {framework.body}
            </p>
            <p className="mt-5 font-serif text-xl leading-relaxed text-primary-foreground md:text-2xl">
              {framework.highlight}
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
            {[
              { label: "Biological", desc: "Body & health" },
              { label: "Psychological", desc: "Mind & emotion" },
              { label: "Spiritual", desc: "Meaning & purpose" },
            ].map((pillar) => (
              <div
                key={pillar.label}
                className="rounded-2xl border border-primary-foreground/15 bg-primary-foreground/10 p-5 backdrop-blur-sm"
              >
                <Sparkles size={18} className="text-accent" />
                <p className="mt-3 font-semibold text-primary-foreground">
                  {pillar.label}
                </p>
                <p className="mt-1 text-sm text-primary-foreground/70">
                  {pillar.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="container-page py-16 lg:py-20">
        <div className="text-center">
          <span className="eyebrow mx-auto">{recroCoreValues.eyebrow}</span>
          <h2 className="mt-4 font-serif text-3xl tracking-tight text-foreground md:text-4xl">
            Vision &amp; mission
          </h2>
        </div>
        <div className="mx-auto mt-12 grid max-w-5xl gap-6 md:grid-cols-2">
          <div className="relative overflow-hidden rounded-[2rem] border border-primary/20 bg-primary-soft p-10 shadow-[var(--shadow-soft)]">
            <p className="text-xs font-semibold tracking-[0.2em] text-muted-foreground uppercase">
              Vision
            </p>
            <p className="mt-5 font-serif text-3xl leading-snug text-primary-deep md:text-4xl">
              {recroCoreValues.vision}
            </p>
          </div>
          <div className="relative overflow-hidden rounded-[2rem] bg-primary-deep p-10 text-primary-foreground shadow-[var(--shadow-lift)]">
            <p className="text-xs font-semibold tracking-[0.2em] text-primary-foreground/70 uppercase">
              Mission
            </p>
            <p className="mt-5 font-serif text-3xl leading-snug md:text-4xl">
              {recroCoreValues.mission}
            </p>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="border-t border-border bg-primary-soft/50 py-16 lg:py-20">
        <div className="container-page">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-xl">
              <span className="eyebrow">Our services</span>
              <h2 className="mt-4 font-serif text-3xl tracking-tight text-foreground md:text-4xl">
                How we walk with you
              </h2>
              <p className="mt-4 leading-relaxed text-muted-foreground">
                From individual therapy to grief camp and corporate wellbeing —
                care shaped by systemic family therapy.
              </p>
            </div>
            <Link
              href="/services"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-deep transition-all hover:gap-2.5"
            >
              All services <ArrowRight size={14} />
            </Link>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {serviceList.slice(0, 6).map((service) => (
              <Link
                key={service.slug}
                href={`/services/${service.slug}`}
                className="group card-lift flex items-start gap-4 rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-soft)]"
              >
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-primary-soft">
                  <Image
                    src={service.icon}
                    alt=""
                    width={20}
                    height={20}
                    className="size-5 object-contain"
                  />
                </span>
                <div className="min-w-0">
                  <p className="font-semibold text-foreground group-hover:text-primary-deep">
                    {service.title}
                  </p>
                  <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                    {service.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container-page pb-20 pt-4">
        <div className="relative flex min-h-[300px] flex-col items-center justify-between overflow-hidden rounded-[2rem] bg-primary-soft md:flex-row">
          <div className="relative h-48 w-full shrink-0 md:h-full md:w-1/4">
            <Image
              src="/assets/journey-camp.jpg"
              alt=""
              fill
              className="object-cover"
              sizes="25vw"
            />
          </div>
          <div className="z-10 flex-1 px-6 py-12 text-center md:py-8">
            <h2 className="font-serif text-3xl tracking-tight text-foreground md:text-4xl">
              Ready to take the first step?
            </h2>
            <p className="mt-4 font-medium text-foreground/80">
              We&apos;re here to listen and walk with you.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link href="/booking" className="btn-primary">
                Book a Session
              </Link>
              <Link href="/contact" className="btn-secondary">
                Contact us
              </Link>
            </div>
          </div>
          <div className="relative h-48 w-full shrink-0 md:h-full md:w-1/4">
            <Image
              src="/assets/journey-connection.jpg"
              alt=""
              fill
              className="object-cover"
              sizes="25vw"
            />
          </div>
        </div>
      </section>
    </>
  );
}
