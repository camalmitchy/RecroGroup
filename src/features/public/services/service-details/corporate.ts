import {
  Briefcase,
  Lock,
  ShieldCheck,
  Users
} from "lucide-react";

import type { ServiceDetail } from "../data";

export const corporateService: ServiceDetail = {
    key: "corporate",
    eyebrow: "Workplace Wellness",
    title: "Corporate Speaking",
    titleItalic: "Corporate",
    titleRest: "Speaking",
    ctaLabel: "Apply for Corporate Training",
    icon: Briefcase,
    heroImage: "/assets/corporate.png",
    glanceImage: "/assets/hero-4.jpg",
    ctaImage: "/assets/hero-4.jpg",
    intro:
      "We partner with organisations who take the mental health of their people seriously. Engagements range from a 60-minute keynote to a multi-session wellness programme, always grounded in clinical insight and delivered with our missions and vision in mind.",
    overview: [
      "Mental health at work is no longer a nice-to-have — it is a retention, productivity, and leadership imperative. Recro Group partners with HR teams, people leaders, and organisations across Kenya to design wellness programmes that actually get used.",
      "Our corporate offerings range from one-off workshops on stress managemement, burnout or leadership training with confidential therapy access for your entire workforce.",
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
  };
