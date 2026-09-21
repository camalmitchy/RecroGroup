import type { ServiceOption } from "./booking-types";

export { TIME_SLOTS } from "../lib/schedule";

export const SERVICES: ServiceOption[] = [
    {
        key: "individual",
        title: "Individual Therapy",
        duration: "50 min",
        icon: "/assets/icons/individual-therapy.svg",
        price: 7000,
    },
    {
        key: "couples",
        title: "Couples Therapy",
        duration: "50 min",
        icon: "/assets/icons/couples-therapy.svg",
        price: 7000,
    },
    {
        key: "family",
        title: "Family Therapy",
        duration: "50 min",
        icon: "/assets/icons/family-therapy.svg",
        price: 7000,
    },
    {
        key: "group",
        title: "Group Therapy",
        duration: "2 hrs",
        icon: "/assets/icons/group-therapy.svg",
        price: 12000,
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
