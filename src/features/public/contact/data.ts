import type { LucideIcon } from "lucide-react";
import { Clock, Mail, MapPin, Phone } from "lucide-react";

export type ContactDetail = {
  icon: LucideIcon;
  title: string;
  value: string;
};

export const contactDetails: ContactDetail[] = [
  { icon: Phone, title: "Call us", value: "+254 700 000 000" },
  { icon: Mail, title: "Email", value: "hello@recrogroup.org" },
  {
    icon: MapPin,
    title: "Visit",
    value: "Nairobi, Kenya — by appointment",
  },
];

export const workingHours = [
  "Mon–Fri · 8:00 – 18:00",
  "Sat · 9:00 – 14:00",
] as const;

export const mapEmbedUrl =
  "https://www.openstreetmap.org/export/embed.html?bbox=36.87738%2C-1.22168%2C36.88138%2C-1.21768&layer=mapnik&marker=-1.21968%2C36.87938";

export const mapCoordinates =
  "Coordinates: 1° 13' 11\" S, 36° 52' 46\" E · Nairobi, Kenya";

export type FaqItem = {
  q: string;
  a: string;
};

export type FaqCategory = {
  category: string;
  questions: FaqItem[];
};

export const faqCategories: FaqCategory[] = [
  {
    category: "Understanding Therapy",
    questions: [
      {
        q: "What is the difference between Psychotherapy and Counselling?",
        a: "Psychotherapy and counselling are often used interchangeably but are different. Counselling tends to be brief and focused on a single problem, while psychotherapy is longer, deeper, and uses a systemic framework that encompasses influences such as family, community, employment, and religion. It is provided by professionals trained specifically in psychotherapy.",
      },
      {
        q: "How frequent are the sessions?",
        a: "Individual therapy sessions run for 50 minutes and are typically held once a week for the best results. Group sessions meet weekly as well but are longer, usually between 1 hour 30 minutes and 2 hours.",
      },
      {
        q: "How long will therapy take?",
        a: "There is no fixed duration. The length and success of therapy depend on the nature and severity of the problem, the client's personal motivation, and any other factors that may arise during treatment.",
      },
      {
        q: "What can I expect at the first session?",
        a: "The first session focuses on building a therapeutic alliance and gathering information to shape a treatment plan. Clients are encouraged to be open and honest about what brought them to therapy. It is normal to feel nervous, but the Recro team's presence is described as calming and supportive.",
      },
      {
        q: "What works in therapy?",
        a: "The client's motivation and a strong therapeutic alliance (relationship with the therapist) are significant factors. The use of evidence-based therapies such as Cognitive Behavioral Therapy, Solution-Focused Therapy, Gestalt Therapy, Structural Therapy, and Transgenerational Therapy also contributes to successful outcomes.",
      },
    ],
  },
  {
    category: "Common Concerns",
    questions: [
      {
        q: "What if my family member/friend wants me to come but I don't think I have a problem?",
        a: "Only you can decide to enter therapy. If a loved one suggests it, that may reflect care for you. Psychotherapy can offer helpful insight from a trained professional and may be worth trying even if you're unsure there's a problem.",
      },
      {
        q: "What if I don't believe in Psychotherapy or Counselling — I think problems should not be discussed outside the home?",
        a: "Recro Group respects cultural beliefs. However, sometimes the home environment can be unhealthy for facilitating change. A trained professional perspective can be helpful to understand issues that may not change otherwise.",
      },
      {
        q: "How do I reach the clinic before or between sessions?",
        a: "The best way to reach the clinic is by calling and speaking with a staff member, who will then contact your therapist. If no one answers, you can leave a voicemail and someone will return your call as soon as possible.",
      },
    ],
  },
  {
    category: "Booking & Appointments",
    questions: [
      {
        q: "How can I make an appointment?",
        a: "You can make an appointment by calling the clinic at the provided phone numbers or by filling out the contact form on the site, after which a staff member will contact you.",
      },
      {
        q: "How do I book a session online?",
        a: "Visit our booking page, select your preferred service, choose a date and time that works for you, and fill in your contact details. We'll confirm your appointment within one working day.",
      },
      {
        q: "Can I book for someone else?",
        a: "Yes, you can book on behalf of a family member or friend. However, the person receiving therapy must be willing and ready to participate. For children and adolescents, a parent or guardian must book and provide consent.",
      },
      {
        q: "Can I reschedule or cancel my appointment?",
        a: "Yes. Please notify us at least 24 hours in advance to reschedule or cancel. Late cancellations may be subject to a fee.",
      },
    ],
  },
  {
    category: "Fees & Payment",
    questions: [
      {
        q: "Can I use my insurance?",
        a: "Currently, insurance companies do not cover mental health treatment at Recro Group, so payment must be made out of pocket.",
      },
      {
        q: "What payment methods do you accept?",
        a: "We accept M-Pesa, bank transfers (both KES and USD), and cash payments. Full payment details are provided after booking confirmation.",
      },
      {
        q: "Do you offer sliding-scale fees?",
        a: "Yes, we offer sliding-scale spots for clients who need financial assistance. Please ask us about this when booking, and we'll work with you to find an arrangement that fits your situation.",
      },
    ],
  },
];
