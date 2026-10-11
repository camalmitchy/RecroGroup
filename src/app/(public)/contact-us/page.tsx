import type { Metadata } from "next";

import { ContactPage } from "@/features/public/contact/components/contact-page";

export const metadata: Metadata = {
  title: "Contact us | Recro Group",
  description:
    "Reach out to Recro Group to book a session, request information, or find answers to common questions about therapy and care.",
  openGraph: {
    title: "Contact us | Recro Group",
    description:
      "Send a message, view our FAQs, or find our Nairobi clinic details.",
  },
};

export default function Page() {
  return <ContactPage />;
}
