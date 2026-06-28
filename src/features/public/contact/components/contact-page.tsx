"use client";

import Image from "next/image";
import Link from "next/link";
import { Clock, Send } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";

import {
  contactDetails,
  faqCategories,
  mapCoordinates,
  mapEmbedUrl,
  workingHours,
} from "../data";

export function ContactPage() {
  return (
    <>
      <section className="relative h-[400px] overflow-hidden bg-surface lg:h-[450px]">
        <Image
          src="/assets/hero-4.jpg"
          alt="Contact us"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 z-[1] bg-gradient-to-r from-black/60 via-black/40 to-black/30" />
        <div className="relative z-10 h-full">
          <div className="container-page flex h-full items-center py-16 lg:py-20">
            <div className="max-w-2xl">
              <span className="inline-flex items-center rounded-full border border-white/30 bg-white/20 px-4 py-1.5 text-xs font-semibold tracking-[0.18em] text-white uppercase backdrop-blur-sm">
                Contact
              </span>
              <h1 className="mt-6 font-serif text-5xl leading-[1.05] text-white drop-shadow-lg md:text-6xl">
                We&apos;d love to
                <br />
                hear from you
              </h1>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-white/95 drop-shadow">
                Send a message or use the details below — we typically reply
                within one business day.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section
        id="contact-form"
        className="container-page grid scroll-mt-24 gap-10 py-16 lg:grid-cols-5 lg:py-20"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
          }}
          className="space-y-5 rounded-3xl border border-border bg-card p-7 shadow-[var(--shadow-soft)] md:p-9 lg:col-span-3"
        >
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              Send us a message
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Fill in the form and we&apos;ll get back to you shortly.
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Your name" placeholder="Jane Doe" required />
            <Field
              label="Email"
              type="email"
              placeholder="jane@example.com"
              required
            />
          </div>
          <Field label="Phone (optional)" placeholder="+254 700 000 000" />
          <div>
            <label className="text-sm font-medium text-foreground">
              How can we help?
            </label>
            <textarea
              rows={5}
              placeholder="Tell us a little about what you're looking for…"
              required
              className="mt-2 w-full resize-none rounded-2xl border border-input bg-background px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <button type="submit" className="btn-primary">
            <Send size={16} /> Send message
          </button>
        </form>

        <aside className="space-y-4 lg:col-span-2">
          {contactDetails.map((item) => (
            <div
              key={item.title}
              className="card-lift flex items-start gap-4 rounded-2xl border border-border bg-card p-5"
            >
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary-soft text-primary-deep">
                <item.icon size={18} />
              </span>
              <div>
                <p className="text-xs tracking-[0.18em] text-muted-foreground uppercase">
                  {item.title}
                </p>
                <p className="mt-1 text-sm font-medium">{item.value}</p>
              </div>
            </div>
          ))}

          <div className="flex items-start gap-4 rounded-2xl border border-border bg-card p-5">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary-soft text-primary-deep">
              <Clock size={18} />
            </span>
            <div className="flex-1">
              <p className="text-xs tracking-[0.18em] text-muted-foreground uppercase">
                Hours
              </p>
              <div className="mt-2 space-y-1.5">
                {workingHours.map((hours) => (
                  <p key={hours} className="text-sm font-medium text-foreground">
                    {hours}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </aside>
      </section>

      <section id="faq" className="scroll-mt-24 bg-muted/30 py-16 lg:py-24">
        <div className="container-page">
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <span className="eyebrow mx-auto">FAQ</span>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-primary md:text-4xl">
              Everything you need to know
            </h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Find answers to the most common questions about therapy, booking,
              and working with Recro Group.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
            {faqCategories.map((category, catIndex) => (
              <div key={category.category} className="space-y-5">
                <div className="mb-6 flex items-center gap-3">
                  <Separator className="flex-1" />
                  <h3 className="text-sm font-semibold tracking-[0.2em] text-primary uppercase">
                    {category.category}
                  </h3>
                  <Separator className="flex-1" />
                </div>

                <Accordion type="single" collapsible className="space-y-4">
                  {category.questions.map((faq, qIndex) => (
                    <AccordionItem
                      key={faq.q}
                      value={`cat-${catIndex}-q-${qIndex}`}
                      className="rounded-2xl border border-border bg-card px-6 py-1 shadow-sm transition-shadow hover:shadow-md"
                    >
                      <AccordionTrigger className="py-5 text-left text-base font-semibold hover:no-underline">
                        {faq.q}
                      </AccordionTrigger>
                      <AccordionContent className="pb-5 leading-relaxed text-muted-foreground">
                        {faq.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ))}
          </div>

          <div className="mx-auto mt-20 max-w-4xl rounded-3xl bg-muted/50 p-8 text-center md:p-12">
            <h3 className="text-2xl font-semibold md:text-3xl">
              Still have questions?
            </h3>
            <p className="mx-auto mt-3 max-w-xl text-base text-muted-foreground">
              We&apos;re here to help. Reach out and we&apos;ll get back to you
              within one business day.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
              <a href="#contact-form" className="btn-primary">
                Send a message
              </a>
              <Link href="/join-us" className="btn-secondary">
                Book a session
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="container-page pb-16 lg:pb-20">
        <div className="overflow-hidden rounded-3xl border border-border shadow-[var(--shadow-soft)]">
          <iframe
            src={mapEmbedUrl}
            width="100%"
            height="450"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Recro Group Location"
          />
        </div>
        <p className="mt-4 text-center text-xs text-muted-foreground">
          {mapCoordinates}
        </p>
      </section>
    </>
  );
}

function Field({
  label,
  ...rest
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label className="text-sm font-medium text-foreground">{label}</label>
      <input
        {...rest}
        className="mt-2 w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
      />
    </div>
  );
}
