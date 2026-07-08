import Image from "next/image";
import Link from "next/link";
import { Check, ArrowRight, Heart, Home, Sparkles, Users } from "lucide-react";

import {
  camperPricing,
  parentPricing,
  journeyChecklist,
} from "../data";

export function GriefCampPage() {
  const concerns = [
    "Loss of a parent or sibling",
    "Sudden or traumatic loss",
    "Complicated grief reactions",
    "Social withdrawal after loss",
    "Difficulty expressing grief",
    "Anniversary reactions",
  ];

  const expectations = [
    "Complete a brief application form sharing your child's story and needs.",
    "Attend a pre-camp briefing session where we meet families and answer questions.",
    "Drop off on Friday afternoon — we handle everything from meals to activities to bedtime.",
    "Join us for a closing circle on Sunday where campers share one thing they're taking home.",
    "Receive a post-camp integration guide to support your child's continued healing.",
  ];

  return (
    <>
      {/* Hero Section with Image */}
      <section className="relative h-[500px] md:h-[600px] overflow-hidden">
        <Image
          src="/assets/forest.jpg"
          alt="Grief Camp - A safe space for children and teens"
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-primary-deep/40" />
        <div className="absolute inset-0 z-[1] bg-gradient-to-r from-black/50 via-black/30 to-black/20" />

        <div className="relative z-10 flex h-full items-center">
          <div className="container-page w-full">
            <div className="max-w-3xl">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif text-white leading-[1.05]">
                Grief Camp
              </h1>
              <p className="mt-6 text-white/95 leading-relaxed text-base md:text-lg max-w-2xl">
                A child-safe, family-friendly program providing young people with language, ritual, and community around loss. Designed and led by licensed clinicians with care for age, faith, and family context.
              </p>
              <p className="mt-4 text-white/90 text-sm font-medium">
                Duration: 3 days
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-primary-deep px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary-deep/90"
                >
                  Apply for Grief Camp
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-white/40 bg-white/20 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/30"
                >
                  Ask a question
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="px-6 py-20">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[2fr_1fr]">
          <div className="space-y-12">
            {/* Who this helps */}
            <Block title="Who this helps">
              <p className="text-muted-foreground leading-relaxed">
                Grief Camp is designed for adolescents aged 10–16 who have
                experienced the death of a parent, sibling, or close family
                member. It's for kids who are navigating loss and need a place
                where they don't have to explain, pretend, or hold back.
              </p>
            </Block>

            {/* Common concerns */}
            <Block title="Common concerns we work with">
              <ul className="grid gap-3 sm:grid-cols-2">
                {concerns.map((c: string) => (
                  <li key={c} className="flex items-start gap-2.5 text-foreground">
                    <Check
                      className="mt-0.5 size-4 text-primary"
                      strokeWidth={2.5}
                    />
                    <span className="text-sm">{c}</span>
                  </li>
                ))}
              </ul>
            </Block>

            {/* What to expect */}
            <Block title="What to expect">
              <ol className="space-y-4">
                {expectations.map((e: string, i: number) => (
                  <li key={i} className="flex gap-4">
                    <span className="grid size-7 shrink-0 place-items-center rounded-full bg-muted font-serif text-sm text-foreground">
                      {i + 1}
                    </span>
                    <span className="text-muted-foreground leading-relaxed">
                      {e}
                    </span>
                  </li>
                ))}
              </ol>
            </Block>

            {/* Camp logistics - Clean Layout */}
            <Block title="Camp logistics">
              <div className="grid gap-8 sm:grid-cols-3">
                <div>
                  <p className="text-xs font-medium tracking-[0.2em] uppercase text-muted-foreground mb-3">
                    Age Group
                  </p>
                  <p className="font-serif text-2xl text-foreground">
                    8–17 years
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium tracking-[0.2em] uppercase text-muted-foreground mb-3">
                    Next Camp Dates
                  </p>
                  <p className="font-serif text-2xl text-foreground">
                    TBA
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium tracking-[0.2em] uppercase text-muted-foreground mb-3">
                    Format
                  </p>
                  <p className="font-serif text-2xl text-foreground">
                    Residential & day
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium tracking-[0.2em] uppercase text-muted-foreground mb-3">
                    Camp Fee
                  </p>
                  <p className="font-serif text-2xl text-foreground">
                    From KES 12,000
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium tracking-[0.2em] uppercase text-muted-foreground mb-3">
                    Scholarships
                  </p>
                  <p className="font-serif text-2xl text-foreground">
                    Available
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium tracking-[0.2em] uppercase text-muted-foreground mb-3">
                    Capacity
                  </p>
                  <p className="font-serif text-2xl text-foreground">
                    20 children / camp
                  </p>
                </div>
              </div>

              <div className="mt-10 flex flex-wrap gap-3">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-primary-deep px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary-deep/90"
                >
                  Apply for Grief Camp
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-border bg-transparent px-6 py-3 text-sm font-semibold text-foreground transition hover:bg-muted"
                >
                  Sponsor a Child
                </Link>
              </div>
              <p className="mt-6 text-xs text-muted-foreground">
                Camp flyers for upcoming seasons are published here by our admin
                team as soon as they are confirmed.
              </p>
            </Block>

            {/* What makes camp different */}
            <Block title="What makes camp different">
              <ul className="space-y-3">
                {journeyChecklist.map((item: string) => (
                  <li key={item} className="flex items-start gap-3">
                    <Check
                      className="mt-0.5 size-5 shrink-0 text-primary"
                      strokeWidth={2.5}
                    />
                    <span className="text-sm text-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </Block>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6 lg:sticky lg:top-28 h-fit">
            {/* At a glance */}
            <div className="rounded-3xl bg-muted/50 border border-border p-7">
              <h3 className="eyebrow">At a glance</h3>
              <dl className="mt-5 space-y-4 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Duration</dt>
                  <dd className="text-foreground">3 days / 2 nights</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Pricing</dt>
                  <dd className="text-foreground">From KES 11,000</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Location</dt>
                  <dd className="text-foreground">Residential camp</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Next camp</dt>
                  <dd className="text-foreground">Aug 14-16, 2026</dd>
                </div>
              </dl>
              <div className="mt-6">
                <Link
                  href="/contact"
                  className="btn-primary block w-full rounded-full text-center"
                >
                  Apply now
                </Link>
              </div>
            </div>

            {/* Pricing breakdown */}
            <div className="rounded-3xl bg-card border border-border p-7">
              <h3 className="eyebrow">2026 Pricing</h3>
              <div className="mt-5 space-y-6">
                {/* Camper pricing */}
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                    For Campers
                  </p>
                  <ul className="space-y-2">
                    {camperPricing.map((tier) => (
                      <li
                        key={tier.label}
                        className="flex items-center justify-between text-sm"
                      >
                        <div>
                          <span className="font-medium text-foreground">
                            {tier.label}
                          </span>
                          <span className="text-xs text-muted-foreground ml-2">
                            {tier.deadline}
                          </span>
                        </div>
                        <span className="font-semibold text-primary-deep">
                          {tier.price}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Parent pricing */}
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                    For Parents
                  </p>
                  <ul className="space-y-2">
                    {parentPricing.map((tier) => (
                      <li
                        key={tier.label}
                        className="flex items-center justify-between text-sm"
                      >
                        <div>
                          <span className="font-medium text-foreground">
                            {tier.label}
                          </span>
                          <span className="text-xs text-muted-foreground ml-2">
                            {tier.deadline}
                          </span>
                        </div>
                        <span className="font-semibold text-primary-deep">
                          {tier.price}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <p className="mt-4 text-xs text-muted-foreground">
                Includes accommodation, meals, activities & counselling.
              </p>
            </div>
          </aside>
        </div>
      </section>

      {/* Related Resources - Using Resources Page Card Style */}
      <section className="bg-muted/30 px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-serif text-3xl text-foreground md:text-4xl">
            Related reading
          </h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              {
                category: "Parenting",
                title: "Talking to Children About Death",
                excerpt:
                  "Age-appropriate ways to discuss loss with your children and support them through grief.",
                readingTime: "5 min read",
              },
              {
                category: "Grief",
                title: "Understanding Complex Grief",
                excerpt:
                  "Grief isn't linear. Learn about the different stages and how to navigate the complexity of loss.",
                readingTime: "7 min read",
              },
              {
                category: "Grief",
                title: "Navigating Holidays After Loss",
                excerpt:
                  "Practical guidance for managing special occasions and family gatherings while grieving.",
                readingTime: "6 min read",
              },
            ].map((r, i) => (
              <Link
                key={i}
                href="/resources"
                className="card-lift group flex flex-col rounded-3xl border border-border bg-card p-8 transition-all hover:-translate-y-1"
              >
                <span className="inline-block rounded-full bg-primary-soft px-3 py-1 text-xs font-semibold text-primary-deep w-fit">
                  {r.category}
                </span>
                <h3 className="mt-4 font-serif text-2xl text-foreground">
                  {r.title}
                </h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {r.excerpt}
                </p>
                <div className="mt-6 flex items-center justify-between text-xs text-muted-foreground">
                  <span>{r.readingTime}</span>
                  <span className="inline-flex items-center gap-1.5 font-semibold uppercase tracking-[0.16em] text-primary-deep">
                    Read{" "}
                    <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Other Services - Using Service Detail Page Card Style */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-serif text-3xl text-foreground md:text-4xl">
            Other services
          </h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              {
                title: "Individual Therapy",
                description:
                  "Individual therapy is a confidential, judgement-free space to slow down and make sense of what you're carrying. Our therapists use evidence-based approaches — adapted to your therapy goals.",
                href: "/services/individual",
                icon: Users,
              },
              {
                title: "Family Therapy",
                description:
                  "Family therapy looks at the whole system. We help each person feel heard while creating language and structure for the family to function with more warmth, clarity, and safety.",
                href: "/services/family",
                icon: Home,
              },
              {
                title: "Group Therapy",
                description:
                  "Group therapy reminds us we are not alone. Held in a small, carefully facilitated space, groups offer connection, perspective, and skills practice that complements individual work beautifully.",
                href: "/services/group",
                icon: Sparkles,
              },
            ].map((s) => {
              const IconComponent = s.icon;
              return (
                <Link
                  key={s.title}
                  href={s.href}
                  className="group rounded-2xl border border-border bg-card p-8 transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-card)]"
                >
                  <div className="flex size-12 items-center justify-center rounded-full bg-primary/10">
                    <IconComponent className="size-6 text-primary" strokeWidth={1.5} />
                  </div>
                  <h3 className="mt-6 font-serif text-xl text-primary-deep">
                    {s.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {s.description}
                  </p>
                  <div className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-primary-deep">
                    Read more{" "}
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}

function Block({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h2 className="font-serif text-2xl text-foreground md:text-3xl">
        {title}
      </h2>
      <div className="mt-5">{children}</div>
    </div>
  );
}
