import {
  HeartHandshake,
  ShieldCheck,
  Flame,
  Users
} from "lucide-react";

import type { ServiceDetail } from "../data";

export const familyService: ServiceDetail = {
    key: "family",
    eyebrow: "Systemic Care",
    title: "Family Therapy",
    titleItalic: "Family",
    titleRest: "Therapy",
    ctaLabel: "Book a family session",
    icon: Users,
    heroImage: "/assets/family.png",
    glanceImage: "/assets/landing.png",
    ctaImage: "/assets/landing.png",
    intro:
      "Family therapy looks at the whole system. We help each person feel heard while creating language and structure for the family to function with more warmth, clarity, and safety — especially during difficult seasons.",
    overview: [
      "Family therapy treats the family as an interconnected system. When one member struggles, the whole system feels it — and the whole system can heal.",
      "Recro's family therapists work with nuclear families, blended families, extended family conflicts, and families navigating illness, loss, or relocation.",
      "Sessions typically include parents/guardians and children or teens together, with occasional sub-system sessions (e.g., parents only, siblings only) as clinically appropriate.",
    ],
    whoFor:
      "Families experiencing conflict, communication breakdown, transitions (blending, divorce, relocation), or a child/teen in distress affecting the whole home.",
    goodFitFor: [
      "Feeling like your family is stuck in unhealthy patterns or roles",
      "Navigating a major family transition (blending families, divorce, relocation)",
      "Struggling with a child or teen whose behavior affects the whole household",
      "Wanting everyone in the family to feel heard and understood",
      "Dealing with conflict between parents and teens or between siblings",
    ],
    concerns: [
      "Parent-teen conflict",
      "Blended family dynamics",
      "Sibling rivalry",
      "Grief affecting the family",
      "Co-parenting after separation",
      "Cultural/generational tension",
    ],
    expect: [
      "Parent intake. We meet with parents/guardians first to understand family dynamics.",
      "First family session. Everyone meets together with clear ground rules for respectful communication.",
      "Practice at home. Homework and rituals to practice new patterns between sessions.",
      "Ongoing care. Regular sessions to celebrate progress and adjust the plan as needed.",
    ],
    benefits: [
      "Calmer, more predictable home environment",
      "Children who feel seen and heard",
      "Parents aligned on boundaries and values",
      "Healthier repair after family conflict",
      "Stronger family identity through change",
    ],
    approaches: [
      {
        name: "Structural Family Therapy",
        description:
          "Mapping family roles and boundaries to create healthier hierarchy and connection.",
      },
      {
        name: "Bowen Family Systems",
        description:
          "Understanding multigenerational patterns and differentiation of self.",
      },
      {
        name: "Narrative Therapy",
        description:
          "Rewriting the stories families tell about themselves and their problems.",
      },
    ],
    features: [
      {
        icon: Users,
        title: "Whole-system view",
        body: "We work with the family, not just the 'identified patient.'",
      },
      {
        icon: Flame,
        title: "Age-inclusive",
        body: "Sessions adapted for children, teens, and adults in the same room.",
      },
      {
        icon: ShieldCheck,
        title: "Safe structure",
        body: "Ground rules ensure every voice can speak without escalation.",
      },
      {
        icon: HeartHandshake,
        title: "Practical tools",
        body: "Take-home exercises that change patterns between sessions.",
      },
    ],
    faqs: [
      {
        q: "Do all family members need to attend?",
        a: "Ideally yes, but we can start with whoever is willing and expand from there.",
      },
      {
        q: "What ages of children can participate?",
        a: "Children from age 5 can participate with age-appropriate facilitation. Teens are active participants.",
      },
      {
        q: "Can you help blended families?",
        a: "Yes. Blended family dynamics are one of our most common focus areas.",
      },
    ],
    testimonial: {
      quote:
        "For the first time in years, we sat at dinner without someone leaving the table angry.",
      author: "The N. family",
      role: "Family therapy clients",
    },
    duration: "50 min",
    pricing: "From KES 8,000",
    pricingNote: "Extended sessions available for larger families.",
    mode: "In-person · Online",
    availability: "Within 1 week",
    booking: "Parent intake within 3 working days",
    relatedArticleSlugs: [
      "from-the-foxhole-to-the-front-porch",
      "how-children-grieve-differently",
    ],
    reading: [
      {
        slug: "from-the-foxhole-to-the-front-porch",
        category: "Family",
        title: "From the foxhole to the front porch",
        image: "https://images.unsplash.com/photo-1511895426328-dc8714191300?w=800",
      },
      {
        slug: "how-children-grieve-differently",
        category: "Parenting",
        title: "How children grieve differently",
        image: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800",
      },
    ],
  };
