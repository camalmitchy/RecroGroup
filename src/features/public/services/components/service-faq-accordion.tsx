"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import type { ServiceFaq } from "../data";

type ServiceFaqAccordionProps = {
  faqs: ServiceFaq[];
};

export function ServiceFaqAccordion({ faqs }: ServiceFaqAccordionProps) {
  return (
    <Accordion type="single" collapsible className="mt-8 max-w-3xl space-y-3">
      {faqs.map((faq, i) => (
        <AccordionItem
          key={faq.q}
          value={`faq-${i}`}
          className="rounded-2xl border border-border bg-card px-6"
        >
          <AccordionTrigger className="py-5 text-left font-semibold hover:no-underline">
            {faq.q}
          </AccordionTrigger>
          <AccordionContent className="pb-5 leading-relaxed text-muted-foreground">
            {faq.a}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
