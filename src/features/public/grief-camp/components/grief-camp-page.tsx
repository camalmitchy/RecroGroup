import Image from "next/image";
import Link from "next/link";
import { Check, ArrowRight, Heart } from "lucide-react";

import { Button } from "@/components/ui/button";
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
      {/* Hero Section */}
      <section className="border-b border-border bg-muted/30 px-6 py-20 lg:py-28">
        <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1fr_auto]">
          <div>
            <Link
              href="/services"
              className="eyebrow inline-flex items-center gap-1.5 hover:text-foreground"
            >
              ← All services
            </Link>
            <h1 className="mt-5 font-serif text-4xl text-foreground md:text-6xl">
              Grief Camp for Adolescents
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              A safe, structured weekend where teens who have lost a parent or
              sibling can grieve, connect, and remember — surrounded by others
              who truly understand.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="rounded-full">
                <Link href="/contact">Apply for Grief Camp</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-full"
              >
                <Link href="/contact">Ask a question</Link>
              </Button>
            </div>
          </div>
          <div className="grid size-28 place-items-center rounded-3xl bg-primary text-white lg:size-36">
            <Heart className="size-12 lg:size-16" strokeWidth={1.25} />
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
                {concerns.map((c) => (
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
                {expectations.map((e, i) => (
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

            {/* Camp logistics */}
            <Block title="Camp logistics">
              <dl className="grid gap-6 sm:grid-cols-3">
                {[
                  ["Age group", "10–16 years"],
                  ["Next camp", "Aug 14-16, 2026"],
                  ["Format", "Residential weekend"],
                  ["Camp fee", "From KES 11,000"],
                  ["Scholarships", "Available"],
                  ["Capacity", "20 children / camp"],
                ].map(([k, v]) => (
                  <div key={k}>
                    <dt className="text-xs uppercase tracking-wider text-muted-foreground">
                      {k}
                    </dt>
                    <dd className="mt-1 font-serif text-lg text-foreground">
                      {v}
                    </dd>
                  </div>
                ))}
              </dl>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild size="lg" className="rounded-full">
                  <Link href="/contact">Apply for Grief Camp</Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="rounded-full"
                >
                  <Link href="/contact">Sponsor a Child</Link>
                </Button>
              </div>
              <p className="mt-4 text-xs text-muted-foreground">
                Camp flyers for upcoming seasons are published here by our admin
                team as soon as they are confirmed.
              </p>
            </Block>

            {/* What makes camp different */}
            <Block title="What makes camp different">
              <ul className="space-y-3">
                {journeyChecklist.map((item) => (
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
                <Button asChild size="lg" className="w-full rounded-full">
                  <Link href="/contact">Apply now</Link>
                </Button>
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

      {/* Related Resources */}
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
              },
              {
                category: "Grief",
                title: "Understanding Complex Grief",
                excerpt:
                  "Grief isn't linear. Learn about the different stages and how to navigate the complexity of loss.",
              },
              {
                category: "Grief",
                title: "Navigating Holidays After Loss",
                excerpt:
                  "Practical guidance for managing special occasions and family gatherings while grieving.",
              },
            ].map((r, i) => (
              <Link
                key={i}
                href="/resources"
                className="group rounded-3xl bg-card border border-border p-7 transition-all hover:-translate-y-1 hover:shadow-lg"
              >
                <span className="inline-block rounded-full bg-primary-soft px-3 py-1 text-xs font-semibold text-primary-deep">
                  {r.category}
                </span>
                <h3 className="mt-3 font-serif text-xl text-foreground">
                  {r.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {r.excerpt}
                </p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-primary-deep">
                  Read more{" "}
                  <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Other Services */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-serif text-3xl text-foreground md:text-4xl">
            Other services
          </h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              {
                title: "Individual Therapy",
                description: "One-on-one psychotherapy for personal growth",
                href: "/services/individual",
              },
              {
                title: "Family Therapy",
                description: "Whole-family sessions for stronger connections",
                href: "/services/family",
              },
              {
                title: "Group Therapy",
                description: "Shared healing experiences with peer support",
                href: "/services/group",
              },
            ].map((s) => (
              <Link
                key={s.title}
                href={s.href}
                className="group rounded-3xl border border-border bg-card p-7 hover:border-primary/30 hover:shadow-lg transition-all"
              >
                <h3 className="font-serif text-xl text-foreground">
                  {s.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {s.description}
                </p>
              </Link>
            ))}
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
