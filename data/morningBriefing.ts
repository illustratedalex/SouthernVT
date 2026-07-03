export type MorningPriority = {
  place: string;
  task: string;
  href: string;
  priority: "urgent" | "high";
};

export type CopyDeskStory = {
  title: string;
  storyHealth: number;
  seo: number;
  verification: "Complete" | "In Review" | "Needs Review";
  readyToPublish: boolean;
  href: string;
};

export type VerificationDeskRecord = {
  place: string;
  status: "needs_review" | "expiring" | "newly_verified";
  detail: string;
  href: string;
};

export type PublishTodayItem = {
  title: string;
  href: string;
  type: "Story" | "Guide" | "Collection";
};

export const morningQuoteOfTheDay =
  "The best local story is the one that helps someone have a better day in the real world.";

export const weatherPlaceholder = "Brattleboro · 72F · Partly Cloudy (mock)";

export const morningPriorities: MorningPriority[] = [
  {
    place: "Hamilton Falls",
    task: "Finish photography tips",
    href: "/basecamp/places/place-hamilton-falls",
    priority: "urgent",
  },
  {
    place: "Mount Equinox",
    task: "Write story",
    href: "/basecamp/places/place-mount-equinox",
    priority: "high",
  },
  {
    place: "Grafton Inn",
    task: "Verify hours",
    href: "/basecamp/places/place-grafton-inn",
    priority: "high",
  },
  {
    place: "Bellows Falls",
    task: "Upload hero",
    href: "/basecamp/places/place-bellows-falls",
    priority: "high",
  },
  {
    place: "Jamaica State Park",
    task: "Review copy",
    href: "/basecamp/places/place-jamaica-state-park",
    priority: "high",
  },
];

export const copyDeskStories: CopyDeskStory[] = [
  {
    title: "Hamilton Falls",
    storyHealth: 93,
    seo: 91,
    verification: "In Review",
    readyToPublish: false,
    href: "/basecamp/places/place-hamilton-falls",
  },
  {
    title: "Jamaica State Park",
    storyHealth: 86,
    seo: 84,
    verification: "Complete",
    readyToPublish: true,
    href: "/basecamp/places/place-jamaica-state-park",
  },
  {
    title: "River safety guide",
    storyHealth: 95,
    seo: 88,
    verification: "Complete",
    readyToPublish: true,
    href: "/basecamp/articles",
  },
];

export const photoDeskNeeds = [
  "Hero",
  "Gallery",
  "Drone",
  "Winter",
  "Vertical Reel",
];

export const verificationDeskRecords: VerificationDeskRecord[] = [
  {
    place: "Hamilton Falls",
    status: "needs_review",
    detail: "Access notes updated yesterday; confirm trail wording.",
    href: "/basecamp/places/place-hamilton-falls",
  },
  {
    place: "Jamaica State Park",
    status: "expiring",
    detail: "Verification expires in 6 days.",
    href: "/basecamp/places/place-jamaica-state-park",
  },
  {
    place: "Lye Brook Falls",
    status: "newly_verified",
    detail: "New verification completed this morning.",
    href: "/basecamp/places/place-lye-brook-falls",
  },
];

export const publishTodayItems: PublishTodayItem[] = [
  {
    title: "Jamaica State Park",
    href: "/basecamp/places/place-jamaica-state-park",
    type: "Story",
  },
  {
    title: "River safety guide",
    href: "/basecamp/articles",
    type: "Guide",
  },
  {
    title: "Summer Swimming Holes collection",
    href: "/basecamp/collections",
    type: "Collection",
  },
];
