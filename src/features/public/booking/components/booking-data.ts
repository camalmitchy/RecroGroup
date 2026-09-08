import type { ServiceOption } from "./booking-types";

export const SERVICES: ServiceOption[] = [
    {
        key: "individual",
        title: "Individual Therapy",
        duration: "50 min",
        icon: "/assets/icons/individual-therapy.svg",
        price: 5000,
    },
    {
        key: "couples",
        title: "Couples Therapy",
        duration: "50 min",
        icon: "/assets/icons/couples-therapy.svg",
        price: 7500,
    },
    {
        key: "family",
        title: "Family Therapy",
        duration: "50 min",
        icon: "/assets/icons/family-therapy.svg",
        price: 8000,
    },
    {
        key: "group",
        title: "Group Therapy",
        duration: "2 hrs",
        icon: "/assets/icons/group-therapy.svg",
        price: 3500,
    },
    {
        key: "children",
        title: "Grief Camp",
        duration: "3 days",
        icon: "/assets/icons/grief-camp.svg",
        price: 15000,
    },
    {
        key: "corporate",
        title: "Corporate Speaking",
        duration: "2+ hrs",
        icon: "/assets/icons/corporate-speaking.svg",
        price: 25000,
    },
];

export const CLINICIANS = [
    {
        id: "dr-karume",
        name: "Dr. Michelle Karume",
        title: "Founder & Licensed Psychotherapist",
        photo: "/assets/founder-portrait.jpg",
        specialties: ["Medical family therapy", "Marriage $ family"],
    },
];

/** Generate time slots (9 AM to 5 PM, hourly) */
export const TIME_SLOTS = Array.from({ length: 9 }, (_, i) => {
    const hour = i + 9;
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour > 12 ? hour - 12 : hour;
    return `${displayHour}:00 ${ampm}`;
});
