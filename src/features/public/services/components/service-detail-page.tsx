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
    </>
  );
}
