import {
  Baby,
  Brain,
  Briefcase,
  HeartHandshake,
  HeartPulse,
  Lock,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  UserRound,
  Users,
} from "lucide-react";

import type { ServiceDetail, ServiceListItem } from "./data";

export const serviceList: ServiceListItem[] = [
  {
    id: "01",
    slug: "individual",
    icon: "/assets/icons/individual-therapy.svg",
    title: "Individual Therapy",
    description:
      "Individual therapy is a confidential, judgement-free space to slow down and make sense of what you're carrying. Our therapists use evidence-based approaches — adapted to your therapy goals.",
    duration: "50 min",
    price: "",
  },
  {
    id: "02",
    slug: "family",
    icon: "/assets/icons/family-therapy.svg",
    title: "Family Therapy",
    description:
      "Family therapy looks at the whole system. We help each person feel heard while creating language and structure for the family to function with more warmth, clarity, and safety — especially during difficult seasons.",
    duration: "50 min",
    price: "",
  },
  {
    id: "03",
    slug: "couples",
    icon: "/assets/icons/couples-therapy.svg",
    title: "Couples Therapy",
    description:
      "We work with couples to slow down reactive cycles, rebuild trust, and reconnect. Sessions are emotionally focused, non-blaming, and culturally attuned to relationships in Kenya today.",
    duration: "50 min",
    price: "",
  },
  {
    id: "04",
    slug: "group",
    icon: "/assets/icons/group-therapy.svg",
    title: "Group Therapy",
    description:
      "Group therapy reminds us we are not alone. Held in a small, carefully facilitated space, groups offer connection, perspective, and skills practice that complements individual work beautifully.",
    duration: "2 hrs",
    price: "",
  },
  {
    id: "05",
    slug: "children",
    icon: "/assets/icons/grief-camp.svg",
    title: "Grief Camp",
    description:
      "Our flagship Grief Camp is a child-safe, family-friendly programme that gives young people language, ritual, and community around loss. Designed and led by licensed clinicians, with care taken for every age, faith background, and family situation.",
    duration: "3 days",
    price: "",
  },
  {
    id: "06",
    slug: "corporate",
    icon: "/assets/icons/corporate-speaking.svg",
    title: "Corporate Speaking & Workshops",
    description:
      "We partner with organisations who take the mental health of their people seriously. Engagements range from a 60-minute keynote to a multi-session wellness programme, always grounded in clinical insight and delivered with our missions and vision in mind.",
    duration: "min 2 hrs",
    price: "",
  },
];

export const servicesBySlug: Record<string, ServiceDetail> = {
  individual: {
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
  },

  couples: {
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
      "Using Emotionally Focused Therapy (EFT) and Gottman-informed techniques, we help partners move from blame to understanding, and from gridlock to repair.",
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
  },

  family: {
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
        icon: Sparkles,
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
  },

  children: {
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
      "Our flagship Grief Camp is a child-safe, family-friendly programme that gives young people language, ritual, and community around loss. Designed and led by licensed clinicians, with care taken for every age, faith background, and family situation.",
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
        icon: Sparkles,
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
  },

  group: {
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
  },

  corporate: {
    key: "corporate",
    eyebrow: "Workplace Wellness",
    title: "Corporate Wellness",
    titleItalic: "Corporate",
    titleRest: "Wellness",
    ctaLabel: "Talk to our corporate team",
    icon: Briefcase,
    heroImage: "/assets/corporate.png",
    glanceImage: "/assets/hero-4.jpg",
    ctaImage: "/assets/hero-4.jpg",
    intro:
      "We partner with organisations who take the mental health of their people seriously. Engagements range from a 60-minute keynote to a multi-session wellness programme, always grounded in clinical insight and delivered with our missions and vision in mind.",
    overview: [
      "Mental health at work is no longer a nice-to-have — it is a retention, productivity, and leadership imperative. Recro Group partners with HR teams, people leaders, and organisations across Kenya to design wellness programmes that actually get used.",
      "Our corporate offerings range from one-off workshops on burnout and grief literacy to full Employee Assistance Programmes (EAPs) with confidential therapy access for your entire workforce.",
      "We also support managers — the front line of workplace mental health — with training on psychological safety, difficult conversations, and team debriefs after critical incidents.",
    ],
    whoFor:
      "HR and People teams, C-suite leaders, NGO programme directors, and organisations investing in employee wellbeing and psychologically safe cultures.",
    goodFitFor: [
      "Seeing signs of burnout, high turnover, or low morale in your team",
      "Wanting to equip managers for mental health conversations",
      "Looking for an EAP that employees will actually use",
      "Responding to a critical incident or organizational crisis",
      "Building a workplace culture that prioritizes psychological safety",
    ],
    concerns: [
      "Employee burnout & turnover",
      "Manager training & support",
      "Critical incident response",
      "Workplace grief & loss",
      "Team conflict & morale",
      "Wellness strategy design",
    ],
    expect: [
      "Discovery call. We meet to understand your organization's culture, needs, and goals.",
      "Custom proposal. Tailored programme options with timelines, pricing, and deliverables.",
      "Programme delivery. On-site, hybrid, or fully online — designed for your team.",
      "Impact reporting. Quarterly reports with usage data and programme refinement.",
    ],
    benefits: [
      "Lower absenteeism and presenteeism",
      "Managers equipped for mental health conversations",
      "Employees with confidential access to professional support",
      "Stronger team cohesion after crisis or change",
      "Employer brand that attracts and retains talent",
    ],
    approaches: [
      {
        name: "Employee Assistance Programmes (EAP)",
        description:
          "Confidential therapy access for employees and dependents, with usage reporting for HR.",
      },
      {
        name: "Workshops & Lunch-and-Learns",
        description:
          "Topics include burnout, grief literacy, stress management, and psychological safety.",
      },
      {
        name: "Critical Incident Debriefs",
        description:
          "Immediate team support after workplace trauma, loss, or organisational crisis.",
      },
    ],
    features: [
      {
        icon: Briefcase,
        title: "Tailored programmes",
        body: "No off-the-shelf packages — we design for your industry and culture.",
      },
      {
        icon: Lock,
        title: "Confidential EAP",
        body: "Employee sessions are private; HR receives aggregate data only.",
      },
      {
        icon: Users,
        title: "Manager training",
        body: "Equip leaders to notice, respond, and refer — not fix.",
      },
      {
        icon: ShieldCheck,
        title: "Crisis-ready",
        body: "Rapid deployment for critical incidents affecting your team.",
      },
    ],
    faqs: [
      {
        q: "How is EAP pricing structured?",
        a: "Typically per-employee-per-month. We provide a custom quote after understanding your headcount and needs.",
      },
      {
        q: "Can you deliver workshops in Kiswahili?",
        a: "Yes. Our facilitators deliver in English, Kiswahili, or both as needed.",
      },
      {
        q: "Do you work with NGOs and schools?",
        a: "Yes. We serve corporates, NGOs, schools, and faith-based organisations.",
      },
    ],
    testimonial: {
      quote:
        "Our managers finally had language for conversations they'd been avoiding for years.",
      author: "HR Director",
      role: "Regional NGO partner",
    },
    duration: "min 2 hrs",
    pricing: "On request",
    pricingNote: "Proposals provided after discovery call.",
    mode: "On-site · Hybrid · Online",
    availability: "Reach out anytime",
    booking: "Discovery call within 1 week",
    relatedArticleSlugs: [
      "anxiety-told-simply",
      "when-grief-shows-up-at-the-office",
    ],
    reading: [
      {
        slug: "anxiety-told-simply",
        category: "Workplace",
        title: "Anxiety, told simply",
        image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800",
      },
      {
        slug: "when-grief-shows-up-at-the-office",
        category: "Grief & Loss",
        title: "When grief shows up at the office",
        image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800",
      },
    ],
  },
};

export const serviceSlugs = Object.keys(servicesBySlug);

export function getServiceBySlug(slug: string): ServiceDetail | undefined {
  return servicesBySlug[slug];
}
