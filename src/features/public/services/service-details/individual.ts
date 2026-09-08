import {
  HeartHandshake,
  HeartPulse,
  Lock,
  ShieldCheck,
  UserRound
} from "lucide-react";

import type { ServiceDetail } from "../data";

export const individualService: ServiceDetail = {
    key: "individual",
    eyebrow: "Therapeutic Care",
    title: "Individual Therapy",
    titleItalic: "Individual",
    titleRest: "Therapy",
    ctaLabel: "Book an individual session",
    icon: HeartHandshake,
    heroImage: "/assets/individual.png",
    glanceImage: "/assets/therapy-session.jpg",
    ctaImage: "/assets/landing.png",
    intro:
      "Individual therapy is a confidential, judgement-free space to slow down and make sense of what you're carrying. Our therapists use evidence-based approaches — adapted to your therapy goals.",
    overview: [
      "Individual therapy at Recro is a one-on-one relationship between you and a licensed psychotherapist. Whether you are navigating anxiety, depression, grief, burnout, or a life transition, sessions are paced to your readiness — never rushed toward a fix.",
      "We draw from evidence-based modalities including Cognitive Behavioural Therapy (CBT), Solution-Focused Therapy, and trauma-informed care, adapted to your cultural context and personal goals.",
      "Many clients begin not knowing exactly what to say. That is normal. The first sessions focus on understanding your story, identifying patterns, and building a plan you feel ownership over.",
    ],
    whoFor:
      "Adults and adolescents (14+) navigating personal challenges, emotional pain, identity questions, or the desire for deeper self-understanding.",
    goodFitFor: [
      "Feeling stuck or overwhelmed by recurring thoughts or emotions",
      "Going through a major life transition (career change, loss, relocation)",
      "Wanting to understand yourself better and build healthier patterns",
      "Experiencing anxiety, depression, or grief that's affecting daily life",
      "Looking for a confidential space to process difficult experiences",
    ],
    concerns: [
      "Anxiety & Stress",
      "Depression & Low Mood",
      "Trauma & PTSD",
      "Self-Esteem",
      "Life Transitions",
      "Burnout",
      "Grief",
    ],
    expect: [
      "Reach out. Book online or call us. We'll match you with a therapist who fits your needs.",
      "First session. A confidential intake conversation to understand what brings you here and what you hope for.",
      "Build together. Collaborative goal-setting — you choose the pace and focus areas.",
      "Ongoing care. Weekly or fortnightly 50-minute sessions, in-person at our Nairobi clinic or online.",
    ],
    benefits: [
      "Clearer understanding of your emotional patterns",
      "Practical coping tools for daily stress",
      "Healthier boundaries in relationships",
      "Renewed sense of purpose and direction",
      "A confidential space that belongs entirely to you",
    ],
    approaches: [
      {
        name: "Cognitive Behavioural Therapy (CBT)",
        description:
          "Identifying thought patterns that fuel anxiety and depression, and replacing them with grounded alternatives.",
      },
      {
        name: "Solution-Focused Therapy",
        description:
          "Building on existing strengths rather than dwelling exclusively on problems.",
      },
      {
        name: "Trauma-Informed Care",
        description:
          "Gentle, paced work for clients who have experienced loss, violence, or chronic stress.",
      },
    ],
    features: [
      {
        icon: Lock,
        title: "Strictly confidential",
        body: "Sessions and records protected under clinical ethics and Kenya Data Protection Act.",
      },
      {
        icon: UserRound,
        title: "Therapist matching",
        body: "We pair you with a clinician suited to your goals — change anytime.",
      },
      {
        icon: ShieldCheck,
        title: "Evidence-based",
        body: "Approaches backed by research, adapted to your lived experience.",
      },
      {
        icon: HeartPulse,
        title: "Flexible format",
        body: "In-person, online video, or phone — whichever feels safest to start.",
      },
    ],
    faqs: [
      {
        q: "How long does individual therapy take?",
        a: "There is no fixed timeline. Some clients find clarity in 8–12 sessions; others benefit from longer-term support. We review together regularly.",
      },
      {
        q: "Do I need a referral?",
        a: "No referral is required. You can book directly through our intake team.",
      },
      {
        q: "Are sessions available online?",
        a: "Yes. We offer secure video sessions for clients across Kenya and the diaspora.",
      },
    ],
    testimonial: {
      quote:
        "I felt heard from the very first session. Recro gave me language for things I had carried silently for years.",
      author: "A. M.",
      role: "Individual therapy client",
    },
    duration: "50 min",
    pricing: "From KES 5,000",
    pricingNote: "Sliding-scale spots available on request.",
    mode: "In-person · Online · Phone",
    availability: "Same-week appointments",
    booking: "Confirmed within 1 working day",
    relatedArticleSlugs: [
      "five-gentle-ways-to-start-therapy",
      "anxiety-told-simply",
    ],
    reading: [
      {
        slug: "five-gentle-ways-to-start-therapy",
        category: "Therapy 101",
        title: "Five gentle ways to start therapy",
        image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800",
      },
      {
        slug: "anxiety-told-simply",
        category: "Wellbeing",
        title: "Anxiety, told simply",
        image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800",
      },
    ],
  };
