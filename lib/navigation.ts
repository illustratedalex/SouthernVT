type NavigationGroup = {
  label: string;
  href: string;
  items: { label: string; href: string }[];
};

export const publicNavigationGroups: NavigationGroup[] = [
  {
    label: "Explore",
    href: "/places",
    items: [
      { label: "Places", href: "/places" },
      { label: "Collections", href: "/collections" },
      { label: "Events", href: "/events" },
      { label: "Deals", href: "/deals" },
    ],
  },
  {
    label: "Plan",
    href: "/concierge",
    items: [
      { label: "Concierge", href: "/concierge" },
      { label: "Passport", href: "/passport" },
    ],
  },
  {
    label: "Stories",
    href: "/guides",
    items: [
      { label: "Guides", href: "/guides" },
      { label: "Current Issue", href: "/updates" },
      { label: "Why Trust SouthernVT", href: "/why-trust-southernvt" },
      { label: "Our Coverage", href: "/our-coverage" },
    ],
  },
  {
    label: "Businesses",
    href: "/businesses",
    items: [
      { label: "Businesses", href: "/businesses" },
      { label: "Claim a Listing", href: "/businesses" },
      { label: "Founding Partners", href: "/founding-partners" },
      { label: "Partner Portal", href: "/partner-portal" },
    ],
  },
];

export const footerLinks = [
  { label: "About", href: "/about" },
  { label: "Our Coverage", href: "/our-coverage" },
  { label: "Why Trust SouthernVT?", href: "/why-trust-southernvt" },
  { label: "Founding Partners", href: "/founding-partners" },
  { label: "Contact", href: "/contact" },
  { label: "Updates", href: "/updates" },
  { label: "Partner Portal", href: "/partner-portal" },
  { label: "Feedback", href: "/feedback" },
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
];
