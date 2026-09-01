import {
  HeartHandshake,
  MessageCircle,
  ShieldCheck,
  Users
} from "lucide-react";

import type { ServiceDetail } from "../data";

export const couplesService: ServiceDetail = {
    key: "couples",
    eyebrow: "Relational Care",
    title: "Couples therapy",
    titleItalic: "Couples",
    titleRest: "therapy",
    ctaLabel: "Book a couples session",
    icon: Users,
    heroImage: "/assets/couples.png",
    glanceImage: "/assets/journey-connection.jpg",
    ctaImage: "/assets/journey-connection.jpg",
    intro:
      "We work with couples to slow down reactive cycles, rebuild trust, and reconnect. Sessions are emotionally focused, non-blaming, and culturally attuned to relationships in Kenya today.",
    overview: [
      "Couples therapy at Recro is not about picking sides. It is about understanding the dance you have been doing together — the patterns that escalate conflict, the moments of disconnection, and the hopes you still share beneath the frustration.",
      "We work with dating couples, engaged partners, married couples, and those considering separation. Sessions are 75 minutes to allow both voices adequate space.",
      "Using systemic therapies, we help partners move from blame to understanding, and from gridlock to repair.",
    ],
    whoFor:
      "Partners at any relationship stage who want to improve communication, rebuild trust after rupture, or navigate major decisions together.",
    goodFitFor: [
      "Feeling stuck in recurring arguments that go nowhere",
      "Wanting to rebuild trust after infidelity or betrayal",
      "Preparing for marriage or a major commitment together",
      "Considering separation but unsure if it's the right choice",
      "Struggling with intimacy, connection, or feeling heard by your partner",
    ],
    concerns: [
      "Communication breakdown",
      "Trust & Infidelity recovery",
      "Intimacy & connection",
      "Recurring arguments",
      "Pre-marital preparation",
      "Separation decisions",
    ],
    expect: [
      "Reach out. Book a couples session online or call us to discuss your relationship needs.",
      "Joint intake. We meet together to map strengths and pain points as a couple.",
      "Build tools. Structured exercises for difficult conversations you can practice at home.",
      "Ongoing sessions. Weekly 75-minute sessions with repair tools to use between meetings.",
    ],
    benefits: [
      "Healthier conflict — arguments that lead somewhere",
      "Renewed emotional and physical intimacy",
      "Shared language for needs and boundaries",
      "Decisions made together, not in reaction",
      "Stronger foundation for co-parenting if separating",
    ],
    approaches: [
      {
        name: "Emotionally Focused Therapy (EFT)",
        description:
          "Identifying attachment needs beneath conflict and creating secure emotional bonds.",
      },
      {
        name: "Gottman Method",
        description:
          "Research-backed tools for de-escalation, repair, and building friendship in the relationship.",
      },
      {
        name: "Imago Relationship Therapy",
        description:
          "Understanding how past wounds shape present reactions between partners.",
      },
    ],
    features: [
      {
        icon: MessageCircle,
        title: "Both voices heard",
        body: "Structured sessions ensure neither partner dominates the conversation.",
      },
      {
        icon: ShieldCheck,
        title: "Neutral ground",
        body: "A therapist holds space so home dynamics don't replay in the room.",
      },
      {
        icon: HeartHandshake,
        title: "Repair-focused",
        body: "We teach repair skills you carry into everyday life.",
      },
      {
        icon: Users,
        title: "All stages welcome",
        body: "Dating, engaged, married, separating — no judgment on where you are.",
      },
    ],
    faqs: [
      {
        q: "Do we both need to attend every session?",
        a: "Most sessions are joint. Occasionally, individual sessions help when one partner needs private space to process.",
      },
      {
        q: "Can couples therapy save a relationship after infidelity?",
        a: "Many couples rebuild trust after infidelity with structured, honest work. We assess readiness together in early sessions.",
      },
      {
        q: "What if we're not sure we want to stay together?",
        a: "Discernment therapy helps you clarify whether to repair or separate with dignity — we support both paths.",
      },
    ],
    testimonial: {
      quote:
        "We came in ready to give up. Three months later, we had tools we still use every week.",
      author: "J. & P.",
      role: "Couples therapy clients",
    },
    duration: "50 min",
    pricing: "From KES 7,500",
    pricingNote: "Joint sessions; individual add-on sessions available.",
    mode: "In-person · Online",
    availability: "Within 1 week",
    booking: "Intake call within 2 working days",
    relatedArticleSlugs: [
      "repair-conversations-for-couples",
      "the-perfect-storm",
    ],
    reading: [
      {
        slug: "repair-conversations-for-couples",
        category: "Relationships",
        title: "Repair conversations for couples",
        image: "https://images.unsplash.com/photo-1516589091380-5d8e87df6999?w=800",
      },
      {
        slug: "the-perfect-storm",
        category: "Relationships",
        title: "The perfect storm",
        image: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=800",
      },
    ],
  };
