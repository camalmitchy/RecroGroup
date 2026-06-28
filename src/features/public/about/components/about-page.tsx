import Image from "next/image";
import Link from "next/link";
import {
  BookOpen,
  Heart,
  Quote,
  ShieldCheck,
  UserCircle2,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import { audiences, values } from "../data";

const valueIcons = [ShieldCheck, Heart, BookOpen, UserCircle2] as const;

export function AboutPage() {
  return (
    <>
      <section className="container-page grid items-stretch gap-16 py-16 lg:grid-cols-2 lg:py-20">
        <div className="max-w-2xl">
          <span className="text-[10px] font-bold tracking-[0.2em] text-primary-deep uppercase">
            Our founder
          </span>
          <h1 className="mt-5 font-serif text-4xl leading-[1.1] tracking-tight md:text-5xl lg:text-6xl">
            About
            <br />
            <span className="text-primary-deep">Dr. Michelle Karume</span>
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
        <div className="relative h-full min-h-[520px] overflow-hidden rounded-[2rem] bg-surface-2 shadow-lg lg:min-h-[680px] xl:min-h-[760px]">
          <Image
            src="/assets/founder-portrait.jpg"
            alt="Dr. Michelle Karume"
            fill
            className="object-cover object-top"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>
      </section>

      <section className="bg-background py-10">
        <div className="container-page">
          <div className="relative flex flex-col items-center gap-8 overflow-hidden rounded-[2.5rem] bg-[#f2f6f3] p-10 md:flex-row md:p-16">
            <Quote
              size={64}
              className="shrink-0 self-start text-[#517a61] opacity-60 md:self-auto"
              fill="currentColor"
            />
            <p className="max-w-4xl text-xl leading-relaxed font-medium text-foreground md:text-2xl">
              I believe in the inherent strength of individuals and families.
              <br className="hidden md:block" />
              Therapy is a collaborative journey toward rediscovering that
              strength
              <br className="hidden md:block" />
              and creating meaningful, lasting change.
            </p>
            <div className="pointer-events-none absolute right-0 bottom-0 hidden opacity-20 md:block">
              <svg
                width="200"
                height="200"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#517a61"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
                <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-background">
        <div className="container-page py-20 text-center">
          <span className="eyebrow mx-auto">Who we work with</span>
          <h2 className="mt-5 text-3xl font-semibold tracking-tight md:text-4xl">
            Support for people and organisations.
          </h2>
          <div className="mx-auto mt-14 grid max-w-6xl grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-5">
            {audiences.map((a) => (
              <div key={a.title}>
                <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-primary-soft text-primary-deep">
                  <Image
                    src={a.icon}
                    alt=""
                    width={32}
                    height={32}
                    className="h-8 w-8 object-contain"
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

      <section className="border-t border-border bg-[#faf9f6]">
        <div className="container-page py-20">
          <div className="text-center">
            <span className="mx-auto inline-flex items-center rounded-full bg-muted px-4 py-1.5 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
              Our values
            </span>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v, index) => {
              const Icon = valueIcons[index];
              return (
                <div
                  key={v.title}
                  className="rounded-3xl border border-border/50 bg-background p-8 shadow-sm transition-transform hover:-translate-y-1"
                >
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#f2f6f3] text-[#517a61]">
                    <Icon size={22} strokeWidth={1.5} />
                  </span>
                  <h3 className="mt-6 text-lg font-semibold">{v.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {v.body}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-background pt-10 pb-20">
        <div className="container-page">
          <div className="relative flex min-h-[300px] flex-col items-center justify-between overflow-hidden rounded-[2rem] bg-[#e8e4db] md:flex-row">
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
              <h2 className="text-3xl tracking-tight text-foreground md:text-4xl">
                Ready to take the first step?
              </h2>
              <p className="mt-4 font-medium text-foreground/80">
                We&apos;re here to listen and walk with you.
              </p>
              <Button
                asChild
                size="lg"
                className="mt-8 rounded-full bg-[#517a61] px-8 text-white hover:bg-[#3d5c49]"
              >
                <Link href="/join-us">Book a Session</Link>
              </Button>
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
        </div>
      </section>
    </>
  );
}
