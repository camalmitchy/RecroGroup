export const homeServices = [
  {
    icon: "/assets/icons/individual-therapy.svg",
    title: "Individual therapy",
    body: "One-on-one psychotherapy for anxiety, depression, life transitions and personal growth.",
    serviceKey: "individual",
  },
  {
    icon: "/assets/icons/family-therapy.svg",
    title: "Family Therapy",
    body: "Strengthen bonds and resolve conflict through compassionate clinical guidance.",
    serviceKey: "family",
  },
  {
    icon: "/assets/icons/couples-therapy.svg",
    title: "Couples Therapy",
    body: "Rebuild trust, intimacy, and partnership for couples navigating transition or rupture.",
    serviceKey: "couples",
  },
  {
    icon: "/assets/icons/group-therapy.svg",
    title: "Group Therapy",
    body: "Healing through shared experience in small, facilitated, confidential groups.",
    serviceKey: "group",
  },
  {
    icon: "/assets/icons/grief-camp.svg",
    title: "Grief Camp",
    body: "Safe, play-based support for children processing loss, change and big emotions.",
    serviceKey: "children",
  },
  {
    icon: "/assets/icons/corporate-speaking.svg",
    title: "Corporate Speaking",
    body: "Workshops, EAP programs and team check-ins that protect your people's wellbeing.",
    serviceKey: "corporate",
  },
  {
    icon: "/assets/icons/group-therapy.svg",
    title: "Consortium",
    body: "A collaborative network of mental health professionals advancing behavioral health services across Kenya.",
    serviceKey: "consortium",
  },
] as const;

export const homeStats = [
  { k: "7+", v: "Years of care" },
  { k: "2.4k", v: "Sessions a year" },
  { k: "9", v: "Camp cohorts" },
] as const;

export const homeApproachPoints = [
  "Licensed psychotherapists and counsellors",
  "Confidential by default, always",
  "Flexible in-person and virtual sessions",
  "Sliding-scale options for those in need",
] as const;

export const homeFramework = {
  title: "BioPsychosocialSpiritual Framework",
  body: "Systems framework is a hallmark way that MFTs work with clients; which sets them apart from other clinical disciplines. The systemic lens is one where the client is viewed from the perspective of their relationships.",
  highlight:
    "This whole person perspective garners insight into the patterns, connections, and contexts that shape wellbeing.",
} as const;

export const homeTrustFeatures = [
  {
    title: "Confidential by design",
    body: "All sessions and records are handled in line with HIPAA guidelines, Counsellors and Psychologists board, and AAMFT ethical guidelines.",
  },
  {
    title: "Therapist–client fit",
    body: "Your goals are important to us, should you feel that Recro is not the right fit for you we will assist by giving you a referral for your consideration.",
  },
  {
    title: "Systems Based therapy",
    body: "Modern Systemic approaches tailored to your goals.",
  },
] as const;

export const homeVideos = [
  {
    title: "Benefits of Therapy",
    desc: "Why talking helps — and what changes inside us when it does.",
    duration: "12:40",
    videoId: "yrtRlE6HlUU",
    thumbnail: "https://i.ytimg.com/vi/yrtRlE6HlUU/hqdefault.jpg",
  },
  {
    title: "Forgiveness",
    desc: "Understanding the emotional architecture of letting go.",
    duration: "9:08",
    videoId: "f3omumMGIw0",
    thumbnail: "https://i.ytimg.com/vi/f3omumMGIw0/hqdefault.jpg",
  },
  {
    title: "Expectations in Relationships",
    desc: "Where unspoken expectations come from and how to name them.",
    duration: "14:22",
    videoId: "6yd3gLyuR_0",
    thumbnail: "https://i.ytimg.com/vi/6yd3gLyuR_0/hqdefault.jpg",
  },
] as const;

export const homeBookingPerks = [
  "Commitment fee: half now, balance at session",
  "In-person sessions in Nairobi",
  "Your chosen day & time becomes your permanent slot",
] as const;

export const homeSelfCareTips = [
  {
    frequency: "Daily",
    description: "Small actions, lasting impact",
    tips: [
      { text: "Self care", icon: "Heart" },
      { text: "Daily progress", icon: "TrendingUp" },
      { text: "Journaling", icon: "BookOpen" },
      { text: "Exercise", icon: "Dumbbell" },
    ],
    bgColor: "bg-primary-deep",
    badgeIcon: "Sun",
  },
  {
    frequency: "Monthly",
    description: "Deeper nourishment rituals",
    tips: [
      { text: "Socializing", icon: "Users" },
      { text: "Massage therapy", icon: "Flame" },
      { text: "Mental Health day", icon: "Brain" },
      { text: "Leisure Reading", icon: "Book" },
    ],
    bgColor: "bg-primary",
    badgeIcon: "Calendar",
  },
  {
    frequency: "Annually",
    description: "Reset and recharge",
    tips: [
      { text: "Trips/Vacation", icon: "Plane" },
      { text: "Retreat (Personal/Family)", icon: "Home" },
    ],
    bgColor: "bg-primary-deep",
    badgeIcon: "Star",
  },
] as const;
