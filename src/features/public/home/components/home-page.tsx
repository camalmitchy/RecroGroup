"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  HeartHandshake,
  Leaf,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useRouter } from "next/navigation";

import {
  homeApproachPoints,
  homeBlogPosts,
  homeBookingPerks,
  homeServices,
  homeStats,
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
              <Link href="/join-us" className="btn-primary">
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
                <dd className="mt-1 font-serif text-2xl text-foreground">14</dd>
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
            <span className="eyebrow">Systemic Approach</span>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl lg:text-5xl">
              A wholistic view of what it means to be well.
            </h2>
            <p className="mt-6 leading-relaxed text-muted-foreground text-lg max-w-3xl mx-auto">
              Our distinguishing touch is reassuring and friendly — yet always
              holds a professional demeanor. Every session is designed to feel
              safe, human, and forward-moving.
            </p>
          </div>
          <ul className="mt-12 grid gap-6 sm:grid-cols-2 max-w-5xl mx-auto">
            {homeApproachPoints.map((p) => (
              <li key={p} className="flex items-start gap-3 p-6 rounded-2xl bg-card border border-border">
                <span className="mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground">
                  <svg width="10" height="10" viewBox="0 0 12 12">
                    <path
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2 6.5L5 9.5L10 3"
                    />
                  </svg>
                </span>
                <span className="text-sm text-foreground leading-relaxed">{p}</span>
              </li>
            ))}
          </ul>
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
              A child-safe, family-friendly therapeutic camp for adolescents
              navigating the loss of a parent, sibling, or close caregiver.
              Designed and led by licensed clinicians.
            </p>
            <div className="mt-10 flex flex-wrap gap-3 justify-center">
              <Link
                href="/join-us?service=grief-camp"
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
                  <span className="grid h-11 w-11 place-items-center rounded-full bg-surface-2 text-primary-deep">
                    <Icon size={18} />
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

      <section className="container-page bg-background py-20">
        <div className="relative overflow-hidden rounded-[2rem] bg-surface px-8 py-16 text-center">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-3xl font-semibold tracking-tight text-foreground md:text-5xl">
              Restoration begins with a conversation.
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground">
              Whether you&apos;re navigating personal challenges or arranging
              support for your team, Recro Group is here. Friendly,
              professional, and entirely confidential.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link href="/join-us" className="btn-primary">
                Book a Session
              </Link>
              <Link href="/contact" className="btn-secondary">
                Contact Recro
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}