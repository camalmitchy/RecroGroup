"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Brain,
  Dna,
  HeartHandshake,
  Mail,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import {
  homeBlogPosts,
  homeBookingPerks,
  homeFramework,
  homeServices,
  homeTestimonials,
  homeTrustFeatures,
  homeVideos,
} from "../data";
import { HomeVideoCard } from "./home-video-card";

const trustIcons = [ShieldCheck, HeartHandshake, Sparkles] as const;

function HomeBookingForm() {
  const router = useRouter();

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        const service = String(fd.get("service") || "individual");
        router.push(`/join-us?service=${encodeURIComponent(service)}`);
      }}
      className="flex flex-col gap-5"
    >
      <label className="block">
        <span className="mb-3 block text-xs font-semibold tracking-[0.18em] text-muted-foreground uppercase">
          Support type
        </span>
        <select
          name="service"
          defaultValue="individual"
          className="w-full cursor-pointer appearance-none rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground transition-colors hover:border-primary"
        >
          <option value="individual">Individual Therapy</option>
          <option value="couples">Couples &amp; Families</option>
          <option value="children">Children &amp; Grief</option>
          <option value="corporate">Corporate Wellness</option>
        </select>
      </label>
      <div className="grid grid-cols-2 gap-4">
        <label className="block">
          <span className="mb-3 block text-xs font-semibold tracking-[0.18em] text-muted-foreground uppercase">
            Preferred date
          </span>
          <input
            type="date"
            name="date"
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground transition-colors hover:border-primary"
          />
        </label>
        <label className="block">
          <span className="mb-3 block text-xs font-semibold tracking-[0.18em] text-muted-foreground uppercase">
            Mode
          </span>
          <select
            name="mode"
            className="w-full cursor-pointer appearance-none rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground transition-colors hover:border-primary"
          >
            <option>In-person</option>
            <option>Online</option>
            <option>Phone</option>
          </select>
        </label>
      </div>
      <button type="submit" className="btn-primary mt-2 w-full justify-center">
        Continue to booking <ArrowRight size={16} />
      </button>
    </form>
  );
}

export function HomePage() {
  const [email, setEmail] = useState("");

  return (
    <>
      {/* HERO */}
      <section className="relative px-6 pt-8 pb-24 lg:pt-12 lg:pb-32">
        <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-2">
          <div>
            <h1 className="mt-6 font-serif text-5xl leading-[1.05] text-foreground md:text-7xl">
              Restore your{" "}
              <span className="italic text-primary-deep">Life</span>.
            </h1>
            <p className="mt-7 max-w-lg text-base leading-relaxed text-muted-foreground">
              <strong className="text-foreground">Recro</strong>{" "}
              <span className="text-sm text-muted-foreground/80">(rec·ro)</span>{" "}
              <strong className="text-foreground">Group Limited</strong> is a Behavioral Health Organization that utilizes Psychotherapy to work with individuals, families, couples, groups and organizations dealing with relational challenges. By using a systemic view, Recro Group works from the Biopsychosocialspiritual Framework which employs a wholistic approach to treatment.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link href="/booking" className="btn-primary">
                Book a Session
              </Link>
              <Link href="/services" className="btn-secondary">
                Explore Services
              </Link>
            </div>
            <dl className="mt-12 grid grid-cols-3 gap-6 border-t border-border pt-8 max-w-md">
              <div>
                <dt className="text-xs uppercase tracking-wider text-muted-foreground">
                  Years
                </dt>
                <dd className="mt-1 font-serif text-2xl text-foreground">
                  12+
                </dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wider text-muted-foreground">
                  Clients
                </dt>
                <dd className="mt-1 font-serif text-2xl text-foreground">
                  3,000+
                </dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wider text-muted-foreground">
                  Therapists
                </dt>
                <dd className="mt-1 font-serif text-2xl text-foreground"></dd>
              </div>
            </dl>
          </div>
          <div className="relative">
            <Image
              src="/assets/hero-therapy-room.jpg"
              alt="A peaceful, sunlit therapy room with linen curtains, two warm armchairs, and a small plant"
              width={1200}
              height={1200}
              className="aspect-square w-full rounded-3xl object-cover shadow-[var(--shadow-card)] ring-1 ring-border"
              priority
            />
            <figure className="absolute -bottom-8 -left-6 hidden max-w-xs rounded-2xl bg-card border border-border p-6 shadow-[var(--shadow-card)] md:block">
              <blockquote className="font-serif text-lg italic leading-snug text-foreground">
                &ldquo;Awareness in itself is healing&rdquo;
              </blockquote>
              <figcaption className="mt-3 text-xs font-semibold uppercase tracking-wider text-primary-deep">
                — Fritz Perls
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      <section className="container-page bg-background py-20">
        <div className="mx-auto max-w-4xl text-center">
          <span className="text-xs font-medium tracking-[0.2em] uppercase text-muted-foreground">
            What we offer
          </span>
          <h2 className="mt-6 font-serif text-4xl md:text-5xl lg:text-6xl text-foreground">
            Support tailored for you
          </h2>
          <p className="mt-6 text-base md:text-lg text-muted-foreground mx-auto max-w-3xl">
            Specialised care for every stage of life's journey — alone, together, or as a team.
          </p>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {homeServices.map((s) => (
            <article
              key={s.title}
              className="group card-lift relative rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]"
            >
              <div className="h-20 w-20">
                <Image
                  src={s.icon}
                  alt=""
                  width={80}
                  height={80}
                  className="size-full object-contain"
                />
              </div>
              <h3 className="mt-5 text-lg font-semibold text-foreground">
                {s.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {s.body}
              </p>
              <div className="mt-5">
                <Link
                  href={`/services/${s.serviceKey}`}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-deep transition-all group-hover:gap-2.5"
                >
                  Learn more <ArrowRight size={13} />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-surface">
        <div className="container-page py-20">
          <div className="mx-auto max-w-4xl text-center">
            <span className="eyebrow">{homeFramework.title}</span>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl lg:text-5xl">
              A wholistic view of what it means to be well.
            </h2>
            <p className="mt-6 leading-relaxed text-muted-foreground text-lg max-w-3xl mx-auto">
              {homeFramework.body}
            </p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 max-w-5xl mx-auto">
            {[
              { label: "Biological", desc: "Body & health", icon: Dna },
              { label: "Psychological", desc: "Mind & emotion", icon: Brain },
              { label: "Social", desc: "Relationships & community", icon: Users },
              { label: "Spiritual", desc: "Meaning & purpose", icon: Sparkles },
            ].map((pillar) => {
              const IconComponent = pillar.icon;
              return (
                <div
                  key={pillar.label}
                  className="rounded-2xl border border-border bg-card p-6 text-center shadow-[var(--shadow-soft)]"
                >
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary-soft">
                    <IconComponent className="h-7 w-7 text-primary-deep" strokeWidth={2} />
                  </div>
                  <p className="mt-4 font-semibold text-foreground text-lg">
                    {pillar.label}
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {pillar.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="container-page bg-background py-20">
        <div className="relative overflow-hidden rounded-[2rem] bg-[#3F5B43] shadow-[var(--shadow-lift)] text-center p-12 md:p-16">
          <div className="mx-auto max-w-3xl">
            <span className="mb-4 inline-block text-xs font-semibold tracking-[0.18em] text-white/70 uppercase">
              Signature Programme
            </span>
            <h2 className="text-3xl font-semibold tracking-tight text-white md:text-4xl lg:text-5xl">
              The Recro Grief Camp
            </h2>
            <p className="mt-6 leading-relaxed text-white/90 text-lg max-w-2xl mx-auto">
              A therapeutic camp for children ages 10-16 who, through death have lost a sibling or parent.
            </p>
            <div className="mt-10 flex flex-wrap gap-3 justify-center">
              <Link
                href="/booking?service=children"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#3F5B43] transition hover:bg-white/90"
              >
                Apply for Grief Camp
              </Link>
              <Link
                href="/sponsor-child"
                className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-white/30 px-6 py-3 text-sm font-semibold text-white transition hover:border-white/50"
              >
                Sponsor a Child
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-surface">
        <div className="container-page py-20">
          <div className="grid gap-10 rounded-[2rem] border border-border bg-card p-8 shadow-[var(--shadow-lift)] md:p-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <span className="eyebrow">Begin healing</span>
              <h2 className="mt-4 font-serif text-3xl leading-[1.1] tracking-tight text-foreground md:text-5xl">
                A first session is a quiet act of courage.
              </h2>
              <p className="mt-5 leading-relaxed text-muted-foreground">
                Choose your service and a time that works for you. We&apos;ll
                confirm within one working day. All sessions are strictly
                confidential.
              </p>
              <ul className="mt-8 space-y-3 text-sm text-foreground">
                {homeBookingPerks.map((p) => (
                  <li key={p} className="flex items-start gap-3">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary-deep" />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
            <HomeBookingForm />
          </div>
        </div>
      </section>

      <section className="bg-background">
        <div className="container-page grid gap-12 py-20 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <span className="eyebrow">Why Recro</span>
            <h2 className="mt-4 font-serif text-3xl leading-[1.05] tracking-tight text-foreground md:text-5xl">
              Clinically credible.
              <br />
              Deeply human.
            </h2>
          </div>
          <div className="grid gap-8 sm:grid-cols-3 lg:col-span-8">
            {homeTrustFeatures.map((f, i) => {
              const Icon = trustIcons[i];
              return (
                <div key={f.title}>
                  <span className="grid h-11 w-11 place-items-center rounded-full bg-primary-soft text-primary-deep">
                    <Icon size={18} strokeWidth={2} />
                  </span>
                  <h3 className="mt-5 text-lg font-semibold text-foreground">
                    {f.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {f.body}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-primary-deep text-background">
        <div className="container-page py-20">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <span className="text-xs font-semibold tracking-[0.2em] text-primary-soft uppercase">
                Media &amp; insights
              </span>
              <h2 className="mt-4 font-serif text-4xl tracking-tight text-background md:text-5xl">
                Watch &amp; reflect
              </h2>
            </div>
            <Link
              href="/media"
              className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.2em] text-primary-soft uppercase transition-all hover:gap-3"
            >
              View media library <ArrowRight size={14} />
            </Link>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {homeVideos.map((v) => (
              <HomeVideoCard key={v.title} video={v} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-background">
        <div className="container-page py-20">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <span className="text-xs font-semibold tracking-[0.2em] text-muted-foreground uppercase">
                Blogs
              </span>
              <h2 className="mt-4 font-serif text-4xl tracking-tight text-foreground md:text-5xl">
                Read &amp; recover
              </h2>
            </div>
            <Link
              href="/insights"
              className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.2em] text-primary-deep uppercase transition-all hover:gap-3"
            >
              All blogs <ArrowRight size={14} />
            </Link>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {homeBlogPosts.map((b) => (
              <Link
                key={b.title}
                href="/insights"
                className="group card-lift block rounded-3xl border border-border bg-card p-8 shadow-[var(--shadow-soft)]"
              >
                <span className="text-xs font-semibold tracking-[0.2em] text-muted-foreground uppercase">
                  {b.category}
                </span>
                <h3 className="mt-4 font-serif text-2xl leading-snug text-foreground">
                  {b.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {b.desc}
                </p>
                <p className="mt-6 text-xs text-muted-foreground">{b.read}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-background">
        <div className="container-page py-20 ">
          <div className="mx-auto max-w-4xl text-center">
            <span className="text-xs font-medium tracking-[0.2em] uppercase text-muted-foreground">
              Testimonials
            </span>
            <h2 className="mt-6 font-serif text-4xl md:text-5xl lg:text-6xl text-foreground">
              What our clients say
            </h2>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {homeTestimonials.map((t) => (
              <figure
                key={t.author}
                className="flex flex-col rounded-3xl border border-border bg-card p-8 shadow-[var(--shadow-soft)]"
              >
                <div className="flex gap-0.5 mb-4">
                  {[...Array(t.rating)].map((_, i) => (
                    <span key={i} className="text-primary-deep text-base">★</span>
                  ))}
                </div>
                <blockquote className="flex-1 text-sm leading-relaxed text-muted-foreground">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-3 border-t border-border pt-4">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full ${t.bgColor} text-white text-sm font-semibold`}>
                    {t.initials}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {t.author}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">{t.location}</p>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-background">
        <div className="container-page py-12 md:py-10">
          <div className="card-lift flex flex-col gap-6 rounded-3xl border border-border bg-card p-6 md:flex-row md:items-center md:gap-10 md:p-8">
            <div className="flex items-center gap-4 md:flex-1">
              <span className="inline-grid h-14 w-14 shrink-0 place-items-center rounded-full bg-primary-soft text-primary-deep">
                <Mail size={24} strokeWidth={1.5} />
              </span>
              <div>
                <h2 className="text-xl font-semibold tracking-tight md:text-2xl">
                  Stay connected
                </h2>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  Get new insights, videos, and resources delivered to your
                  inbox.
                </p>
              </div>
            </div>
            <form
              className="flex flex-col gap-3 sm:flex-row md:min-w-[380px]"
              onSubmit={(e) => {
                e.preventDefault();
              }}
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                required
                className="flex-1 rounded-full border border-border bg-background px-5 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:outline-none"
              />
              <button type="submit" className="btn-primary shrink-0">
                Subscribe
              </button>
            </form>
          </div>
          <p className="mt-4 text-center text-xs text-muted-foreground md:text-left">
            We respect your privacy. Unsubscribe anytime.
          </p>
        </div>
      </section>
    </>
  );
}