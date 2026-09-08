import {
  Brain,
  Lock,
  ShieldCheck,
  Users
} from "lucide-react";

import type { ServiceDetail } from "../data";

export const groupService: ServiceDetail = {
    key: "group",
    eyebrow: "Group Care",
    title: "Group Therapy",
    titleItalic: "Group",
    titleRest: "Therapy",
    ctaLabel: "Join a therapy group",
    icon: Brain,
    heroImage: "/assets/group.png",
    glanceImage: "/assets/journey-group.jpg",
    ctaImage: "/assets/journey-nature.jpg",
    intro:
      "Group therapy reminds us we are not alone. Held in a small, carefully facilitated space, groups offer connection, perspective, and skills practice that complements individual work beautifully.",
    overview: [
      "There is a particular kind of healing that only happens in community. Group therapy at Recro brings together 6–10 people around a shared theme — grief, parenting, anxiety, divorce recovery — in a closed, confidential cohort.",
      "Groups run for 8–10 weekly sessions. The closed format means the same people show up each week, building trust and depth that open groups cannot replicate.",
      "A trained group facilitator holds the container, ensures equitable participation, and introduces skills and exercises each session.",
    ],
    whoFor:
      "Adults who would benefit from shared experience, peer support, and structured skill-building around a specific life theme.",
    goodFitFor: [
      "Feeling isolated in what you're going through and wanting connection",
      "Ready to hear others' perspectives and share your own experience",
      "Looking for accountability and encouragement from peers",
      "Wanting structured skills practice in a supportive environment",
      "Already in individual therapy and wanting to complement it with group support",
    ],
    concerns: [
      "Grief & bereavement",
      "Parenting challenges",
      "Anxiety management",
      "Divorce recovery",
      "Personal growth",
      "Burnout recovery",
    ],
    expect: [
      "Join waitlist. Contact us to join the waitlist for your theme of interest.",
      "Screening call. Brief call to ensure group fit and readiness for the cohort.",
      "Weekly sessions. 8–10 weekly 90-minute sessions with the same trusted group.",
      "Close together. Final session with integration, reflection, and next-step planning.",
    ],
    benefits: [
      "Reduced isolation — others truly understand",
      "Diverse perspectives on shared struggles",
      "Accountability and encouragement from peers",
      "Skills practice in a safe environment",
      "Lasting connections beyond the group",
    ],
    approaches: [
      {
        name: "Process Groups",
        description:
          "Open sharing and interpersonal learning within the group dynamic.",
      },
      {
        name: "Psychoeducational Groups",
        description:
          "Structured teaching of skills (e.g., anxiety management, grief processing) with group discussion.",
      },
      {
        name: "Support Groups",
        description:
          "Peer support facilitated by a clinician for shared life experiences.",
      },
    ],
    features: [
      {
        icon: Users,
        title: "Small cohorts",
        body: "6–10 members maximum for meaningful participation.",
      },
      {
        icon: Lock,
        title: "Closed & confidential",
        body: "Same members each week; what's shared stays in the room.",
      },
      {
        icon: Brain,
        title: "Themed focus",
        body: "Each cohort has a clear theme so members share relevant experience.",
      },
      {
        icon: ShieldCheck,
        title: "Facilitated safety",
        body: "A trained clinician ensures respectful, productive sessions.",
      },
    ],
    faqs: [
      {
        q: "When does the next group start?",
        a: "Cohorts launch quarterly. Contact us to join the waitlist for your theme of interest.",
      },
      {
        q: "Do I have to share personal details?",
        a: "Participation is encouraged but never forced. Many members start by listening.",
      },
      {
        q: "Can I join if I'm already in individual therapy?",
        a: "Absolutely. Group and individual therapy complement each other well.",
      },
    ],
    testimonial: {
      quote:
        "I didn't realise how alone I felt until I heard others say exactly what I was thinking.",
      author: "Group participant",
      role: "Grief support cohort",
    },
    duration: "2 hrs",
    pricing: "From KES 3,500 / session",
    pricingNote: "Full cohort packages available at a reduced rate.",
    mode: "In-person · Online",
    availability: "Cohorts quarterly",
    booking: "Join waitlist anytime",
    relatedArticleSlugs: [
      "when-grief-shows-up-at-the-office",
      "anxiety-told-simply",
    ],
    reading: [
      {
        slug: "when-grief-shows-up-at-the-office",
        category: "Grief & Loss",
        title: "When grief shows up at the office",
        image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800",
      },
    ],
  };
