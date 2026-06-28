export const MOCK_THERAPISTS = [
  { id: "t1", fullName: "Dr. Michelle Karume" },
  { id: "t2", fullName: "Grace Wanjiku" },
  { id: "t3", fullName: "James Ochieng" },
] as const;

export type MockBooking = {
  id: string;
  reference: string;
  clientName: string;
  clientEmail: string;
  preferredDate: string | null;
  therapistId: string | null;
  status: "REQUESTED" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
  paymentStatus: "PENDING" | "PAID" | "FAILED";
};

export const INITIAL_BOOKINGS: MockBooking[] = [
  {
    id: "b1",
    reference: "RC-2401",
    clientName: "Amina K.",
    clientEmail: "amina@example.com",
    preferredDate: "2026-07-02",
    therapistId: "t1",
    status: "REQUESTED",
    paymentStatus: "PENDING",
  },
  {
    id: "b2",
    reference: "RC-2402",
    clientName: "Brian O.",
    clientEmail: "brian@example.com",
    preferredDate: "2026-07-03",
    therapistId: null,
    status: "REQUESTED",
    paymentStatus: "PENDING",
  },
  {
    id: "b3",
    reference: "RC-2403",
    clientName: "Wanjiku M.",
    clientEmail: "wanjiku@example.com",
    preferredDate: "2026-07-05",
    therapistId: "t2",
    status: "CONFIRMED",
    paymentStatus: "PAID",
  },
  {
    id: "b4",
    reference: "RC-2404",
    clientName: "Maria P.",
    clientEmail: "maria@example.com",
    preferredDate: "2026-06-28",
    therapistId: "t1",
    status: "COMPLETED",
    paymentStatus: "PAID",
  },
];

export type MockPayment = {
  id: string;
  method: "MPESA" | "BANK" | "CARD";
  amountKes: number;
  reference: string | null;
  bookingId: string | null;
  status: "PENDING" | "PAID" | "FAILED";
  createdAt: string;
};

export const INITIAL_PAYMENTS: MockPayment[] = [
  {
    id: "p1",
    method: "MPESA",
    amountKes: 4500,
    reference: "RKJ29A",
    bookingId: "b1",
    status: "PENDING",
    createdAt: "2026-06-26",
  },
  {
    id: "p2",
    method: "BANK",
    amountKes: 6000,
    reference: "BT-8821",
    bookingId: "b2",
    status: "PENDING",
    createdAt: "2026-06-25",
  },
  {
    id: "p3",
    method: "MPESA",
    amountKes: 4500,
    reference: "QWE77K",
    bookingId: "b3",
    status: "PAID",
    createdAt: "2026-06-24",
  },
];

export type MockGriefApplication = {
  id: string;
  childName: string;
  childAge: number | null;
  parentName: string;
  parentEmail: string;
  parentPhone: string | null;
  tier: string | null;
  status: "PENDING" | "REVIEWING" | "ACCEPTED" | "REJECTED" | "WAITLISTED";
  createdAt: string;
};

export const INITIAL_GRIEF_APPLICATIONS: MockGriefApplication[] = [
  {
    id: "g1",
    childName: "Grace N.",
    childAge: 12,
    parentName: "Faith N.",
    parentEmail: "faith@example.com",
    parentPhone: "+254 712 000 001",
    tier: "Early price",
    status: "PENDING",
    createdAt: "2026-06-26",
  },
  {
    id: "g2",
    childName: "Tom W.",
    childAge: 14,
    parentName: "Peter W.",
    parentEmail: "peter@example.com",
    parentPhone: "+254 733 000 002",
    tier: "Mega deal",
    status: "REVIEWING",
    createdAt: "2026-06-24",
  },
  {
    id: "g3",
    childName: "Lily A.",
    childAge: 11,
    parentName: "Sarah A.",
    parentEmail: "sarah@example.com",
    parentPhone: "+254 722 000 003",
    tier: "Regular price",
    status: "ACCEPTED",
    createdAt: "2026-06-20",
  },
];

export type MockInquiry = {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  status: "NEW" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";
  createdAt: string;
};

export const INITIAL_INQUIRIES: MockInquiry[] = [
  {
    id: "i1",
    name: "James K.",
    email: "james@example.com",
    subject: "Partnership question",
    message: "We would like to explore a corporate wellness partnership.",
    status: "NEW",
    createdAt: "2026-06-26",
  },
  {
    id: "i2",
    name: "Lucy M.",
    email: "lucy@example.com",
    subject: "Grief Camp",
    message: "Is there financial assistance available for camp fees?",
    status: "IN_PROGRESS",
    createdAt: "2026-06-25",
  },
  {
    id: "i3",
    name: "David R.",
    email: "david@example.com",
    subject: null,
    message: "Thank you for the session last week.",
    status: "RESOLVED",
    createdAt: "2026-06-22",
  },
];

export const DASHBOARD_KPIS = [
  { label: "Today's bookings", value: 14, delta: "+12%", up: true, href: "/dashboard/bookings" },
  { label: "Pending appointments", value: 7, delta: "+2", up: true, href: "/dashboard/bookings" },
  { label: "Pending M-Pesa", value: 9, delta: "-1", up: false, href: "/dashboard/payments" },
  { label: "Grief camp applications", value: 18, delta: "+6", up: true, href: "/dashboard/programs" },
  { label: "New inquiries", value: 11, delta: "+4", up: true, href: "/dashboard/inquiries" },
] as const;

export const DASHBOARD_ACTIVITY = [
  { time: "2m ago", text: "New booking — Amina K. · Individual therapy", href: "/dashboard/bookings", tone: "info" as const },
  { time: "9m ago", text: "M-Pesa payment received · KES 4,500", href: "/dashboard/payments", tone: "success" as const },
  { time: "44m ago", text: "Grief Camp application · age 10–13", href: "/dashboard/programs", tone: "info" as const },
  { time: "2h ago", text: "Contact form · partnership question", href: "/dashboard/inquiries", tone: "muted" as const },
] as const;

export const DASHBOARD_QUEUE = {
  "Needs attention": [
    { who: "Wanjiku M.", type: "Bank transfer", status: "Verify proof", action: "Review" },
    { who: "Brian O.", type: "Booking", status: "Awaiting therapist assignment", action: "Assign" },
    { who: "Grace N.", type: "Grief camp", status: "New application", action: "Open" },
  ],
  "Pending payments": [
    { who: "Amina K.", type: "M-Pesa", status: "Awaiting STK confirmation", action: "Resend" },
    { who: "James K.", type: "Bank transfer", status: "Proof not uploaded", action: "Remind" },
  ],
} as const;

export type MockCustomer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  type: string;
  lastActivity: string;
  bookings: number;
};

export const MOCK_CUSTOMERS: MockCustomer[] = [
  { id: "c1", name: "Amina K.", email: "amina@example.com", phone: "+254 700 111 222", type: "Individual", lastActivity: "Today", bookings: 7 },
  { id: "c2", name: "Wanjiku & James", email: "wj@example.com", phone: "+254 711 333 444", type: "Couple", lastActivity: "Yesterday", bookings: 4 },
  { id: "c3", name: "Brian O.", email: "brian@example.com", phone: "+254 722 555 666", type: "Family", lastActivity: "2d ago", bookings: 2 },
  { id: "c4", name: "Grace N.", email: "grace@example.com", phone: "+254 733 777 888", type: "Individual", lastActivity: "3d ago", bookings: 1 },
  { id: "c5", name: "Acme Ltd", email: "hr@acme.co.ke", phone: "+254 20 555 0100", type: "Corporate", lastActivity: "1w ago", bookings: 3 },
];

export type MockNewsletterSubscriber = {
  id: string;
  email: string;
  name: string | null;
  createdAt: string;
};

export const INITIAL_NEWSLETTER_SUBSCRIBERS: MockNewsletterSubscriber[] = [
  { id: "n1", email: "hello@example.com", name: "Sarah M.", createdAt: "2026-06-20" },
  { id: "n2", email: "wellness@corp.co.ke", name: null, createdAt: "2026-06-18" },
  { id: "n3", email: "faith@example.com", name: "Faith N.", createdAt: "2026-06-15" },
];

export type MockBlogPost = {
  id: string;
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  content: string;
  coverImageUrl: string;
  isPublished: boolean;
};

export const INITIAL_BLOG_POSTS: MockBlogPost[] = [
  {
    id: "bp1",
    title: "Five gentle ways to start therapy",
    slug: "five-gentle-ways-to-start-therapy",
    category: "Therapy 101",
    excerpt: "Starting therapy can feel daunting. Here are five gentle entry points.",
    content: "Starting therapy can feel daunting...",
    coverImageUrl: "/assets/reading-guide.jpg",
    isPublished: true,
  },
  {
    id: "bp2",
    title: "From the foxhole to the front porch",
    slug: "from-the-foxhole-to-the-front-porch",
    category: "Family",
    excerpt: "A family perspective on healing after deployment.",
    content: "When a service member returns home...",
    coverImageUrl: "/assets/journey-connection.jpg",
    isPublished: true,
  },
];

export type MockMediaItem = {
  id: string;
  title: string;
  kind: "video" | "podcast" | "audio";
  url: string;
  description: string;
  thumbnailUrl: string;
  isPublished: boolean;
};

export const INITIAL_MEDIA_ITEMS: MockMediaItem[] = [
  {
    id: "m1",
    title: "Understanding grief in children",
    kind: "video",
    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    description: "A short introduction for parents and guardians.",
    thumbnailUrl: "/assets/grief-camp.jpg",
    isPublished: true,
  },
];

export type MockFaq = {
  id: string;
  question: string;
  answer: string;
  category: string;
  sortOrder: number;
  isPublished: boolean;
};

export const INITIAL_FAQS: MockFaq[] = [
  {
    id: "f1",
    question: "How do I book a session?",
    answer: "Use the Join Us page or contact us directly.",
    category: "Booking",
    sortOrder: 1,
    isPublished: true,
  },
  {
    id: "f2",
    question: "Do you accept insurance?",
    answer: "We work with several providers. Contact us for details.",
    category: "Billing",
    sortOrder: 2,
    isPublished: true,
  },
];

export type MockTestimonial = {
  id: string;
  authorName: string;
  role: string;
  quote: string;
  rating: number;
  isPublished: boolean;
};

export const INITIAL_TESTIMONIALS: MockTestimonial[] = [
  {
    id: "t1",
    authorName: "A. M.",
    role: "Individual therapy client",
    quote: "I felt heard from the very first session.",
    rating: 5,
    isPublished: true,
  },
];

export type MockService = {
  id: string;
  title: string;
  slug: string;
  category: string;
  description: string;
  priceKes: number;
  durationMin: number;
  isPublished: boolean;
};

export const INITIAL_SERVICES: MockService[] = [
  {
    id: "s1",
    title: "Individual Therapy",
    slug: "individual",
    category: "Therapeutic care",
    description: "One-to-one sessions tailored to your needs.",
    priceKes: 5000,
    durationMin: 50,
    isPublished: true,
  },
  {
    id: "s2",
    title: "Couples Therapy",
    slug: "couples",
    category: "Therapeutic care",
    description: "Support for partners navigating change together.",
    priceKes: 7500,
    durationMin: 60,
    isPublished: true,
  },
];

export type MockTherapistRecord = {
  id: string;
  fullName: string;
  title: string;
  email: string;
  phone: string;
  bio: string;
  photoUrl: string;
  isActive: boolean;
};

export const INITIAL_THERAPIST_RECORDS: MockTherapistRecord[] = [
  {
    id: "t1",
    fullName: "Dr. Michelle Karume",
    title: "Clinical Psychologist",
    email: "michelle@recrogroup.org",
    phone: "+254 700 000 001",
    bio: "Specialises in trauma-informed family therapy.",
    photoUrl: "/assets/founder-portrait.jpg",
    isActive: true,
  },
  {
    id: "t2",
    fullName: "Grace Wanjiku",
    title: "Counselling Psychologist",
    email: "grace@recrogroup.org",
    phone: "+254 700 000 002",
    bio: "Works with children, adolescents, and families.",
    photoUrl: "",
    isActive: true,
  },
];

export type MockStaffRole = {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  role: "admin" | "receptionist";
};

export const INITIAL_STAFF_ROLES: MockStaffRole[] = [
  { id: "sr1", userId: "u1", fullName: "Admin User", email: "admin@recrogroup.org", role: "admin" },
  { id: "sr2", userId: "u2", fullName: "Reception Desk", email: "reception@recrogroup.org", role: "receptionist" },
];
