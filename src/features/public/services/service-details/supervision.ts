import {
  ClipboardCheck,
  ShieldCheck,
  Users,
  UserRound,
} from "lucide-react";

import type { ServiceDetail } from "../data";

export const supervisionService: ServiceDetail = {
  key: "supervision",
  eyebrow: "Professional Support",
  title: "Supervision",
  titleItalic: "Supervision",
  titleRest: "",
  ctaLabel: "Contact us to schedule",
  icon: ClipboardCheck,
  heroImage: "/assets/services.jpg",
  glanceImage: "/assets/services.jpg",
  ctaImage: "/assets/services.jpg",
  intro:
    "We provide supervision at both levels: individual and group. Whether you are a novice therapist or a seasoned one and need supervision, kindly contact us to schedule your sessions.",
  overview: [
    "Clinical supervision at Recro is a confidential space for therapists to reflect on their work, strengthen clinical judgement, and stay ethically grounded.",
    "We offer two formats. Individual supervision is one-to-one with a supervisor. Group supervision brings a small cohort together so practitioners can learn from one another as well as from the supervisor.",
    "Whether you are newly qualified or well established in practice, contact us and we will help you choose the format that fits and schedule your sessions.",
  ],
  whoFor:
    "Novice and seasoned therapists who want individual or group clinical supervision.",
  goodFitFor: [
    "Newly qualified therapists building clinical confidence",
    "Seasoned practitioners seeking a fresh supervisory relationship",
    "Clinicians who prefer one-to-one reflection",
    "Practitioners who learn well in a small peer group",
  ],
  concerns: [
    "Clinical case consultation",
    "Ethical decision-making",
    "Professional development",
    "Therapist self-care",
    "Group process and peer learning",
  ],
  expect: [
    "Contact us. Tell us whether you need individual or group supervision.",
    "Match. We confirm format, fees, and a session time that works for you.",
    "Sessions. Individual or group meetings focused on your clinical work.",
    "Ongoing support. Continue as needed — there is no fixed programme length.",
  ],
  benefits: [
    "Support at both individual and group levels",
    "A fit for novice and seasoned therapists",
    "Confidential, professionally held space",
    "Clear fees before you begin",
  ],
  approaches: [
    {
      name: "Individual supervision",
      description:
        "One-to-one sessions focused on your caseload, clinical judgement, and professional growth. KES 5,000 per person.",
    },
    {
      name: "Group supervision",
      description:
        "A facilitated group of 2 to 6 practitioners. KES 4,000 per person.",
    },
  ],
  features: [
    {
      icon: UserRound,
      title: "Individual",
      body: "KES 5,000 per person for one-to-one supervision.",
    },
    {
      icon: Users,
      title: "Group",
      body: "KES 4,000 per person. Group size is 2 to 6.",
    },
    {
      icon: ShieldCheck,
      title: "For every stage",
      body: "Open to novice therapists and seasoned practitioners.",
    },
    {
      icon: ClipboardCheck,
      title: "By arrangement",
      body: "Contact us to schedule the format and times that work for you.",
    },
  ],
  faqs: [
    {
      q: "What kinds of supervision do you offer?",
      a: "We provide supervision at both levels: individual and group.",
    },
    {
      q: "How much does supervision cost?",
      a: "Individual supervision is KES 5,000 per person. Group supervision is KES 4,000 per person, with a group size of 2 to 6.",
    },
    {
      q: "Who is supervision for?",
      a: "Whether you are a novice therapist or a seasoned one and need supervision, kindly contact us to schedule your sessions.",
    },
  ],
  testimonial: {
    quote:
      "Supervision gave me a steady place to think about my work and stay ethically grounded.",
    author: "Supervisee",
    role: "Practising therapist",
  },
  duration: "By arrangement",
  pricing: "Individual KES 5,000 · Group KES 4,000 per person",
  pricingNote: "Group supervision is for 2 to 6 people. Contact us to schedule.",
  mode: "In-person · Online",
  availability: "By appointment",
  booking: "Contact us to schedule",
  relatedArticleSlugs: [],
  reading: [],
};
