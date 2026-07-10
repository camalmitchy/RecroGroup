import { BookingPage } from "@/features/public/booking/components/booking-page";

export const metadata = {
    title: "Book a Session — Recro Group",
    description:
        "Schedule your therapy session with our licensed clinicians. Choose your service, select a convenient time, and complete your booking in minutes.",
};

export default function Page() {
    return <BookingPage />;
}
