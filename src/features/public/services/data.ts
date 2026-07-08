import type { LucideIcon } from "lucide-react";

export type ServiceListItem = {
  id: string;
  slug: string;
  icon: string;
  title: string;
  description: string;
  duration: string;
  price: string;
};

export type ServiceFeature = {
  icon: LucideIcon;
  title: string;
  body: string;
};

export type ServiceApproach = {
  name: string;
  description: string;
};

export type ServiceFaq = {
  q: string;
  a: string;
};

export type ServiceTestimonial = {
  quote: string;
  author: string;
  role: string;
};

export type ServiceReading = {
  slug: string;
  category: string;
  title: string;
  image: string;
};

export type ServiceDetail = {
  key: string;
  eyebrow: string;
  title: string;
  titleItalic: string;
  titleRest: string;
  ctaLabel: string;
  icon: LucideIcon;
  heroImage: string;
  glanceImage: string;
  ctaImage: string;
  intro: string;
  overview: string[];
  whoFor: string;
  goodFitFor?: string[];
  concerns: string[];
  expect: string[];
  benefits: string[];
  approaches: ServiceApproach[];
  features: ServiceFeature[];
  faqs: ServiceFaq[];
  testimonial: ServiceTestimonial;
  duration: string;
  pricing: string;
  pricingNote: string;
  mode: string;
  availability: string;
  booking: string;
  relatedArticleSlugs: string[];
  reading: ServiceReading[];
};

export {
  getServiceBySlug,
  serviceList,
  serviceSlugs,
  servicesBySlug,
} from "./service-details";
