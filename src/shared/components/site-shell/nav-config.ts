export type NavLink = {
  href: string;
  label: string;
  exact?: boolean;
};

export type ServiceNavItem = {
  slug: string;
  label: string;
  description: string;
  icon: string;
};

export const mainNavLinks: NavLink[] = [
  { href: "/", label: "Home", exact: true },
  { href: "/about", label: "About" },
  { href: "/grief-camp", label: "Grief Camp" },
  { href: "/resources", label: "Resources" },
  { href: "/media", label: "Media" },
  { href: "/merchandise", label: "Merchandise" },
  { href: "/contact", label: "Contact" },
  { href: "/faq", label: "FAQ" },
];

export const serviceNavItems: ServiceNavItem[] = [
  {
    slug: "individual",
    label: "Individual Therapy",
    description: "Systems focus one-on-one psychotherapy for personal life's challenges",
    icon: "/assets/icons/individual-therapy.svg",
  },
  {
    slug: "couples",
    label: "Couples Therapy",
    description: "Relationship therapy",
    icon: "/assets/icons/couples-therapy.svg",
  },
  {
    slug: "family",
    label: "Family Therapy",
    description: "Whole-family sessions",
    icon: "/assets/icons/family-therapy.svg",
  },
  {
    slug: "group",
    label: "Group Therapy",
    description: "Shared healing experience",
    icon: "/assets/icons/group-therapy.svg",
  },
  {
    slug: "children",
    label: "Grief Camps",
    description: "Therapeutic support for children processing the death of their loved one",
    icon: "/assets/icons/grief-camp.svg",
  },
  {
    slug: "corporate",
    label: "Corporate Speaking",
    description: "Mental Health workshops and trainings to support your staff wellbeing",
    icon: "/assets/icons/corporate-speaking.svg",
  },
  {
    slug: "consortium",
    label: "Consortium",
    description: "Professional network & collaboration",
    icon: "/assets/icons/group-therapy.svg",
  },
];
