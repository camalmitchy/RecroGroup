import {
  HeartHandshake,
  ShieldCheck,
  Flame,
  Users,
} from "lucide-react";

import type { ServiceDetail } from "../data";

export const supervisionService: ServiceDetail = {
  key: "supervision",
  eyebrow: "Clinical Supervision",
  title: "Supervision",
  titleItalic: "Supervision",
  titleRest: "",
  ctaLabel: "Contact us to schedule",
  icon: Users,
  heroImage: "/assets/services.jpg",
  glanceImage: "/assets/services.jpg",
  ctaImage: "/assets/services.jpg",
  intro:
    "We provide supervision on both levels: Individual and Group. Whether you are a novice therapist or a seasoned one and need Supervision, kindly contact us to schedule your sessions.",
  overview: [
    "We provide supervision on both levels: Individual and Group. Whether you are a novice therapist or a seasoned one and need Supervision, kindly contact us to schedule your sessions.",
    "Individual supervision offers a dedicated space to reflect on clinical work, strengthen ethical decision-making, and grow your practice with focused feedback.",
    "Group supervision brings 2–6 practitioners together to learn from shared cases, peer insight, and facilitated discussion — at a lower per-person rate.",
  ],
  whoFor:
    "Novice and seasoned therapists who want individual or group clinical supervision.",
  goodFitFor: [
    "Newly qualified therapists building clinical confidence",
    "Seasoned practitioners seeking ongoing reflective practice",
    "Clinicians who prefer one-to-one supervision",
    "Practitioners who learn well in a small peer group (2–6 people)",
  ],
  concerns: [
    "Individual supervision",
    "Group supervision",
    "Clinical case review",
    "Ethical practice",
    "Professional development",
  ],
  expect: [
    "Contact us. Reach out to share whether you need individual or group supervision.",
    "Match the format. We confirm the level that fits — individual or a group of 2–6.",
    "Schedule sessions. We set a time that works for you.",
    "Ongoing supervision. Continue session by session as your clinical work requires.",
  ],
  benefits: [
    "Support whether you are new to practice or highly experienced",
    "Choice of individual or group supervision",
    "Small groups of 2–6 for meaningful participation",
    "A clear, confidential space to reflect on clinical work",
  ],
  approaches: [
    {
      name: "Individual supervision",
      description:
        "One-to-one clinical supervision at KES 5,000 per person.",
    },
    {
      name: "Group supervision",
      description:
        "Facilitated group supervision at KES 4,000 per person, with groups of 2–6.",
    },
  ],
  features: [
    {
      icon: Users,
      title: "Two levels",
      body: "Individual and group supervision, so you can choose the format that fits your practice.",
    },
    {
      icon: ShieldCheck,
      title: "For every stage",
      body: "Open to novice therapists and seasoned practitioners alike.",
    },
    {
      icon: Flame,
      title: "Small groups",
      body: "Group supervision is limited to 2–6 people.",
    },
    {
      icon: HeartHandshake,
      title: "Schedule with us",
      body: "Contact us to arrange the sessions that work for you.",
    },
  ],
  faqs: [
    {
      q: "What kinds of supervision do you offer?",
      a: "We provide supervision on both levels: Individual and Group.",
    },
    {
      q: "Who is supervision for?",
      a: "Whether you are a novice therapist or a seasoned one and need Supervision, kindly contact us to schedule your sessions.",
    },
    {
      q: "How much does supervision cost?",
      a: "Individual supervision is KES 5,000 per person. Group supervision is KES 4,000 per person, with a group size of 2 to 6.",
    },
    {
      q: "How do I book?",
      a: "Contact us to schedule your sessions. Online calendar booking is not used for supervision.",
    },
  ],
  testimonial: {
    quote:
      "Supervision gave me a steady place to think about my cases and grow as a clinician.",
    author: "Supervisee",
    role: "Practising therapist, Nairobi",
  },
  duration: "By arrangement",
  pricing: "Individual KES 5,000 / Group KES 4,000 per person",
  pricingNote: "Group supervision: 2–6 people. Contact us to schedule.",
  mode: "In-person · by arrangement",
  availability: "Contact us to schedule",
  booking: "Contact us to schedule your sessions",
  relatedArticleSlugs: [],
  reading: [],
};
