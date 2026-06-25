import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  HeartHandshake,
  Leaf,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  homeApproachPoints,
  homeBlogPosts,
  homeBookingPerks,
  homeServices,
  homeStats,
  homeTrustFeatures,
  homeVideos,
} from "../data";
import { HomeBookingForm } from "./home-booking-form";
import { HomeVideoCard } from "./home-video-card";

const trustIcons = [ShieldCheck, HeartHandshake, Sparkles] as const;

export function HomePage() {
  return (
    <>
        <section className="relative min-h-[100vh] overflow-hidden bg-background">
          <Image
            src="/assets/landing.png"
            alt="A diverse family sitting together in a bright sunlit therapy room"
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 z-[1] bg-gradient-to-r from-foreground/70 via-foreground/50 to-foreground/20" />
          <div className="relative z-10">
            <div className="container-page flex min-h-[100vh] items-end pt-12 pb-16 md:pt-20 md:pb-20">
              <div className="max-w-2xl">
                <h1 className="text-4xl leading-[1.05] font-semibold tracking-tight text-background drop-shadow-sm sm:text-5xl lg:text-6xl">
                  Walking with you, step by step.
                </h1>
                <p className="mt-6 max-w-xl text-base leading-relaxed text-background/95 lg:text-lg">
                  A compassionate space for healing, growth, and emotional
                  wellness — for individuals, couples, families, and
                  organisations navigating life&apos;s most difficult moments.
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <Button
                    asChild
                    size="lg"
                    className="rounded-full px-6 shadow-md"
                  >
                    <Link href="/booking">
                      Book a session
                      <ArrowRight className="size-4" />
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="secondary"
                    size="lg"
                    className="rounded-full border border-background/40 bg-background/20 px-6 text-background backdrop-blur-sm hover:bg-background/30"
                  >
                    <Link href="/services">Explore services</Link>
                  </Button>
                </div>
                <dl className="mt-12 grid max-w-md grid-cols-3 gap-6">
                  {homeStats.map((s) => (
                    <div key={s.v}>
                      <dt className="text-3xl font-semibold text-background">
                        {s.k}
                      </dt>
                      <dd className="mt-1 text-xs text-background/80">{s.v}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </div>
        </section>

        <section className="container-page bg-background py-20">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-xl">
              <Badge variant="secondary" className="rounded-full">
                What we do
              </Badge>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">
                Support for every season of life
              </h2>
              <p className="mt-3 text-muted-foreground">
                Whether you&apos;re navigating loss, growing as a couple,
                raising kids or leading a team — there&apos;s a Recro service
                for that.
              </p>
            </div>
            <Button asChild variant="link" className="text-primary">
              <Link href="/services">
                All services
                <ArrowRight className="size-3.5" />
              </Link>
            </Button>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {homeServices.map((s) => (
              <Card
                key={s.title}
                className="rounded-3xl shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
              >
                <CardHeader>
                  <div className="size-20">
                    <Image
                      src={s.icon}
                      alt=""
                      width={80}
                      height={80}
                      className="size-full object-contain"
                    />
                  </div>
                  <CardTitle className="text-lg">{s.title}</CardTitle>
                  <CardDescription className="leading-relaxed">
                    {s.body}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild variant="link" className="h-auto p-0 text-primary">
                    <Link href={`/services/${s.serviceKey}`}>
                      Learn more
                      <ArrowRight className="size-3.5" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="border-y border-border bg-surface">
          <div className="container-page grid items-center gap-12 py-20 lg:grid-cols-2">
            <div className="relative">
              <div className="aspect-[4/3] overflow-hidden rounded-4xl ring-1 ring-border shadow-md">
                <Image
                  src="/assets/therapy-session.jpg"
                  alt="Two people in a calm therapy session"
                  width={1200}
                  height={900}
                  className="size-full object-cover"
                />
              </div>
              <Card className="absolute -right-6 -bottom-6 hidden max-w-64 md:block">
                <CardContent className="p-5">
                  <Leaf className="size-5 text-primary" />
                  <p className="mt-2 text-sm leading-snug font-medium">
                    &ldquo;I left lighter than I came in.&rdquo; — A Recro
                    client
                  </p>
                </CardContent>
              </Card>
            </div>

            <div>
              <Badge variant="secondary" className="rounded-full">
                Our approach
              </Badge>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">
                A wholistic view of what it means to be well.
              </h2>
              <p className="mt-4 leading-relaxed text-muted-foreground">
                Our distinguishing touch is reassuring and friendly — yet always
                holds a professional demeanor. Every session is designed to feel
                safe, human, and forward-moving.
              </p>
              <ul className="mt-8 space-y-4">
                {homeApproachPoints.map((p) => (
                  <li key={p} className="flex items-start gap-3">
                    <span className="mt-0.5 grid size-5 place-items-center rounded-full bg-primary text-primary-foreground">
                      <Check className="size-3" strokeWidth={3} />
                    </span>
                    <span className="text-sm">{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="container-page bg-background py-20">
          <div className="relative overflow-hidden rounded-4xl bg-primary shadow-md">
            <div className="grid lg:grid-cols-2">
              <div className="p-8 text-primary-foreground md:p-12">
                <Badge
                  variant="outline"
                  className="mb-4 rounded-full border-primary-foreground/30 text-primary-foreground"
                >
                  Signature Programme
                </Badge>
                <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
                  The Recro Grief Camp
                </h2>
                <p className="mt-4 max-w-md leading-relaxed text-primary-foreground/90">
                  A child-safe, family-friendly therapeutic camp for adolescents
                  navigating the loss of a parent, sibling, or close caregiver.
                  Designed and led by licensed clinicians.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Button
                    asChild
                    size="lg"
                    variant="secondary"
                    className="rounded-full bg-background text-primary hover:bg-background/90"
                  >
                    <Link href="/grief-camp">Apply for Grief Camp</Link>
                  </Button>
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="rounded-full border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
                  >
                    <Link href="/grief-camp">Sponsor a Child</Link>
                  </Button>
                </div>
              </div>
              <div className="relative min-h-[280px] lg:min-h-0">
                <Image
                  src="/assets/grief-camp.jpg"
                  alt="Children in a therapeutic camp setting"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="bg-surface">
          <div className="container-page py-20">
            <Card className="rounded-4xl p-8 shadow-md md:p-12">
              <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
                <div>
                  <Badge variant="secondary" className="rounded-full">
                    Begin healing
                  </Badge>
                  <h2 className="mt-4 font-serif text-3xl leading-[1.1] tracking-tight md:text-5xl">
                    A first session is a quiet act of courage.
                  </h2>
                  <p className="mt-5 leading-relaxed text-muted-foreground">
                    Choose your service and a time that works for you. We&apos;ll
                    confirm within one working day. All sessions are strictly
                    confidential.
                  </p>
                  <ul className="mt-8 space-y-3 text-sm">
                    {homeBookingPerks.map((p) => (
                      <li key={p} className="flex items-start gap-3">
                        <span className="mt-2 size-1.5 rounded-full bg-primary" />
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
                <HomeBookingForm />
              </div>
            </Card>
          </div>
        </section>

        <section className="bg-background">
          <div className="container-page grid gap-12 py-20 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <Badge variant="secondary" className="rounded-full">
                Why Recro
              </Badge>
              <h2 className="mt-4 font-serif text-3xl leading-[1.05] tracking-tight md:text-5xl">
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
                    <span className="grid size-11 place-items-center rounded-full bg-muted text-primary">
                      <Icon className="size-4" />
                    </span>
                    <h3 className="mt-5 text-lg font-semibold">{f.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {f.body}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="bg-foreground text-background">
          <div className="container-page py-20">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div>
                <Badge
                  variant="outline"
                  className="rounded-full border-accent/40 text-accent"
                >
                  Media &amp; insights
                </Badge>
                <h2 className="mt-4 font-serif text-4xl tracking-tight md:text-5xl">
                  Watch &amp; reflect
                </h2>
              </div>
              <Button
                asChild
                variant="link"
                className="text-accent hover:text-accent/80"
              >
                <Link href="/insights">
                  View media library
                  <ArrowRight className="size-3.5" />
                </Link>
              </Button>
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
                <p className="text-xs font-semibold tracking-[0.2em] text-muted-foreground uppercase">
                  Blogs
                </p>
                <h2 className="mt-4 font-serif text-4xl tracking-tight md:text-5xl">
                  Read &amp; recover
                </h2>
              </div>
              <Button asChild variant="link" className="text-primary">
                <Link href="/blog">
                  All blogs
                  <ArrowRight className="size-3.5" />
                </Link>
              </Button>
            </div>
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {homeBlogPosts.map((b) => (
                <Link key={b.title} href="/blog" className="group block">
                  <Card className="h-full rounded-3xl p-2 transition-all hover:-translate-y-0.5 hover:shadow-md">
                    <CardHeader>
                      <p className="text-xs font-semibold tracking-[0.2em] text-muted-foreground uppercase">
                        {b.category}
                      </p>
                      <CardTitle className="font-serif text-2xl leading-snug">
                        {b.title}
                      </CardTitle>
                      <CardDescription className="leading-relaxed">
                        {b.desc}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-xs text-muted-foreground">{b.read}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="container-page bg-background py-20">
          <Card className="rounded-4xl bg-surface px-8 py-16 text-center shadow-sm">
            <CardHeader className="mx-auto max-w-3xl">
              <CardTitle className="text-3xl md:text-5xl">
                Restoration begins with a conversation.
              </CardTitle>
              <CardDescription className="text-lg">
                Whether you&apos;re navigating personal challenges or arranging
                support for your team, Recro Group is here. Friendly,
                professional, and entirely confidential.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap items-center justify-center gap-3">
              <Button asChild size="lg" className="rounded-full">
                <Link href="/booking">Book a Session</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-full">
                <Link href="/contact">Contact Recro</Link>
              </Button>
            </CardContent>
          </Card>
        </section>
    </>
  );
}
