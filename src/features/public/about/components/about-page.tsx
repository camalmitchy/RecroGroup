import Image from "next/image";
import Link from "next/link";
import {
  BookOpen,
  Heart,
  Quote,
  ShieldCheck,
  UserCircle2,
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

import { audiences, values } from "../data";

const valueIcons = [ShieldCheck, Heart, BookOpen, UserCircle2] as const;

export function AboutPage() {
  return (
    <>
      <section className="container-page grid items-center gap-16 py-16 lg:grid-cols-2 lg:py-20">
        <div className="max-w-2xl">
          <Badge variant="secondary" className="rounded-full tracking-[0.2em] uppercase">
            Our founder
          </Badge>
          <h1 className="mt-5 text-4xl leading-[1.1] font-semibold tracking-tight md:text-5xl lg:text-6xl">
            About
            <br />
            <span className="text-primary">Dr. Michelle Karume</span>
          </h1>
          <p className="mt-8 font-serif text-lg leading-relaxed text-foreground/80 italic md:text-xl">
            &ldquo;Dedicated to facilitating restoration through psychotherapy&rdquo;
          </p>
          <div className="mt-8 space-y-5 text-[15px] leading-[1.75] text-muted-foreground">
            <p>
              When Dr. Michelle Karume moved back to Kenya from the United
              States of America, it became very clear that her expertise and
              passion would be vital in very diverse ways. Teaching,
              psychotherapy, training and research are ways in which she
              intrinsically shares knowledge and restores relationships.
            </p>
            <p>
              With a belief that the family unit is the training ground for life
              and that healing, restoration, professional or otherwise are the
              parameters for success, she is intentionally working with
              individuals, couples, families, children and organizations through
              collaborative care and program development. All of which afford
              her the platforms of doing psychotherapy in Nairobi and teaching
              undergraduate and Masters students.
            </p>
          </div>
        </div>
        <Card className="flex min-h-[320px] items-center justify-center overflow-hidden rounded-4xl p-0 shadow-lg">
          <div className="relative aspect-[4/5] w-full">
            <Image
              src="/assets/founder-portrait.jpg"
              alt="Dr. Michelle Karume"
              fill
              className="object-contain"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </Card>
      </section>

      <section className="bg-background py-10">
        <div className="container-page">
          <Card className="relative overflow-hidden rounded-4xl bg-muted/60 p-10 md:p-16">
            <div className="flex flex-col items-center gap-8 md:flex-row">
              <Quote
                size={64}
                className="shrink-0 self-start text-primary opacity-60 md:self-auto"
                fill="currentColor"
              />
              <p className="max-w-4xl text-xl leading-relaxed font-medium md:text-2xl">
                I believe in the inherent strength of individuals and families.
                <br className="hidden md:block" />
                Therapy is a collaborative journey toward rediscovering that
                strength
                <br className="hidden md:block" />
                and creating meaningful, lasting change.
              </p>
            </div>
            <div className="pointer-events-none absolute right-0 bottom-0 hidden opacity-20 md:block">
              <svg
                width="200"
                height="200"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-primary"
              >
                <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
                <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
              </svg>
            </div>
          </Card>
        </div>
      </section>

      <section className="bg-background">
        <div className="container-page py-20 text-center">
          <Badge variant="secondary" className="rounded-full uppercase">
            Who we work with
          </Badge>
          <h2 className="mt-5 text-3xl font-semibold tracking-tight md:text-4xl">
            Support for people and organisations.
          </h2>
          <div className="mx-auto mt-14 grid max-w-6xl grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-5">
            {audiences.map((a) => (
              <div key={a.title}>
                <span className="mx-auto grid size-14 place-items-center rounded-full bg-primary/10 text-primary">
                  <Image
                    src={a.icon}
                    alt=""
                    width={32}
                    height={32}
                    className="size-8 object-contain"
                  />
                </span>
                <h3 className="mt-5 text-base font-semibold">{a.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {a.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-muted/30">
        <div className="container-page py-20">
          <div className="text-center">
            <Badge variant="secondary" className="rounded-full uppercase">
              Our values
            </Badge>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v, index) => {
              const Icon = valueIcons[index];
              return (
                <Card
                  key={v.title}
                  className="rounded-3xl p-8 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
                >
                  <span className="grid size-12 place-items-center rounded-2xl bg-primary/10 text-primary">
                    <Icon size={22} strokeWidth={1.5} />
                  </span>
                  <CardHeader className="px-0 pt-6">
                    <CardTitle className="text-lg">{v.title}</CardTitle>
                    <CardDescription className="leading-relaxed">
                      {v.body}
                    </CardDescription>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-background pb-20 pt-10">
        <div className="container-page">
          <Card className="relative flex min-h-[300px] flex-col items-center justify-between overflow-hidden rounded-4xl bg-accent/20 p-0 md:flex-row">
            <div className="relative h-48 w-full shrink-0 md:h-full md:w-1/4">
              <Image
                src="/assets/journey-camp.jpg"
                alt=""
                fill
                className="object-cover"
                sizes="25vw"
              />
            </div>

            <CardContent className="z-10 flex-1 px-6 py-12 text-center md:py-8">
              <CardTitle className="text-3xl tracking-tight md:text-4xl">
                Ready to take the first step?
              </CardTitle>
              <CardDescription className="mt-4 text-base font-medium text-foreground/80">
                We&apos;re here to listen and walk with you.
              </CardDescription>
              <Button asChild size="lg" className="mt-8 rounded-full px-8">
                <Link href="/booking">Book a Session</Link>
              </Button>
            </CardContent>

            <div className="relative h-48 w-full shrink-0 md:h-full md:w-1/4">
              <Image
                src="/assets/journey-connection.jpg"
                alt=""
                fill
                className="object-cover"
                sizes="25vw"
              />
            </div>
          </Card>
        </div>
      </section>
    </>
  );
}
