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
  { href: "/grief-camp", label: "Grief Camp" },
  { href: "/about", label: "About" },
  { href: "/insights", label: "Insights" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

export const serviceNavItems: ServiceNavItem[] = [
  {
    slug: "individual",
    label: "Individual Therapy",
    description: "One-on-one psychotherapy",
    icon: "/assets/icons/individual-therapy.svg",
  },
  {
    slug: "couples",
    label: "Couples Therapy",
    description: "Relationship counselling",
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
    description: "Support for children",
    icon: "/assets/icons/grief-camp.svg",
  },
  {
    slug: "corporate",
    label: "Corporate Speaking",
    description: "Workplace wellness",
    icon: "/assets/icons/corporate-speaking.svg",
  },
];
