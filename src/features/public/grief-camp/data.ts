export const camperPricing = [
  { label: "Mega deal", deadline: "by April 30", price: "KES 11,000" },
  { label: "Early price", deadline: "after May 1", price: "KES 13,000" },
  { label: "Regular price", deadline: "after June 30", price: "KES 15,000" },
] as const;

export const parentPricing = [
  { label: "Mega deal", deadline: "by April 30", price: "KES 2,500" },
  { label: "Early price", deadline: "after May 1", price: "KES 4,500" },
  { label: "Regular price", deadline: "after June 30", price: "KES 6,500" },
] as const;

export const journeyPillars = [
  { title: "Camp Activity", image: "/assets/journey-camp.jpg" },
  { title: "Nature", image: "/assets/journey-nature.jpg" },
  { title: "Group Support", image: "/assets/journey-group.jpg" },
  { title: "Connection", image: "/assets/journey-connection.jpg" },
] as const;

export const journeyChecklist = [
  "Professional grief counsellors on-site 24/7",
  "Age-appropriate therapeutic activities",
  "Safe spaces for sharing and remembering",
  "Outdoor recreation and team building",
] as const;

export const infoStrip = [
  {
    title: "Who it's for",
    body: "Adolescents aged 10–16 who have experienced the loss of a parent or sibling.",
  },
  {
    title: "Camp Dates",
    body: "14 – 16 August 2026 (Friday – Sunday)",
  },
  {
    title: "Camp Fee",
    body: "See pricing below (subsidised places available)",
  },
  {
    title: "Parent Session",
    body: "Includes a pre-camp briefing and post-camp integration session for guardians.",
  },
] as const;

export const pricingBlocks = [
  { title: "For Campers", tiers: camperPricing },
  { title: "For Parents/Guardians", tiers: parentPricing },
] as const;
