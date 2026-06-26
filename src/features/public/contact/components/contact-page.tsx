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
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

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
        <div className="absolute inset-0 z-[1] bg-gradient-to-r from-foreground/60 via-foreground/40 to-foreground/30" />
        <div className="relative z-10 h-full">
          <div className="container-page flex h-full items-center py-16 lg:py-20">
            <div className="max-w-2xl">
              <Badge
                variant="outline"
                className="rounded-full border-background/30 bg-background/20 px-4 py-1.5 text-xs font-semibold tracking-[0.18em] text-background uppercase backdrop-blur-sm"
              >
                Contact
              </Badge>
              <h1 className="mt-6 text-5xl leading-[1.05] font-semibold tracking-tight text-background drop-shadow-lg md:text-6xl">
                We&apos;d love to
                <br />
                hear from you
              </h1>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-background/95 drop-shadow">
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
        <Card className="rounded-3xl p-7 shadow-md md:p-9 lg:col-span-3">
          <CardHeader className="px-0 pt-0">
            <CardTitle>Send us a message</CardTitle>
            <CardDescription>
              Fill in the form and we&apos;ll get back to you shortly.
            </CardDescription>
          </CardHeader>
          <CardContent className="px-0 pb-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
              }}
            >
              <FieldGroup>
                <div className="grid gap-5 md:grid-cols-2">
                  <Field>
                    <FieldLabel htmlFor="contact-name">Your name</FieldLabel>
                    <Input
                      id="contact-name"
                      placeholder="Jane Doe"
                      className="h-11 rounded-2xl"
                      required
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="contact-email">Email</FieldLabel>
                    <Input
                      id="contact-email"
                      type="email"
                      placeholder="jane@example.com"
                      className="h-11 rounded-2xl"
                      required
                    />
                  </Field>
                </div>
                <Field>
                  <FieldLabel htmlFor="contact-phone">
                    Phone (optional)
                  </FieldLabel>
                  <Input
                    id="contact-phone"
                    placeholder="+254 700 000 000"
                    className="h-11 rounded-2xl"
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="contact-message">
                    How can we help?
                  </FieldLabel>
                  <Textarea
                    id="contact-message"
                    rows={5}
                    placeholder="Tell us a little about what you're looking for…"
                    className="min-h-32 rounded-2xl"
                    required
                  />
                </Field>
                <Button type="submit" size="lg" className="rounded-full">
                  <Send className="size-4" />
                  Send message
                </Button>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>

        <aside className="space-y-4 lg:col-span-2">
          {contactDetails.map((item) => (
            <Card
              key={item.title}
              className="rounded-2xl p-5 transition-all hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex items-start gap-4">
                <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                  <item.icon size={18} />
                </span>
                <div>
                  <p className="text-xs tracking-[0.18em] text-muted-foreground uppercase">
                    {item.title}
                  </p>
                  <p className="mt-1 text-sm font-medium">{item.value}</p>
                </div>
              </div>
            </Card>
          ))}

          <Card className="rounded-2xl p-5">
            <div className="flex items-start gap-4">
              <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                <Clock size={18} />
              </span>
              <div className="flex-1">
                <p className="text-xs tracking-[0.18em] text-muted-foreground uppercase">
                  Hours
                </p>
                <div className="mt-2 space-y-1.5">
                  {workingHours.map((hours) => (
                    <p key={hours} className="text-sm font-medium">
                      {hours}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </aside>
      </section>

      <section id="faq" className="scroll-mt-24 bg-muted/30 py-16 lg:py-24">
        <div className="container-page">
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <Badge variant="secondary" className="rounded-full uppercase">
              FAQ
            </Badge>
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

          <Card className="mx-auto mt-20 max-w-4xl rounded-3xl bg-muted/50 p-8 text-center md:p-12">
            <CardHeader className="px-0">
              <CardTitle className="text-2xl md:text-3xl">
                Still have questions?
              </CardTitle>
              <CardDescription className="mx-auto mt-3 max-w-xl text-base">
                We&apos;re here to help. Reach out and we&apos;ll get back to
                you within one business day.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap items-center justify-center gap-4 px-0">
              <Button asChild size="lg" className="rounded-full">
                <a href="#contact-form">Send a message</a>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-full">
                <Link href="/booking">Book a session</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="container-page pb-16 lg:pb-20">
        <Card className="overflow-hidden rounded-3xl p-0 shadow-md">
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
        </Card>
        <p className="mt-4 text-center text-xs text-muted-foreground">
          {mapCoordinates}
        </p>
      </section>
    </>
  );
}
