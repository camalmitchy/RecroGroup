import {
  Baby,
  HeartPulse,
  Flame,
  Users
} from "lucide-react";

import type { ServiceDetail } from "../data";

export const childrenService: ServiceDetail = {
    key: "children",
    eyebrow: "Young Minds",
    title: "Children & Adolescents",
    titleItalic: "Children",
    titleRest: "& Adolescents",
    ctaLabel: "Book a session for your child",
    icon: Baby,
    heroImage: "/assets/grief.png",
    glanceImage: "/assets/journey-camp.jpg",
    ctaImage: "/assets/grief-cam.png",
    intro:
      "Our flagship Grief Camp is a child-safe, family-friendly program that equips our campers with tools, language and a community around their loss. Designed and led by licensed clinicians, this action-packed weekend facilitates healthy grieving through therapeutic sessions and activities.",
    overview: [
      "Children do not always have words for big feelings. At Recro, our child and adolescent therapists use play therapy, art, sand tray work, and age-appropriate conversation to help young people process anxiety, grief, behavioural challenges, and school struggles.",
      "Parents are partners in the process — not spectators. Regular parent feedback sessions ensure you understand what is happening in therapy and how to support your child at home.",
      "For children navigating grief, our Grief Camp programme offers a complementary intensive experience alongside individual or family therapy.",
    ],
    whoFor:
      "Children aged 5–12 and adolescents 13–18 experiencing emotional, behavioural, or developmental concerns — and their parents seeking guidance.",
    goodFitFor: [
      "Noticing persistent changes in your child's mood, sleep, or behavior",
      "Your child is struggling with anxiety, worry, or big emotions they can't express",
      "Experiencing school refusal, friendship difficulties, or social struggles",
      "Your child has experienced loss, trauma, or a major family transition",
      "Looking for professional guidance on how to support your child at home",
    ],
    concerns: [
      "Anxiety & worry",
      "Grief & loss",
      "School refusal or struggles",
      "Friendship difficulties",
      "Big behavioural changes",
      "Self-esteem & identity",
    ],
    expect: [
      "Parent consultation. We meet with you first to understand your child's needs and concerns.",
      "Child sessions. Weekly 45-minute sessions using play, art, and age-appropriate conversation.",
      "Parent feedback. Monthly sessions with you to share progress and practical home strategies.",
      "Coordinated care. We work with schools when appropriate and with your consent.",
    ],
    benefits: [
      "Calmer emotional regulation at home and school",
      "Improved communication between child and parents",
      "Age-appropriate coping skills that last",
      "Parents who feel equipped, not helpless",
      "Early intervention before patterns harden",
    ],
    approaches: [
      {
        name: "Play Therapy",
        description:
          "Children express and process emotions through play — the natural language of childhood.",
      },
      {
        name: "Cognitive Behavioural Therapy (adapted)",
        description:
          "Age-appropriate CBT for tweens and teens managing anxiety and low mood.",
      },
      {
        name: "Grief-Informed Care",
        description:
          "Specialised support for children who have lost a parent, sibling, or close caregiver.",
      },
    ],
    features: [
      {
        icon: Baby,
        title: "Child-safe space",
        body: "Warm, welcoming rooms designed to help children feel at ease.",
      },
      {
        icon: Users,
        title: "Parent partnership",
        body: "Regular updates and coaching so therapy extends into daily life.",
      },
      {
        icon: Flame,
        title: "Creative methods",
        body: "Play, art, and storytelling — not just talking.",
      },
      {
        icon: HeartPulse,
        title: "Grief Camp link",
        body: "Intensive camp option for bereaved adolescents.",
      },
    ],
    faqs: [
      {
        q: "Will my child have to talk about things they don't want to?",
        a: "Never. We follow the child's pace. Play and creative methods often bypass verbal resistance naturally.",
      },
      {
        q: "How do I know if my child needs therapy?",
        a: "Persistent changes in mood, sleep, school performance, or behaviour lasting more than a few weeks are worth exploring.",
      },
      {
        q: "Can siblings attend together?",
        a: "Yes, sibling sessions are available when relational dynamics are part of the concern.",
      },
    ],
    testimonial: {
      quote:
        "Camp gave my daughter friends who understood without her having to explain. It gave me hope.",
      author: "Parent of camper",
      role: "Grief Camp & child therapy family",
    },
    duration: "3 days",
    pricing: "From KES 4,500",
    pricingNote: "Parent feedback sessions included monthly.",
    mode: "In-person",
    availability: "Same-week for urgent cases",
    booking: "Parent call within 2 working days",
    relatedArticleSlugs: ["how-children-grieve-differently"],
    reading: [
      {
        slug: "how-children-grieve-differently",
        category: "Parenting",
        title: "How children grieve differently",
        image: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800",
      },
    ],
  };
