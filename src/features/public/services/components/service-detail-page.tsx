import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  Clock,
  Heart,
  Home,
  Lock,
  MapPin,
  Settings,
  Sparkles,
  Tag,
  Users as UsersIcon,
} from "lucide-react";

import type { ServiceDetail } from "../data";
import { serviceList } from "../data";

type ServiceDetailPageProps = {
  service: ServiceDetail;
};

export function ServiceDetailPage({ service }: ServiceDetailPageProps) {

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
                  href={
                    service.key === "consortium"
                      ? `/services/consortium/apply`
                      : service.key === "corporate"
                        ? `/services/corporate/apply`
                        : service.key === "children"
                          ? `/grief-camp/apply`
                          : `/booking?service=${service.key}`
                  }
                  className="btn-primary rounded-full px-7"
                >
                  {service.key === "children" ? "Register for camp" : service.ctaLabel}
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
            </div>
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

      {/* Who This Is For & Common Concerns Section */}
      <section className="container-page py-16 lg:py-24 bg-muted/30">
        <div className="grid gap-12 lg:grid-cols-2">
          {/* Who this is for */}
          <div>
            <p className="text-xs font-medium tracking-[0.2em] uppercase text-primary-deep/60">
              Who this is for
            </p>
            <h2 className="mt-4 font-serif text-3xl text-primary-deep md:text-4xl">
              A good fit if you're...
            </h2>
            <div className="mt-8 space-y-3">
              {service.goodFitFor?.map((item: string, i: number) => (
                <div
                  key={i}
                  className="flex items-start gap-3 rounded-2xl border border-border bg-card p-5"
                >
                  <Check
                    className="mt-0.5 size-5 shrink-0 text-primary"
                    strokeWidth={2.5}
                  />
                  <span className="text-sm leading-relaxed text-foreground/80">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Common concerns */}
          <div>
            <p className="text-xs font-medium tracking-[0.2em] uppercase text-primary-deep/60">
              Common concerns
            </p>
            <h2 className="mt-4 font-serif text-3xl text-primary-deep md:text-4xl">
              What we work on
            </h2>
            <div className="mt-8 flex flex-wrap gap-2">
              {service.concerns.map((concern) => (
                <span
                  key={concern}
                  className="rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground"
                >
                  {concern}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* What to Expect Section */}
      <section className="container-page py-16 lg:py-24">
        <div className="max-w-7xl">
          <p className="text-xs font-medium tracking-[0.2em] uppercase text-primary-deep/60">
            What to expect
          </p>
          <h2 className="mt-4 font-serif text-3xl text-primary-deep md:text-4xl lg:text-5xl">
            A clear, gentle process — designed to lower the stakes.
          </h2>

          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {service.expect.map((step, index) => (
              <div
                key={index}
                className="rounded-2xl border border-border bg-card p-7"
              >
                <div className="font-serif text-5xl text-muted-foreground/30">
                  {String(index + 1).padStart(2, "0")}
                </div>
                <h3 className="mt-4 font-serif text-lg text-primary-deep">
                  {step.split(".")[0]}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {step.includes(".") ? step.split(".").slice(1).join(".").trim() : step}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="container-page py-16 lg:py-24 bg-muted/30">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="text-xs font-medium tracking-[0.2em] uppercase text-primary-deep/60">
              Benefits
            </p>
            <h2 className="mt-4 font-serif text-3xl text-primary-deep md:text-4xl lg:text-5xl">
              What you can expect to gain.
            </h2>

            <div className="mt-12 grid gap-6 sm:grid-cols-2">
              {service.benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-border bg-card p-6"
                >
                  <div className="flex size-10 items-center justify-center rounded-full bg-primary/10">
                    <Sparkles className="size-5 text-primary" strokeWidth={2} />
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-foreground/80">
                    {benefit}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div className="rounded-2xl border border-border bg-card p-5 text-center">
                <Lock className="mx-auto size-6 text-primary-deep/60" strokeWidth={1.5} />
                <p className="mt-3 text-xs font-medium text-foreground">
                  Confidential
                </p>
              </div>
              <div className="rounded-2xl border border-border bg-card p-5 text-center">
                <BookOpen className="mx-auto size-6 text-primary-deep/60" strokeWidth={1.5} />
                <p className="mt-3 text-xs font-medium text-foreground">
                  Evidence-based
                </p>
              </div>
              <div className="rounded-2xl border border-border bg-card p-5 text-center">
                <Heart className="mx-auto size-6 text-primary-deep/60" strokeWidth={1.5} />
                <p className="mt-3 text-xs font-medium text-foreground">
                  Tailored
                </p>
              </div>
              <div className="rounded-2xl border border-border bg-card p-5 text-center">
                <Settings className="mx-auto size-6 text-primary-deep/60" strokeWidth={1.5} />
                <p className="mt-3 text-xs font-medium text-foreground">
                  Compassionate
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-2xl border border-border bg-card p-8 shadow-[var(--shadow-soft)] lg:sticky lg:top-24">
              <h3 className="font-serif text-2xl text-primary-deep">
                At a glance
              </h3>

              <div className="mt-8 space-y-6">
                <div className="flex items-start gap-4">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <Clock className="size-5 text-primary" strokeWidth={2} />
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Duration
                    </p>
                    <p className="mt-1 text-base font-medium text-foreground">
                      {service.duration}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <Tag className="size-5 text-primary" strokeWidth={2} />
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Pricing
                    </p>
                    <p className="mt-1 text-base font-medium text-foreground">
                      {service.pricing}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <MapPin className="size-5 text-primary" strokeWidth={2} />
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Mode
                    </p>
                    <p className="mt-1 text-base font-medium text-foreground">
                      {service.mode}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <ArrowRight className="size-5 text-primary" strokeWidth={2} />
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Availability
                    </p>
                    <p className="mt-1 text-base font-medium text-foreground">
                      {service.availability}
                    </p>
                  </div>
                </div>
              </div>

              <Link
                href={
                  service.key === "consortium"
                    ? `/services/consortium/apply`
                    : service.key === "corporate"
                      ? `/services/corporate/apply`
                      : `/booking?service=${service.key}`
                }
                className="btn-primary mt-8 w-full rounded-full"
              >
                {service.key === "consortium" || service.key === "corporate" ? "Apply Now" : "Book now"}{" "}
                <ArrowRight className="ml-2 size-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* You may also consider Section */}
      <section className="container-page py-16 lg:py-24">
        <div className="mb-12 flex items-center justify-between">
          <h2 className="font-serif text-3xl text-primary-deep md:text-4xl">
            You may also consider
          </h2>
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary-deep transition-colors hover:text-primary-deep/80"
          >
            All services <ArrowRight className="size-4" />
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {serviceList
            .filter((s) => s.slug !== service.key)
            .slice(0, 3)
            .map((relatedService) => {
              // Map icon names to actual icon components
              const iconMap: Record<string, any> = {
                individual: UsersIcon,
                couples: Heart,
                family: Home,
                group: UsersIcon,
                children: Sparkles,
                corporate: Settings,
              };

              const IconComponent = iconMap[relatedService.slug] || Sparkles;

              return (
                <Link
                  key={relatedService.slug}
                  href={`/services/${relatedService.slug}`}
                  className="group rounded-2xl border border-border bg-card p-8 transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-card)]"
                >
                  <div className="flex size-12 items-center justify-center rounded-full bg-primary/10">
                    <IconComponent className="size-6 text-primary" strokeWidth={1.5} />
                  </div>
                  <h3 className="mt-6 font-serif text-xl text-primary-deep">
                    {relatedService.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {relatedService.description}
                  </p>
                  <div className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-primary-deep">
                    Read more{" "}
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>
              );
            })}
        </div>
      </section>
    </>
  );
}
