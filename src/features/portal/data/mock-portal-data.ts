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
