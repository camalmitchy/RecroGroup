import {
  HeartHandshake,
  ShieldCheck,
  Flame,
  Users
} from "lucide-react";

import type { ServiceDetail } from "../data";

export const consortiumService: ServiceDetail = {
    key: "consortium",
    eyebrow: "Professional Network",
    title: "Consortium",
    titleItalic: "Consortium",
    titleRest: "",
    ctaLabel: "Apply for Membership",
    icon: Users,
    heroImage: "/assets/services.jpg",
    glanceImage: "/assets/services.jpg",
    ctaImage: "/assets/services.jpg",
    intro:
      "A behavioral health consortium bringing together diverse behavioral health professionals (mental and medical health) for sharpening clinical and research skills, providing ethically sound services, and collaboration with professionals who uphold high levels of professionalism.",
    overview: [
      "Recro Group Limited is a behavioral health organization that provides psychotherapy and training in the Nairobi area. As part of enhancing best practice, Recro Group has developed a behavioral health consortium.",
      "The Consortium brings together a diverse group of like-minded behavioral health professionals (mental and medical health) for the purposes of: sharpening clinical and research skills, providing ethically sound services, and collaboration with other professionals who uphold the high level of professionalism and who want to maintain best practices in the field.",
      "The consortium strives to provide a forum for behavioral health professionals with collective and unified voices to grow in profession and have support from one another. By promoting the dissemination and equitable progression of practices, members benefit from the sharing of resources, networking, increasing skillsets, and collaborating with other professionals.",
    ],
    whoFor:
      "Professionals who have a Masters or Doctorate degree in Marriage and Family Therapy, Medicine, Allied health, Clinical Psychology and Counseling Psychology from accredited Universities.",
    goodFitFor: [
      "Licensed therapists with Masters or Doctorate in Marriage and Family Therapy",
      "Medical professionals committed to behavioral health",
      "Clinical Psychologists from accredited Universities",
      "Counseling Psychologists advancing best practices",
      "Allied health professionals in the mental health field",
    ],
    concerns: [
      "Professional development",
      "Clinical skills advancement",
      "Research collaboration",
      "Ethical practice standards",
      "Professional networking",
      "Best practice maintenance",
    ],
    expect: [
      "Contact us. Express interest in consortium membership by contacting us at 0717-78-78-07 / 0717-78-78-08 or info@recrogroup.org.",
      "Application form. We will send you the application form to complete.",
      "Review process. Brief review to ensure alignment with consortium requirements.",
      "Onboarding. Welcome to the consortium with access to monthly meetings and resources.",
    ],
    benefits: [
      "Forum for behavioral health professionals with collective and unified voices",
      "Sharing of resources and networking opportunities",
      "Increasing skillsets through collaboration",
      "Support from fellow professionals",
      "Monthly meetings (2nd Thursday of every month at 7:30–9:30am)",
    ],
    approaches: [
      {
        name: "Clinical Excellence",
        description:
          "Sharpening clinical and research skills through collaborative learning.",
      },
      {
        name: "Ethical Practice",
        description:
          "Providing ethically sound services with adherence to professional guidelines.",
      },
      {
        name: "Professional Collaboration",
        description:
          "Working with professionals who maintain high levels of professionalism and best practices.",
      },
    ],
    features: [
      {
        icon: Users,
        title: "Monthly meetings",
        body: "2nd Thursday of every month at 7:30–9:30am for professional development and networking.",
      },
      {
        icon: ShieldCheck,
        title: "Professional standards",
        body: "Members must be part of professional governing bodies (CPB, AAMFT, APA, KMA, etc.).",
      },
      {
        icon: Flame,
        title: "Skill development",
        body: "Continuous learning through resource sharing and collaboration.",
      },
      {
        icon: HeartHandshake,
        title: "Unified voice",
        body: "Collective professional support and advocacy for the field.",
      },
    ],
    faqs: [
      {
        q: "Who can join the consortium?",
        a: "Professionals who have a Masters or Doctorate degree in Marriage and Family Therapy, Medicine, Allied health, Clinical Psychology and Counseling Psychology from accredited Universities.",
      },
      {
        q: "What are the membership requirements?",
        a: "Adherence to ethical and legal guidelines as stipulated by your profession, attendance of monthly meetings (2nd Thursday at 7:30–9:30am), participation in meetings, character and zeal to meet best practices, and must be a member of your professional governing body (CPB, AAMFT, APA, KMA, etc.).",
      },
      {
        q: "What are the membership fees?",
        a: "2000/- per month ($20). Payments can be made in advance or on the day of the meeting via Cash, Cheque, or M-Pesa (Buy Goods and Services – Till Number: 747736). Subject to change but members are notified in due course.",
      },
      {
        q: "How do I apply?",
        a: "Contact us at 0717-78-78-07 / 0717-78-78-08 or email info@recrogroup.org to express interest. We will send you the application form.",
      },
    ],
    testimonial: {
      quote:
        "Being part of the consortium has expanded my referral network and kept me connected to best practices in the field.",
      author: "Consortium Member",
      role: "Licensed therapist, Nairobi",
    },
    duration: "Ongoing monthly meetings",
    pricing: "KES 2,000/month ($20)",
    pricingNote: "Payments can be made in advance or on meeting day. Subject to change with notification.",
    mode: "In-person monthly meetings",
    availability: "Applications accepted year-round",
    booking: "Contact us for application form",
    relatedArticleSlugs: [],
    reading: [],
  };
