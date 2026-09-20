import {
  ClipboardCheck,
  HeartHandshake,
  ShieldCheck,
  Users,
} from "lucide-react";

import type { ServiceDetail } from "../data";

export const supervisionService: ServiceDetail = {
  key: "supervision",
  eyebrow: "Professional Development",
  title: "Supervision",
  titleItalic: "Supervision",
  titleRest: "",
  ctaLabel: "Contact us to schedule",
  icon: ClipboardCheck,
  heroImage: "/assets/services.jpg",
  glanceImage: "/assets/services.jpg",
  ctaImage: "/assets/services.jpg",
  intro:
    "We provide supervision on both levels: Individual and Group. Whether you are a novice therapist or a seasoned one and need supervision, kindly contact us to schedule your sessions.",
  overview: [
    "Clinical supervision at Recro supports therapists at every stage of practice — from newly qualified clinicians building confidence to seasoned practitioners seeking a reflective space.",
    "Individual supervision offers focused, one-to-one guidance on cases, ethics, and professional growth. Group supervision brings 2–6 clinicians together to learn from one another under a trained supervisor.",
    "Sessions are scheduled by arrangement. Contact us to discuss which format fits your needs and to book your place.",
  ],
  whoFor:
    "Novice and seasoned therapists who want individual or group supervision to strengthen clinical practice, ethics, and professional development.",
  goodFitFor: [
    "Newly qualified therapists seeking structured clinical guidance",
    "Seasoned clinicians who want a reflective, accountable space",
    "Practitioners working through complex or ethically sensitive cases",
    "Small peer groups looking for facilitated group supervision",
    "Clinicians who want to grow in skill while staying grounded in best practice",
  ],
  concerns: [
    "Case consultation",
    "Ethical decision-making",
    "Clinical skill development",
    "Professional identity",
    "Burnout & self-care",
    "Group learning",
  ],
  expect: [
    "Contact us. Reach out to share whether you need individual or group supervision.",
    "Match & schedule. We confirm format, group size where relevant, and a session time.",
    "Supervisory work. Reflective case discussion, ethics, and skill development.",
    "Ongoing sessions. Continue at a cadence that supports your practice.",
  ],
  benefits: [
    "A confidential space to think through clinical work",
    "Support whether you are new to practice or highly experienced",
    "Choice of individual or small-group format",
    "Guidance grounded in ethical, systemic practice",
    "A clearer, more confident clinical stance",
  ],
  approaches: [
    {
      name: "Individual supervision",
      description:
        "One-to-one sessions focused on your caseload, professional development, and clinical questions. KES 5,000 per person.",
    },
    {
      name: "Group supervision",
      description:
        "Facilitated supervision for 2–6 clinicians, combining case discussion with peer learning. KES 4,000 per person.",
    },
    {
      name: "Reflective practice",
      description:
        "A structured space to examine patterns, ethics, and the therapist’s own use of self in the work.",
    },
  ],
  features: [
    {
      icon: ClipboardCheck,
      title: "Individual or group",
      body: "Supervision is offered one-to-one or in groups of 2–6.",
    },
    {
      icon: Users,
      title: "All experience levels",
      body: "Welcome whether you are a novice therapist or a seasoned clinician.",
    },
    {
      icon: ShieldCheck,
      title: "Ethically grounded",
      body: "Case discussion held within professional and ethical guidelines.",
    },
    {
      icon: HeartHandshake,
      title: "Scheduled with you",
      body: "Contact us to arrange a time that fits your practice.",
    },
  ],
  faqs: [
    {
      q: "Who is supervision for?",
      a: "Both novice and seasoned therapists. If you need supervision, contact us to schedule sessions.",
    },
    {
      q: "What is the difference between individual and group supervision?",
      a: "Individual supervision is one-to-one (KES 5,000 per person). Group supervision is KES 4,000 per person for groups of 2 to 6.",
    },
    {
      q: "How do I book?",
      a: "Supervision is scheduled by contacting us. Use the contact form or call 0717-78-78-07 / 0717-78-78-08.",
    },
  ],
  testimonial: {
    quote:
      "Supervision gave me a place to think clearly about my cases and to keep growing as a clinician.",
    author: "Supervisee",
    role: "Practising therapist, Nairobi",
  },
  duration: "By arrangement",
  pricing: "Individual KES 5,000 · Group KES 4,000 (2–6 people)",
  pricingNote:
    "Individual supervision is KES 5,000 per person. Group supervision is KES 4,000 per person (group size 2 to 6).",
  mode: "In-person · Online",
  availability: "Scheduled on request",
  booking: "Contact us to schedule your sessions",
  relatedArticleSlugs: [],
  reading: [],
};
